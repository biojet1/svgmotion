import { Animatable, NumberValue } from "./keyframes.js";
import { Fill, Transform, ValueSet } from "./properties.js";

export type Constructor = new (...args: any[]) => {};
export function SVGProps<TBase extends Constructor>(Base: TBase) {
    return class SVGProps extends Base {
        static tag = '';
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
        static opacity = { name: 'opacity' };
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
        ///
        to_json() {
            const o: any = { tag: (<typeof SVGProps>this.constructor).tag };
            // o['entries'] = Object.entries(this);
            for (let [k, v] of Object.entries(this)) {
                if (v instanceof Animatable) {
                    o[k] = v.to_json();
                } else if (v instanceof ValueSet) {
                    o[k] = v.to_json();
                }
            }
            return o;
        }
        //
        // from_json(o: ChildNode | ParentNode) {



        // }
    };
}

