
import { NVectorValue, Transform, NumberValue, Box } from "./keyframes.js"

interface INode {
    id?: string;
    transform?: Transform;
    opacity?: NumberValue;
    // fill
    // stroke
    // clip
    _update(frame: number, node: SVGElement): boolean;
}
function update(frame: number, target: INode, el: SVGElement) {
    const { opacity } = target;
    if (opacity) {
        const v = opacity.get_value(frame);
        el.style.opacity = v + '';
    }



}

function deco(target: any, context: any) {


    target.prototype.fun = function () {
        console.log("FUN")
    }
    return target;
}

@deco
export abstract class Node implements INode {
    id?: string;
    transform?: Transform;
    opacity?: NumberValue;
    abstract _update(frame: number, node: SVGElement): boolean;
    abstract as_svg(doc: Document): SVGElement;
}

export abstract class Shape extends Node {
    // strok fill
}




export abstract class Container extends Array<Node | Container> implements INode {
    id?: string;
    transform?: Transform;
    opacity?: NumberValue;

    _update(frame: number, node: SVGElement): boolean {

        for (const e of this) {
            //  e._update(frame, )

        }
        return true;

    }
    abstract as_svg(doc: Document): SVGElement;
}

export class Group extends Container {
    as_svg(doc: Document) {
        const con = doc.createElementNS(NS_SVG, "group");
        for (const sub of this) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
    }
}
// 
export class ViewPort extends Container {
    view_port: Box = new Box([0, 0], [100, 100]);
    as_svg(doc: Document) {
        const con = doc.createElementNS(NS_SVG, "svg");
        // e.preserveAspectRatio
        // this.view_port.size
        // e.width.baseVal.value = this.size
        // e.addEventListener
        (con as any)._aux = this;
        for (const sub of this) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
    }
}

const NS_SVG = "http://www.w3.org/2000/svg"
export class Rect extends Shape {
    size: NVectorValue = new NVectorValue([100, 100]);
    as_svg(doc: Document) {
        const e = doc.createElementNS(NS_SVG, "rect");
        // e.width.baseVal.value = this.size
        // e.addEventListener
        (e as any)._aux = this;
        return e;
    }
    _update(frame: number, node: SVGElement): boolean {
        let x = this.size.get_value(frame);
        let e = node as unknown as SVGRectElement;
        e.width.baseVal.value = x[0];
        e.height.baseVal.value = x[0];
        // super.
        update(frame, this, node);
        return false;
    }
}

// export class Ellipse extends Shape {
//     size: NVectorValue = new NVectorValue([100, 100]);
// }

// export class Image extends Node {
//     href: string = "";
//     size: NVectorValue = new NVectorValue([100, 100]);
// }

const w = new WeakMap<SVGElement, INode>();

function _update_walk(frame: number, node: SVGElement) {
    // w.get(node);
    const aux = (node as any)._aux as INode;
    if (aux) {
        if (aux._update(frame, node)) {
            for (let cur = node.firstElementChild; cur; cur = cur.nextElementSibling) {
                _update_walk(frame, cur as SVGElement);
            }
        }
    }
}

export class Root extends ViewPort {
    defs: Array<Node | Container> = [];

}