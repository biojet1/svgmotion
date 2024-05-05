import { Circle, Container, Group, Item, Path, Rect, ViewPort } from "../model/node.js";

declare module "../model/node" {
    interface Container {
        get_rect(x: number | string): Rect;
        get_circle(x: number | string): Circle;
        get_group(x: number | string): Group;
        get_view(x: number | string): ViewPort;
        get_path(x: number | string): Path;
    }
}

Container.prototype.get_rect = function (x: number | string = 0) {
    return get_node(this, Rect, x);
}

Container.prototype.get_circle = function (x: number | string = 0) {
    return get_node(this, Circle, x);
}

Container.prototype.get_group = function (x: number | string = 0) {
    return get_node(this, Group, x);
}

Container.prototype.get_view = function (x: number | string = 0) {
    return get_node(this, ViewPort, x);
}

Container.prototype.get_path = function (x: number | string = 0) {
    return get_node(this, Path, x);
}

function get_node<T>(that: Container, K: { new(...args: any[]): T }, x: number | string = 0): T {
    const n = find_node(that, K, x);
    if (n) {
        return n;
    }
    throw new Error(`not found '${x}'`);
}

function find_node<T>(that: Container, K: { new(...args: any[]): T }, x: number | string = 0): T | void {
    if (typeof x == "number") {
        for (const n of enum_node_type(that, K)) {
            if (x-- > 0) {
                continue;
            }
            return n;
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
        if (cur instanceof Item || cur instanceof Container) {
            if (cur instanceof x) {
                yield cur;
            }
        }
    } while (cur !== end && (cur = cur._next));
}