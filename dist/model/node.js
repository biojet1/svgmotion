import { Animatable, Keyframes, NVectorValue } from "./keyframes.js";
import { Box, ValueSet } from "./properties.js";
function update(frame, target, el) {
    const { opacity } = target;
    if (opacity) {
        const v = opacity.get_value(frame);
        el.style.opacity = v + '';
        // el.style.stroke
    }
}
export class Node {
    id;
    transform;
    opacity;
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
export class Shape extends Node {
}
export class Container extends Array {
    id;
    transform;
    opacity;
    // fill?: Fill;
    stroke;
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
    size = new NVectorValue([100, 100]);
    as_svg(doc) {
        const e = this._node = doc.createElementNS(NS_SVG, "rect");
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return e;
    }
    update_self(frame, node) {
        let x = this.size.get_value(frame);
        let e = node;
        e.width.baseVal.value = x[0];
        e.height.baseVal.value = x[1];
        // console.log(`Rect:update_self ${frame} ${x}`);
        super.update_self(frame, node);
    }
}
// export class Ellipse extends Shape {
//     size: NVectorValue = new NVectorValue([100, 100]);
// }
// export class Image extends Node {
//     href: string = "";
//     size: NVectorValue = new NVectorValue([100, 100]);
// }
export class Root extends ViewPort {
    defs = [];
}
//# sourceMappingURL=node.js.map