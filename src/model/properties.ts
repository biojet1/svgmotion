import { Animatable, NVector, NVectorValue, NumberValue, PositionValue, RGBValue, TextValue, Value } from "./keyframes.js";
import { Matrix } from "./matrix.js";

export function xget<T>(that: any, name: string, value: T): T {
    // console.log(`_GETX ${name}`);
    Object.defineProperty(that, name, {
        value,
        writable: true,
        enumerable: true,
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
        const { anchor, scale, skew, rotation, position } = this;

        // console.log("get_matrix before position", m);

        // console.log("get_matrix after position", m);

        if (anchor) {
            const [x, y] = anchor.get_value(frame);
            if (x || y) {
                m = m.cat(Matrix.translate(-x, -y));
            }
        }
        if (scale) {
            const [x, y] = scale.get_value(frame);
            if (!(x === 1 && y === 1)) {
                m = m.cat(Matrix.scale(x, y));
            }
        }
        // console.log("get_matrix before rotation", m);
        if (rotation) {
            let s = rotation.get_value(frame);
            if (s) {
                m = m.rotate(-s);
            }
            // console.log("get_matrix after rotation", m, s, Matrix.rotate(-s));
        }

        if (skew) {
            let s = skew.get_value(frame);
            if (s) {
                const { skew_axis } = this;
                const a = skew_axis.get_value(frame);
                m = m.multiply(Matrix.rotate(-a));
                m = m.multiply(Matrix.skewX(-s));
                m = m.multiply(Matrix.rotate(a));
            }
        }
        // console.log("get_matrix", m);
        if (position) {
            const [x, y] = position.get_value(frame);
            // console.log(" position", x, y, Matrix.translate(x, y));
            if (x || y) {
                m = m.cat(Matrix.translate(x, y));
            }
        }
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


        // if (rotate) {
        //     this.rotation.value = rotate;
        // }
        // if (skewX) {
        //     this.skew.value = skewX;
        // }

        // dest_trans.position.value -= dest_trans.anchor_point.value
        // dest_trans.anchor_point.value = NVector(0, 0)
        // trans = matrix.extract_transform()
        // dest_trans.skew_axis.value = math.degrees(trans["skew_axis"])
        // dest_trans.skew.value = -math.degrees(trans["skew_angle"])
        // dest_trans.position.value += trans["translation"]
        // dest_trans.rotation.value -= math.degrees(trans["angle"])
        // dest_trans.scale.value *= trans["scale"]

        // const { translateX, translateY, scaleX, scaleY, rotate, skewX } = Matrix.parse(s).decompose();
        // if (translateX || translateY) {
        //     this.position = new PositionValue([translateX, translateY]);
        // }
        // if (scaleX || scaleY) {
        //     this.scale = new PositionValue([scaleX, scaleY]);
        // }
        // if (rotate) {
        //     this.rotation.value = rotate;
        // }
        // if (skewX) {
        //     this.skew.value = skewX;
        // }

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



