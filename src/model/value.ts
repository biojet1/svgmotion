import { Animated } from "../keyframe/keyframe.js";
import { KeyframeEntry, Keyframes } from "../keyframe/kfhelper.js";
export interface KFBase {
    t: number;
    h?: boolean;
    o?: Iterable<number>;
    i?: Iterable<number>;
}

export interface KFEntry<V> extends KFBase {
    v: V;
    r?: number; // repeat_count
    b?: boolean; // bounce   
}

export type ValueT<V> = { v: V; k?: KFEntry<V>[]; r?: number; b?: boolean; _?: string; };
export type ValueF<V> = { v: V; k?: KFEntry<V>[]; r?: number; b?: boolean; };

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

export function kfe_to_json<V>(kfe: KeyframeEntry<V>, value: any): KFEntry<V> {
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
export class Animatable<V> extends Animated<V> {
    value: V | null;

    // static
    override initial_value(): V {
        const { value } = this;
        if (value == null) {
            throw new Error(`value cant be null`);
        }
        return value;
    }

    set_value(value: V | any) {
        this.value = this.check_value(value);
    }

    to_json(): ValueT<V> {
        const { value, kfs } = this;
        const o: ValueT<V> = { v: this.value_to_json(value) };
        if (kfs && kfs.length > 0) {
            o.k = [...kfs.map((v) => kfe_to_json(v, this.value_to_json(v.value))
            )];
        }
        if (this._repeat_count) {
            o.r = this._repeat_count;
        }
        if (this._bounce) {
            o.b = this._bounce;
        }
        return o;
    }

    from_json(x: ValueF<any>) {
        const { k, v } = x;
        if (k != undefined) {
            const { r, b } = x;
            this.kfs = new Keyframes<V>(...k.map((x) => kfe_from_json(x, this.value_from_json(x.v))));
            if (r != null) {
                this._repeat_count = r;
            }
            if (b != null) {
                this._bounce = b;
            }
        }
        if (v != undefined) {
            this.value = this.value_from_json(x.v);
        }
        if (v === null) {
            this.value = null;
        }
    }

    constructor(v: V) {
        super();
        if (v == null) {
            throw new Error(`unexpected value=${v}`);
        } else {
            this.value = v;
        }
    }
}

export class AnimatableD<V> extends Animatable<V> {
    override get_value(frame: number) {
        const { kfs } = this;
        let p = undefined; // previous KeyframeEntry<V>
        for (const k of kfs) {
            if (k.time >= frame) {
                return k.value;
            }
            p = k;
        }
        if (p) {
            return p.value;
        }
        // throw new Error(`empty keyframe list`);
        const { value } = this;
        if (value == null) {
            throw new Error(`value cant be null`);
        }
        return value;

    }
    override key_value(
        frame: number,
        value: V,
        start?: number,
        easing?: Iterable<number> | boolean,
        add?: boolean
    ) {
        let { kfs } = this;
        let last;

        last = kfs.at(-1);
        if (last) {
            if (start == undefined) {
                // pass
            } else if (start > last.time) {
                last.easing = true;
                last = kfs.push_value(start, last.value);
            } else {
                if (start != last.time) {
                    throw new Error(
                        `unexpected start=${start} last.time=${last.time} time=${frame}`
                    );
                }
            }
        } else {
            if (start != undefined) {
                if (this.value != null) {
                    last = kfs.push_value(start, this.value);
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
        return kfs.push_value(frame, value);
    }
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

    constructor(v: NVector) {
        super(v);
    }
}

export class PointsValue extends AnimatableD<number[][]> {
    override value_to_json(s: number[][]) {
        return s;
    }
    override value_from_json(a: any): number[][] {
        return a as number[][];
    }
}
export class TextValue extends AnimatableD<string> {
    override add_value(a: string, b: string): string {
        return a + "" + b;
    }
    override value_to_json(s: string) {
        return s;
    }
    override value_from_json(a: any): string {
        return a + "";
    }
}

export class RGBValue extends NVectorValue {
    static to_css_rgb([r, g, b, a]: Iterable<number>) {
        if (a == 0) {
            return "none";
        }
        return `rgb(${Math.round((r * 255) % 256)}, ${Math.round(
            (g * 255) % 256
        )}, ${Math.round((b * 255) % 256)})`;
    }
}

export class PositionValue extends NVectorValue { }

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

///////////



