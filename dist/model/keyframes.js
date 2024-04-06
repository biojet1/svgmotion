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
    calc_ratio(r) {
        const { out_value: ov, in_value: iv } = this;
        return cubic_bezier_y_of_x([0, 0], [ov.x, ov.y], [iv.x, iv.y], [1, 1])(r);
    }
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
        if (value instanceof Keyframes) {
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
                        return this.lerp_value(p.calc_ratio(r), p.value, k.value);
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
                        throw new Error(`unexpected start=${start} last.time=${last.time} time=${time}`);
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
                if (easing === true) {
                    last.hold = true;
                }
                else {
                    easing(last);
                }
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        return kfs.set_value(time, value);
    }
    parse_value(x) {
        return x;
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
export class Size extends NVector {
    constructor(w = 0, h = 0) {
        super([w, h]);
    }
}
export class RGB extends NVector {
    constructor(r = 0, g = 0, b = 0) {
        super([r, g, b]);
    }
}
// def Point3D(x, y, z):
//     return NVector(x, y, z)
export class PositionValue extends NVectorValue {
}
export class RGBValue extends NVectorValue {
}
//# sourceMappingURL=keyframes.js.map