import {
    Animatable,
    Keyframes,
    NVector,
    NVectorValue,
    NumberValue,
    PositionValue,
    TextValue,
} from "./keyframes.js";
import {
    Box,
    Fill,
    Stroke,
    Transform,
    ValueSet,
} from "./properties.js";
import { UPDATE } from "./update_dom.js";
import { Node, Parent } from "./linked.js";
import { SVGProps } from "./svgprops.js";

interface INode {
    id?: string;
    _node?: SVGElement;
}

export abstract class Item extends SVGProps(Node) implements INode {
    id?: string;
    _node?: SVGElement;

    as_svg(doc: Document): SVGElement {
        const e = (this._node = doc.createElementNS(NS_SVG, (<typeof Item>this.constructor).tag));
        return set_svg(e, this);
    }

    update_self(frame: number, node: SVGElement): void {
        update(frame, this, node);
    }

    update_node(frame: number): void {
        const node = this._node;
        if (node) {
            this.update_self(frame, node);
        }
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
    // to_json() {
    //     const o = { tag: (<typeof Container>this.constructor).tag };
    //     return o;
    // }

}

export abstract class Shape extends Item { }

export class Container extends SVGProps(Parent) implements INode {
    id?: string;
    _node?: SVGElement;


    as_svg(doc: Document): SVGElement {
        const con = (this._node = doc.createElementNS(NS_SVG, (<typeof Container>this.constructor).tag));
        for (const sub of this.children<Container | Item>()) {
            con.appendChild(sub.as_svg(doc));
        }
        return set_svg(con, this);
    }

    update_self(frame: number, node: SVGElement): boolean {
        update(frame, this, node);
        return true; // should we call update_node to children
    }
    update_node(frame: number) {
        const node = this._node;
        if (node) {
            if (this.update_self(frame, node)) {
                for (const sub of this.children<Container | Item>()) {
                    sub.update_node(frame);
                }
            }
        }
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
        o.nodes = [...this.children<Container | Item>()].map(v => v.to_json());
        return o;
    }
    // static {
    //     // this.prototype._attax_propch = 2;
    //     Object.defineProperty(this, "the_name", {
    //         value: "the_value",
    //         writable: true,
    //         enumerable: true,
    //     });
    // }
}

function update(frame: number, target: Item | Container, el: SVGElement) {
    for (let [n, v] of Object.entries(target)) {
        v && UPDATE[n]?.(frame, el, v);
    }
}

export class Group extends Container {
    static tag = 'g';
}


export class ViewPort extends Container {
    static tag = 'svg';
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
    get fit_view() {
        return this._getx("d", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        this._setx("d", v);
    }
    ///
    get zoom_pan() {
        return this._getx("d", new TextValue("disable"));
    }
    set zoom_pan(v: TextValue) {
        this._setx("d", v);
    }
}

const NS_SVG = "http://www.w3.org/2000/svg";

export class Path extends Shape {
    static tag = 'path';
    ///
    get d() {
        return this._getx("d", new TextValue(""));
    }
    set d(v: TextValue) {
        this._setx("d", v);
    }
}
export class Rect extends Shape {
    static tag = 'rect';
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

export class Root extends ViewPort {
    defs: { [key: string]: Item | Container } = {};
    id_map: { [key: string]: Item | Container } = {};
    override as_svg(doc: Document): SVGElement {
        const n = super.as_svg(doc);
        const defs = doc.createElementNS(NS_SVG, "defs");
        for (let [n, v] of Object.entries(this.defs)) {
            defs.appendChild(v.as_svg(doc));
        }
        if (defs.firstElementChild) {
            n.insertBefore(defs, n.firstChild);
        }
        return set_svg(n, this);
    }
    remember_id(id: string, node: Item | Container) {
        this.id_map[id] = node;
    }
}
