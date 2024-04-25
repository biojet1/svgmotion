import { cubic_bezier_y_of_x } from "./bezier.js";
function ratio_at(a, t) {
    const [ox, oy, ix, iy] = a;
    return cubic_bezier_y_of_x([0, 0], [ox, oy], [ix, iy], [1, 1])(t);
}
function kfe_from_json(x, value) {
    const { t: time, h, o, i } = x;
    if (h) {
        return { time, easing: true, value };
    }
    else if (o && i) {
        const [ox, oy] = o;
        const [ix, iy] = o;
        return { time, easing: [ox, oy, ix, iy], value };
    }
    return { time, value };
}
function kfe_to_json(kfe, value) {
    const { time: t, easing } = kfe;
    if (!easing) {
        return { t, k: value };
    }
    else if (easing === true) {
        return { t, h: true, k: value };
    }
    else {
        const [ox, oy, ix, iy] = easing;
        return { t, o: [ox, oy], i: [ix, iy], k: value };
    }
}
export class KeyframeEntry {
    time = 0;
    value;
    easing;
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
    lerp_value(ratio, a, b) {
        throw Error(`Not implemented`);
    }
    add_value(a, b) {
        throw Error(`Not implemented`);
        // return a + b;
    }
    value_to_json(a) {
        throw Error(`Not implemented`);
    }
    value_from_json(a) {
        throw Error(`Not implemented`);
    }
    get_value(frame) {
        const { value } = this;
        if (value instanceof Keyframes) {
            let p = undefined; // previous KeyframeEntry<V>
            for (const k of value) {
                if (frame <= k.time) {
                    if (p) {
                        if (k.easing === true) {
                            return p.value;
                        }
                        let r = (frame - p.time) / (k.time - p.time);
                        if (r == 0) {
                            return p.value;
                        }
                        else if (r == 1) {
                            return k.value;
                        }
                        else if (p.easing && p.easing !== true) {
                            r = ratio_at(p.easing, r);
                        }
                        return this.lerp_value(r, p.value, k.value);
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
    set_value(frame, value, start, easing, add) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                }
                else if (start > last.time) {
                    last.easing = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                }
                else {
                    if (start != last.time) {
                        throw new Error(`unexpected start=${start} last.time=${last.time} time=${frame}`);
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
            if (easing != undefined) {
                last.easing = easing;
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        return kfs.set_value(frame, value);
    }
    check_value(x) {
        return x;
    }
    constructor(v) {
        if (v == null) {
            throw new Error(`unexpected value=${v}`);
        }
        else {
            this.value = v;
        }
    }
    to_json() {
        const { value } = this;
        if (value instanceof Keyframes) {
            return { k: value.map((v) => kfe_to_json(v, this.value_to_json(v.value))) };
        }
        else {
            return { v: value };
        }
    }
}
export class AnimatableD extends Animatable {
    get_value(frame) {
        const { value } = this;
        if (value instanceof Keyframes) {
            let p = undefined; // previous KeyframeEntry<V>
            for (const k of value) {
                if (k.time >= frame) {
                    return k.value;
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
    set_value(frame, value, start, easing, add) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                }
                else if (start > last.time) {
                    last.easing = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                }
                else {
                    if (start != last.time) {
                        throw new Error(`unexpected start=${start} last.time=${last.time} time=${frame}`);
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
            if (easing != undefined) {
                throw new Error(`easing not suppported`);
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        return kfs.set_value(frame, value);
    }
}
export class NumberValue extends Animatable {
    lerp_value(r, a, b) {
        return a * (1 - r) + b * r;
    }
    add_value(a, b) {
        return a + b;
    }
    constructor(v = 0) {
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
        const u = 1 - t;
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
    check_value(x) {
        if (x instanceof NVector) {
            return x;
        }
        else {
            return new NVector(x);
        }
    }
    value_to_json(a) {
        return [...a];
    }
    value_from_json(a) {
        return new NVector(a);
    }
    constructor(v) {
        super(v);
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
    // constructor(x: number = 0, y: number = 0) {
    //     super([x, y]);
    // }
    static to_css_rgb([r, g, b]) {
        return `rgb(${Math.round((r * 255) % 256)}, ${Math.round((g * 255) % 256)}, ${Math.round((b * 255) % 256)})`;
    }
}
export class TextValue extends AnimatableD {
    add_value(a, b) {
        return a + '' + b;
    }
}
//# sourceMappingURL=keyframes.js.map