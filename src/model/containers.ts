import { BoundingBox, Matrix } from "../geom/index.js";
import { Keyframe } from "../keyframe/keyframe.js";
import { Animatable, TextValue, LengthValue, LengthXValue, LengthYValue } from "./value.js";
import { ValueSet, ViewBox } from "./valuesets.js";
import { Element } from "./base.js";
import { Node } from "./linked.js";

export class Container extends Element {
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

    get_id(id: string) {
        const { _start, _end: end } = this;
        let cur: Node | undefined = _start;
        do {
            if (cur instanceof Element) {
                if (cur.id === id) {
                    return cur;
                }
            }
        } while (cur !== end && (cur = cur._next));
    }
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
export class Group extends Container {
    static override tag = "g";
}

export class Symbol extends Container {
    static override tag = "symbol";
    get fit_view() {
        return this._new_field("fit_view", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        this._new_field("fit_view", v);
    }
}

export class Filter extends Container {
    static override tag = "filter";
}

export class Marker extends Container {
    static override tag = "marker";
    ///
    get fit_view() {
        return this._new_field("fit_view", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        this._new_field("fit_view", v);
    }
    ///
}

export class Pattern extends Container {
    static override tag = "pattern";
    ///
    get x() {
        return this._new_field("x", new LengthXValue(0));
    }
    set x(v: LengthXValue) {
        this._new_field("x", v);
    }
    ///
    get y() {
        return this._new_field("y", new LengthYValue(0));
    }
    set y(v: LengthYValue) {
        this._new_field("y", v);
    }
    ///
    get width() {
        return this._new_field("width", new LengthXValue(100));
    }
    set width(v: LengthXValue) {
        this._new_field("width", v);
    }
    ///
    get height() {
        return this._new_field("height", new LengthYValue(100));
    }
    set height(v: LengthYValue) {
        this._new_field("height", v);
    }
    ///
    get view_box() {
        return this._new_field("view_box", new ViewBox([0, 0], [100, 100]));
    }
    set view_box(v: ViewBox) {
        this._new_field("view_box", v);
    }
    //
    get fit_view() {
        return this._new_field("fit_view", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        this._new_field("fit_view", v);
    }
    /// href
    get href() {
        return this._new_field("href", new TextValue(''));
    }
    set href(v: TextValue) {
        this._new_field("href", v);
    }
    ///
    get pattern_units() {
        return this._new_field("pattern_units", new TextValue("objectBoundingBox"));
    }
    set pattern_units(v: TextValue) {
        this._new_field("pattern_units", v);
    }
    ///
    get pattern_content_units() {
        return this._new_field("pattern_units", new TextValue("userSpaceOnUse"));
    }
    set pattern_content_units(v: TextValue) {
        this._new_field("pattern_units", v);
    }
    ///
    // pattern_transform=transform
}

export class Mask extends Container {
    static override tag = "mask";
    ///
    get x() {
        return this._new_field("x", new LengthXValue(0));
    }
    set x(v: LengthXValue) {
        this._new_field("x", v);
    }
    ///
    get y() {
        return this._new_field("y", new LengthYValue(0));
    }
    set y(v: LengthYValue) {
        this._new_field("y", v);
    }
    ///
    get width() {
        return this._new_field("width", new LengthXValue(100));
    }
    set width(v: LengthXValue) {
        this._new_field("width", v);
    }
    ///
    get height() {
        return this._new_field("height", new LengthYValue(100));
    }
    set height(v: LengthYValue) {
        this._new_field("height", v);
    }
    ///
    get mask_units() {
        return this._new_field("mask_units", new TextValue("objectBoundingBox"));
    }
    set mask_units(v: TextValue) {
        this._new_field("mask_units", v);
    }
    ///
    get mask_content_units() {
        return this._new_field("mask_content_units", new TextValue("userSpaceOnUse"));
    }
    set mask_content_units(v: TextValue) {
        this._new_field("mask_content_units", v);
    }
}

export class ClipPath extends Container {
    static override tag = "clipPath";
    ///
    get clip_path_units() {
        return this._new_field("clip_path_units", new TextValue("userSpaceOnUse"));
    }
    set clip_path_units(v: TextValue) {
        this._new_field("clip_path_units", v);
    }
}
