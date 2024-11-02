import { BoundingBox } from "../geom/index.js";
import { Animatable } from "./value.js";
import { ValueSet } from "./valuesets.js";
import { Element, Chars } from "./base.js";
import { Node } from "../tree/linked3.js";

export class Container extends Element {
    calc_time_range() {
        let max = 0;
        let min = 0;
        for (let v of this.enum_values()) {
            const { kfs } = v;
            if (kfs && kfs.length > 0) {
                const s = v.kfs_stepper;
                if (s) {
                    const { start, end } = s;
                    if (end < Infinity && end > max) {
                        max = end;
                    }
                    if (start < min) {
                        min = start;
                    }
                }
            }
        }
        return [min, max];
    }
    override *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            } else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
        for (const sub of this.children<Element>()) {
            if (sub instanceof Element) {
                yield* sub.enum_values();
            }
        }
    }
    // tree
    find_node<T>(x: number | string = 0, K: { new(...args: any[]): T; }): T | void {
        if (typeof x == "number") {
            for (const n of enum_node_type(this, K)) {
                if (!(x-- > 0)) {
                    return n;
                }
            }
        } else {
            for (const n of enum_node_type(this, K)) {
                if (n instanceof Element) {
                    if (Object.getOwnPropertyDescriptor(n, 'id')?.value == x) {
                        return n
                    }
                }
            }
        }
    }
    get_node<T>(
        x: number | string = 0,
        K: { new(...args: any[]): T }
    ): T {
        const n = this.find_node(x, K);
        if (n) {
            return n;
        }
        throw new Error(`not found ${K.name} '${x}'`);
    }
    get_id(id: string) {
        const { _start, _end: end } = this;
        let cur: Node | undefined = _start;
        do {
            if (cur instanceof Element) {
                if (Object.getOwnPropertyDescriptor(cur, 'id')?.value == id) {
                    return cur;
                }
            }
        } while (cur !== end && (cur = cur._next));
    }
    get_chars(x: number) {
        return this.get_node(x, Chars);
    }
    get_element(x: number | string = 0) {
        return this.get_node(x, Element);
    }
    // geom
    bbox_of(frame: number, ...args: Element[]) {
        const bb = BoundingBox.not();
        for (const x of args) {
            const m = x.transform_under(frame, this);
            x.update_bbox(bb, frame, m);
        }
        return bb;
    }
}

function* enum_node_type<T>(that: Container, x: { new(...args: any[]): T }) {
    const { _start, _end: end } = that;
    let cur: typeof _start | undefined = _start;
    do {
        if (cur instanceof Element || cur instanceof Chars) {
            if (cur instanceof x) {
                yield cur;
            }
        }
    } while (cur !== end && (cur = cur._next));
}

export class Content extends Container {
    add_chars(text: string, before?: Node) {
        const n = new Chars();
        n.content.set_value(text);
        this.insert_before(before, n);
    }
    add_content(before?: Node) {
        const n = new Chars();
        this.insert_before(before, n);
        return n;
    }
}

