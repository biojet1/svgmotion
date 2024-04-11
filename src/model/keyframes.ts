import { cubic_bezier_y_of_x } from "./bezier.js";

export interface IEasing {
    ratio_at(t: number): number;
    reverse(): IEasing;
}

export class KeyframeEntry<V> {
    time: number = 0;
    value!: V;
    easing?: IEasing | boolean;
}

export class Keyframes<V> extends Array<KeyframeEntry<V>> {
    set_value(time: number, value: V) {
        let last = this[this.length - 1];
        if (last) {
            if (last.time == time) {
                last.value = value;
                return last;
            } else if (time < last.time) {
                throw new Error(`keyframe is incremental`);
            }
        }
        const kf = new KeyframeEntry<V>();
        kf.time = time;
        kf.value = value;
        this.push(kf);
        return kf;
    }
}

export class Animatable<V> {
    value!: Keyframes<V> | V;
    lerp_value(ratio: number, a: V, b: V): V {
        throw Error(`Not implemented`);
    }
    add_value(a: V, b: V): V {
        throw Error(`Not implemented`);
        // return a + b;
    }
    get_value(frame: number) {
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
                        } else if (r == 1) {
                            return k.value;
                        } else if (p.easing && p.easing !== true) {
                            r = p.easing.ratio_at(r);
                        }
                        return this.lerp_value(r, p.value, k.value);
                    } else {
                        return k.value;
                    }
                }
                p = k;
            }
            if (p) {
                return p.value;
            }
            throw new Error(`empty keyframe list`);
        } else {
            return value;
        }
    }

    set_value(
        frame: number,
        value: V,
        start?: number,
        easing?: IEasing | boolean,
        add?: boolean
    ) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                } else if (start > last.time) {
                    last.easing = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                } else {
                    if (start != last.time) {
                        throw new Error(
                            `unexpected start=${start} last.time=${last.time} time=${frame}`
                        );
                    }
                }
            }
        } else {
            const v = kfs;
            kfs = this.value = new Keyframes<V>();
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
    check_value(x: any): V {
        return x as V;
    }
    constructor(v: V) {
        this.value = v;
    }
}

export class AnimatableD<V> extends Animatable<V> {
    override get_value(frame: number) {
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
        } else {
            return value;
        }
    }
    override set_value(
        frame: number,
        value: V,
        start?: number,
        easing?: IEasing | boolean,
        add?: boolean
    ) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                } else if (start > last.time) {
                    last.easing = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                } else {
                    if (start != last.time) {
                        throw new Error(
                            `unexpected start=${start} last.time=${last.time} time=${frame}`
                        );
                    }
                }
            }
        } else {
            const v = kfs;
            kfs = this.value = new Keyframes<V>();
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

export class NumberValue extends Animatable<number> {
    lerp_value(r: number, a: number, b: number): number {
        return a * (1 - r) + b * r;
    }
    add_value(a: number, b: number): number {
        return a + b;
    }

    constructor(v: number = 0) {
        super(v);
    }
}

export class NVector extends Float64Array {
    add(that: NVector) {
        return new NVector(this.map((v, i) => v + that[i]));
    }
    mul(that: NVector) {
        return new NVector(this.map((v, i) => v * that[i]));
    }
    lerp(that: NVector, t: number) {
        const u = 1 - t;
        const a = this.map((v, i) => v * u);
        const b = that.map((v, i) => v * t);
        return new NVector(a.map((v, i) => v + b[i]));
    }
}

export class NVectorValue extends Animatable<NVector> {
    lerp_value(r: number, a: NVector, b: NVector): NVector {
        return a.lerp(b, r);
    }
    add_value(a: NVector, b: NVector): NVector {
        return a.add(b);
    }
    check_value(x: any): NVector {
        if (x instanceof NVector) {
            return x;
        } else {
            return new NVector(x);
        }
    }
    constructor(v: Iterable<number>) {
        super(NVector.from(v) as NVector);
    }
}
// def Point(x, y):
//     return NVector(x, y)

// def Size(x, y):
//     return NVector(x, y)
export class Point extends NVector {
    constructor(x: number = 0, y: number = 0) {
        super([x, y]);
    }
}

export class Size extends NVector {
    constructor(w: number = 0, h: number = 0) {
        super([w, h]);
    }
}

export class RGB extends NVector {
    constructor(r: number = 0, g: number = 0, b: number = 0) {
        super([r, g, b]);
    }
}
// def Point3D(x, y, z):
//     return NVector(x, y, z)
export class PositionValue extends NVectorValue {
    // constructor(x: number = 0, y: number = 0) {
    //     super([x, y]);
    // }
}

export class RGBValue extends NVectorValue {
    // constructor(x: number = 0, y: number = 0) {
    //     super([x, y]);
    // }
    static to_css_rgb([r, g, b]: Iterable<number>) {
        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
            b * 255
        )})`;
    }
}

export class TextValue extends AnimatableD<string> {
    add_value(a: string, b: string): string {
        return a + '' + b;
    }
}
