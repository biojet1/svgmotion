import { NumberValue } from "./keyframes.js";
import { Fill, Transform } from "./properties.js";
export function SVGProps(Base) {
    return class SVGProps extends Base {
        static tag = '';
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