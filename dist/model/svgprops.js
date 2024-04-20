import { NumberValue } from "./keyframes.js";
import { Fill } from "./properties.js";
export function SVGProps(Base) {
    return class SVGProps extends Base {
        get prop5() {
            return this._getx("prop5", new NumberValue(45));
        }
        set prop5(v) {
            this._setx("prop5", v);
        }
        get fill() {
            return this._getx("fill", new Fill());
        }
        set fill(v) {
            this._setx("fill", v);
        }
        get opacity() {
            return this._getx("opacity", new NumberValue(1));
        }
        set opacity(v) {
            this._setx("opacity", v);
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
    };
}
//# sourceMappingURL=svgprops.js.map