import { Animatable, NumberValue, Value } from "./keyframes.js";
import { Fill, Transform, ValueSet, xset, xget } from "./properties.js";
// import { Node, Parent } from "./linked.js";
export type Constructor = new (...args: any[]) => {};
export function SVGProps<TBase extends Constructor>(Base: TBase) {
    return class SVGProps extends Base {
        id?: string;
        _element?: SVGElement;
        static tag = '';
        ///
        get prop5() {
            return xget(this, "prop5", new NumberValue(45));
        }
        set prop5(v: NumberValue) {
            xset(this, "prop5", v);
        }
        /// fill
        get fill() {
            return xget(this, "fill", new Fill());
        }
        set fill(v: Fill) {
            xset(this, "fill", v);
        }
        /// opacity
        get opacity() {
            return xget(this, "opacity", new NumberValue(1));
        }
        set opacity(v: NumberValue) {
            xset(this, "opacity", v);
        }
        /// transform
        get transform() {
            return xget(this, "transform", new Transform());
        }
        set transform(v: Transform) {
            xset(this, "transform", v);
        }
        to_json() {
            const o: any = { tag: (<typeof SVGProps>this.constructor).tag };
            for (let [k, v] of Object.entries(this)) {
                if (v instanceof Animatable || v instanceof ValueSet) {
                    o[k] = v.to_json();
                }
            }
            return o;
        }
        props_from_json(props: { [key: string]: Value<any> }) {
            for (let [k, v] of Object.entries(props)) {
                const p = (this as any)[k];
                if (p instanceof Animatable || p instanceof ValueSet) {
                    p.from_json(v);
                } else {
                    throw new Error(`Unexpected property "${k}" (${v})`);
                }
            }
        }
        //
        // root<T extends Parent = Parent>() {
        //     let root = this._parent;
        //     if (root) {
        //         for (let x; (x = root._parent); root = x);
        //         return root as T;
        //     }
        // }


    };
}

