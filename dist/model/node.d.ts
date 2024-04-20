import { Animatable, Keyframes, NumberValue, TextValue } from "./keyframes.js";
import { Box, Fill, RectSizeProp } from "./properties.js";
import { Node, Parent } from "./linked.js";
interface INode {
    id?: string;
    _node?: SVGElement;
}
declare const Item_base: {
    new (...args: any[]): {
        prop5: NumberValue;
        fill: Fill;
        opacity: NumberValue;
        _getx<T>(name: string, value: T): T;
        _setx<T_1>(name: string, value: T_1): void;
    };
} & typeof Node;
export declare abstract class Item extends Item_base implements INode {
    id?: string;
    _node?: SVGElement;
    abstract as_svg(doc: Document): SVGElement;
    update_self(frame: number, node: SVGElement): void;
    update_node(frame: number): void;
    enum_values(): Generator<Animatable<any>, void, unknown>;
}
export declare abstract class Shape extends Item {
}
declare const Container_base: {
    new (...args: any[]): {
        prop5: NumberValue;
        fill: Fill;
        opacity: NumberValue;
        _getx<T>(name: string, value: T): T;
        _setx<T_1>(name: string, value: T_1): void;
    };
} & typeof Parent;
export declare class Container extends Container_base implements INode {
    id?: string;
    _node?: SVGElement;
    as_svg(doc: Document): SVGElement;
    update_self(frame: number, node: SVGElement): boolean;
    update_node(frame: number): void;
    enum_values(): Generator<Animatable<any>, void, unknown>;
    enum_keyframes(): Generator<Keyframes<any>, void, unknown>;
    calc_time_range(): number[];
    add_rect(size?: Iterable<number>): Rect;
    add_view(): ViewPort;
    add_group(): Group;
    add_path(): Path;
}
export declare class Group extends Container {
    as_svg(doc: Document): SVGElement;
}
export declare class ViewPort extends Container {
    as_svg(doc: Document): SVGElement;
    get view_box(): Box;
    set view_box(v: Box);
    get width(): NumberValue;
    set width(v: NumberValue);
    get height(): NumberValue;
    set height(v: NumberValue);
}
export declare class Path extends Shape {
    as_svg(doc: Document): SVGElement;
    get d(): TextValue;
    set d(v: TextValue);
}
export declare class Rect extends Shape {
    size: RectSizeProp;
    as_svg(doc: Document): SVGElement;
    get width(): NumberValue;
    set width(v: NumberValue);
    get height(): NumberValue;
    set height(v: NumberValue);
    get x(): NumberValue;
    set x(v: NumberValue);
    get y(): NumberValue;
    set y(v: NumberValue);
}
export declare class Root extends ViewPort {
    defs: {
        [key: string]: Item | Container;
    };
    id_map: {
        [key: string]: Item | Container;
    };
    as_svg(doc: Document): SVGElement;
    remember_id(id: string, node: Item | Container): void;
}
export {};
