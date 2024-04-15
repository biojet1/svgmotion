import { Animatable, Keyframes, NumberValue } from "./keyframes.js";
import { Box, Fill, RectSizeProp, UPDATE, ValueSet } from "./properties.js";
export class Item {
    id;
    // transform?: Transform;
    // opacity?: OpacityProp;
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
    get opacity() {
        const v = new NumberValue(1);
        const o = { value: v, writable: true, enumerable: true };
        console.log("opacity prop_x", o);
        Object.defineProperty(this, "opacity", o);
        return v;
    }
    get fill() {
        console.log("GET fill");
        const v = new Fill();
        Object.defineProperty(this, "fill", { value: v, writable: true, enumerable: true });
        return v;
    }
    set fill(v) {
        console.log("SET fill");
        Object.defineProperty(this, "fill", { value: v, writable: true, enumerable: true });
    }
}
export class Shape extends Item {
    // strok fill
    get prop_x() {
        const p = { value: { value: 4 } };
        console.log("prop_x", p);
        Object.defineProperty(this, "prop_x", p);
        return p;
    }
}
export class Container extends Array {
    id;
    _node;
    update_self(frame, node) {
        update(frame, this, node);
        return true; // should we call update_node to children
    }
    update_node(frame) {
        const node = this._node;
        if (node) {
            if (this.update_self(frame, node)) {
                for (const sub of this) {
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
        for (const sub of this) {
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
        this.push(x);
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
    get opacity() {
        const v = new NumberValue(1);
        Object.defineProperty(this, "opacity", { value: v, writable: true, enumerable: true });
        return v;
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
        for (const sub of this) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
    }
}
export class ViewPort extends Container {
    view_port = new Box([0, 0], [100, 100]);
    as_svg(doc) {
        const con = this._node = doc.createElementNS(NS_SVG, "svg");
        // e.preserveAspectRatio
        // this.view_port.size
        // e.width.baseVal.value = this.size
        // e.addEventListener
        for (const sub of this) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
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