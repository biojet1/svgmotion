import { viewbox_transform } from "domspec/dist/svg/attr-transform.js";
import { Animatable, NVectorValue, NumberValue, PositionValue, RGBValue } from "./keyframes.js";
import { Matrix } from "./matrix.js";

export class ValueSet {
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
    update_prop(frame: number, node: SVGElement) {
        throw new Error(`Not implemented`);
    }
    _getx<T>(name: string, value: T): T {
        console.log(`_GETX ${name}`);
        Object.defineProperty(this, name, {
            value,
            writable: true,
            enumerable: true,
        });
        return value;
    }
    _setx<T>(name: string, value: T) {
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
    constructor(position: Iterable<number>, size: Iterable<number>) {
        super();
        if (size) {
            this.size = new PositionValue(size);
        }
        if (position) {
            this.position = new PositionValue(position);
        }
    }
    // update_prop(frame: number, node: SVGSVGElement) {
    //     const size = this.size.get_value(frame);
    //     const pos = this.position.get_value(frame);
    //     node.x.baseVal.value = pos[0];
    //     node.y.baseVal.value = pos[1];
    //     node.width.baseVal.value = size[0];
    //     node.height.baseVal.value = size[1];
    // }
    /// size
    get size() {
        return this._getx("size", new PositionValue([100, 100]));
    }
    set size(v: PositionValue) {
        this._setx("size", v);
    }
    /// position
    get position() {
        return this._getx("position", new PositionValue([100, 100]));
    }
    set position(v: PositionValue) {
        this._setx("position", v);
    }
}

export class Stroke extends ValueSet {
    /// width
    get width() {
        return this._getx("width", new NumberValue(1));
    }
    set width(v: NumberValue) {
        this._setx("width", v);
    }
}

export class Fill extends ValueSet {
    /// opacity
    get opacity() {
        return this._getx("opacity", new NumberValue(1));
    }
    set opacity(v: NumberValue) {
        this._setx("opacity", v);
    }
    /// opacity
    get color() {
        return this._getx("color", new RGBValue([0, 0, 0]));
    }
    set color(v: RGBValue) {
        this._setx("color", v);
    }
}


export class Transform extends ValueSet {


    get_matrix(frame: number) {
        let m = Matrix.identity();
        const { anchor, scale, skew, rotation, position } = this;

        console.log("before position", m);
        if (position) {
            const [x, y] = position.get_value(frame);
            console.log(" position", x, y, Matrix.translate(x, y));
            m = m.cat(Matrix.translate(x, y));
        }
        console.log("after position", m);

        if (anchor) {
            const [x, y] = anchor.get_value(frame);
            m = m.cat(Matrix.translate(-x, -y));
        }
        if (scale) {
            const [x, y] = scale.get_value(frame);
            m = m.cat(Matrix.scale(x, y));
        }
        if (rotation) {
            let s = rotation.get_value(frame);
            if (s) {
                m = m.cat(Matrix.rotate(-s));
            }
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

        return m;
    }
    parse(s: string) {
        const { rotation, scale, skew, skew_axis, translation } = Matrix.parse(s).take_apart();

        if (translation[0] !== 0 || translation[1] !== 0) {
            this.position = new PositionValue([-translation[0], -translation[1]]);
        }
        if (scale[0] !== 1 || scale[1] !== 1) {
            this.scale = new PositionValue(scale);
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
        return this._getx("anchor", new PositionValue([0, 0]));
    }
    set anchor(v: PositionValue) {
        this._setx("anchor", v);
    }
    /// position
    get position() {
        return this._getx("position", new PositionValue([0, 0]));
    }
    set position(v: PositionValue) {
        this._setx("position", v);
    }
    /// scale
    get scale() {
        return this._getx("scale", new NVectorValue([0, 0]));
    }
    set scale(v: NVectorValue) {
        this._setx("scale", v);
    }
    /// rotation
    get rotation() {
        return this._getx("rotation", new NumberValue(0));
    }
    set rotation(v: NumberValue) {
        this._setx("rotation", v);
    }
    /// skew
    get skew() {
        return this._getx("skew", new NumberValue(0));
    }
    set skew(v: NumberValue) {
        this._setx("skew", v);
    }
    /// skew_axis
    get skew_axis() {
        return this._getx("skew_axis", new NumberValue(0));
    }
    set skew_axis(v: NumberValue) {
        this._setx("skew_axis", v);
    }
    to_json() {

    }
    from_json(x: any) {

    }


}



export class OpacityProp extends NumberValue {
    // update_prop(frame: number, node: SVGElement) {
    //     const v = this.get_value(frame);
    //     node.style.opacity = v + '';
    // }
}

export class RectSizeProp extends NVectorValue {
    // update_prop(frame: number, node: SVGRectElement) {
    //     let x = this.get_value(frame);
    //     node.width.baseVal.value = x[0];
    //     node.height.baseVal.value = x[1];
    // }
}


