import { Animatable, NVector, NVectorValue, NumberValue, PositionValue, RGBValue, TextValue, Value } from "./keyframes.js";
import { Matrix } from "./matrix.js";

export function xget<T>(that: any, name: string, value: T): T {
    // console.log(`_GETX ${name}`);
    Object.defineProperty(that, name, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,


    });
    return value;
}
export function xset<T>(that: any, name: string, value: T) {
    // console.log(`_SETX ${name}`);
    Object.defineProperty(that, name, {
        value,
        writable: true,
        enumerable: true,
    });
}

export class ValueSet {
    // [key: string]: Animatable;
    *enum_values(): Generator<Animatable<any>, void, unknown> {
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
    to_json() {
        let u: any = {};
        for (let [k, v] of Object.entries(this)) {
            if (v instanceof Animatable) {
                u[k] = v.to_json();
            }
        }
        return u;
    }
    from_json(u: Value<any>) {
        for (let [k, v] of Object.entries(u)) {
            const p = (this as any)[k];
            if (p instanceof Animatable) {
                p.from_json(v);
            } else {
                throw new Error(`Unexpected property "${k}" (${v})`);
            }
        }
    }
}

export class Box extends ValueSet {
    constructor(position: Iterable<number>, size: Iterable<number>) {
        super();
        if (size) {
            this.size = new PositionValue(new NVector(size));
        }
        if (position) {
            this.position = new PositionValue(new NVector(position));
        }
    }
    /// size
    get size() {
        return xget(this, "size", new PositionValue(new NVector([100, 100])));
    }
    set size(v: PositionValue) {
        xset(this, "size", v);
    }
    /// position
    get position() {
        return xget(this, "position", new PositionValue(new NVector([0, 0])));
    }
    set position(v: PositionValue) {
        xset(this, "position", v);
    }
}

export class Stroke extends ValueSet {
    /// width
    get width() {
        return xget(this, "width", new NumberValue(1));
    }
    set width(v: NumberValue) {
        xset(this, "width", v);
    }
    /// opacity
    get opacity() {
        return xget(this, "opacity", new NumberValue(1));
    }
    set opacity(v: NumberValue) {
        xset(this, "opacity", v);
    }
    /// color
    get color() {
        return xget(this, "color", new RGBValue(new NVector([0, 0, 0])));
    }
    set color(v: RGBValue) {
        xset(this, "color", v);
    }
    /// stroke-miterlimit
    get miter_limit() {
        return xget(this, "miter_limit", new NumberValue(4));
    }
    set miter_limit(v: NumberValue) {
        xset(this, "miter_limit", v);
    }
    // stroke-dashoffset
    get dash_offset() {
        return xget(this, "dash_offset", new NumberValue(1));
    }
    set dash_offset(v: NumberValue) {
        xset(this, "dash_offset", v);
    }
    // stroke-array
    get dash_array() {
        return xget(this, "dash_array", new NVectorValue(new NVector([1, 1])));
    }
    set dash_array(v: NVectorValue) {
        xset(this, "dash_array", v);
    }
}

export class Fill extends ValueSet {
    /// opacity
    get opacity() {
        return xget(this, "opacity", new NumberValue(1));
    }
    set opacity(v: NumberValue) {
        xset(this, "opacity", v);
    }
    /// color
    get color() {
        return xget(this, "color", new RGBValue(new NVector([0, 0, 0])));
    }
    set color(v: RGBValue) {
        xset(this, "color", v);
    }
    // 
}
export class Font extends ValueSet {
    /// weight
    get weight() {
        return xget(this, "weight", new TextValue('normal'));
    }
    set weight(v: TextValue) {
        xset(this, "weight", v);
    }
    /// size
    get size() {
        return xget(this, "size", new TextValue('normal'));
    }
    set size(v: TextValue) {
        xset(this, "size", v);
    }
    /// font-family
    get family() {
        return xget(this, "family", new TextValue('monospace'));
    }
    set family(v: TextValue) {
        xset(this, "family", v);
    }
}


export class Transform extends ValueSet {


    get_matrix(frame: number) {
        let m = Matrix.identity();
        let p: number[] | undefined;
        let a: number[] | undefined;
        let s: number[] | undefined;
        let r: number | undefined;
        let k: number | undefined;
        let x: number | undefined;
        for (const n of Object.keys(this)) {
            switch (n) {
                case "position":
                    p = [...this.position.get_value(frame)];
                    break;
                case "anchor":
                    a = [...this.anchor.get_value(frame)];
                    break;
                case "scale":
                    s = [...this.scale.get_value(frame)];
                    break;
                case "rotation":
                    r = this.rotation.get_value(frame);
                    break;
                case "skew":
                    k = this.skew.get_value(frame);
                    break;
                case "skew_axis":
                    x = this.skew_axis.get_value(frame);
                    break;
            }

        }
        if (p) {
            // if (a) {
            //     m = m.cat(Matrix.translate(p[0] - a[0], p[1] - a[1]));
            // } else {
            m = m.cat(Matrix.translate(p[0], p[1]));
            // }
        } else if (a) {
            // m = m.cat(Matrix.translate(-a[0], -a[1]));
        }

        if (s) {
            if (a) {
                const x = Matrix.translate(a[0], a[1]).cat(Matrix.scale(s[0], s[1])).cat(Matrix.translate(-a[0], -a[1]))
                m = m.cat(x);

            } else {
                m = m.cat(Matrix.scale(s[0], s[1]));
            }
        }
        // console.info("get_matrix before rotation", m);
        if (r) {
            // m = m.rotate(-r);
            if (a) {

                m = m.cat(Matrix.rotate(-r, a[0], a[1]));
            } else {

                m = m.cat(Matrix.rotate(-r));
            }

            // console.log("get_matrix after rotation", m, s, Matrix.rotate(-s));
        }

        if (k) {
            if (x) {
                m = m.multiply(Matrix.rotate(-x));
                m = m.multiply(Matrix.skewX(-k));
                m = m.multiply(Matrix.rotate(x));
            } else {
                m = m.multiply(Matrix.skewX(-k));
            }
        }
        // console.log("get_matrix", m);
        // if (p) {
        //     // console.log(" position", x, y, Matrix.translate(x, y));
        //     m = m.cat(Matrix.translate(p[0], p[1]));
        // }
        // if (a) {
        //     m = m.cat(Matrix.translate(a[0], a[1]));
        // }
        return m;
    }
    clear() {
        const o: any = this;
        delete o['anchor'];
        delete o['scale'];
        delete o['rotation'];
        delete o['skew_axis'];
        delete o['skew'];
        delete o['position'];
    }
    parse(s: string) {
        const { rotation, scale, skew, skew_axis, translation } = Matrix.parse(s).take_apart();
        this.clear();
        if (translation[0] !== 0 || translation[1] !== 0) {
            this.anchor = new PositionValue(new NVector([-translation[0], -translation[1]]));
        }
        if (scale[0] !== 1 || scale[1] !== 1) {
            this.scale = new PositionValue(new NVector(scale));
        }
        if (rotation !== 0) {
            this.rotation.value = -rotation;
        }
        if (skew !== 0) {
            this.skew_axis.value = skew_axis;
            this.skew.value = -skew;
        }
        // Sc * Ro * Sk * T = 
    }
    /// anchor
    get anchor() {
        return xget(this, "anchor", new PositionValue(new NVector([0, 0])));
    }
    set anchor(v: PositionValue) {
        xset(this, "anchor", v);
    }
    /// position
    get position() {
        return xget(this, "position", new PositionValue(new NVector([0, 0])));
    }
    set position(v: PositionValue) {
        xset(this, "position", v);
    }
    /// scale
    get scale() {
        return xget(this, "scale", new NVectorValue(new NVector([1, 1])));
    }
    set scale(v: NVectorValue) {
        xset(this, "scale", v);
    }
    /// rotation
    get rotation() {
        return xget(this, "rotation", new NumberValue(0));
    }
    set rotation(v: NumberValue) {
        xset(this, "rotation", v);
    }
    /// skew
    get skew() {
        return xget(this, "skew", new NumberValue(0));
    }
    set skew(v: NumberValue) {
        xset(this, "skew", v);
    }
    /// skew_axis
    get skew_axis() {
        return xget(this, "skew_axis", new NumberValue(0));
    }
    set skew_axis(v: NumberValue) {
        xset(this, "skew_axis", v);
    }
    ///
}



