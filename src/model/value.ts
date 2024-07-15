import { cubic_point_at } from "../keyframe/bezier.js";
import { Animated, KeyExtra } from "../keyframe/keyframe.js";
import { Keyframe } from "../keyframe/kfhelper.js";
export interface PlainKeyframe {
    t: number;
    h?: boolean;
    o?: Iterable<number>;
    i?: Iterable<number>;
}

export interface PlainKeyframeV<V> extends PlainKeyframe {
    v: V;
    r?: number; // repeat_count
    b?: boolean; // bounce
}

export type PlainValue<V> = {
    v: V;
    k?: PlainKeyframeV<V>[];
    r?: number;
    b?: boolean;
    _?: string;
};

export class Animatable<
    V,
    K extends Keyframe<V> = Keyframe<V>
> extends Animated<V, K> {
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
    dump_keyframe(kfe: K, value: any): PlainKeyframeV<V> {
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
    dump(): PlainValue<V> {
        const { value, kfs } = this;
        const o: PlainValue<V> = { v: this.dump_value(value) };
        if (kfs && kfs.length > 0) {
            o.k = kfs.map((v) => this.dump_keyframe(v, this.dump_value(v.value)));
        }
        return o;
    }
    load_keyframe(x: PlainKeyframe, value: V): K {
        const { t: time, h, o, i } = x;
        if (h) {
            return { time, easing: true, value } as K;
        } else if (o && i) {
            const [ox, oy] = o;
            const [ix, iy] = i;
            return { time, easing: [ox, oy, ix, iy], value } as K;
        }
        return { time, value } as K;
    }
    load(x: PlainValue<any>) {
        const { k, v } = x;
        if (k != undefined) {
            const { r, b } = x;
            this.kfs = k.map((x) => this.load_keyframe(x, this.load_value(x.v)));
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
        let p = undefined; // previous Keyframe<V>
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
    override key_value(frame: number, value: V, extra?: KeyExtra) {
        const { start, easing, add } = extra ?? {};
        let { kfs } = this;
        let last;

        last = kfs.at(-1);
        if (last) {
            if (start == undefined) {
                // pass
            } else if (start > last.time) {
                last.easing = true;
                last = this.add_keyframe(start, last.value);
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
                    last = this.add_keyframe(start, this.value);
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
        return this.add_keyframe(frame, value);
    }
}

export class VectorValue<
    K extends Keyframe<Vector> = Keyframe<Vector>
> extends Animatable<Vector, K> {
    override lerp_value(r: number, a: Vector, b: Vector): Vector {
        return a.lerp(b, r);
    }
    override add_value(a: Vector, b: Vector): Vector {
        return a.add(b);
    }
    override check_value(x: any): Vector {
        if (x instanceof Vector) {
            return x;
        } else {
            return new Vector(x);
        }
    }
    override dump_value(a: Vector): any {
        if (a == null) {
            return null;
        }
        return Array.from(a); // NaN -> null
    }

    override load_value(a: any): Vector {
        return new Vector(a);
    }

    constructor(v: Vector) {
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

export class RGBValue extends VectorValue {
    static to_css_rgb([r, g, b, a]: Iterable<number>) {
        if (a == 0) {
            return "none";
        }
        return `rgb(${Math.round((r * 255) % 256)}, ${Math.round(
            (g * 255) % 256
        )}, ${Math.round((b * 255) % 256)})`;
    }
}

export interface PositionKeyframe<V> extends Keyframe<V> {
    in_tan?: Iterable<number>;
    out_tan?: Iterable<number>;
}

export interface PositionKFData<V> extends PlainKeyframeV<V> {
    ti?: Iterable<number>;
    to?: Iterable<number>;
}

export class PositionValue extends VectorValue<PositionKeyframe<Vector>> {
    override lerp_keyframes(
        t: number,
        a: PositionKeyframe<Vector>,
        b: PositionKeyframe<Vector>
    ) {
        const ti = a.in_tan;
        if (ti) {
            const to = a.out_tan;
            if (to) {
                const [ix, iy] = ti;
                const [ox, oy] = to;
                const [ax, ay] = a.value;
                const [bx, by] = b.value;
                const [x, y] = cubic_point_at(
                    t,
                    [ax, ay],
                    [ax + ox, ay + oy],
                    [bx + ix, by + iy],
                    [bx, by]
                );
                return new Vector([x, y]);
            }
        }
        return super.lerp_keyframes(t, a, b);
    }

    override dump_keyframe(
        kfe: PositionKeyframe<Vector>,
        value: any
    ): PositionKFData<Vector> {
        const d: PositionKFData<Vector> = super.dump_keyframe(kfe, value);
        const ti = kfe.in_tan;
        if (ti) {
            const to = kfe.out_tan;
            if (to) {
                d.ti = ti;
                d.to = to;
            }
        }
        return d;
    }
    override load_keyframe(
        x: PositionKFData<Vector>,
        value: Vector
    ): PositionKeyframe<Vector> {
        const kf: PositionKeyframe<Vector> = super.load_keyframe(x, value);
        const { ti, to } = x;
        if (ti && to) {
            kf.in_tan = ti;
            kf.out_tan = to;
        }
        return kf;
    }

    override key_value(frame: number, value: Vector, extra?: KeyExtra) {
        let kf = super.key_value(frame, value, extra);
        let last = this.kfs.at(-2);
        if (last && extra) {
            const [c1, c2] = extra?.curve ?? [];
            if (c1) {
                if (c2) {
                    last.out_tan = c1;
                    last.in_tan = c2;
                } else {
                    // reflect ?
                }
            }
        }

        return kf;
    }
}

export class ScalarValue extends Animatable<number> {
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

export class Vector extends Float64Array {
    add(that: Vector) {
        return new Vector(this.map((v, i) => v + that[i]));
    }
    mul(that: Vector) {
        return new Vector(this.map((v, i) => v * that[i]));
    }
    lerp(that: Vector, t: number) {
        const u = 1 - t;
        const a = this.map((v, i) => v * u);
        const b = that.map((v, i) => v * t);
        return new Vector(a.map((v, i) => v + b[i]));
    }
}

export class Point extends Vector {
    constructor(x: number = 0, y: number = 0) {
        super([x, y]);
    }
}

export class Size extends Vector {
    constructor(w: number = 0, h: number = 0) {
        super([w, h]);
    }
}

export class RGB extends Vector {
    constructor(r: number = 0, g: number = 0, b: number = 0) {
        super([r, g, b]);
    }
}
export class RGBNone extends RGB {
    constructor() {
        super(NaN, NaN, NaN);
    }
}
