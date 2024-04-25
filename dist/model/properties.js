import { Animatable, NVector, NVectorValue, NumberValue, PositionValue, RGBValue } from "./keyframes.js";
import { Matrix } from "./matrix.js";
export class ValueSet {
    *enum_values() {
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
    update_prop(frame, node) {
        throw new Error(`Not implemented`);
    }
    _getx(name, value) {
        console.log(`_GETX ${name}`);
        Object.defineProperty(this, name, {
            value,
            writable: true,
            enumerable: true,
        });
        return value;
    }
    _setx(name, value) {
        console.log(`_SETX ${name}`);
        Object.defineProperty(this, name, {
            value,
            writable: true,
            enumerable: true,
        });
    }
}
export class Box extends ValueSet {
    // size: PositionValue;
    // position: PositionValue;
    constructor(position, size) {
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
        return this._getx("size", new PositionValue(new NVector([100, 100])));
    }
    set size(v) {
        this._setx("size", v);
    }
    /// position
    get position() {
        return this._getx("position", new PositionValue(new NVector([0, 0])));
    }
    set position(v) {
        this._setx("position", v);
    }
}
export class Stroke extends ValueSet {
    /// width
    get width() {
        return this._getx("width", new NumberValue(1));
    }
    set width(v) {
        this._setx("width", v);
    }
}
export class Fill extends ValueSet {
    /// opacity
    get opacity() {
        return this._getx("opacity", new NumberValue(1));
    }
    set opacity(v) {
        this._setx("opacity", v);
    }
    /// opacity
    get color() {
        return this._getx("color", new RGBValue(new NVector([0, 0, 0])));
    }
    set color(v) {
        this._setx("color", v);
    }
}
export class Transform extends ValueSet {
    get_matrix(frame) {
        let m = Matrix.identity();
        const { anchor, scale, skew, rotation, position } = this;
        console.log("get_matrix before position", m);
        if (position) {
            const [x, y] = position.get_value(frame);
            // console.log(" position", x, y, Matrix.translate(x, y));
            if (x || y) {
                m = m.cat(Matrix.translate(x, y));
            }
        }
        console.log("get_matrix after position", m);
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
        console.log("get_matrix before rotation", m);
        if (rotation) {
            let s = rotation.get_value(frame);
            if (s) {
                m = m.rotate(-s);
            }
            console.log("get_matrix after rotation", m, s, Matrix.rotate(-s));
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
        console.log("get_matrix", m);
        return m;
    }
    parse(s) {
        const { rotation, scale, skew, skew_axis, translation } = Matrix.parse(s).take_apart();
        if (translation[0] !== 0 || translation[1] !== 0) {
            this.position = new PositionValue(new NVector([-translation[0], -translation[1]]));
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
        return this._getx("anchor", new PositionValue(new NVector([0, 0])));
    }
    set anchor(v) {
        this._setx("anchor", v);
    }
    /// position
    get position() {
        return this._getx("position", new PositionValue(new NVector([0, 0])));
    }
    set position(v) {
        this._setx("position", v);
    }
    /// scale
    get scale() {
        return this._getx("scale", new NVectorValue(new NVector([1, 1])));
    }
    set scale(v) {
        this._setx("scale", v);
    }
    /// rotation
    get rotation() {
        return this._getx("rotation", new NumberValue(0));
    }
    set rotation(v) {
        this._setx("rotation", v);
    }
    /// skew
    get skew() {
        return this._getx("skew", new NumberValue(0));
    }
    set skew(v) {
        this._setx("skew", v);
    }
    /// skew_axis
    get skew_axis() {
        return this._getx("skew_axis", new NumberValue(0));
    }
    set skew_axis(v) {
        this._setx("skew_axis", v);
    }
    ///
    to_json() {
    }
    from_json(x) {
    }
}
//# sourceMappingURL=properties.js.map