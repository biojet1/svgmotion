/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// UNUSED EXPORTS: animate

// NAMESPACE OBJECT: ./dist/index.js
var dist_namespaceObject = {};
__webpack_require__.r(dist_namespaceObject);
__webpack_require__.d(dist_namespaceObject, {
  Action: () => (Action),
  Actions: () => (Actions),
  Animatable: () => (Animatable),
  AnimatableD: () => (AnimatableD),
  Box: () => (Box),
  Container: () => (Container),
  Fill: () => (Fill),
  Group: () => (Group),
  Item: () => (Item),
  KeyframeEntry: () => (KeyframeEntry),
  Keyframes: () => (Keyframes),
  NVector: () => (NVector),
  NVectorValue: () => (NVectorValue),
  NumberValue: () => (NumberValue),
  OpacityProp: () => (OpacityProp),
  Par: () => (Par),
  ParA: () => (ParA),
  ParE: () => (ParE),
  Path: () => (Path),
  Point: () => (Point),
  PositionValue: () => (PositionValue),
  RGB: () => (RGB),
  RGBValue: () => (RGBValue),
  Rect: () => (Rect),
  RectSizeProp: () => (RectSizeProp),
  Root: () => (Root),
  Seq: () => (Seq),
  SeqA: () => (SeqA),
  Shape: () => (Shape),
  Size: () => (Size),
  Step: () => (Step),
  StepA: () => (StepA),
  Stroke: () => (Stroke),
  TextValue: () => (TextValue),
  To: () => (To),
  ToA: () => (ToA),
  Track: () => (Track),
  Transform: () => (Transform),
  ValueSet: () => (ValueSet),
  ViewPort: () => (ViewPort)
});

;// CONCATENATED MODULE: ./dist/model/keyframes.js
class KeyframeEntry {
    time = 0;
    value;
    easing;
}
class Keyframes extends Array {
    set_value(time, value) {
        let last = this[this.length - 1];
        if (last) {
            if (last.time == time) {
                last.value = value;
                return last;
            }
            else if (time < last.time) {
                throw new Error(`keyframe is incremental`);
            }
        }
        const kf = new KeyframeEntry();
        kf.time = time;
        kf.value = value;
        this.push(kf);
        return kf;
    }
}
class Animatable {
    value;
    lerp_value(ratio, a, b) {
        throw Error(`Not implemented`);
    }
    add_value(a, b) {
        throw Error(`Not implemented`);
        // return a + b;
    }
    get_value(frame) {
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
                        }
                        else if (r == 1) {
                            return k.value;
                        }
                        else if (p.easing && p.easing !== true) {
                            r = p.easing.ratio_at(r);
                        }
                        return this.lerp_value(r, p.value, k.value);
                    }
                    else {
                        return k.value;
                    }
                }
                p = k;
            }
            if (p) {
                return p.value;
            }
            throw new Error(`empty keyframe list`);
        }
        else {
            return value;
        }
    }
    set_value(frame, value, start, easing, add) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                }
                else if (start > last.time) {
                    last.easing = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                }
                else {
                    if (start != last.time) {
                        throw new Error(`unexpected start=${start} last.time=${last.time} time=${frame}`);
                    }
                }
            }
        }
        else {
            const v = kfs;
            kfs = this.value = new Keyframes();
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
    check_value(x) {
        return x;
    }
    constructor(v) {
        this.value = v;
    }
}
class AnimatableD extends Animatable {
    get_value(frame) {
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
        }
        else {
            return value;
        }
    }
    set_value(frame, value, start, easing, add) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                }
                else if (start > last.time) {
                    last.easing = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                }
                else {
                    if (start != last.time) {
                        throw new Error(`unexpected start=${start} last.time=${last.time} time=${frame}`);
                    }
                }
            }
        }
        else {
            const v = kfs;
            kfs = this.value = new Keyframes();
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
class NumberValue extends Animatable {
    lerp_value(r, a, b) {
        return a * (1 - r) + b * r;
    }
    add_value(a, b) {
        return a + b;
    }
    constructor(v = 0) {
        super(v);
    }
}
class NVector extends Float64Array {
    add(that) {
        return new NVector(this.map((v, i) => v + that[i]));
    }
    mul(that) {
        return new NVector(this.map((v, i) => v * that[i]));
    }
    lerp(that, t) {
        const u = 1 - t;
        const a = this.map((v, i) => v * u);
        const b = that.map((v, i) => v * t);
        return new NVector(a.map((v, i) => v + b[i]));
    }
}
class NVectorValue extends Animatable {
    lerp_value(r, a, b) {
        return a.lerp(b, r);
    }
    add_value(a, b) {
        return a.add(b);
    }
    check_value(x) {
        if (x instanceof NVector) {
            return x;
        }
        else {
            return new NVector(x);
        }
    }
    constructor(v) {
        super(NVector.from(v));
    }
}
// def Point(x, y):
//     return NVector(x, y)
// def Size(x, y):
//     return NVector(x, y)
class Point extends NVector {
    constructor(x = 0, y = 0) {
        super([x, y]);
    }
}
class Size extends NVector {
    constructor(w = 0, h = 0) {
        super([w, h]);
    }
}
class RGB extends NVector {
    constructor(r = 0, g = 0, b = 0) {
        super([r, g, b]);
    }
}
// def Point3D(x, y, z):
//     return NVector(x, y, z)
class PositionValue extends NVectorValue {
}
class RGBValue extends NVectorValue {
    // constructor(x: number = 0, y: number = 0) {
    //     super([x, y]);
    // }
    static to_css_rgb([r, g, b]) {
        return `rgb(${Math.round((r * 255) % 256)}, ${Math.round((g * 255) % 256)}, ${Math.round((b * 255) % 256)})`;
    }
}
class TextValue extends AnimatableD {
    add_value(a, b) {
        return a + '' + b;
    }
}
//# sourceMappingURL=keyframes.js.map
;// CONCATENATED MODULE: ./dist/model/matrix.js
const { sqrt, abs, tan, cos, sin, atan, atan2, PI } = Math;
const { isFinite: matrix_isFinite } = Number;
const radians = function (d) {
    return ((d % 360) * PI) / 180;
};
const _cat = function (m, n) {
    const { a, b, c, d, e, f } = m;
    const { a: A, b: B, c: C, d: D, e: E, f: F } = n;
    return [
        a * A + c * B + e * 0,
        b * A + d * B + f * 0,
        a * C + c * D + e * 0,
        b * C + d * D + f * 0,
        a * E + c * F + e * 1,
        b * E + d * F + f * 1,
    ];
};
const _inv = function (m) {
    // Get the current parameters out of the matrix
    const { a, b, c, d, e, f } = m;
    // Invert the 2x2 matrix in the top left
    const det = a * d - b * c;
    if (!det)
        throw new Error('Cannot invert ' + m);
    // Calculate the top 2x2 matrix
    const na = d / det;
    const nb = -b / det;
    const nc = -c / det;
    const nd = a / det;
    // Apply the inverted matrix to the top right
    const ne = -(na * e + nc * f);
    const nf = -(nb * e + nd * f);
    // Construct the inverted matrix
    return [na, nb, nc, nd, ne, nf];
};
class Matrix {
    // [ a, c, e ] [ sx*cosψ, -sy*sinψ, tx ]
    // [ b, d, f ] [ sx*sinψ,  sy*cosψ, ty ]
    a;
    b;
    c;
    d;
    e;
    f;
    constructor(M = []) {
        const [a = 1, b = 0, c = 0, d = 1, e = 0, f = 0] = M;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        if (!(matrix_isFinite(a) &&
            matrix_isFinite(b) &&
            matrix_isFinite(c) &&
            matrix_isFinite(d) &&
            matrix_isFinite(e) &&
            matrix_isFinite(f)))
            throw TypeError(`${JSON.stringify(arguments)}`);
    }
    // Query methods
    get isIdentity() {
        const { a, b, c, d, e, f } = this;
        return a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0;
    }
    get is2D() {
        return true;
    }
    toString() {
        const { a, b, c, d, e, f } = this;
        return `matrix(${a} ${b} ${c} ${d} ${e} ${f})`;
    }
    clone() {
        const { a, b, c, d, e, f } = this;
        return new Matrix([a, b, c, d, e, f]);
    }
    equals(other, epsilon = 0) {
        const { a, b, c, d, e, f } = this;
        const { a: A, b: B, c: C, d: D, e: E, f: F } = other;
        return (other === this ||
            (closeEnough(a, A, epsilon) &&
                closeEnough(b, B, epsilon) &&
                closeEnough(c, C, epsilon) &&
                closeEnough(d, D, epsilon) &&
                closeEnough(e, E, epsilon) &&
                closeEnough(f, F, epsilon)));
    }
    isURT(epsilon = 1e-15) {
        // decomposition as U*R*T is possible
        const { a, d, b, c } = this;
        return a - d <= epsilon && b + c <= epsilon;
    }
    decompose() {
        let { a, d, b, c } = this;
        const { e, f } = this;
        let scaleX, scaleY, skewX;
        if ((scaleX = sqrt(a * a + b * b)))
            (a /= scaleX), (b /= scaleX);
        if ((skewX = a * c + b * d))
            (c -= a * skewX), (d -= b * skewX);
        if ((scaleY = sqrt(c * c + d * d)))
            (c /= scaleY), (d /= scaleY), (skewX /= scaleY);
        if (a * d < b * c)
            (a = -a), (b = -b), (skewX = -skewX), (scaleX = -scaleX);
        return {
            translateX: e,
            translateY: f,
            rotate: (atan2(b, a) * 180) / PI,
            skewX: (atan(skewX) * 180) / PI,
            scaleX: scaleX,
            scaleY: scaleY,
            toString: function () {
                const { translateX, translateY, rotate, skewX, scaleX, scaleY } = this;
                return `${translateX || translateY ? `translate(${translateX} ${translateY})` : ''}${rotate ? `rotate(${rotate})` : ''}${skewX ? `skewX(${skewX})` : ''}${scaleX == 1 && scaleY == 1
                    ? ''
                    : `scale(${scaleX}${scaleX == scaleY ? '' : ' ' + scaleY})`}`;
            },
        };
    }
    toArray() {
        const { a, b, c, d, e, f } = this;
        return [a, b, c, d, e, f];
    }
    describe() {
        return this.decompose().toString();
    }
    _set_hexad(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        return this;
    }
    // methods returning a Matrix
    _hexad(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        return new Matrix([a, b, c, d, e, f]);
    }
    _catSelf(m) {
        return this._set_hexad(..._cat(this, m));
    }
    _postCatSelf(m) {
        return this._set_hexad(..._cat(m, this));
    }
    _cat(m) {
        return this._hexad(..._cat(this, m));
    }
    _postCat(m) {
        return this._hexad(..._cat(m, this));
    }
    inverse() {
        return this._hexad(..._inv(this));
    }
    cat(m) {
        return this._cat(m);
    }
    multiply(m) {
        return this._cat(m);
    }
    postCat(m) {
        return this._postCat(m);
    }
    translate(x = 0, y = 0) {
        return this._cat(Matrix.matrix(1, 0, 0, 1, x, y));
    }
    translateY(v) {
        return this.translate(0, v);
    }
    translateX(v) {
        return this.translate(v, 0);
    }
    scale(scaleX, scaleY) {
        return this._cat(Matrix.matrix(scaleX, 0, 0, scaleY ?? scaleX, 0, 0));
    }
    rotate(ang, x = 0, y = 0) {
        const θ = ((ang % 360) * PI) / 180;
        const cosθ = cos(θ);
        const sinθ = sin(θ);
        return this._cat(Matrix.matrix(cosθ, sinθ, -sinθ, cosθ, x ? -cosθ * x + sinθ * y + x : 0, y ? -sinθ * x - cosθ * y + y : 0));
    }
    skew(x, y) {
        return this._cat(Matrix.matrix(1, tan(radians(y)), tan(radians(x)), 1, 0, 0));
    }
    skewX(x) {
        return this.skew(x, 0);
    }
    skewY(y) {
        return this.skew(0, y);
    }
    // Static methods
    static hexad(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        return new this([a, b, c, d, e, f]);
    }
    static matrix(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        return new this([a, b, c, d, e, f]);
    }
    static fromArray(m) {
        return new this(m);
    }
    static parse(d) {
        let m = new this();
        if (d)
            for (const str of d.split(/\)\s*,?\s*/).slice(0, -1)) {
                const kv = str.trim().split('(');
                const name = kv[0].trim();
                const args = kv[1].split(/[\s,]+/).map(function (str) {
                    return parseFloat(str.trim());
                });
                switch (name) {
                    case 'matrix':
                        m._catSelf(this.fromArray(args));
                        break;
                    case 'translate':
                        m._catSelf(this.translate(args[0], args[1]));
                        break;
                    case 'translateX':
                        m._catSelf(this.translateX(args[0]));
                        break;
                    case 'translateY':
                        m._catSelf(this.translateY(args[0]));
                        break;
                    case 'scale':
                        m._catSelf(this.scale(args[0], args[1]));
                        break;
                    case 'rotate':
                        m._catSelf(this.rotate(args[0], args[1], args[2]));
                        break;
                    case 'skewX':
                        m._catSelf(this.skewX(args[0]));
                        break;
                    case 'skewY':
                        m._catSelf(this.skewY(args[0]));
                        break;
                    default:
                        throw new Error(`Unexpected transform '${name}'`);
                }
            }
        return m;
    }
    static fromElement(node) {
        return this.parse(node.getAttribute('transform') || '');
    }
    static new(first) {
        switch (typeof first) {
            case 'string':
                return this.parse(first);
            case 'number':
                return this.matrix(first, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            case 'undefined':
                return new Matrix();
            case 'object':
                if (Array.isArray(first)) {
                    return this.fromArray(first);
                }
                else if (first.nodeType === 1) {
                    return this.fromElement(first);
                }
                else {
                    const { a, b, c, d, e, f } = first;
                    return this.matrix(a, b, c, d, e, f);
                }
            default:
                throw new TypeError(`Invalid matrix argument ${Array.from(arguments)}`);
        }
    }
    static interpolate(A, B, opt) {
        const a = this.new(A).toArray();
        const b = this.new(B).toArray();
        const n = a.length;
        const klass = this;
        // console.warn("interpolate T", A, B, a, b);
        return function (t) {
            let c = [0, 0, 0, 0, 0, 0];
            for (let i = 0; i < n; ++i)
                c[i] = a[i] === b[i] ? b[i] : a[i] * (1 - t) + b[i] * t;
            // console.warn("compose", c);
            return klass.fromArray(c);
        };
    }
    static translate(x = 0, y = 0) {
        return this.matrix(1, 0, 0, 1, x, y);
    }
    static translateY(v) {
        return this.matrix(1, 0, 0, 1, 0, v);
    }
    static translateX(v) {
        return this.matrix(1, 0, 0, 1, v, 0);
    }
    static skew(x, y) {
        return this.matrix(1, tan(radians(y)), tan(radians(x)), 1, 0, 0);
    }
    static skewX(x) {
        return this.skew(x, 0);
    }
    static skewY(y) {
        return this.skew(0, y);
    }
    static rotate(ang, x = 0, y = 0) {
        const θ = ((ang % 360) * PI) / 180;
        const cosθ = cos(θ);
        const sinθ = sin(θ);
        return this.matrix(cosθ, sinθ, -sinθ, cosθ, x ? -cosθ * x + sinθ * y + x : 0, y ? -sinθ * x - cosθ * y + y : 0);
    }
    static scale(scaleX, scaleY) {
        return this.matrix(scaleX, 0, 0, scaleY ?? scaleX, 0, 0);
    }
    // static Identity = new Matrix();
    static identity() {
        return new this();
        // return this.Identity;
    }
}
function closeEnough(a, b, threshold = 1e-6) {
    return abs(b - a) <= threshold;
}
class MatrixMut extends (/* unused pure expression or super */ null && (Matrix)) {
    setHexad(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        return this;
    }
    // _catSelf(m: Matrix) {
    // 	return this.setHexad(..._cat(this, m));
    // }
    // _postCatSelf(m: Matrix) {
    // 	return this.setHexad(..._cat(m, this));
    // }
    invertSelf() {
        return this.setHexad(..._inv(this));
    }
    catSelf(m) {
        return this._catSelf(m);
    }
    postCatSelf(m) {
        return this._postCatSelf(m);
    }
}
//# sourceMappingURL=matrix.js.map
;// CONCATENATED MODULE: ./dist/model/properties.js


class ValueSet {
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
class Box extends ValueSet {
    // size: PositionValue;
    // position: PositionValue;
    constructor(position, size) {
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
    set size(v) {
        this._setx("size", v);
    }
    /// position
    get position() {
        return this._getx("position", new PositionValue([100, 100]));
    }
    set position(v) {
        this._setx("position", v);
    }
}
class Stroke extends ValueSet {
    /// width
    get width() {
        return this._getx("width", new NumberValue(1));
    }
    set width(v) {
        this._setx("width", v);
    }
}
class Fill extends ValueSet {
    /// opacity
    get opacity() {
        return this._getx("opacity", new NumberValue(1));
    }
    set opacity(v) {
        this._setx("opacity", v);
    }
    /// opacity
    get color() {
        return this._getx("color", new RGBValue([0, 0, 0]));
    }
    set color(v) {
        this._setx("color", v);
    }
}
class Transform extends ValueSet {
    get_matrix(frame) {
        let m = Matrix.identity();
        const { anchor, scale, skew, rotation } = this;
        if (anchor) {
            const a = anchor.get_value(frame);
            m.multiply(Matrix.translate(-a[0], -a[1]));
        }
        if (scale) {
            const a = scale.get_value(frame);
            m.multiply(Matrix.scale(-a[0], -a[1]));
        }
        if (skew) {
            let s = skew.get_value(frame);
            if (s) {
                s = -s * Math.PI / 180.0;
                const { skew_axis } = this;
                const a = skew_axis.get_value(frame) * Math.PI / 180.0;
                m = m.multiply(Matrix.rotate(-a));
                m = m.multiply(Matrix.skewX(s));
                m = m.multiply(Matrix.rotate(a));
            }
        }
        if (rotation) {
            let s = rotation.get_value(frame);
            if (s) {
                m = m.cat(Matrix.rotate(-s));
            }
        }
        return m;
    }
    /// anchor
    get anchor() {
        return this._getx("anchor", new PositionValue([0, 0]));
    }
    set anchor(v) {
        this._setx("anchor", v);
    }
    /// position
    get position() {
        return this._getx("position", new PositionValue([0, 0]));
    }
    set position(v) {
        this._setx("position", v);
    }
    /// scale
    get scale() {
        return this._getx("scale", new NVectorValue([0, 0]));
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
}
class OpacityProp extends NumberValue {
}
class RectSizeProp extends NVectorValue {
}
//# sourceMappingURL=properties.js.map
;// CONCATENATED MODULE: ./dist/model/update_dom.js

const UPDATE = {
    opacity: function (frame, node, prop) {
        const v = prop.get_value(frame);
        node.style.opacity = v + '';
    },
    size: function (frame, node, prop) {
        let [x, y] = prop.get_value(frame);
        node.width.baseVal.value = x;
        node.height.baseVal.value = y;
    },
    position: function (frame, node, prop) {
        let x = prop.get_value(frame);
        node.x.baseVal.value = x[0];
        node.y.baseVal.value = x[1];
    },
    transform: function (frame, node, prop) {
        const m = prop.get_matrix(frame);
        node.setAttribute("transform", m.toString());
    },
    fill: function (frame, node, prop) {
        for (let [n, v] of Object.entries(prop)) {
            if (v) {
                switch (n) {
                    case "opacity":
                        node.style.fillOpacity = v.get_value(frame) + '';
                        break;
                    case "color":
                        node.style.fill = RGBValue.to_css_rgb(v.get_value(frame));
                        break;
                }
            }
        }
    },
    x: function (frame, node, prop) {
        node.x.baseVal.value = prop.get_value(frame);
    },
    y: function (frame, node, prop) {
        node.y.baseVal.value = prop.get_value(frame);
    },
    cx: function (frame, node, prop) {
        node.cx.baseVal.value = prop.get_value(frame);
    },
    cy: function (frame, node, prop) {
        node.cy.baseVal.value = prop.get_value(frame);
    },
    r: function (frame, node, prop) {
        node.r.baseVal.value = prop.get_value(frame);
    },
    width: function (frame, node, prop) {
        let q = node.width.baseVal;
        // console.log("/////", q);
        q.convertToSpecifiedUnits(1);
        q.value = prop.get_value(frame);
    },
    height: function (frame, node, prop) {
        let q = node.height.baseVal;
        q.convertToSpecifiedUnits(1);
        q.value = prop.get_value(frame);
    },
    rx: function (frame, node, prop) {
        node.rx.baseVal.value = prop.get_value(frame);
    },
    ry: function (frame, node, prop) {
        node.ry.baseVal.value = prop.get_value(frame);
    },
    view_box: function (frame, node, prop) {
        const s = prop.size.get_value(frame);
        const p = prop.position.get_value(frame);
        node.setAttribute("viewBox", `${p[0]} ${p[1]} ${s[0]} ${s[1]}`);
    },
    d: function (frame, node, prop) {
        const s = prop.get_value(frame);
        node.setAttribute("d", s);
    },
    fit_view: function (frame, node, prop) {
        const s = prop.get_value(frame);
        node.setAttribute("preserveAspectRatio", s);
    },
};
//# sourceMappingURL=update_dom.js.map
;// CONCATENATED MODULE: ./dist/model/linked.js
class Node {
    _next;
    _prev;
    _parent;
    get _end() {
        return this;
    }
    get _start() {
        return this;
    }
    next_sibling() {
        // *P -> a b c -> *E
        const node = this._end._next;
        if (node instanceof End) {
            if (node._parent !== this._parent) {
                // console.warn([node.parentNode, this.parentNode]);
                throw new Error("Unexpected following End node");
            }
        }
        else {
            return node;
        }
    }
    previous_sibling() {
        // a ^a b ^b ...
        // c  b ^b ...
        // N b ^b ...  ^N
        const node = this._start._prev;
        if (node instanceof End) {
            // ...<child/></end>
            return node._start;
        }
        else if (this._parent === node) {
            return undefined;
        }
        return node;
    }
    root() {
        let root = this._parent;
        if (root) {
            for (let x; (x = root._parent); root = x)
                ;
            return root;
        }
    }
    _link_next(node) {
        // [THIS]<->node
        if (node === this) {
            throw new Error(`Same node`);
        }
        else if (node) {
            this._next = node;
            node._prev = this;
        }
        else {
            delete this._next;
        }
    }
    _detach() {
        const { _prev: prev, _end: { _next: next }, } = this;
        // [PREV]<->[THIS]<->[NEXT] => [PREV]<->[NEXT]
        prev && prev._link_next(next);
        this._prev = undefined; // or this._start._prev = undefined
        this._end._next = undefined;
        this._parent = undefined;
        return this;
    }
    _attach(prev, next, parent) {
        const { _start, _end, _parent } = this;
        // if (_parent || _start._prev || _end._next) {
        //     throw new Error(`Detach first`);
        // }
        this._parent = parent;
        prev._link_next(_start);
        _end._link_next(next);
    }
    place_after(...nodes) {
        const { _parent } = this;
        _parent?.insert_before(this.next_sibling() || _parent._end, ...nodes);
    }
    place_before(...nodes) {
        const { _parent } = this;
        _parent?.insert_before(this, ...nodes);
    }
    replace_with(...nodes) {
        const { _parent } = this;
        if (_parent) {
            const next = this.next_sibling() ?? _parent._end;
            this.remove();
            _parent.insert_before(next, ...nodes);
        }
    }
    remove() {
        this._detach();
    }
}
class Parent extends Node {
    //// Tree
    _tail;
    constructor() {
        super();
        this._tail = this._next = new End(this);
    }
    get _end() {
        // End node or self
        return this._tail;
    }
    first_child() {
        // P  c ... ^P
        // P  C ^C ... ^P
        // P ^P
        let { _next, _end } = this;
        if (_next !== _end) {
            if (_next instanceof End) {
                throw new Error("Unexpected end node");
            }
            else if (!_next) {
                throw new Error("next expected");
            }
            else if (_next._parent !== this) {
                throw new Error("Unexpected parent");
            }
            return _next;
        }
    }
    last_child() {
        // P  ... c  ^P
        // P  ... C ^C  ^P
        // P ^P
        const { _prev } = this._end;
        if (_prev != this) {
            return _prev?._start;
        }
    }
    insert_before(child, ...nodes) {
        if (child._parent !== this) {
            throw new Error("child not found");
        }
        for (const node of nodes) {
            if (node !== child) {
                node._detach()._attach(child._prev ?? this, child, this);
            }
        }
    }
    append_child(...nodes) {
        this.insert_before(this._end, ...nodes);
    }
    prepend_child(...nodes) {
        this.insert_before(this._next || this._end, ...nodes);
    }
    remove_child(node) {
        if (node instanceof End) {
            throw new Error("Unexpected End node");
        }
        else if (node._parent !== this) {
            throw new Error("child not found");
        }
        node.remove();
        return node;
    }
    contains(node) {
        let p = node;
        do
            if (p === this) {
                return true;
            }
        while ((p = p._parent));
        return false;
    }
    *children() {
        for (let cur = this.first_child(); cur; cur = cur.next_sibling()) {
            yield cur;
        }
    }
    *[Symbol.iterator]() {
        for (let cur = this.first_child(); cur; cur = cur.next_sibling()) {
            yield cur;
        }
    }
    root_or_self() {
        let root = this;
        for (let x; (x = root._parent); root = x)
            ;
        return root;
    }
}
class End extends Node {
    _parent;
    constructor(parent) {
        super();
        this._parent = this._prev = parent;
    }
    get _start() {
        return this._parent;
    }
}
//# sourceMappingURL=linked.js.map
;// CONCATENATED MODULE: ./dist/model/svgprops.js


function SVGProps(Base) {
    return class SVGProps extends Base {
        get prop5() {
            return this._getx("prop5", new NumberValue(45));
        }
        set prop5(v) {
            this._setx("prop5", v);
        }
        /// fill
        get fill() {
            return this._getx("fill", new Fill());
        }
        set fill(v) {
            this._setx("fill", v);
        }
        /// opacity
        get opacity() {
            return this._getx("opacity", new NumberValue(1));
        }
        set opacity(v) {
            this._setx("opacity", v);
        }
        /// transform
        get transform() {
            return this._getx("transform", new Transform());
        }
        set transform(v) {
            this._setx("transform", v);
        }
        ///
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
    };
}
//# sourceMappingURL=svgprops.js.map
;// CONCATENATED MODULE: ./dist/model/node.js





class Item extends SVGProps(Node) {
    id;
    _node;
    update_self(frame, node) {
        update(frame, this, node);
    }
    update_node(frame) {
        const node = this._node;
        if (node) {
            this.update_self(frame, node);
        }
    }
    *enum_values() {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            }
            else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
    }
}
class Shape extends Item {
}
class Container extends SVGProps(Parent) {
    id;
    _node;
    as_svg(doc) {
        throw new Error(`Not implemented`);
    }
    update_self(frame, node) {
        update(frame, this, node);
        return true; // should we call update_node to children
    }
    update_node(frame) {
        const node = this._node;
        if (node) {
            if (this.update_self(frame, node)) {
                for (const sub of this.children()) {
                    sub.update_node(frame);
                }
            }
        }
    }
    *enum_values() {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            }
            else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
        for (const sub of this.children()) {
            yield* sub.enum_values();
        }
    }
    *enum_keyframes() {
        for (let { value } of this.enum_values()) {
            if (value instanceof Keyframes) {
                yield value;
            }
        }
    }
    calc_time_range() {
        let max = 0;
        let min = 0;
        for (let kfs of this.enum_keyframes()) {
            for (const { time } of kfs) {
                if (time > max) {
                    max = time;
                }
                if (time < min) {
                    min = time;
                }
            }
        }
        return [min, max];
    }
    add_rect(size = [100, 100]) {
        const x = new Rect();
        // x.size = new NVectorValue(size);
        this.append_child(x);
        return x;
    }
    add_view() {
        const x = new ViewPort();
        this.append_child(x);
        return x;
    }
    add_group() {
        const x = new Group();
        this.append_child(x);
        return x;
    }
    add_path() {
        const x = new Path();
        this.append_child(x);
        return x;
    }
}
function update(frame, target, el) {
    for (let [n, v] of Object.entries(target)) {
        v && UPDATE[n]?.(frame, el, v);
    }
}
class Group extends Container {
    as_svg(doc) {
        const con = (this._node = doc.createElementNS(NS_SVG, "g"));
        for (const sub of this.children()) {
            con.appendChild(sub.as_svg(doc));
        }
        return set_svg(con, this);
    }
}
// Container.prototype
class ViewPort extends Container {
    as_svg(doc) {
        const con = (this._node = doc.createElementNS(NS_SVG, "svg"));
        for (const sub of this.children()) {
            con.appendChild(sub.as_svg(doc));
        }
        return set_svg(con, this);
    }
    get view_box() {
        return this._getx("view_box", new Box([0, 0], [100, 100]));
    }
    set view_box(v) {
        this._setx("view_box", v);
    }
    ///
    get width() {
        return this._getx("width", new NumberValue(100));
    }
    set width(v) {
        this._setx("width", v);
    }
    ///
    get height() {
        return this._getx("height", new NumberValue(100));
    }
    set height(v) {
        this._setx("height", v);
    }
    ///
    get fit_view() {
        return this._getx("d", new TextValue(""));
    }
    set fit_view(v) {
        this._setx("d", v);
    }
    ///
    get zoom_pan() {
        return this._getx("d", new TextValue("disable"));
    }
    set zoom_pan(v) {
        this._setx("d", v);
    }
}
const NS_SVG = "http://www.w3.org/2000/svg";
class Path extends Shape {
    as_svg(doc) {
        const e = (this._node = doc.createElementNS(NS_SVG, "path"));
        // e.setAttribute("d", this.d.get_value);
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return set_svg(e, this);
    }
    get d() {
        return this._getx("d", new TextValue(""));
    }
    set d(v) {
        this._setx("d", v);
    }
}
class Rect extends Shape {
    size = new RectSizeProp([100, 100]);
    as_svg(doc) {
        const e = (this._node = doc.createElementNS(NS_SVG, "rect"));
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return set_svg(e, this);
    }
    ///
    get width() {
        return this._getx("width", new NumberValue(100));
    }
    set width(v) {
        this._setx("width", v);
    }
    ///
    get height() {
        return this._getx("height", new NumberValue(100));
    }
    set height(v) {
        this._setx("height", v);
    }
    ///
    get x() {
        return this._getx("x", new NumberValue(0));
    }
    set x(v) {
        this._setx("x", v);
    }
    ///
    get y() {
        return this._getx("y", new NumberValue(0));
    }
    set y(v) {
        this._setx("y", v);
    }
    ///
    get rx() {
        return this._getx("rx", new NumberValue(0));
    }
    set rx(v) {
        this._setx("rx", v);
    }
    ///
    get ry() {
        return this._getx("ry", new NumberValue(0));
    }
    set ry(v) {
        this._setx("ry", v);
    }
}
// export class Ellipse extends Shape {
//     size: NVectorValue = new NVectorValue([100, 100]);
// }
// export class Image extends Node {
//     // href: string = "";
//     // size: NVectorValue = new NVectorValue([100, 100]);
// }
function set_svg(elem, node) {
    const { id } = node;
    if (id) {
        elem.id = id;
    }
    return elem;
}
class Root extends ViewPort {
    defs = {};
    id_map = {};
    as_svg(doc) {
        const n = super.as_svg(doc);
        const defs = doc.createElementNS(NS_SVG, "defs");
        for (let [n, v] of Object.entries(this.defs)) {
            defs.appendChild(v.as_svg(doc));
        }
        if (defs.firstElementChild) {
            n.insertBefore(defs, n.firstChild);
        }
        return set_svg(n, this);
    }
    remember_id(id, node) {
        this.id_map[id] = node;
    }
}
//# sourceMappingURL=node.js.map
;// CONCATENATED MODULE: ./dist/model/index.js



//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./dist/track/track.js
class Track {
    frame = 0;
    frame_rate = 60;
    _hint_dur = 60; // 1s * frame_rate
    _easing;
    sec(n) {
        return this.frame_rate * n;
    }
    to_frame(sec) {
        return Math.round(this.frame_rate * sec);
    }
    feed(cur) {
        const d = feed(this, cur, this.frame, this.frame);
        this.frame += d;
        return this;
    }
    play(...args) {
        let I = this.frame;
        let B = this.frame;
        for (const [i, act] of args.entries()) {
            let D = 0;
            if (Array.isArray(act)) {
                for (const a of act) {
                    let d = feed(this, a, I, B);
                    D = Math.max(d, D);
                }
            }
            else {
                D = feed(this, act, I, B);
            }
            I += D;
        }
        this.frame = I;
    }
}
function feed(track, cur, frame, base_frame) {
    cur.ready(track);
    cur.resolve(frame, base_frame, track._hint_dur);
    const d = cur.get_active_dur();
    if (d >= 0) {
        cur.run();
    }
    else {
        throw new Error(`Unexpected`);
    }
    return d;
}
//# sourceMappingURL=track.js.map
;// CONCATENATED MODULE: ./dist/track/action.js
class Action {
    _start = -Infinity;
    _end = -Infinity;
    _dur;
    ready(parent) {
        throw new Error("Not implemented");
    }
    run() {
        throw new Error("Not implemented");
    }
    resolve(frame, base_frame, hint_dur) {
        const dur = this._dur ?? hint_dur;
        this._start = frame;
        this._end = frame + dur;
    }
    get_active_dur() {
        return this._end - this._start;
    }
}
class Actions extends Array {
    _start = -Infinity;
    _end = -Infinity;
    frame_rate = -Infinity;
    _hint_dur;
    _easing;
    ready(parent) {
        this._easing = this._easing ?? parent._easing;
        this.frame_rate = parent.frame_rate;
        if (this._hint_dur != undefined) {
            this._hint_dur = this.to_frame(this._hint_dur);
        }
    }
    run() {
        for (const act of this) {
            if (act._start < 0 || act._start > act._end) {
                throw new Error(`Unexpected _start=${act._start} _end=${act._end}`);
            }
            act.run();
        }
    }
    get_active_dur() {
        return this._end - this._start;
    }
    to_frame(sec) {
        return Math.round(this.frame_rate * sec);
    }
}
class SeqA extends Actions {
    _delay;
    _stagger;
    ready(parent) {
        super.ready(parent);
        const { _delay, _stagger } = this;
        _delay && (this._delay = parent.to_frame(_delay));
        _stagger && (this._stagger = parent.to_frame(_stagger));
        for (const act of this) {
            act.ready(this);
        }
    }
    resolve(frame, base_frame, hint_dur) {
        const { _delay, _stagger, _hint_dur = hint_dur } = this;
        let e = frame;
        if (_stagger) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, _hint_dur);
                e = act._end;
                s = Math.max(s + _stagger, base_frame); // next start time
            }
        }
        else if (_delay) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, _hint_dur);
                e = act._end;
                s = Math.max(e + _delay, base_frame); // next start time
            }
        }
        else {
            for (const act of this) {
                act.resolve(e, base_frame, _hint_dur);
                e = act._end;
            }
        }
        this._start = frame;
        this._end = e;
    }
    delay(sec) {
        this._delay = sec;
        return this;
    }
    stagger(sec) {
        this._stagger = sec;
        return this;
    }
}
function Seq(...items) {
    const x = new SeqA(...items);
    return x;
}
class ParA extends Actions {
    _tail;
    ready(parent) {
        super.ready(parent);
        for (const act of this) {
            act.ready(this);
        }
    }
    resolve(frame, base_frame, hint_dur_) {
        let { _hint_dur = hint_dur_ } = this;
        let end = frame;
        for (const act of this) {
            act.resolve(frame, base_frame, _hint_dur);
            if (_hint_dur == undefined) {
                _hint_dur = act.get_active_dur();
            }
            else {
                _hint_dur = Math.max(_hint_dur, act.get_active_dur());
            }
            end = Math.max(end, act._end);
        }
        if (this._tail) {
            for (const act of this) {
                if (act._end != end) {
                    act.resolve(end - act.get_active_dur(), base_frame, _hint_dur);
                }
                if (act._end != end) {
                    throw new Error(`Unexpected act._end=${act._end} end=${end}`);
                }
            }
        }
        this._start = frame;
        this._end = end;
    }
}
function Par(...items) {
    const x = new ParA(...items);
    return x;
}
function ParE(...items) {
    const x = new ParA(...items);
    x._tail = true;
    return x;
}
class ToA extends Action {
    _easing;
    constructor(props, value, dur) {
        super();
        this.ready = function (parent) {
            const { _easing } = this;
            this._dur = (dur == undefined) ? undefined : parent.to_frame(dur);
            if (!_easing) {
                this._easing = parent._easing;
            }
        };
        this.run = function () {
            const { _start, _end } = this;
            for (const prop of props) {
                prop.set_value(_end, value, _start);
            }
        };
    }
}
function To(props, value, dur = 1) {
    return new ToA(props, value, dur);
}
//# sourceMappingURL=action.js.map
;// CONCATENATED MODULE: ./dist/track/steps.js

class StepA extends Action {
    _steps;
    _max_dur;
    _easing;
    _bounce;
    _repeat;
    _base_frame;
    _vars;
    _kf_map;
    constructor(steps, vars, { dur, easing, bounce, repeat, max_dur, }) {
        super();
        this._steps = steps;
        this._vars = vars;
        this._base_frame = Infinity;
        this.ready = function (parent) {
            this._dur = (dur == undefined) ? undefined : parent.to_frame(dur);
            this._max_dur = (max_dur == undefined) ? undefined : parent.to_frame(max_dur);
            if (repeat) {
                this._repeat = repeat;
            }
            if (bounce) {
                this._bounce = bounce;
            }
            easing = this._easing ?? easing;
            // collect names, parse inputs
            const names = [];
            this._steps.map((e, i, a) => {
                for (const [k, v] of Object.entries(e)) {
                    switch (k) {
                        case "dur":
                        case "t":
                            e[k] = parent.to_frame(v);
                            continue;
                        case "ease":
                            v == undefined || (e[k] = easing);
                            continue;
                    }
                    names.push(k);
                }
            });
            // drop propertye not present
            for (const [k, _] of Object.entries(this._vars)) {
                if (names.indexOf(k) < 0) {
                    delete vars[k];
                }
            }
        };
    }
    resolve(frame, base_frame, hint_dur) {
        const { _steps: steps, _kf_map, _dur = hint_dur, _max_dur = hint_dur, _vars } = this;
        if (_kf_map != undefined) {
            if (this._start != frame) {
                const d = this._end - this._start;
                this._start = frame;
                this._end = frame + d;
            }
            return;
        }
        let entries = resolve_t(steps, _vars, _dur, _max_dur);
        if (this._bounce) {
            entries = resolve_bounce(entries);
        }
        if (this._repeat) {
            entries = resolve_repeat(entries, this._repeat);
        }
        let t_max = 0;
        for (const e of entries) {
            t_max = Math.max(t_max, e.t);
        }
        // (this as any)._entries = Array.from(entries);
        this._kf_map = map_keyframes(entries);
        this._start = frame;
        this._end = frame + t_max;
        this._base_frame = base_frame;
    }
    run() {
        const { _start, _vars, _kf_map } = this;
        for (const [name, entries] of Object.entries(_kf_map)) {
            for (const prop of enum_props(_vars, name)) {
                let prev_t = 0;
                for (const { t, value, ease } of entries) {
                    const frame = _start + t;
                    let v;
                    if (value == null) {
                        v = prop.get_value(_start);
                    }
                    else {
                        v = prop.check_value(value);
                    }
                    prop.set_value(frame, v, prev_t, ease);
                    prev_t = t;
                }
            }
        }
    }
}
function resolve_t(steps, vars, hint_dur, max_dur) {
    const entries = new Array();
    steps.forEach((e, i, a) => {
        let t_max = undefined;
        if (e.t == undefined) {
            const { dur } = e;
            if (dur == undefined) {
                if (i == 0) {
                    e.t = 0;
                }
                else {
                    const prev = steps[i - 1];
                    if (!(i > 0 && prev.t != undefined)) {
                        throw new Error(`Unexpected`);
                    }
                    else if (hint_dur == undefined) {
                        throw new Error(`for no "t" and no "dur" provide hint duration'`);
                    }
                    e.t = prev.t + hint_dur;
                }
            }
            else if (i > 0) {
                if (!(dur >= 0)) {
                    throw new Error(`Unexpected`);
                }
                e.t = dur + steps[i - 1].t;
            }
            else {
                if (!(i === 0 || dur >= 0)) {
                    throw new Error(`Unexpected`);
                }
                e.t = dur;
            }
        }
        if (e.t < 0) {
            if (t_max == undefined) {
                if (max_dur == undefined) {
                    throw new Error(`for negative "t" provide max duration`);
                }
                t_max = max_dur;
            }
            e.t = t_max + e.t;
        }
        const { t } = e;
        if (t_max != undefined) {
            if (t > t_max) {
                throw new Error(`"t" is > max duration`);
            }
        }
        if (t < 0) {
            throw new Error(`"t" is negative`);
        }
        else if (t > 0) {
            if (i == 0) {
                // first item is not t=0
                const first = { t: 0 };
                for (const [n, _] of Object.entries(vars)) {
                    first[n] = null;
                }
                entries.push(first);
            }
        }
        else {
            if (!(i === 0 && t == 0)) {
                throw new Error(`Unexpected`);
            }
            for (const [k, _] of Object.entries(vars)) {
                if (Object.hasOwn(e, k)) {
                    if (e[k] == null) {
                        throw new Error(`Unexpected`);
                    }
                }
                else {
                    e[k] = null;
                }
            }
        }
        entries.push(e);
    });
    return entries;
}
// def resolve_bounce(steps: list[Entry]):
//     t_max = 0
//     for e in steps:
//         t_max = max(t_max, e["t"])
//     extra = []
//     for e in steps:
//         if e["t"] < t_max:
//             t2 = t_max + (t_max - e["t"])
//             e2 = {**e, "t": t2}
//             if e.get("ease"):
//                 e2["ease"] = e["ease"].reverse()
//             extra.append(e2)
//         else:
//             assert e["t"] == t_max, f't:{e["t"]} t_max:{t_max}'
//     return steps + extra
function resolve_bounce(steps) {
    let t_max = 0;
    for (const e of steps) {
        t_max = Math.max(t_max, e.t);
    }
    let extra = [];
    for (const { t, ease, ...vars } of steps) {
        if (t < t_max) {
            const e = { ...vars, t: t_max + (t_max - t) };
            if (ease != undefined) {
                if (ease && ease !== true) {
                    e.ease = ease.reversed();
                }
                else {
                    e.ease = ease;
                }
            }
            extra.push(e);
        }
        else {
            if (t != t_max) {
                throw new Error(`e.t=${t}, t_max=${t_max}`);
            }
        }
    }
    return steps.concat(extra);
}
// def resolve_repeat(steps, repeat: int):
//     t_max = 0
//     for e in steps:
//         t_max = max(t_max, e["t"])
//     n = repeat
//     t_dur = t_max + 1
//     t = t_dur
//     extra = []
//     while n > 0:
//         n -= 1
//         for i, e in enumerate(steps):
//             e2 = {**e, "t": e["t"] + t}
//             if i == 0:
//                 e2["ease"] = True
//                 pass
//             # else:
//             #     e2["t"] = e["t"] - steps[i - 1]["t"]
//             extra.append(e2)
//         t += t_dur
//     return steps + extra
function resolve_repeat(steps, repeat) {
    let t_max = 0;
    for (const { t } of steps) {
        t_max = Math.max(t_max, t);
    }
    let extra = [];
    let n = repeat;
    const t_dur = t_max + 1;
    let u = t_dur;
    while (n-- > 0) {
        steps.forEach(({ t, ...etc }, i, a) => {
            const e = { ...etc, t: t + u };
            if (i == 0) {
                e.ease = true;
            }
            extra.push(e);
        });
        u += t_dur;
    }
    return steps.concat(extra);
}
function map_keyframes(steps) {
    const entry_map = {};
    for (const e of steps) {
        for (const [k, _] of Object.entries(e)) {
            switch (k) {
                case "dur":
                case "t":
                case "ease":
                    continue;
            }
            if (!k) {
                throw new Error(`Unexpected key ${k} in steps ${steps}`);
            }
            let a = entry_map[k];
            if (!a) {
                a = entry_map[k] = [];
            }
            a.push(e);
        }
    }
    const kf_map = {};
    for (const [name, entries] of Object.entries(entry_map)) {
        const x = entries
            .map((v, i, a) => {
            return { t: v.t, value: v[name], ease: v.ease };
        })
            .sort((a, b) => a.t - b.t);
        if (x[0].t != 0) {
            throw new Error(`No t=0 ${x[0]}`);
        }
        kf_map[name] = x;
    }
    return kf_map;
}
function* enum_props(vars, name) {
    const x = vars[name];
    if (x) {
        if (Array.isArray(x)) {
            yield* x;
        }
        else {
            yield x;
        }
    }
}
function Step(steps, vars, params = {}) {
    return new StepA(steps, vars, params);
}
//# sourceMappingURL=steps.js.map
;// CONCATENATED MODULE: ./dist/track/index.js



//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./dist/index.js


//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./dist/web.js

function animate(root, fps) {
    const [start, end] = root.calc_time_range();
    if (end >= start) {
        const mspf = 1000 / fps; // miliseconds per frame
        const frames = end - start + 1;
        let frame = start;
        function render(currentTime) {
            const t = performance.now();
            {
                // console.info(`${frame} t=${t} frames=${frames} ${start}-${end}`);
                root.update_node(frame);
            }
            frame = (frame + 1) % frames;
            const excess = mspf - (performance.now() - t);
            if (excess > 0) {
                setTimeout(() => requestAnimationFrame(render), excess);
            }
            else {
                requestAnimationFrame(render);
            }
        }
        requestAnimationFrame(render);
    }
    else {
        root.update_node(0);
    }
}
// globalThis.requestAnimationFrame()
globalThis.svgmotion = {
    root: function () {
        return new Root();
    }, animate, ...dist_namespaceObject,
};
globalThis.animate = animate;
//# sourceMappingURL=web.js.map
/******/ })()
;