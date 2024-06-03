import { Animated } from "../keyframe/keyframe.js";
import { KeyframeEntry, push_kfe } from "../keyframe/kfhelper.js";
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
    dump_kfe(kfe: KeyframeEntry<V>, value: any): KFEntry<V> {
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
    dump(): ValueT<V> {
        const { value, kfs } = this;
        const o: ValueT<V> = { v: this.dump_value(value) };
        if (kfs && kfs.length > 0) {
            o.k = kfs.map((v) => this.dump_kfe(v, this.dump_value(v.value)));
        }
        if (this._repeat_count) {
            o.r = this._repeat_count;
        }
        if (this._bounce) {
            o.b = this._bounce;
        }
        return o;
    }
    load_kfe(x: KFBase, value: V): KeyframeEntry<V> {
        const { t: time, h, o, i } = x;
        if (h) {
            return { time, easing: true, value };
        } else if (o && i) {
            const [ox, oy] = o;
            const [ix, iy] = i;
            return { time, easing: [ox, oy, ix, iy], value };
        }
        return { time, value };
    }
    load(x: ValueF<any>) {
        const { k, v } = x;
        if (k != undefined) {
            const { r, b } = x;
            this.kfs = k.map((x) => this.load_kfe(x, this.load_value(x.v)));
            if (r != null) {
                this._repeat_count = r;
            }
            if (b != null) {
                this._bounce = b;
            }
        }
        if (v != undefined) {
            this.value = this.load_value(x.v);
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
                last = push_kfe(kfs, start, last.value);
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
                    last = push_kfe(kfs, start, this.value);
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
        return push_kfe(kfs, frame, value);
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
    override dump_value(a: NVector): any {
        if (a == null) {
            return null;
        }
        return Array.from(a); // NaN -> null
    }

    override load_value(a: any): NVector {
        return new NVector(a);
    }

    constructor(v: NVector) {
        super(v);
    }
}

export class PointsValue extends AnimatableD<number[][]> {
    override dump_value(s: number[][]) {
        return s;
    }
    override load_value(a: any): number[][] {
        return a as number[][];
    }
}
export class TextValue extends AnimatableD<string> {
    override add_value(a: string, b: string): string {
        return a + "" + b;
    }
    override dump_value(s: string) {
        return s;
    }
    override load_value(a: any): string {
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
    override dump_value(v: number): any {
        return v;
    }
    override load_value(a: any): number {
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



