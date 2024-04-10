import { Animatable, NVectorValue, NumberValue, PositionValue, RGBValue } from "./keyframes.js";

export class ValueSet {
    *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (const sub of Object.values(this)) {
            if (sub instanceof Animatable) {
                // let { value } = sub;
                // if (value instanceof Keyframes) {
                //     yield value;
                // }
                yield sub;
            }
        }
    }
    update_prop(frame: number, node: SVGElement) {
        throw new Error(`Not implemented`);
    }
}

export class Box extends ValueSet {
    size: PositionValue;
    position: PositionValue;
    constructor(position: Iterable<number>, size: Iterable<number>) {
        super();
        this.size = new NVectorValue(size);
        this.position = new NVectorValue(position);
    }
    update_prop(frame: number, node: SVGSVGElement) {
        const size = this.size.get_value(frame);
        const pos = this.position.get_value(frame);
        node.x.baseVal.value = pos[0];
        node.y.baseVal.value = pos[1];
        node.width.baseVal.value = size[0];
        node.height.baseVal.value = size[1];
    }
}

export class Stroke extends ValueSet {
    width?: NumberValue;
}

export class Fill extends ValueSet {
    color?: RGBValue;
    opacity?: NumberValue;
}


export class Transform extends ValueSet {
    anchor?: PositionValue;
    position?: PositionValue;
    scale?: NVectorValue;
    rotation?: NumberValue;
    skew?: NumberValue;
    skew_axis?: NumberValue;

}
export const UPDATE: {
    [key: string]: any;
} = {

    opacity: function (frame: number, node: SVGElement, prop: NumberValue) {
        const v = prop.get_value(frame);
        node.style.opacity = v + '';
    }
}


export class OpacityProp extends NumberValue {
    update_prop(frame: number, node: SVGElement) {
        const v = this.get_value(frame);
        node.style.opacity = v + '';
    }
}

export class RectSizeProp extends NVectorValue {
    update_prop(frame: number, node: SVGRectElement) {
        let x = this.get_value(frame);
        node.width.baseVal.value = x[0];
        node.height.baseVal.value = x[1];
    }
    static {
        UPDATE['size'] = function (frame: number, node: SVGRectElement, prop: NVectorValue) {
            let x = prop.get_value(frame);
            node.width.baseVal.value = x[0];
            node.height.baseVal.value = x[1];
        }
    }
}


