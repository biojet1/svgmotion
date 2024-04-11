import { Animatable, Keyframes, NumberValue } from "./keyframes.js";
import { Box, Fill, RectSizeProp, Stroke, Transform } from "./properties.js";
interface INode {
    id?: string;
    transform?: Transform;
    opacity?: NumberValue;
    _node?: SVGElement;
    stroke?: Stroke;
}
export declare abstract class Node implements INode {
    id?: string;
    _node?: SVGElement;
    abstract as_svg(doc: Document): SVGElement;
    update_self(frame: number, node: SVGElement): void;
    update_node(frame: number): void;
    enum_values(): Generator<Animatable<any>, void, unknown>;
    get opacity(): NumberValue;
    get fill(): Fill;
    set fill(v: Fill);
}
export declare abstract class Shape extends Node {
    get prop_x(): {
        value: {
            value: number;
        };
    };
}
export declare abstract class Container extends Array<Node | Container> implements INode {
    id?: string;
    _node?: SVGElement;
    abstract as_svg(doc: Document): SVGElement;
    update_self(frame: number, node: SVGElement): boolean;
    update_node(frame: number): void;
    enum_values(): Generator<Animatable<any>, void, unknown>;
    enum_keyframes(): Generator<Keyframes<any>, void, unknown>;
    add_rect(size?: Iterable<number>): Rect;
    calc_time_range(): number[];
    get opacity(): NumberValue;
}
export declare class Group extends Container {
    as_svg(doc: Document): SVGElement;
}
export declare class ViewPort extends Container {
    view_port: Box;
    as_svg(doc: Document): SVGSVGElement;
}
export declare class Rect extends Shape {
    size: RectSizeProp;
    as_svg(doc: Document): SVGRectElement;
}
export declare class Root extends ViewPort {
    defs: Array<Node | Container>;
}
export {};
