import { NVectorValue, Transform, NumberValue, Box } from "./keyframes.js";
function deco(target, context) {
    target.prototype.fun = function () {
        console.log("FUN");
    };
    return target;
}
@deco
export class Node {
    id;
    transform;
    opacity;
}
export class Shape extends Node {
}
export class Container extends Array {
    id;
    transform = new Transform();
    opacity = new NumberValue(1);
    _update(frame, node) {
        for (const e of this) {
            // e._update(frame)
        }
    }
}
export class Group extends Container {
    as_svg(doc) {
        const con = doc.createElementNS(NS_SVG, "group");
        for (const sub of this) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
    }
}
// 
export class ViewPort extends Container {
    view_port = new Box([0, 0], [100, 100]);
    as_svg(doc) {
        const con = doc.createElementNS(NS_SVG, "svg");
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
export class Root extends ViewPort {
    defs = [];
}
const NS_SVG = "http://www.w3.org/2000/svg";
export class Rect extends Shape {
    size = new NVectorValue([100, 100]);
    as_svg(doc) {
        const e = doc.createElementNS(NS_SVG, "rect");
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return e;
    }
    _update(frame, node) {
        let x = this.size.get_value(frame);
        let e = node;
        e.width.baseVal.value = x[0];
        e.height.baseVal.value = x[0];
    }
}
// export class Ellipse extends Shape {
//     size: NVectorValue = new NVectorValue([100, 100]);
// }
// export class Image extends Node {
//     href: string = "";
//     size: NVectorValue = new NVectorValue([100, 100]);
// }
//# sourceMappingURL=node.js.map