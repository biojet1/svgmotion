import { Animatable, NVectorValue, NumberValue, PositionValue, RGBValue } from "./keyframes.js";
export declare class ValueSet {
    enum_values(): Generator<Animatable<any>, void, unknown>;
    update_prop(frame: number, node: SVGElement): void;
}
export declare class Box extends ValueSet {
    size: PositionValue;
    position: PositionValue;
    constructor(position: Iterable<number>, size: Iterable<number>);
    update_prop(frame: number, node: SVGSVGElement): void;
}
export declare class Stroke extends ValueSet {
    width?: NumberValue;
}
export declare class Fill extends ValueSet {
    color?: RGBValue;
    opacity?: NumberValue;
}
export declare class Transform extends ValueSet {
    anchor?: PositionValue;
    position?: PositionValue;
    scale?: NVectorValue;
    rotation?: NumberValue;
    skew?: NumberValue;
    skew_axis?: NumberValue;
}
export declare class OpacityProp extends NumberValue {
    update_prop(frame: number, node: SVGElement): void;
}
export declare class RectSizeProp extends NVectorValue {
    update_prop(frame: number, node: SVGRectElement): void;
}
