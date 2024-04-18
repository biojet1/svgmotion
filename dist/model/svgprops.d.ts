import { NumberValue } from "./keyframes.js";
import { Fill } from "./properties.js";
export type Constructor = new (...args: any[]) => {};
export declare function SVGProps<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        prop5: NumberValue;
        fill: Fill;
        opacity: NumberValue;
        _getx<T>(name: string, value: T): T;
        _setx<T_1>(name: string, value: T_1): void;
    };
} & TBase;
