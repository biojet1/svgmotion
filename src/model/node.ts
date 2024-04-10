import { Animatable, Keyframes, NVectorValue, NumberValue } from "./keyframes.js";
import { Box, Fill, OpacityProp, RectSizeProp, Stroke, Transform, UPDATE, ValueSet } from "./properties.js";

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



export abstract class Node implements INode {
    id?: string;
    // transform?: Transform;
    // opacity?: OpacityProp;
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
    get opacity() {
        const v = new NumberValue(1);
        const o = { value: v, writable: true, enumerable: true };
        console.log("opacity prop_x", o)
        Object.defineProperty(this, "opacity", o)
        return v;
    }
    get fill() {
        const v = new Fill();
        const o = { value: v, writable: true, enumerable: true };
        Object.defineProperty(this, "fill", o)
        return v;
    }
    // get transform() {
    //     const v = new Transform();
    //     Object.defineProperty(this, "transform", { value: v })
    //     return v;
    // }

}

export abstract class Shape extends Node {
    // strok fill
    get prop_x() {
        const p = { value: { value: 4 } };
        console.log("prop_x", p)
        Object.defineProperty(this, "prop_x", p)
        return p;
    }

}

export abstract class Container extends Array<Node | Container> implements INode {
    id?: string;
    // transform?: Transform;
    opacity?: OpacityProp;
    // // fill?: Fill;
    // stroke?: Stroke;


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
function update(frame: number, target: Node | Container, el: SVGElement) {
    for (let [n, v] of Object.entries(target)) {
        v && UPDATE[n]?.(frame, el, v);
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
    size: RectSizeProp = new RectSizeProp([100, 100]);
    as_svg(doc: Document) {
        const e = this._node = doc.createElementNS(NS_SVG, "rect");
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return e;
    }
    // update_self(frame: number, node: SVGElement) {
    //     let x = this.size.get_value(frame);
    //     let e = node as unknown as SVGRectElement;
    //     e.width.baseVal.value = x[0];
    //     e.height.baseVal.value = x[1];
    //     // console.log(`Rect:update_self ${frame} ${x}`);
    //     super.update_self(frame, node);
    // }
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