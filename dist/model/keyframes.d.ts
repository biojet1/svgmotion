export interface IEasing {
    ratio_at(t: number): number;
    reverse(): IEasing;
}
export declare class KeyframeEntry<V> {
    time: number;
    value: V;
    easing?: IEasing | boolean;
}
export declare class Keyframes<V> extends Array<KeyframeEntry<V>> {
    set_value(time: number, value: V): KeyframeEntry<V>;
}
export declare abstract class Animatable<V> {
    value: Keyframes<V> | V;
    abstract lerp_value(ratio: number, a: V, b: V): V;
    abstract add_value(a: V, b: V): V;
    get_value(time: number): V;
    set_value(time: number, value: V, start?: number, easing?: IEasing | boolean, add?: boolean): KeyframeEntry<V>;
    parse_value(x: any): V;
    constructor(v: V);
}
export declare class NumberValue extends Animatable<number> {
    lerp_value(r: number, a: number, b: number): number;
    add_value(a: number, b: number): number;
    constructor(v: number);
}
export declare class NVector extends Float64Array {
    add(that: NVector): NVector;
    mul(that: NVector): NVector;
    lerp(that: NVector, t: number): NVector;
}
export declare class NVectorValue extends Animatable<NVector> {
    lerp_value(r: number, a: NVector, b: NVector): NVector;
    add_value(a: NVector, b: NVector): NVector;
    constructor(v: Iterable<number>);
}
export declare class Point extends NVector {
    constructor(x?: number, y?: number);
}
export declare class Size extends NVector {
    constructor(w?: number, h?: number);
}
export declare class RGB extends NVector {
    constructor(r?: number, g?: number, b?: number);
}
export declare class PositionValue extends NVectorValue {
}
export declare class RGBValue extends NVectorValue {
}
