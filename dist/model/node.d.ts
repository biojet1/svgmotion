import { NVectorValue, Transform, NumberValue, Box } from "./keyframes.js";
interface INode {
    id?: string;
    transform?: Transform;
    opacity?: NumberValue;
}
export declare abstract class Node implements INode {
    id?: string;
    transform?: Transform;
    opacity?: NumberValue;
    abstract _update(frame: number, node: SVGElement): void;
    abstract as_svg(doc: Document): SVGElement;
}
export declare abstract class Shape extends Node {
}
export declare abstract class Container extends Array<Node | Container> {
    id?: string;
    transform: Transform;
    opacity: NumberValue;
    _update(frame: number, node: SVGElement): void;
    abstract as_svg(doc: Document): SVGElement;
}
export declare class Group extends Container {
    as_svg(doc: Document): SVGElement;
}
export declare class ViewPort extends Container {
    view_port: Box;
    as_svg(doc: Document): SVGSVGElement;
}
export declare class Root extends ViewPort {
    defs: Array<Node | Container>;
}
export declare class Rect extends Shape {
    size: NVectorValue;
    as_svg(doc: Document): SVGRectElement;
    _update(frame: number, node: SVGElement): void;
}
export {};
