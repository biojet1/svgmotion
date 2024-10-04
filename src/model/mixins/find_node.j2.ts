import { Element, TextData } from "../base.js";
import { Container, Symbol, Group, ClipPath, Marker, Mask, Pattern, Filter } from "../containers.js";
import { ViewPort } from "../viewport.js";
import { Use, Image } from "../elements.js";
import { Text, TSpan } from "../text.js";
import { Circle, Ellipse, Line, Path, Polygon, Polyline, Rect } from "../shapes.js";
import { FEDropShadow, FEGaussianBlur, LinearGradient, MeshPatch, MeshRow, RadialGradient } from "../filters.js";

function get_node<T>(
    that: Container,
    x: number | string = 0,
    K: { new(...args: any[]): T }
): T {
    const n = find_node(that, x, K);
    if (n) {
        return n;
    }
    throw new Error(`not found ${K.name} '${x}'`);
}

function find_node<T>(
    that: Container,
    x: number | string = 0,
    K: { new(...args: any[]): T }
): T | void {
    if (typeof x == "number") {
        for (const n of enum_node_type(that, K)) {
            if (!(x-- > 0)) {
                return n;
            }
        }
    } else {
        for (const n of enum_node_type(that, K)) {
            if (n.id === x) {
                return n;
            }
        }
    }
}

function* enum_node_type<T>(that: Container, x: { new(...args: any[]): T }) {
    const { _start, _end: end } = that;
    let cur: typeof _start | undefined = _start;
    do {
        if (cur instanceof Element || cur instanceof TextData) {
            if (cur instanceof x) {
                yield cur;
            }
        }
    } while (cur !== end && (cur = cur._next));
}


declare module "../containers" {
    interface Container {
        /*% for e in elements %*/
        get_/*{ e.name }*/(x: number | string): /*{ e.kind }*/;
        /*% endfor %*/
        /*% for e in elements %*/
        find_/*{ e.name }*/(x: number | string): /*{ e.kind }*/ | void;
        /*% endfor %*/
    }
}

/*% for e in elements %*/
Container.prototype.get_/*{ e.name }*/ = function (x: number | string = 0) {
    return get_node(this, x, /*{ e.kind }*/);
}
Container.prototype.find_/*{ e.name }*/ = function (x: number | string = 0): /*{ e.kind }*/ | void {
    return find_node(this, x, /*{ e.kind }*/);
}
/*% endfor %*/
