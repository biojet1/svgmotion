import { BoundingBox, Matrix, MatrixMut, PathLC } from "../geom/index.js";
import { Node, Parent } from "./linked.js";
import { Track } from "../track/track.js";
import { Keyframe } from "../keyframe/keyframe.js";
import { Element, LengthHValue, LengthWValue, TextData, LengthValue } from "./base.js";
import { Animatable, PointsValue, PositionValue, TextValue } from "./value.js";
import { Box, ValueSet } from "./valuesets.js";

export interface PlainNode {
    tag: string;
    nodes: PlainNode[];
}

export interface PlainRoot {
    version: string;
    view: PlainNode;
    defs: { [key: string]: PlainNode };
    frame_rate: number;
}

export class Container extends Element {
    *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            } else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
        for (const sub of this.children<Element>()) {
            if (sub instanceof Element) {
                yield* sub.enum_values();
            }
        }
    }

    *enum_keyframes(): Generator<Array<Keyframe<any>>, void, unknown> {
        for (let v of this.enum_values()) {
            yield v.kfs;
        }
    }
    calc_time_range() {
        let max = 0;
        let min = 0;
        for (let kfs of this.enum_keyframes()) {
            for (const { time } of kfs) {
                if (time > max) {
                    max = time;
                }
                if (time < min) {
                    min = time;
                }
            }
        }
        return [min, max];
    }

    get_id(id: string) {
        const { _start, _end: end } = this;
        let cur: Node | undefined = _start;
        do {
            if (cur instanceof Element) {
                if (cur.id === id) {
                    return cur;
                }
            }
        } while (cur !== end && (cur = cur._next));
    }
    bbox_of(frame: number, ...args: Element[]) {
        const bb = BoundingBox.not();
        for (const x of args) {
            const m = transform_up_to(this, x, frame);
            x.update_bbox(bb, frame, m);
        }
        return bb;
    }
    override update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {
        let w = this.transform.get_transform(frame);
        if (m) {
            m = m.cat(w)
        }
        for (const x of this.children<Element>()) {
            x.update_bbox(bbox, frame, m)
        }
    }
}

export class ViewPort extends Container {
    static tag = "svg";
    ///
    get x() {
        return this._new_field("x", new LengthWValue(0));
    }
    set x(v: LengthWValue) {
        this._new_field("x", v);
    }
    ///
    get y() {
        return this._new_field("y", new LengthHValue(0));
    }
    set y(v: LengthHValue) {
        this._new_field("y", v);
    }
    ///
    get width() {
        const n = this.get_vp_width(0);
        return this._new_field("width", new LengthWValue(n));
    }
    set width(v: LengthWValue) {
        this._new_field("width", v);
    }
    ///
    get height() {
        const n = this.get_vp_height(0);
        return this._new_field("height", new LengthHValue(n));
    }
    set height(v: LengthHValue) {
        this._new_field("height", v);
    }
    ///
    get view_box() {
        const n = this.get_vp_size(0);
        return this._new_field("view_box", new Box([0, 0], n));
    }
    set view_box(v: Box) {
        this._new_field("view_box", v);
    }
    ///
    get fit_view() {
        return this._new_field("fit_view", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        this._new_field("fit_view", v);
    }
    ///
    get zoom_pan() {
        return this._new_field("zoom_pan", new TextValue("disable"));
    }
    set zoom_pan(v: TextValue) {
        this._new_field("zoom_pan", v);
    }
    // 
    override update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {
        const width = this.width.get_value(frame);
        const height = this.height.get_value(frame);
        const x = this.x.get_value(frame);
        const y = this.y.get_value(frame);
        if (width && height) {
            let b = BoundingBox.rect(x, y, width, height);
            if (m) {
                b = b.transform(m);
            }
            bbox.merge_self(b);
        }
    }
    ///
    override cat_transform(frame: number, n: Matrix) {
        if (Object.hasOwn(this, "view_box")) {
            let w = this.width.get_value(frame);
            let h = this.height.get_value(frame);
            if (w && h) {
                const x = this.x.get_value(frame);
                const y = this.y.get_value(frame);
                let [vx, vy] = this.view_box.position.get_value(frame);
                let [vw, vh] = this.view_box.size.get_value(frame);
                const fv = this.fit_view.get_value(frame);
                // const { x: vx, y: vy, width: vw, height: vh } = this.viewBox._calcBox();
                (vx == null || isNaN(vx)) && (vx = x);
                (vy == null || isNaN(vy)) && (vy = y);
                (vw == null || isNaN(vw)) && (vw = w);
                (vh == null || isNaN(vh)) && (vh = h);
                if (vw && vh) {
                    const [tx, ty, sx, sy] = viewbox_transform(
                        x,
                        y,
                        w,
                        h,
                        vx,
                        vy,
                        vw,
                        vh,
                        fv
                    );
                    n.cat_self(Matrix.translate(tx, ty).scale(sx, sy))
                }
            }
        }
    }
}

export abstract class Shape extends Element {
    describe(frame: number): string {
        throw new Error(`Not implemented`);
    }
    get_path(frame: number): PathLC {
        return PathLC.parse(this.describe(frame));
    }
    override update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {
        let w = this.transform.get_transform(frame);
        if (m) {
            m = m.cat(w)
        }
        const p = this.get_path(frame);
        bbox.merge_self((m ? p.transform(m) : p).bbox());
    }
}

function transform_up_to(top: Parent, desc: Element, time: number) {
    let cur: Element | undefined = desc;
    let ls: Element[] = []
    while (cur) {
        cur = cur.parent<Container>();
        if (cur === top) {
            let m = MatrixMut.identity();
            ls.reverse();
            for (const x of ls) {
                x.cat_transform(time, m)
            }
            return m;
        } else if (cur) {
            ls.push(cur);
        }
    }
    throw new Error(`No parent`);
}

export class Group extends Container {
    static tag = "g";
}

export class Symbol extends Container {
    static tag = "symbol";
    ///
    get view_box() {
        return this._new_field("view_box", new Box([0, 0], [100, 100]));
    }
    set view_box(v: Box) {
        this._new_field("view_box", v);
    }
    ///
    get width() {
        return this._new_field("width", new LengthWValue(100));
    }
    set width(v: LengthWValue) {
        this._new_field("width", v);
    }
    ///
    get height() {
        return this._new_field("height", new LengthHValue(100));
    }
    set height(v: LengthHValue) {
        this._new_field("height", v);
    }
    ///
    get x() {
        return this._new_field("x", new LengthWValue(0));
    }
    set x(v: LengthWValue) {
        this._new_field("x", v);
    }
    ///
    get y() {
        return this._new_field("y", new LengthHValue(0));
    }
    set y(v: LengthHValue) {
        this._new_field("y", v);
    }
    ///
    get ref_x() {
        return this._new_field("ref_x", new LengthWValue(0));
    }
    set ref_x(v: LengthWValue) {
        this._new_field("ref_x", v);
    }
    ///
    get ref_y() {
        return this._new_field("ref_y", new LengthHValue(0));
    }
    set ref_y(v: LengthHValue) {
        this._new_field("ref_y", v);
    }
    //
    get fit_view() {
        return this._new_field("fit_view", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        this._new_field("fit_view", v);
    }
}
export class Path extends Shape {
    static tag = "path";
    ///
    get d() {
        return this._new_field("d", new TextValue(""));
    }
    set d(v: TextValue) {
        this._new_field("d", v);
    }
    override describe(frame: number) {
        return this.d.get_value(frame);
    }
}

export class Rect extends Shape {
    static tag = "rect";
    ///
    get x() {
        return this._new_field("x", new LengthWValue(0));
    }
    set x(v: LengthWValue) {
        this._new_field("x", v);
    }
    ///
    get y() {
        return this._new_field("y", new LengthHValue(0));
    }
    set y(v: LengthHValue) {
        this._new_field("y", v);
    }
    ///
    get width() {
        // const n = this.get_vp_width(0);
        const n = 100;
        return this._new_field("width", new LengthWValue(n));
    }
    set width(v: LengthWValue) {
        this._new_field("width", v);
    }
    ///
    get height() {
        // const n = this.get_vp_height(0);
        const n = 100;
        return this._new_field("height", new LengthHValue(n));
    }
    set height(v: LengthHValue) {
        this._new_field("height", v);
    }
    ///
    get rx() {
        return this._new_field("rx", new LengthWValue(0));
    }
    set rx(v: LengthWValue) {
        this._new_field("rx", v);
    }
    ///
    get ry() {
        return this._new_field("ry", new LengthHValue(0));
    }
    set ry(v: LengthHValue) {
        this._new_field("ry", v);
    }
    ///
    get size() {
        return this._new_field("size", new PositionValue([100, 100]));
    }
    set size(v: PositionValue) {
        this._new_field("size", v);
    }
    //
    override describe(frame: number) {
        const width = this.width.get_value(frame);
        const height = this.height.get_value(frame);
        const x = this.x.get_value(frame);
        const y = this.y.get_value(frame);
        const rx = this.rx.get_value(frame);
        const ry = this.ry.get_value(frame);
        return `M ${x} ${y} h ${width} v ${height} h ${-width} Z`;
    }
}

export class Circle extends Shape {
    static tag = "circle";
    ///
    get cx() {
        return this._new_field("cx", new LengthWValue(0));
    }
    set cx(v: LengthWValue) {
        this._new_field("cx", v);
    }
    ///
    get cy() {
        return this._new_field("cy", new LengthHValue(0));
    }
    set cy(v: LengthHValue) {
        this._new_field("cy", v);
    }
    ///
    get r() {
        return this._new_field("r", new LengthValue(0));
    }
    set r(v: LengthValue) {
        this._new_field("r", v);
    }
    ////
    override describe(frame: number) {
        const x = this.cx.get_value(frame);
        const y = this.cy.get_value(frame);
        const r = this.r.get_value(frame);
        if (r === 0) return "M0 0";
        return `M ${x - r} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y} A ${r} ${r} 0 0 0 ${x - r} ${y}`;
    }
}

export class Ellipse extends Shape {
    static tag = "ellipse";
    /// cx
    get cx() {
        return this._new_field("cx", new LengthWValue(0));
    }
    set cx(v: LengthWValue) {
        this._new_field("cx", v);
    }
    /// cy
    get cy() {
        return this._new_field("cy", new LengthHValue(0));
    }
    set cy(v: LengthHValue) {
        this._new_field("cy", v);
    }
    /// rx
    get rx() {
        return this._new_field("rx", new LengthWValue(0));
    }
    set rx(v: LengthWValue) {
        this._new_field("rx", v);
    }
    /// ry
    get ry() {
        return this._new_field("ry", new LengthHValue(0));
    }
    set ry(v: LengthHValue) {
        this._new_field("ry", v);
    }
    ///
    override describe(frame: number) {
        const x = this.cx.get_value(frame);
        const y = this.cy.get_value(frame);
        const rx = this.rx.get_value(frame);
        const ry = this.ry.get_value(frame);
        return `M ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${x + rx
            } ${y} A ${rx} ${ry} 0 0 0 ${x - rx} ${y}`;
    }
}

export class Line extends Shape {
    static tag = "line";
    /// x1
    get x1() {
        return this._new_field("x1", new LengthWValue(0));
    }
    set x1(v: LengthWValue) {
        this._new_field("x1", v);
    }
    /// y1
    get y1() {
        return this._new_field("y1", new LengthHValue(0));
    }
    set y1(v: LengthHValue) {
        this._new_field("y1", v);
    }
    /// x2
    get x2() {
        return this._new_field("x2", new LengthWValue(0));
    }
    set x2(v: LengthWValue) {
        this._new_field("x2", v);
    }
    /// y2
    get y2() {
        return this._new_field("y2", new LengthHValue(0));
    }
    set y2(v: LengthHValue) {
        this._new_field("y2", v);
    }
    ////
    override describe(frame: number) {
        const x1 = this.x1.get_value(frame);
        const x2 = this.x2.get_value(frame);
        const y1 = this.y1.get_value(frame);
        const y2 = this.y2.get_value(frame);
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
}

export class Polyline extends Shape {
    static tag = "polyline";
    /// points
    get points() {
        return this._new_field("points", new PointsValue([]));
    }
    set points(v: PointsValue) {
        this._new_field("points", v);
    }
    ///
    override describe(frame: number) {
        const s = this.points.get_value(frame).map(v => `${v[0]},${v[1]}`).join(' ');
        return s ? `M ${s}` : "";
    }
}

export class Polygon extends Shape {
    static tag = "polygon";
    /// points
    get points() {
        return this._new_field("points", new PointsValue([]));
    }
    set points(v: PointsValue) {
        this._new_field("points", v);
    }
    ///
    override describe(frame: number) {
        const s = this.points.get_value(frame).map(v => `${v[0]},${v[1]}`).join(' ');
        return s ? `M ${s}` : "";
    }
}

export class Use extends Element {
    static tag = "use";
    ///
    get x() {
        return this._new_field("x", new LengthWValue(0));
    }
    set x(v: LengthWValue) {
        this._new_field("x", v);
    }
    ///
    get y() {
        return this._new_field("y", new LengthHValue(0));
    }
    set y(v: LengthHValue) {
        this._new_field("y", v);
    }
    ///
    get width() {
        return this._new_field("width", new LengthWValue(100));
    }
    set width(v: LengthWValue) {
        this._new_field("width", v);
    }
    ///
    get height() {
        return this._new_field("height", new LengthHValue(100));
    }
    set height(v: LengthHValue) {
        this._new_field("height", v);
    }
    /// href
    get href() {
        return this._new_field("href", new TextValue(''));
    }
    set href(v: TextValue) {
        this._new_field("href", v);
    }
}

export class Image extends Use {
    static tag = "image";
    //
    get fit_view() {
        return this._new_field("fit_view", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        this._new_field("fit_view", v);
    }
}

export class Text extends Container {
    static tag = "text";
    get x() {
        return this._new_field("x", new LengthWValue(0));
    }
    set x(v: LengthWValue) {
        this._new_field("x", v);
    }
    ///
    get y() {
        return this._new_field("y", new LengthHValue(0));
    }
    set y(v: LengthHValue) {
        this._new_field("y", v);
    }
    ///
    get dx() {
        return this._new_field("dx", new LengthWValue(0));
    }
    set dx(v: LengthWValue) {
        this._new_field("dx", v);
    }
    ///
    get dy() {
        return this._new_field("dy", new LengthHValue(0));
    }
    set dy(v: LengthHValue) {
        this._new_field("dy", v);
    }
    ///
    add_chars(text: string, before?: Node) {
        const x = new TextData();
        // x.data = text;
        x.content.set_value(text);
        this.insert_before(before ?? this._end, x);
    }
    add_content(before?: Node) {
        const x = new TextData();
        this.insert_before(before ?? this._end, x);
        return x;
    }
}

export class TSpan extends Text {
    static tag = "tspan";
}

export class Root extends Container {
    defs: { [key: string]: Element } = {};
    all: { [key: string]: Element } = {};
    frame_rate: number = 60;
    version: string = "0.0.1";
    working_dir?: string;
    // view
    get view() {
        let x = this.first_child();
        if (x instanceof ViewPort) {
            return x;
        } else if (!x) {
            this.remove_children();
            x = this.add_view();
        }
        if (x instanceof ViewPort) {
            return x;
        }
        throw new Error("Unexpected");
    }

    set_view(vp: ViewPort) {
        this.remove_children();
        this.append_child(vp);
    }
    override add_view(): ViewPort {
        this.remove_children();
        return super.add_view();
    }
    // etc
    remember_id(id: string, node: Element) {
        this.all[id] = node;
    }
    at(offset: number) {
        return this.track.sub(offset)
    }
    //
    get track() {
        const tr = new Track();
        tr.frame_rate = this.frame_rate;
        tr.hint_dur = 1 * this.frame_rate;
        Object.defineProperty(this, "track", {
            value: tr,
            writable: true,
            enumerable: true,
            configurable: true,
        });
        return tr;
    }
    set track(v: Track) {
        Object.defineProperty(this, "track", {
            value: v,
            writable: true,
            enumerable: true,
        });
    }
}

export function viewbox_transform(
    e_x: number,
    e_y: number,
    e_width: number,
    e_height: number,
    vb_x: number,
    vb_y: number,
    vb_width: number,
    vb_height: number,
    aspect?: string | null
) {
    // https://svgwg.org/svg2-draft/coords.html#ComputingAViewportsTransform
    //  Let align be the align value of preserveAspectRatio, or 'xMidYMid' if preserveAspectRatio is not defined.
    let [align = "xmidymid", meet_or_slice = "meet"] = aspect
        ? aspect.toLowerCase().split(" ")
        : [];
    // Initialize scale-x to e-width/vb-width.
    let scale_x = e_width / vb_width;
    // Initialize scale-y to e-height/vb-height.
    let scale_y = e_height / vb_height;
    // If align is not 'none' and meetOrSlice is 'meet', set the larger of scale-x and scale-y to the smaller.
    if (align != "none" && meet_or_slice == "meet") {
        scale_x = scale_y = Math.min(scale_x, scale_y);
    } else if (align != "none" && meet_or_slice == "slice") {
        // Otherwise, if align is not 'none' and v is 'slice', set the smaller of scale-x and scale-y to the larger
        scale_x = scale_y = Math.max(scale_x, scale_y);
    }
    // Initialize translate-x to e-x - (vb-x * scale-x).
    let translate_x = e_x - vb_x * scale_x;
    // Initialize translate-y to e-y - (vb-y * scale-y)
    let translate_y = e_y - vb_y * scale_y;
    // If align contains 'xMid', add (e-width - vb-width * scale-x) / 2 to translate-x.
    if (align.indexOf("xmid") >= 0) {
        translate_x += (e_width - vb_width * scale_x) / 2.0;
    }
    // If align contains 'xMax', add (e-width - vb-width * scale-x) to translate-x.
    if (align.indexOf("xmax") >= 0) {
        translate_x += e_width - vb_width * scale_x;
    }
    // If align contains 'yMid', add (e-height - vb-height * scale-y) / 2 to translate-y.
    if (align.indexOf("ymid") >= 0) {
        translate_y += (e_height - vb_height * scale_y) / 2.0;
    }
    //  If align contains 'yMax', add (e-height - vb-height * scale-y) to translate-y.
    if (align.indexOf("ymax") >= 0) {
        translate_y += e_height - vb_height * scale_y;
    }
    // translate(translate-x, translate-y) scale(scale-x, scale-y)
    return [translate_x, translate_y, scale_x, scale_y];
}
