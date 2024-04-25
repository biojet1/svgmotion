import { NumberValue } from "./keyframes.js";
import { Fill, Transform } from "./properties.js";

export type Constructor = new (...args: any[]) => {};
export function SVGProps<TBase extends Constructor>(Base: TBase) {
    return class SVGProps extends Base {
        get prop5() {
            return this._getx("prop5", new NumberValue(45));
        }
        set prop5(v: NumberValue) {
            this._setx("prop5", v);
        }
        /// fill
        get fill() {
            return this._getx("fill", new Fill());
        }
        set fill(v: Fill) {
            this._setx("fill", v);
        }
        /// opacity
        get opacity() {
            return this._getx("opacity", new NumberValue(1));
        }
        set opacity(v: NumberValue) {
            this._setx("opacity", v);
        }
        /// transform
        get transform() {
            return this._getx("transform", new Transform());
        }
        set transform(v: Transform) {
            this._setx("transform", v);
        }

        ///
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
        // static _setxx<T>(name: string, value: T) {
        //     console.log(`_SETX ${name}`);
        //     Object.defineProperty(this, name, {
        //         value,
        //         writable: true,
        //         enumerable: true,
        //     });
        // }
    };
}
