import { NumberValue } from "./keyframes.js";
import { Fill } from "./properties.js";

export type Constructor = new (...args: any[]) => {};
export function SVGProps<TBase extends Constructor>(Base: TBase) {
    return class SVGProps extends Base {
        get prop5() {
            return this._getx("prop5", new NumberValue(45));
        }
        set prop5(v: NumberValue) {
            this._setx("prop5", v);
        }
        get fill() {
            return this._getx("fill", new Fill());
        }
        set fill(v: Fill) {
            this._setx("fill", v);
        }
        get opacity() {
            return this._getx("opacity", new NumberValue(1));
        }
        set opacity(v: NumberValue) {
            this._setx("opacity", v);
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
