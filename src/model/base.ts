import { Matrix, BoundingBox } from "../geom/index.js";
import { Node, Parent } from "../tree/linked3.js";
import { TextValue, PercentageValue, FontSizeValue, LengthValue } from "./value.js";
import { Animatable } from "./value.js";
import { Fill, Transform, xset, xget, Font, Stroke, ValueSet } from "./valuesets.js";

/// @@@ //////////
export class Chars extends Node {
    id?: string;
    get content() {
        return xget(this, "content", new TextValue(''));
    }
    set content(v: TextValue) {
        xset(this, "content", v);
    }
}
interface Constructor<M> {
    new(...args: any[]): M
}
export class Element extends Parent {
    // id?: string;
    static tag = '?';
    static _prop_attr: { [key: string]: string } = {};
    // tree
    *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            } else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
    }
    // geom
    cat_transform(frame: number, n: Matrix) {
        if (Object.hasOwn(this, "transform")) {
            this.transform.cat_transform(frame, n);
        }
    }
    update_bbox(_bbox: BoundingBox, _frame: number, _m?: Matrix) {
    }
    bounding_box(frame: number, m?: Matrix) {
        const bb = BoundingBox.not();
        this.update_bbox(bb, frame, m);
        return bb
    }
    object_bbox(_frame: number) {
        const bb = BoundingBox.not();
        // TODO:
        return bb
    }
    // field
    static new<T extends Element>(this: Constructor<T>, params?: object): T {
        const e = new this();
        params && e._set_params(params);
        return e;
    }
    _new_field<T extends Animatable<any> | ValueSet>(name: string, value: T): T {
        const v = xget(this, name, value);
        v._parent = this;
        return v;
    }
    _set_params(o: object) {
        for (const [k, v] of Object.entries(o)) {
            switch (k) {
                case 'id':
                    this.id = v;
                    break;
                default:
                    const f = (this as any)[k];
                    if (f instanceof Animatable) {
                        f.set_value(v);
                    } else if (f instanceof ValueSet) {
                        for (const [n, w] of Object.entries(v)) {
                            const g = (f as any)[n];
                            if (g instanceof Animatable) {
                                g.set_value(w);
                            }
                        }
                    }
            }
        }
    }
    // id
    get id() {
        const id = Math.round(Math.random() * 1E+5).toString(36)
        xget(this, "id", id);
        return id;
    }
    set id(id: string) {
        xget(this, "id", id);
    }
    id_equals(id: string) {
        return Object.hasOwn(this, 'id') && this.id == id;
    }
    /// Properties ////////////
    get transform() { return this._new_field("transform", new Transform()); }
    get fill() { return this._new_field("fill", new Fill()); }
    get stroke() { return this._new_field("stroke", new Stroke()); }
    get font() { return this._new_field("font", new Font()); }
    get opacity() { return this._new_field("opacity", new PercentageValue(1)); }
    get alignment_baseline() { return this._new_field("alignment_baseline", new TextValue()); }
    get text_anchor() { return this._new_field("text_anchor", new TextValue('start')); }
    get text_decoration() { return this._new_field("text_decoration", new TextValue('none')); }
    get text_overflow() { return this._new_field("text_overflow", new TextValue('clip')); }
    get unicode_bidi() { return this._new_field("unicode_bidi", new TextValue('normal')); }
    get white_space() { return this._new_field("white_space", new TextValue('default')); }
    get word_spacing() { return this._new_field("word_spacing", new TextValue('pre')); }
    get writing_mode() { return this._new_field("writing_mode", new TextValue('horizontal-tb')); }
    get text_align() { return this._new_field("text_align", new TextValue('start')); }
    get line_height() { return this._new_field("line_height", new FontSizeValue(1)); }
    get stop_opacity() { return this._new_field("stop_opacity", new PercentageValue(1)); }
    get display() { return this._new_field("display", new TextValue('')); }
    get overflow() { return this._new_field("overflow", new TextValue('visible')); }
    get visibility() { return this._new_field("visibility", new TextValue('visible')); }
    get image_rendering() { return this._new_field("image_rendering", new TextValue('auto')); }
    get shape_rendering() { return this._new_field("shape_rendering", new TextValue('auto')); }
    get text_rendering() { return this._new_field("text_rendering", new TextValue('auto')); }
    get color_rendering() { return this._new_field("color_rendering", new TextValue('auto')); }
    get clip() { return this._new_field("clip", new TextValue('auto')); }
    get clip_path() { return this._new_field("clip_path", new TextValue('none')); }
    get clip_rule() { return this._new_field("clip_rule", new TextValue('nonzero')); }
    get color() { return this._new_field("color", new TextValue('currentColor')); }
    get color_interpolation() { return this._new_field("color_interpolation", new TextValue('auto')); }
    get filter() { return this._new_field("filter", new TextValue()); }
    get letter_spacing() { return this._new_field("letter_spacing", new LengthValue(0)); }
    get mask() { return this._new_field("mask", new TextValue('')); }
    get pointer_events() { return this._new_field("pointer_events", new TextValue('visiblePainted')); }
    get vector_effect() { return this._new_field("vector_effect", new TextValue('none')); }

};

// TODO: dash array, path