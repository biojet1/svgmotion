import { Animatable, NVectorValue, NumberValue, PositionValue, RGBValue } from "./keyframes.js";
import { Matrix } from "./matrix.js";
export declare class ValueSet {
    enum_values(): Generator<Animatable<any>, void, unknown>;
    update_prop(frame: number, node: SVGElement): void;
    _getx<T>(name: string, value: T): T;
    _setx<T>(name: string, value: T): void;
}
export declare class Box extends ValueSet {
    constructor(position: Iterable<number>, size: Iterable<number>);
    get size(): PositionValue;
    set size(v: PositionValue);
    get position(): PositionValue;
    set position(v: PositionValue);
}
export declare class Stroke extends ValueSet {
    get width(): NumberValue;
    set width(v: NumberValue);
}
export declare class Fill extends ValueSet {
    get opacity(): NumberValue;
    set opacity(v: NumberValue);
    get color(): RGBValue;
    set color(v: RGBValue);
}
export declare class Transform extends ValueSet {
    get_matrix(frame: number): Matrix;
    parse(s: string): void;
    get anchor(): PositionValue;
    set anchor(v: PositionValue);
    get position(): PositionValue;
    set position(v: PositionValue);
    get scale(): NVectorValue;
    set scale(v: NVectorValue);
    get rotation(): NumberValue;
    set rotation(v: NumberValue);
    get skew(): NumberValue;
    set skew(v: NumberValue);
    get skew_axis(): NumberValue;
    set skew_axis(v: NumberValue);
    to_json(): void;
    from_json(x: any): void;
}
export declare class OpacityProp extends NumberValue {
}
export declare class RectSizeProp extends NVectorValue {
}
