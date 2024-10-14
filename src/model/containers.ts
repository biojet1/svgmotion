import { BoundingBox, Matrix } from "../geom/index.js";
import { Keyframe } from "../keyframe/keyframe.js";
import { Animatable, TextValue, LengthValue, LengthXValue, LengthYValue } from "./value.js";
import { ValueSet, ViewBox } from "./valuesets.js";
import { Element, Chars } from "./base.js";
import { Node } from "../tree/linked3.js";

export class Container extends Element {
    // keyframes
    *enum_keyframes(): Generator<Array<Keyframe<any>>, void, unknown> {
        for (let v of this.enum_values()) {
            yield v.kfs;
        }
    }
    calc_time_range() {
        let max = 0;
        let min = 0;
        for (let kfs of this.enum_keyframes()) {
            for (const { time } of kfs) {
                if (time > max) {
                    max = time;
                }
                if (time < min) {
                    min = time;
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
                    if (n.id_equals(x)) {
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
                if (cur.id_equals(id)) {
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
    override update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {
        let w = this.transform.get_transform(frame);
        m = m ? m.cat(w) : w;
        for (const x of this.children<Element>()) {
            x.update_bbox(bbox, frame, m);
        }
    }
    override object_bbox(frame: number) {
        const bb = BoundingBox.not();
        for (const x of this.children<Element>()) {
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

export class Group extends Container {
    static override tag = "g";
}

export class Defs extends Container {
    static override tag = "defs";
}

export class Symbol extends Container {
    static override tag = "symbol";
    //
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get ref_x() { return this._new_field("ref_x", new LengthXValue(0)); }
    get ref_y() { return this._new_field("ref_y", new LengthYValue(0)); }
    get view_box() { return this._new_field("view_box", new ViewBox([0, 0], [100, 100])); }
}

export class Filter extends Container {
    static override tag = "filter";
}

export class Marker extends Container {
    static override tag = "marker";
    ///
    get ref_x() { return this._new_field("ref_x", new LengthXValue(0)); }
    get ref_y() { return this._new_field("ref_y", new LengthYValue(0)); }
    get view_box() { return this._new_field("view_box", new ViewBox([0, 0], [100, 100])); }
    get marker_units() { return this._new_field("marker_units", new TextValue('strokeWidth')); }
    get marker_width() { return this._new_field("marker_width", new LengthXValue(3)); }
    get marker_height() { return this._new_field("marker_height", new LengthYValue(3)); }
    get orient() { return this._new_field("orient", new LengthValue(0)); }
    ///
}

export class Pattern extends Container {
    static override tag = "pattern";
    ///
    get href() { return this._new_field("href", new TextValue('')); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get view_box() { return this._new_field("view_box", new ViewBox([0, 0], [100, 100])); }
    get pattern_units() { return this._new_field("pattern_units", new TextValue('objectBoundingBox')); }
    get pattern_content_units() { return this._new_field("pattern_content_units", new TextValue('userSpaceOnUse')); }
    get pattern_transform() { return this._new_field("pattern_transform", new TextValue('')); }
}

export class Mask extends Container {
    static override tag = "mask";
    ///
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get mask_units() { return this._new_field("mask_units", new TextValue('objectBoundingBox')); }
    get mask_content_units() { return this._new_field("mask_content_units", new TextValue('userSpaceOnUse')); }
}

export class ClipPath extends Container {
    static override tag = "clipPath";
    ///
    get clip_path_units() { return this._new_field("clip_path_units", new TextValue('userSpaceOnUse')); }
}
