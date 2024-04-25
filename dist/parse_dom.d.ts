export declare function parse_svg(src: string | URL, opt?: {
    xinclude?: boolean;
    base?: string | URL;
}): Promise<Item | Container>;
import { Item, Container } from "./model/node.js";
export declare const A1: {
    [key: string]: (elem: SVGElement, parent: Container) => Item | Container;
};
