import { Animatable, Keyframes, NumberValue, TextValue, } from "./keyframes.js";
import { Box, RectSizeProp, UPDATE, ValueSet, } from "./properties.js";
import { Node, Parent } from "./linked.js";
import { SVGProps } from "./svgprops.js";
export class Item extends SVGProps(Node) {
    id;
    _node;
    update_self(frame, node) {
        update(frame, this, node);
    }
    update_node(frame) {
        const node = this._node;
        if (node) {
            this.update_self(frame, node);
        }
    }
    *enum_values() {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            }
            else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
    }
}
export class Shape extends Item {
}
export class Container extends SVGProps(Parent) {
    id;
    _node;
    as_svg(doc) {
        throw new Error(`Not implemented`);
    }
    update_self(frame, node) {
        update(frame, this, node);
        return true; // should we call update_node to children
    }
    update_node(frame) {
        const node = this._node;
        if (node) {
            if (this.update_self(frame, node)) {
                for (const sub of this.children()) {
                    sub.update_node(frame);
                }
            }
        }
    }
    *enum_values() {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            }
            else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
        for (const sub of this.children()) {
            yield* sub.enum_values();
        }
    }
    *enum_keyframes() {
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
    add_rect(size = [100, 100]) {
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
}
function update(frame, target, el) {
    for (let [n, v] of Object.entries(target)) {
        v && UPDATE[n]?.(frame, el, v);
    }
}
export class Group extends Container {
    as_svg(doc) {
        const con = (this._node = doc.createElementNS(NS_SVG, "g"));
        for (const sub of this.children()) {
            con.appendChild(sub.as_svg(doc));
        }
        return set_svg(con, this);
    }
}
// Container.prototype
export class ViewPort extends Container {
    as_svg(doc) {
        const con = (this._node = doc.createElementNS(NS_SVG, "svg"));
        for (const sub of this.children()) {
            con.appendChild(sub.as_svg(doc));
        }
        return set_svg(con, this);
    }
    get view_box() {
        return this._getx("view_box", new Box([0, 0], [100, 100]));
    }
    set view_box(v) {
        this._setx("view_box", v);
    }
    get width() {
        return this._getx("width", new NumberValue(100));
    }
    set width(v) {
        this._setx("width", v);
    }
    get height() {
        return this._getx("height", new NumberValue(100));
    }
    set height(v) {
        this._setx("height", v);
    }
}
const NS_SVG = "http://www.w3.org/2000/svg";
export class Path extends Shape {
    as_svg(doc) {
        const e = (this._node = doc.createElementNS(NS_SVG, "path"));
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return set_svg(e, this);
    }
    get d() {
        return this._getx("d", new TextValue(""));
    }
    set d(v) {
        this._setx("d", v);
    }
}
export class Rect extends Shape {
    size = new RectSizeProp([100, 100]);
    as_svg(doc) {
        const e = (this._node = doc.createElementNS(NS_SVG, "rect"));
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return set_svg(e, this);
    }
    get width() {
        return this._getx("width", new NumberValue(100));
    }
    set width(v) {
        this._setx("width", v);
    }
    ///
    get height() {
        return this._getx("height", new NumberValue(100));
    }
    set height(v) {
        this._setx("height", v);
    }
    ///
    get x() {
        return this._getx("x", new NumberValue(0));
    }
    set x(v) {
        this._setx("x", v);
    }
    ///
    get y() {
        return this._getx("y", new NumberValue(0));
    }
    set y(v) {
        this._setx("y", v);
    }
}
// export class Ellipse extends Shape {
//     size: NVectorValue = new NVectorValue([100, 100]);
// }
// export class Image extends Node {
//     // href: string = "";
//     // size: NVectorValue = new NVectorValue([100, 100]);
// }
function set_svg(elem, node) {
    const { id } = node;
    if (id) {
        elem.id = id;
    }
    return elem;
}
export class Root extends ViewPort {
    defs = {};
    id_map = {};
    as_svg(doc) {
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
    remember_id(id, node) {
        this.id_map[id] = node;
    }
}
//# sourceMappingURL=node.js.map