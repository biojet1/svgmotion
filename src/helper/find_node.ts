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
    return get_node(this, x, Rect);
}

Container.prototype.get_circle = function (x: number | string = 0) {
    return get_node(this, x, Circle);
}

Container.prototype.get_group = function (x: number | string = 0) {
    return get_node(this, x, Group);
}

Container.prototype.get_view = function (x: number | string = 0) {
    return get_node(this, x, ViewPort);
}

Container.prototype.get_path = function (x: number | string = 0) {
    return get_node(this, x, Path);
}


function get_node<T>(that: Container, x: number | string = 0, K: { new(...args: any[]): T }): T {
    const n = find_node(that, x, K);
    if (n) {
        return n;
    }
    throw new Error(`not found '${x}'`);
}

function find_node<T>(that: Container, x: number | string = 0, K: { new(...args: any[]): T }): T | void {
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
        if (cur instanceof Item || cur instanceof Container) {
            if (cur instanceof x) {
                yield cur;
            }
        }
    } while (cur !== end && (cur = cur._next));
}