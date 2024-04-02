import { Animatable, NVectorValue } from "./keyframes.js";
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
}
export class Box extends ValueSet {
    size;
    position;
    constructor(position, size) {
        super();
        this.size = new NVectorValue(size);
        this.position = new NVectorValue(position);
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
//# sourceMappingURL=properties.js.map