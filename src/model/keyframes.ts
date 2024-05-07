import { cubic_bezier_y_of_x } from "./bezier.js";
export interface KFBase {
    t: number;
    h?: boolean;
    o?: Iterable<number>;
    i?: Iterable<number>;
}

export interface KFEntry<V> extends KFBase {
    v: V;
}

export type Value<V> = { k: KFEntry<V>[] } | { v: V };
export type ValueP<V> = { k?: KFEntry<V>[], v?: V };

function ratio_at(a: Iterable<number>, t: number) {
    const [ox, oy, ix, iy] = a;
    return cubic_bezier_y_of_x([0, 0], [ox, oy], [ix, iy], [1, 1])(t);
}

export function kfe_from_json<V>(x: KFBase, value: V): KeyframeEntry<V> {
    const { t: time, h, o, i } = x;
    if (h) {
        return { time, easing: true, value };
    } else if (o && i) {
        const [ox, oy] = o;
        const [ix, iy] = o;
        return { time, easing: [ox, oy, ix, iy], value };
    }
    return { time, value };
}
function kfe_to_json<V>(kfe: KeyframeEntry<V>, value: any): KFEntry<V> {
    const { time: t, easing } = kfe;
    if (!easing) {
        return { t, v: value };
    } else if (easing === true) {
        return { t, h: true, v: value };
    } else {
        const [ox, oy, ix, iy] = easing;
        return { t, o: [ox, oy], i: [ix, iy], v: value };
    }
}

export interface KeyframeEntry<V> {
    time: number;
    value: V;
    easing?: Iterable<number> | boolean;
}

export class Keyframes<V> extends Array<KeyframeEntry<V>> {
    set_value(time: number, value: V): KeyframeEntry<V> {
        let last = this[this.length - 1];
        if (last) {
            if (last.time == time) {
                last.value = value;
                return last;
            } else if (time < last.time) {
                throw new Error(`keyframe is incremental`);
            }
        }
        const kf = { time, value };
        this.push({ time, value });
        return kf;
    }
}

export class Animatable<V> {
    value!: Keyframes<V> | V | null;
    // static
    lerp_value(ratio: number, a: V, b: V): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // static
    add_value(a: V, b: V): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // static
    value_to_json(a: V | null): any {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // static
    value_from_json(a: any): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // set_intial_value
    parse_value(a: string) {
        throw Error(`Not implemented by '${this.constructor.name}' ("${a}")`);
    }
    // get_value_f()
    format_value(frame: number): string {
        throw Error(`Not implemented by '${this.constructor.name}' ("${frame}")`);
    }
    // get_frame_value
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
                            r = ratio_at(p.easing, r);
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
            if (value == null) {
                throw new Error(`value cant be null`);
            }
            return value;
        }
    }
    // set_at()
    // get_at() set()
    // set_frame_value()

    set_value(
        frame: number,
        value: V,
        start?: number,
        easing?: Iterable<number> | boolean,
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
                            `unexpected start=${start} last.time=${last.time} time=${frame} value=${value}`
                        );
                    }
                }
            }
        } else {
            const v = kfs;
            kfs = this.value = new Keyframes<V>();
            if (start != undefined) {
                if (v != null) {
                    last = kfs.set_value(start, v);
                }
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
    constructor(v: Keyframes<V> | V) {
        if (v == null) {
            throw new Error(`unexpected value=${v}`);
        } else {
            this.value = v;
        }
    }
    to_json(): Value<V> {
        const { value } = this;
        if (value instanceof Keyframes) {
            return {
                k: value.map((v) =>
                    kfe_to_json(v, this.value_to_json(v.value))
                ),
            };
        } else {
            return { v: this.value_to_json(value) };
        }
    }

    from_json(x: ValueP<any>) {
        const { k, v } = x;
        if (k != undefined) {
            const kfs = new Keyframes<V>();
            kfs.push(
                ...k.map((x) => kfe_from_json(x, this.value_from_json(x.v)))
            );
            this.value = kfs;
        } else if (v != undefined) {
            this.value = this.value_from_json(x.v);
        } else if (v === null) {
            this.value = null;
        } else {
            // console.error(x);
            throw Error(`No k, v (${Object.entries(x)})`);
        }
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
            if (value == null) {
                throw new Error(`value cant be null`);
            }
            return value;
        }
    }
    override set_value(
        frame: number,
        value: V,
        start?: number,
        easing?: Iterable<number> | boolean,
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
                if (v != null) {
                    last = kfs.set_value(start, v);
                }
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
    override lerp_value(r: number, a: number, b: number): number {
        return a * (1 - r) + b * r;
    }
    override add_value(a: number, b: number): number {
        return a + b;
    }
    override value_to_json(v: number): any {
        return v;
    }
    override value_from_json(a: any): number {
        return a as number;
    }
    override format_value(frame: number): string {
        const c = this.get_value(frame);
        return c + '';
    }
    override parse_value(s: string) {
        this.value = parseFloat(s);
    }
    constructor(v: number | Keyframes<number> = 0) {
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
    // static from(x: ArrayLike<number>) {
    //     return new NVector(x);
    // }
}

export class NVectorValue extends Animatable<NVector> {
    override lerp_value(r: number, a: NVector, b: NVector): NVector {
        return a.lerp(b, r);
    }
    override add_value(a: NVector, b: NVector): NVector {
        return a.add(b);
    }
    override check_value(x: any): NVector {
        if (x instanceof NVector) {
            return x;
        } else {
            return new NVector(x);
        }
    }
    override value_to_json(a: NVector): any {
        if (a == null) {
            return null;
        }
        return Array.from(a); // NaN -> null
    }

    override value_from_json(a: any): NVector {
        return new NVector(a);
    }

    override parse_value(s: string) {
        this.value = this.value_from_json(s.split(/[\s,]+/).map(function (str) {
            return parseFloat(str.trim());
        }));

    }

    constructor(v: NVector | Keyframes<NVector>) {
        super(v);
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
export class RGBNone extends RGB {
    constructor() {
        super(NaN, NaN, NaN);
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
    static to_css_rgb([r, g, b, a]: Iterable<number>) {
        if (a == 0) {
            return 'none';
        }
        return `rgb(${Math.round((r * 255) % 256)}, ${Math.round(
            (g * 255) % 256
        )}, ${Math.round((b * 255) % 256)})`;
    }
    // override format_value(frame: number): string {
    //     if (this.value == null) {
    //         return 'none';
    //     }
    //     const c = this.get_value(frame);
    //     // console.log("format_value", c.constructor.name);

    //     return RGBValue.to_css_rgb(c);
    // }


}

export class TextValue extends AnimatableD<string> {
    override add_value(a: string, b: string): string {
        return a + "" + b;
    }
    override parse_value(s: string) {
        this.value = s;
    }
    override value_to_json(s: string) {
        return s;
    }
    override value_from_json(a: any): string {
        return a + '';
    }
}

export class PointsValue extends AnimatableD<number[][]> {
    override value_to_json(s: number[][]) {
        return s;
    }
    override value_from_json(a: any): number[][] {
        return a as number[][];
    }
    override parse_value(s: string) {
        const nums = s.split(/[\s,]+/).map(function (str) {
            return parseFloat(str.trim());
        });
        const points: number[][] = [];
        for (let n = nums.length - 1; n-- > 0; n--) {
            points.push([nums.shift()!, nums.shift()!]);

        }
        this.value = points;
    }
}