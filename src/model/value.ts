import { cubic_point_at } from "../keyframe/bezier.js";
import { Vector } from "../geom/index.js";
import { Keyframe, Animated, KeyExtra } from "../keyframe/keyframe.js";
import { parse_css_color } from "../helper/parse_color.js";


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
    value: V | string;
    _parent?: any;


    // static
    override initial_value(): V {
        const v = this.check_value(this.value);
        return this.value = v;
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
    dump_key_value(x: V): any {
        return this.dump_value(x)
    }

    dump(): PlainValue<V> {
        const { value, kfs } = this;
        const o: PlainValue<V> = { v: this.dump_value(value) };
        if (kfs && kfs.length > 0) {
            o.k = kfs.map((v) => this.dump_keyframe(v, this.dump_key_value(v.value)));
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
    load_key_value(x: any): V {
        return this.load_value(x);
    }
    load(x: PlainValue<any>) {
        const { k, v } = x;
        if (k != undefined) {
            const { r, b } = x;
            this.kfs = k.map((x) => this.load_keyframe(x, this.load_key_value(x.v)));
        }
        if (v != undefined) {
            this.value = this.load_value(x.v);
        }
    }
    get_repr(frame: number): string {
        const { value, kfs } = this;
        if (kfs && kfs.length > 0) {
            return this.get_value(frame) + '';
        }
        return value + '';
    }
    set_repr(value: string) {
        this.value = value;
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
            if (frame < k.time) {
                if (p) {
                    return p.value;
                } else {
                    return k.value;
                }
            }
            p = k;
        }
        if (p) {
            return p.value;
        }
        return this.initial_value();
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
                last = this.add_keyframe(start, this.initial_value());
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

export class VectorValue<K extends Keyframe<Vector> = Keyframe<Vector>> extends Animatable<Vector, K> {
    override lerp_value(r: number, a: Vector, b: Vector): Vector {
        return a.lerp(b, r);
    }
    override add_value(a: Vector, b: Vector): Vector {
        return a.add(b);
    }
    override check_value(x: any): Vector {
        if (x instanceof Vector) {
            return x;
        } else if (typeof x == "string") {
            return this.load_value(x.split(/[\s,]+/).map(function (str) {
                return parseFloat(str.trim());
            }));

        } else {
            return new Vector(x);
        }
    }
    override dump_value(a: Vector): any {
        if (a == null || typeof a == "string") {
            return a;
        } else {
            return this.dump_key_value(a);
        }
    }
    override dump_key_value(a: Vector): any {
        if (a instanceof Vector) {
            return Array.from(a); // NaN -> null
        } else {
            throw new Error(`not a Vector`);
        }
    }

    override load_value(a: any): Vector {
        if (a == null || typeof a == "string") {
            return a;
        } else {
            return this.load_key_value(a);
        }

    }
    override load_key_value(a: any): Vector {
        if (Array.isArray(a)) {
            return new Vector(a);
        }
        throw new Error(`not array of numbers`);
    }
    override initial_value(): Vector {
        const { value } = this;
        if (value instanceof Vector) {
            return value;
        }
        const v = this.check_value(value);
        return this.value = v;
        // throw Error(`Not a Vector '${this.constructor.name}' '${value}'`);
    }

    override get_repr(frame: number): string {
        const { value, kfs } = this;
        function format(v: Vector) {
            return Array.prototype.map.call(v, x => x.toString()).join(' ')
        }
        if (kfs && kfs.length > 0) {
            return format(this.get_value(frame));
        }
        if (value instanceof Vector) {
            return format(value);
        }
        return value + '';
    }

    constructor(v: Vector | Iterable<number>) {
        if (v instanceof Vector) {
            super(v);
        } else {
            super(new Vector(v));
        }
    }
}

export class PointsValue extends AnimatableD<number[][]> {
    override dump_value(s: number[][]) {
        return s;
    }
    override load_value(a: any): number[][] {
        return a as number[][];
    }
    override initial_value(): number[][] {
        const { value } = this;
        if (Array.isArray(value)) {
            return value;
        }
        return this.check_value(value);
    }
    override check_value(x: any): number[][] {
        if (Array.isArray(x)) {
            return x;
        } else if (typeof x == "string") {
            const nums = x.split(/[\s,]+/).map(function (str) {
                return parseFloat(str.trim());
            });
            const points: number[][] = [];
            for (let n = nums.length - 1; n-- > 0; n--) {
                points.push([nums.shift()!, nums.shift()!]);
            }
            return points;
        } else {
            throw Error(`Not a number[][] '${this.constructor.name}' '${x}'`);
        }
    }
    override get_repr(frame: number): string {
        const { value, kfs } = this;
        function format(v: number[][]) {
            return v.map(([a, b]) => `${a},${b}`).join(' ')
        }
        if (kfs && kfs.length > 0) {
            return format(this.get_value(frame));
        }
        if (Array.isArray(value)) {
            return format(value);
        }
        return value + '';
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
    override initial_value(): string {
        const { value } = this;
        if (typeof value === 'string') {
            return value;
        }
        throw Error(`Not a string '${this.constructor.name}' '${value}'`);
    }
    constructor(value: string = "") {
        super(value);
    }
}

export class UnknownValue extends AnimatableD<string> {

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
    override check_value(x: RGB) {
        if (x instanceof RGB) {
            return x;
        } else if (typeof x == "string") {
            const c = parse_css_color(x);
            if (c != null) {
                return new RGB(c[0] / 255, c[1] / 255, c[2] / 255);
            }
        } else {
            return new RGB(...(x as number[]));
        }
        throw new Error(`Invalid color "${x}"`);
    };

    override initial_value(): Vector {
        const { value } = this;
        return this.check_value(value as RGB);
    }
    override get_repr(frame: number): string {
        const { value, kfs } = this;
        function format(v: Vector) {
            return RGBValue.to_css_rgb(v);
        }
        if (kfs && kfs.length > 0) {
            return format(this.get_value(frame));
        }
        if (value instanceof Vector) {
            return format(value);
        }
        return value + '';
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
    override initial_value(): number {
        const { value } = this;
        if (typeof value === 'number') {
            return value;
        }
        return this.parse_number(value);
    }
    parse_number(value: string | any) {
        if (/^\s*[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?\s*$/.test(value)) {
            const v = parseFloat(value);
            if (!isNaN(v)) {
                return v;
            }
        }
        throw Error(`Not a number '${this.constructor.name}' '${value}'`);
    }
    constructor(v: number = 0) {
        super(v);
    }
}

export class PercentageValue extends ScalarValue {
    constructor(v: number = 0) {
        super(v);
    }
    override initial_value(): number {
        const { value } = this;
        if (typeof value === 'string') {
            if (value.endsWith('%')) {
                return this.parse_number(value.replaceAll('%', '')) / 100;
            }
        }
        return super.initial_value();
    }
    override get_repr(frame: number): string {
        const { value, kfs } = this;
        if (kfs && kfs.length > 0) {
            return this.get_value(frame).toFixed(5).replace(/0$/, '');
        }
        if (typeof value === 'number') {
            return value.toFixed(5).replace(/0$/, '');
        }
        return value + '';
    }


}

export class RGB extends Vector {
    constructor(r: number = 0, g: number = 0, b: number = 0) {
        if (!isFinite(r) || !isFinite(g) || !isFinite(b)) {
            throw new TypeError(`Not a finite number ${[r, g, b]}`);
        }
        super([r, g, b]);
    }


}

// export abstract class EnumeratedValue<V> extends AnimatableD<V> {
// }

// export abstract class MatchTextValue extends TextValue {
//     static _re = /.*/;

//     override check_value(x: any): string {
//         if ((this.constructor as typeof MatchTextValue)._re.exec(x) == null) {
//             throw Error(`Unexpected value ${x}`)
//         }
//         return x as string;
//     }
//     constructor(x: string) {
//         super(x)
//         this.check_value(x)
//     }
// }

// export abstract class EnumTextValue extends TextValue {
//     static _values: string[] = [];

//     override check_value(x: any): string {
//         if ((this.constructor as typeof EnumTextValue)._values.indexOf(x) < 0) {
//             throw Error(`Unexpected value ${x}`)
//         }
//         return x as string;
//     }
//     constructor(x: string) {
//         super(x)
//         this.check_value(x)
//     }
// }
