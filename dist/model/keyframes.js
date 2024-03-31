import { cubic_bezier_y_of_x } from "./bezier.js";
export class Handle {
    x = 0;
    y = 0;
}
export class KeyframeEntry {
    time = 0;
    in_value = new Handle();
    out_value = new Handle();
    hold = false;
    value;
}
export class Keyframes extends Array {
    set_value(time, value) {
        let last = this[this.length - 1];
        if (last) {
            if (last.time == time) {
                last.value = value;
                return last;
            }
            else if (time < last.time) {
                throw new Error(`keyframe is incremental`);
            }
        }
        const kf = new KeyframeEntry();
        kf.time = time;
        kf.value = value;
        this.push(kf);
        return kf;
    }
}
export class Animatable {
    value;
    get_value(time) {
        const { value } = this;
        if (value instanceof Array) {
            let p = undefined; // previous KeyframeEntry<V>
            for (const k of value) {
                if (time <= k.time) {
                    if (p) {
                        if (k.hold) {
                            return p.value;
                        }
                        const r = (time - p.time) / (k.time - p.time);
                        if (r == 0) {
                            return p.value;
                        }
                        else if (r == 1) {
                            return k.value;
                        }
                        return this.lerp_value(cubic_bezier_y_of_x([0, 0], [p.out_value.x, p.out_value.y], [p.in_value.x, p.in_value.y], [1, 1])(r), p.value, k.value);
                    }
                    else {
                        return k.value;
                    }
                }
                p = k;
            }
            if (p) {
                return p.value;
            }
            throw new Error(`empty keyframe list`);
        }
        else {
            return value;
        }
    }
    set_value(time, value, start, easing, add) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                }
                else if (start > last.time) {
                    last.hold = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                }
                else {
                    if (start != last.time) {
                        throw new Error(`unexpected`);
                    }
                }
            }
        }
        else {
            const v = kfs;
            kfs = this.value = new Keyframes();
            if (start != undefined) {
                last = kfs.set_value(start, v);
            }
        }
        if (last) {
            if (easing) {
                easing(last);
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        return kfs.set_value(time, value);
    }
    constructor(v) {
        this.value = v;
    }
}
export class NumberValue extends Animatable {
    lerp_value(r, a, b) {
        return a * (1 - r) + b * r;
    }
    add_value(a, b) {
        return a + b;
    }
    constructor(v) {
        super(v);
    }
}
export class NVector extends Float64Array {
    add(that) {
        return new NVector(this.map((v, i) => v + that[i]));
    }
    mul(that) {
        return new NVector(this.map((v, i) => v * that[i]));
    }
    lerp(that, t) {
        const u = (1 - t);
        const a = this.map((v, i) => v * u);
        const b = that.map((v, i) => v * t);
        return new NVector(a.map((v, i) => v + b[i]));
    }
}
export class NVectorValue extends Animatable {
    lerp_value(r, a, b) {
        return a.lerp(b, r);
    }
    add_value(a, b) {
        return a.add(b);
    }
    constructor(v) {
        super(new NVector(v));
    }
}
// def Point(x, y):
//     return NVector(x, y)
// def Size(x, y):
//     return NVector(x, y)
export class Point extends NVector {
    constructor(x = 0, y = 0) {
        super([x, y]);
    }
}
// def Point3D(x, y, z):
//     return NVector(x, y, z)
export class PositionValue extends NVectorValue {
}
export class Transform {
    anchor;
    position;
    scale;
    rotation;
    skew;
    skew_axis;
}
export class Box {
    size;
    position;
    constructor(position, size) {
        this.size = new NVectorValue(size);
        this.position = new NVectorValue(position);
    }
}
// class Transform(LottieObject):
//     """!
//     Layer transform
//     """
//     _props = [
//         LottieProp("anchor_point", "a", PositionValue, False),
//         LottieProp("position", "p", PositionValue, False),
//         LottieProp("scale", "s", MultiDimensional, False),
//         LottieProp("rotation", "r", Value, False),
//         LottieProp("opacity", "o", Value, False),
//         LottieProp("skew", "sk", Value, False),
//         LottieProp("skew_axis", "sa", Value, False),
// TODO: VectorValue, RGBAValue
//# sourceMappingURL=keyframes.js.map