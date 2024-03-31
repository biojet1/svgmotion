export declare class Handle {
    x: number;
    y: number;
}
export declare class KeyframeEntry<V> {
    time: number;
    in_value: Handle;
    out_value: Handle;
    hold: boolean;
    value: V;
}
export declare class Keyframes<V> extends Array<KeyframeEntry<V>> {
    set_value(time: number, value: V): KeyframeEntry<V>;
}
export declare abstract class Animatable<V> {
    value: Keyframes<V> | V;
    abstract lerp_value(ratio: number, a: V, b: V): V;
    abstract add_value(a: V, b: V): V;
    get_value(time: number): V;
    set_value(time: number, value: V, start?: number, easing?: (a: KeyframeEntry<V>) => void, add?: boolean): KeyframeEntry<V>;
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
export declare class PositionValue extends NVectorValue {
}
export declare class Transform {
    anchor?: PositionValue;
    position?: PositionValue;
    scale?: NVectorValue;
    rotation?: NumberValue;
    skew?: NumberValue;
    skew_axis?: NumberValue;
}
export declare class Box {
    size: PositionValue;
    position: PositionValue;
    constructor(position: Iterable<number>, size: Iterable<number>);
}
