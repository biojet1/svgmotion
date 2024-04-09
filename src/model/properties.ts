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
}

export class Box extends ValueSet {
    size: PositionValue;
    position: PositionValue;
    constructor(position: Iterable<number>, size: Iterable<number>) {
        super();
        this.size = new NVectorValue(size);
        this.position = new NVectorValue(position);
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
export class OpacityProp extends NumberValue {
    update_prop(frame: number, node: SVGElement) {
        const v = this.get_value(frame);
        node.style.opacity = v + '';
    }
}


