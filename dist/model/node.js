import { Animatable, Keyframes, NumberValue } from "./keyframes.js";
import { Box, RectSizeProp, UPDATE, ValueSet } from "./properties.js";
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
    add_rect(size = [100, 100]) {
        const x = new Rect();
        // x.size = new NVectorValue(size);
        this.append_child(x);
        let y = this.first_child();
        return x;
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
}
function update(frame, target, el) {
    for (let [n, v] of Object.entries(target)) {
        v && UPDATE[n]?.(frame, el, v);
    }
}
export class Group extends Container {
    as_svg(doc) {
        const con = this._node = doc.createElementNS(NS_SVG, "group");
        for (const sub of this.children()) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
    }
}
// Container.prototype
export class ViewPort extends Container {
    as_svg(doc) {
        const con = this._node = doc.createElementNS(NS_SVG, "svg");
        for (const sub of this.children()) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
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
export class Rect extends Shape {
    size = new RectSizeProp([100, 100]);
    as_svg(doc) {
        const e = this._node = doc.createElementNS(NS_SVG, "rect");
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return e;
    }
}
// export class Ellipse extends Shape {
//     size: NVectorValue = new NVectorValue([100, 100]);
// }
// export class Image extends Node {
//     // href: string = "";
//     // size: NVectorValue = new NVectorValue([100, 100]);
// }
export class Root extends ViewPort {
    defs = [];
}
//# sourceMappingURL=node.js.map