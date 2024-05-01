import {
    Animatable,
    Keyframes,
    NVector,
    NumberValue,
    PositionValue,
    TextValue,
    Value,
} from "./keyframes.js";
import { Box, ValueSet } from "./properties.js";
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
        // x.size = new NVectorValue(size);
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
        return this._getx("view_box", new Box([0, 0], [100, 100]));
    }
    set view_box(v: Box) {
        this._setx("view_box", v);
    }
    ///
    get width() {
        return this._getx("width", new NumberValue(100));
    }
    set width(v: NumberValue) {
        this._setx("width", v);
    }
    ///
    get height() {
        return this._getx("height", new NumberValue(100));
    }
    set height(v: NumberValue) {
        this._setx("height", v);
    }
    ///
    get x() {
        return this._getx("x", new NumberValue(0));
    }
    set x(v: NumberValue) {
        this._setx("x", v);
    }
    ///
    get y() {
        return this._getx("y", new NumberValue(0));
    }
    set y(v: NumberValue) {
        this._setx("y", v);
    }
    ///
    get fit_view() {
        return this._getx("fit_view", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        this._setx("fit_view", v);
    }
    ///
    get zoom_pan() {
        return this._getx("zoom_pan", new TextValue("disable"));
    }
    set zoom_pan(v: TextValue) {
        this._setx("zoom_pan", v);
    }
}



export class Path extends Shape {
    static tag = "path";
    ///
    get d() {
        return this._getx("d", new TextValue(""));
    }
    set d(v: TextValue) {
        this._setx("d", v);
    }
}

export class Rect extends Shape {
    static tag = "rect";
    ///
    get width() {
        return this._getx("width", new NumberValue(100));
    }
    set width(v: NumberValue) {
        this._setx("width", v);
    }
    ///
    get height() {
        return this._getx("height", new NumberValue(100));
    }
    set height(v: NumberValue) {
        this._setx("height", v);
    }
    ///
    get x() {
        return this._getx("x", new NumberValue(0));
    }
    set x(v: NumberValue) {
        this._setx("x", v);
    }
    ///
    get y() {
        return this._getx("y", new NumberValue(0));
    }
    set y(v: NumberValue) {
        this._setx("y", v);
    }
    ///
    get rx() {
        return this._getx("rx", new NumberValue(0));
    }
    set rx(v: NumberValue) {
        this._setx("rx", v);
    }
    ///
    get ry() {
        return this._getx("ry", new NumberValue(0));
    }
    set ry(v: NumberValue) {
        this._setx("ry", v);
    }
    ///
    get size() {
        return this._getx("size", new PositionValue(new NVector([100, 100])));
    }
    set size(v: PositionValue) {
        this._setx("size", v);
    }
    // 
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
        } else {
            this.version = version;
        }
        this.defs = {};
        if (defs) {
            Object.entries(defs).map(([k, v]) => {
                this.defs[k] = from_json_walk(v, this);
            });
        }
        if (!root) {
            throw new Error("No root");
        } else {
            this.set_viewport(from_json_walk(root, this) as ViewPort);
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