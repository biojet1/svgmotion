import { Animatable } from "./keyframes.js";
import { NumberValue } from "./keyframes.js";
import { PositionValue, NVectorValue } from "./keyframes.js";
export declare class ValueSet {
    enum_values(): Generator<Animatable<any>, void, unknown>;
}
export declare class Box extends ValueSet {
    size: PositionValue;
    position: PositionValue;
    constructor(position: Iterable<number>, size: Iterable<number>);
}
export declare class Stroke extends ValueSet {
    width?: NumberValue;
}
export declare class Transform extends ValueSet {
    anchor?: PositionValue;
    position?: PositionValue;
    scale?: NVectorValue;
    rotation?: NumberValue;
    skew?: NumberValue;
    skew_axis?: NumberValue;
}
