import { Animatable, Keyframes, NVectorValue, NumberValue } from "./keyframes.js";
import { Box, Fill, Stroke, Transform, ValueSet } from "./properties.js";

interface INode {
    id?: string;
    transform?: Transform;
    opacity?: NumberValue;
    _node?: SVGElement;
    // fill?: Fill;
    stroke?: Stroke;
    // clip
    // _update(frame: number, node: SVGElement): boolean;

}

function update(frame: number, target: INode, el: SVGElement) {
    const { opacity } = target;
    if (opacity) {
        const v = opacity.get_value(frame);
        el.style.opacity = v + '';
        // el.style.stroke
    }
}

export abstract class Node implements INode {
    id?: string;
    transform?: Transform;
    opacity?: NumberValue;
    _node?: SVGElement;

    abstract as_svg(doc: Document): SVGElement;

    update_self(frame: number, node: SVGElement): void {
        update(frame, this, node);
    }

    update_node(frame: number): void {
        const node = this._node;
        if (node) {
            this.update_self(frame, node);
        }
    }
    * enum_values(): Generator<Animatable<any>, void, unknown> {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            } else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
    }
}

export abstract class Shape extends Node {
    // strok fill
}

export abstract class Container extends Array<Node | Container> implements INode {
    id?: string;
    transform?: Transform;
    opacity?: NumberValue;
    // fill?: Fill;
    stroke?: Stroke;

    _node?: SVGElement;

    abstract as_svg(doc: Document): SVGElement;
    update_self(frame: number, node: SVGElement): boolean {
        update(frame, this, node);
        return true; // should we call update_node to children
    }
    update_node(frame: number) {
        const node = this._node;
        if (node) {
            if (this.update_self(frame, node)) {
                for (const sub of this) {
                    sub.update_node(frame);
                }
            }
        }
    }
    * enum_values(): Generator<Animatable<any>, void, unknown> {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            } else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
        for (const sub of this) {
            yield* sub.enum_values();
        }
    }

    * enum_keyframes(): Generator<Keyframes<any>, void, unknown> {
        for (let { value } of this.enum_values()) {
            if (value instanceof Keyframes) {
                yield value;
            }
        }
    }
    add_rect(size: Iterable<number> = [100, 100]) {
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
    as_svg(doc: Document) {
        const con = this._node = doc.createElementNS(NS_SVG, "group");
        for (const sub of this) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
    }
}

export class ViewPort extends Container {
    view_port: Box = new Box([0, 0], [100, 100]);
    as_svg(doc: Document) {
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

const NS_SVG = "http://www.w3.org/2000/svg"
export class Rect extends Shape {
    size: NVectorValue = new NVectorValue([100, 100]);
    as_svg(doc: Document) {
        const e = this._node = doc.createElementNS(NS_SVG, "rect");
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return e;
    }
    update_self(frame: number, node: SVGElement) {
        let x = this.size.get_value(frame);
        let e = node as unknown as SVGRectElement;
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
    defs: Array<Node | Container> = [];


}