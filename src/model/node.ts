import { Track } from "../track/track.js";
import { BaseProps } from "./baseprops.js";
import { PlainValue } from "./value.js";
import { Animatable } from "./value.js";
import { ScalarValue, PointsValue, PositionValue, TextValue } from "./value.js";
import { Node, Parent } from "./linked.js";
import { Box, ValueSet, xget, xset } from "./valuesets.js";
import { Keyframe } from "../keyframe/keyframe.js";

export interface PlainNode {
    tag: string;
    nodes: PlainNode[];
    opacity?: PlainValue<any>;
}

export interface PlainRoot {
    version: string;
    view: PlainNode;
    defs: { [key: string]: PlainNode };
    frame_rate: number;
}

export abstract class Item extends BaseProps(Node) {
    *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            } else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
    }
    g_wrap() {
        const p = this.parent();
        if (p) {
            const g = new Group();
            this.place_after(g);
            g.append_child(this);
            return g;
        } else {
            throw new Error(`No parent`);

        }
    }
    *ancestors() {
        let top = this._parent;
        while (top) {
            yield top
            top = top._parent;
        }
    }

    owner_viewport() {
        //  nearest ancestor ‘svg’ element. 
        for (const a of this.ancestors()) {
            if (a instanceof ViewPort) {
                return a;
            }
        }
    }

    farthest_viewport(): ViewPort | undefined {
        let parent: Item | Parent | undefined = this;
        let farthest: ViewPort | undefined = undefined;
        while ((parent = parent._parent)) {
            if (parent instanceof ViewPort) {
                farthest = parent;
            }
        }
        return farthest;
    }

}

export abstract class Shape extends Item { }

export class Container extends BaseProps(Parent) {
    *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            } else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
        for (const sub of this.children<Container | Item>()) {
            yield* sub.enum_values();
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
            if (cur instanceof Item || cur instanceof Container) {
                if (cur.id === id) {
                    return cur;
                }
            }
        } while (cur !== end && (cur = cur._next));
    }
}

export class Group extends Container {
    static tag = "g";
}

export class ViewPort extends Container {
    static tag = "svg";
    ///
    get view_box() {
        return xget(this, "view_box", new Box([0, 0], [100, 100]));
    }
    set view_box(v: Box) {
        xset(this, "view_box", v);
    }
    ///
    get width() {
        return xget(this, "width", new ScalarValue(100));
    }
    set width(v: ScalarValue) {
        xset(this, "width", v);
    }
    ///
    get height() {
        return xget(this, "height", new ScalarValue(100));
    }
    set height(v: ScalarValue) {
        xset(this, "height", v);
    }
    ///
    get x() {
        return xget(this, "x", new ScalarValue(0));
    }
    set x(v: ScalarValue) {
        xset(this, "x", v);
    }
    ///
    get y() {
        return xget(this, "y", new ScalarValue(0));
    }
    set y(v: ScalarValue) {
        xset(this, "y", v);
    }
    ///
    get fit_view() {
        return xget(this, "fit_view", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        xset(this, "fit_view", v);
    }
    ///
    get zoom_pan() {
        return xget(this, "zoom_pan", new TextValue("disable"));
    }
    set zoom_pan(v: TextValue) {
        xset(this, "zoom_pan", v);
    }
}
export class Symbol extends Container {
    static tag = "symbol";
    ///
    get view_box() {
        return xget(this, "view_box", new Box([0, 0], [100, 100]));
    }
    set view_box(v: Box) {
        xset(this, "view_box", v);
    }
    ///
    get width() {
        return xget(this, "width", new ScalarValue(100));
    }
    set width(v: ScalarValue) {
        xset(this, "width", v);
    }
    ///
    get height() {
        return xget(this, "height", new ScalarValue(100));
    }
    set height(v: ScalarValue) {
        xset(this, "height", v);
    }
    ///
    get x() {
        return xget(this, "x", new ScalarValue(0));
    }
    set x(v: ScalarValue) {
        xset(this, "x", v);
    }
    ///
    get y() {
        return xget(this, "y", new ScalarValue(0));
    }
    set y(v: ScalarValue) {
        xset(this, "y", v);
    }
    ///
    get refx() {
        return xget(this, "refx", new ScalarValue(0));
    }
    set refx(v: ScalarValue) {
        xset(this, "refx", v);
    }
    ///
    get refy() {
        return xget(this, "refy", new ScalarValue(0));
    }
    set refy(v: ScalarValue) {
        xset(this, "refy", v);
    }
}
export class Path extends Shape {
    static tag = "path";
    ///
    get d() {
        return xget(this, "d", new TextValue(""));
    }
    set d(v: TextValue) {
        xset(this, "d", v);
    }
}

export class Rect extends Shape {
    static tag = "rect";
    ///
    get width() {
        return xget(this, "width", new ScalarValue(100));
    }
    set width(v: ScalarValue) {
        xset(this, "width", v);
    }
    ///
    get height() {
        return xget(this, "height", new ScalarValue(100));
    }
    set height(v: ScalarValue) {
        xset(this, "height", v);
    }
    ///
    get x() {
        return xget(this, "x", new ScalarValue(0));
    }
    set x(v: ScalarValue) {
        xset(this, "x", v);
    }
    ///
    get y() {
        return xget(this, "y", new ScalarValue(0));
    }
    set y(v: ScalarValue) {
        xset(this, "y", v);
    }
    ///
    get rx() {
        return xget(this, "rx", new ScalarValue(0));
    }
    set rx(v: ScalarValue) {
        xset(this, "rx", v);
    }
    ///
    get ry() {
        return xget(this, "ry", new ScalarValue(0));
    }
    set ry(v: ScalarValue) {
        xset(this, "ry", v);
    }
    ///
    get size() {
        return xget(this, "size", new PositionValue([100, 100]));
    }
    set size(v: PositionValue) {
        xset(this, "size", v);
    }
    //
}

export class Circle extends Shape {
    static tag = "circle";
    ///
    get cx() {
        return xget(this, "cx", new ScalarValue(0));
    }
    set cx(v: ScalarValue) {
        xset(this, "cx", v);
    }
    ///
    get cy() {
        return xget(this, "cy", new ScalarValue(0));
    }
    set cy(v: ScalarValue) {
        xset(this, "cy", v);
    }
    ///
    get r() {
        return xget(this, "r", new ScalarValue(0));
    }
    set r(v: ScalarValue) {
        xset(this, "r", v);
    }
}

export class Ellipse extends Shape {
    static tag = "ellipse";
    /// cx
    get cx() {
        return xget(this, "cx", new ScalarValue(0));
    }
    set cx(v: ScalarValue) {
        xset(this, "cx", v);
    }
    /// cy
    get cy() {
        return xget(this, "cy", new ScalarValue(0));
    }
    set cy(v: ScalarValue) {
        xset(this, "cy", v);
    }
    /// rx
    get rx() {
        return xget(this, "rx", new ScalarValue(0));
    }
    set rx(v: ScalarValue) {
        xset(this, "rx", v);
    }
    /// ry
    get ry() {
        return xget(this, "ry", new ScalarValue(0));
    }
    set ry(v: ScalarValue) {
        xset(this, "ry", v);
    }
}

export class Line extends Shape {
    static tag = "line";
    /// x1
    get x1() {
        return xget(this, "x1", new ScalarValue(0));
    }
    set x1(v: ScalarValue) {
        xset(this, "x1", v);
    }
    /// y1
    get y1() {
        return xget(this, "y1", new ScalarValue(0));
    }
    set y1(v: ScalarValue) {
        xset(this, "y1", v);
    }
    /// x2
    get x2() {
        return xget(this, "x2", new ScalarValue(0));
    }
    set x2(v: ScalarValue) {
        xset(this, "x2", v);
    }
    /// y2
    get y2() {
        return xget(this, "y2", new ScalarValue(0));
    }
    set y2(v: ScalarValue) {
        xset(this, "y2", v);
    }
}

export class Polyline extends Shape {
    static tag = "polyline";
    /// points
    get points() {
        return xget(this, "points", new PointsValue([]));
    }
    set points(v: PointsValue) {
        xset(this, "points", v);
    }
}

export class Polygon extends Shape {
    static tag = "polygon";
    /// points
    get points() {
        return xget(this, "points", new PointsValue([]));
    }
    set points(v: PointsValue) {
        xset(this, "points", v);
    }
}

export class Use extends Item {
    static tag = "use";
    /// href
    get href() {
        return xget(this, "href", new TextValue(''));
    }
    set href(v: TextValue) {
        xset(this, "href", v);
    }
    ///
    get width() {
        return xget(this, "width", new ScalarValue(100));
    }
    set width(v: ScalarValue) {
        xset(this, "width", v);
    }
    ///
    get height() {
        return xget(this, "height", new ScalarValue(100));
    }
    set height(v: ScalarValue) {
        xset(this, "height", v);
    }
    ///
    get x() {
        return xget(this, "x", new ScalarValue(0));
    }
    set x(v: ScalarValue) {
        xset(this, "x", v);
    }
    ///
    get y() {
        return xget(this, "y", new ScalarValue(0));
    }
    set y(v: ScalarValue) {
        xset(this, "y", v);
    }
}


export class Image extends Use {
    static tag = "image";
}

export class Text extends Container {
    static tag = "text";
    /// text
    get text() {
        return xget(this, "text", new TextValue(''));
    }
    set text(v: TextValue) {
        xset(this, "text", v);
    }
    /// tail
    get tail() {
        return xget(this, "tail", new TextValue(''));
    }
    set tail(v: TextValue) {
        xset(this, "tail", v);
    }
}

export class TSpan extends Text {
    static tag = "tspan";
}

export class Root extends Container {
    defs: { [key: string]: Item | Container } = {};
    all: { [key: string]: Item | Container } = {};
    frame_rate: number = 60;
    version: string = "0.0.1";
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
    remember_id(id: string, node: Item | Container) {
        this.all[id] = node;
    }

    // new_view, new_rect
    at(offset: number) {
        // const tr = new Track();
        // tr.frame_rate = this.frame_rate;
        // tr.hint_dur = 1 * this.frame_rate;
        // tr.end_frame = tr.to_frame(offset);
        // return tr;
        return this.track.sub(offset)
    }
    //
    get track() {
        const tr = new Track();
        tr.frame_rate = this.frame_rate;
        tr.hint_dur = 1 * this.frame_rate;
        return xget(this, "track", tr);
    }
    set track(v: Track) {
        xset(this, "track", v);
    }
}
