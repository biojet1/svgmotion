import {
    Animatable,
    Keyframes,
    NVector,
    NumberValue,
    PositionValue,
    TextValue,
    Value,
} from "./keyframes.js";
import { Box, ValueSet, xset, xget } from "./properties.js";
import { Node, Parent } from "./linked.js";
import { SVGProps } from "./svgprops.js";
import { update_dom } from "./update_dom.js";
import { from_json_walk } from "./from_json.js";

const NS_SVG = "http://www.w3.org/2000/svg";

export abstract class Item extends SVGProps(Node) {
    to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement {
        const e = (this._element = doc.createElementNS(
            NS_SVG,
            (<typeof Item>this.constructor).tag
        ));
        return set_svg(e, this);
    }

    *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            } else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
    }
}

export abstract class Shape extends Item { }

export class Container extends SVGProps(Parent) {

    to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement {
        const con = (this._element = doc.createElementNS(
            NS_SVG,
            (<typeof Container>this.constructor).tag
        ));
        for (const sub of this.children<Container | Item>()) {
            con.appendChild(sub.to_dom(doc));
        }
        return set_svg(con, this);
    }


    update_dom(frame: number) {
        update_dom(frame, this);
    }

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

    *enum_keyframes(): Generator<Keyframes<any>, void, unknown> {
        for (let { value } of this.enum_values()) {
            if (value instanceof Keyframes) {
                yield value;
            }
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
    add_rect(size: Iterable<number> = [100, 100]) {
        const x = new Rect();
        this.append_child(x);
        return x;
    }
    add_view() {
        const x = new ViewPort();
        this.append_child(x);
        return x;
    }
    add_group() {
        const x = new Group();
        this.append_child(x);
        return x;
    }
    add_path() {
        const x = new Path();
        this.append_child(x);
        return x;
    }
    add_circle() {
        const x = new Circle();
        this.append_child(x);
        return x;
    }
    ///
    override to_json() {
        let o = super.to_json();
        o.nodes = [...this.children<Container | Item>()].map((v) =>
            v.to_json()
        );
        return o;
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
        return xget(this, "width", new NumberValue(100));
    }
    set width(v: NumberValue) {
        xset(this, "width", v);
    }
    ///
    get height() {
        return xget(this, "height", new NumberValue(100));
    }
    set height(v: NumberValue) {
        xset(this, "height", v);
    }
    ///
    get x() {
        return xget(this, "x", new NumberValue(0));
    }
    set x(v: NumberValue) {
        xset(this, "x", v);
    }
    ///
    get y() {
        return xget(this, "y", new NumberValue(0));
    }
    set y(v: NumberValue) {
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
        return xget(this, "width", new NumberValue(100));
    }
    set width(v: NumberValue) {
        xset(this, "width", v);
    }
    ///
    get height() {
        return xget(this, "height", new NumberValue(100));
    }
    set height(v: NumberValue) {
        xset(this, "height", v);
    }
    ///
    get x() {
        return xget(this, "x", new NumberValue(0));
    }
    set x(v: NumberValue) {
        xset(this, "x", v);
    }
    ///
    get y() {
        return xget(this, "y", new NumberValue(0));
    }
    set y(v: NumberValue) {
        xset(this, "y", v);
    }
    ///
    get rx() {
        return xget(this, "rx", new NumberValue(0));
    }
    set rx(v: NumberValue) {
        xset(this, "rx", v);
    }
    ///
    get ry() {
        return xget(this, "ry", new NumberValue(0));
    }
    set ry(v: NumberValue) {
        xset(this, "ry", v);
    }
    ///
    get size() {
        return xget(this, "size", new PositionValue(new NVector([100, 100])));
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
        return xget(this, "cx", new NumberValue(0));
    }
    set cx(v: NumberValue) {
        xset(this, "cx", v);
    }
    ///
    get cy() {
        return xget(this, "cy", new NumberValue(0));
    }
    set cy(v: NumberValue) {
        xset(this, "cy", v);
    }
    ///
    get r() {
        return xget(this, "r", new NumberValue(0));
    }
    set r(v: NumberValue) {
        xset(this, "r", v);
    }
}

// export class Ellipse extends Shape {
//     size: NVectorValue = new NVectorValue([100, 100]);
// }

// export class Image extends Node {
//     // href: string = "";
//     // size: NVectorValue = new NVectorValue([100, 100]);
// }

function set_svg(elem: SVGElement, node: Item | Container): SVGElement {
    const { id } = node;
    if (id) {
        elem.id = id;
    }
    return elem;
}

export class Doc extends Container {
    defs: { [key: string]: Item | Container } = {};
    all: { [key: string]: Item | Container } = {};
    version: string = "0.0.1";
    constructor() {
        super();
    }
    get viewport() {
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

    set_viewport(vp: ViewPort) {
        this.remove_children();
        this.append_child(vp);
    }
    remember_id(id: string, node: Item | Container) {
        this.all[id] = node;
    }
    override add_view(): ViewPort {
        this.remove_children();
        return super.add_view();

    }

    override to_json(): PlainDoc {
        const { version, viewport, defs } = this;
        return {
            version, root: viewport.to_json(),
            defs: Object.fromEntries(Object.entries(defs).map(([k, v]) => [k, v.to_json()]))
        };
    }

    from_json(src: PlainDoc) {
        const { version, root, defs } = src;
        if (!version) {
            throw new Error("No version {${Object.keys(src)}}");
        } else if (! /^\d+\.\d+\.\d+$/.test(version)) {
            throw new Error("Invalid version");
        } else if (!root) {
            throw new Error("No root");
        }
        const vp = from_json_walk(root, this);
        if (!(vp instanceof ViewPort)) {
            throw new Error("ViewPort expected");
        }
        this.version = version;
        this.defs = {};
        this.set_viewport(vp);
        if (defs) {
            Object.entries(defs).map(([k, v]) => {
                this.defs[k] = from_json_walk(v, this);
            });
        }
    }
    // new_view, new_rect
    to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement {
        const element = this.viewport.to_dom(doc);
        const defs = doc.createElementNS(NS_SVG, "defs");
        for (let [n, v] of Object.entries(this.defs)) {
            defs.appendChild(v.to_dom(doc));
        }
        if (defs.firstElementChild) {
            element.insertBefore(defs, element.firstChild);
        }
        return element;
    }
}

export interface PlainNode {
    tag: string;
    nodes: PlainNode[];
    opacity: Value<any>;
}

export interface PlainDoc {
    version: string;
    root: PlainNode;
    defs: { [key: string]: PlainNode };
}