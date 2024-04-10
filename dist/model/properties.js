import { Animatable, NVectorValue, NumberValue } from "./keyframes.js";
export class ValueSet {
    *enum_values() {
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
    update_prop(frame, node) {
        throw new Error(`Not implemented`);
    }
}
export class Box extends ValueSet {
    size;
    position;
    constructor(position, size) {
        super();
        this.size = new NVectorValue(size);
        this.position = new NVectorValue(position);
    }
    update_prop(frame, node) {
        const size = this.size.get_value(frame);
        const pos = this.position.get_value(frame);
        node.x.baseVal.value = pos[0];
        node.y.baseVal.value = pos[1];
        node.width.baseVal.value = size[0];
        node.height.baseVal.value = size[1];
    }
}
export class Stroke extends ValueSet {
    width;
}
export class Fill extends ValueSet {
    color;
    opacity;
}
export class Transform extends ValueSet {
    anchor;
    position;
    scale;
    rotation;
    skew;
    skew_axis;
}
export class OpacityProp extends NumberValue {
    update_prop(frame, node) {
        const v = this.get_value(frame);
        node.style.opacity = v + '';
    }
}
export class RectSizeProp extends NVectorValue {
    update_prop(frame, node) {
        let x = this.get_value(frame);
        node.width.baseVal.value = x[0];
        node.height.baseVal.value = x[1];
    }
}
//# sourceMappingURL=properties.js.map