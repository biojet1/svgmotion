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

    /// FILL
    get fill() {
        return this._new_field("fill", new Fill());
    }
    set fill(v: Fill) {
        this._new_field("fill", v);
    }
    /// STROKE
    get stroke() {
        return this._new_field("stroke", new Stroke());
    }
    set stroke(v: Stroke) {
        this._new_field("stroke", v);
    }
    /// FONT
    get font() {
        return this._new_field("font", new Font());
    }
    set font(v: Font) {
        this._new_field("font", v);
    }
    /// transform
    get transform() {
        return this._new_field("transform", new Transform());
    }
    set transform(v: Transform) {
        this._new_field("transform", v);
    }
    /// Properties ////////////
    /// getset<text-anchor>
    get text_anchor() {
        return this._new_field('text_anchor', new TextValue('start'));
    }
    set text_anchor(v: TextValue) {
        this._new_field('text_anchor', v);
    }
    /// getset<text-decoration>
    get text_decoration() {
        return this._new_field('text_decoration', new TextValue('none'));
    }
    set text_decoration(v: TextValue) {
        this._new_field('text_decoration', v);
    }
    /// getset<text-overflow>
    get text_overflow() {
        return this._new_field('text_overflow', new TextValue(''));
    }
    set text_overflow(v: TextValue) {
        this._new_field('text_overflow', v);
    }
    /// getset<unicode-bidi>
    get unicode_bidi() {
        return this._new_field('unicode_bidi', new TextValue('normal'));
    }
    set unicode_bidi(v: TextValue) {
        this._new_field('unicode_bidi', v);
    }
    /// getset<white-space>
    get white_space() {
        return this._new_field('white_space', new TextValue('default'));
    }
    set white_space(v: TextValue) {
        this._new_field('white_space', v);
    }
    /// getset<word-spacing>
    get word_spacing() {
        return this._new_field('word_spacing', new TextValue('pre'));
    }
    set word_spacing(v: TextValue) {
        this._new_field('word_spacing', v);
    }
    /// getset<writing-mode>
    get writing_mode() {
        return this._new_field('writing_mode', new TextValue('horizontal-tb'));
    }
    set writing_mode(v: TextValue) {
        this._new_field('writing_mode', v);
    }
    /// getset<text-align>
    get text_align() {
        return this._new_field('text_align', new TextValue('start'));
    }
    set text_align(v: TextValue) {
        this._new_field('text_align', v);
    }
    /// getset<line-height>
    get line_height() {
        return this._new_field('line_height', new FontSizeValue(1));
    }
    set line_height(v: FontSizeValue) {
        this._new_field('line_height', v);
    }
    /// getset<stop-opacity>
    get stop_opacity() {
        return this._new_field('stop_opacity', new PercentageValue(1));
    }
    set stop_opacity(v: PercentageValue) {
        this._new_field('stop_opacity', v);
    }
    /// getset<display>
    get display() {
        return this._new_field('display', new TextValue());
    }
    set display(v: TextValue) {
        this._new_field('display', v);
    }
    /// getset<overflow>
    get overflow() {
        return this._new_field('overflow', new TextValue('visible'));
    }
    set overflow(v: TextValue) {
        this._new_field('overflow', v);
    }
    /// getset<visibility>
    get visibility() {
        return this._new_field('visibility', new TextValue('visible'));
    }
    set visibility(v: TextValue) {
        this._new_field('visibility', v);
    }
    /// getset<image-rendering>
    get image_rendering() {
        return this._new_field('image_rendering', new TextValue('auto'));
    }
    set image_rendering(v: TextValue) {
        this._new_field('image_rendering', v);
    }
    /// getset<shape-rendering>
    get shape_rendering() {
        return this._new_field('shape_rendering', new TextValue('auto'));
    }
    set shape_rendering(v: TextValue) {
        this._new_field('shape_rendering', v);
    }
    /// getset<text-rendering>
    get text_rendering() {
        return this._new_field('text_rendering', new TextValue('auto'));
    }
    set text_rendering(v: TextValue) {
        this._new_field('text_rendering', v);
    }
    /// getset<color-rendering>
    get color_rendering() {
        return this._new_field('color_rendering', new TextValue('auto'));
    }
    set color_rendering(v: TextValue) {
        this._new_field('color_rendering', v);
    }
    /// getset<color-interpolation>
    get color_interpolation() {
        return this._new_field('color_interpolation', new TextValue('auto'));
    }
    set color_interpolation(v: TextValue) {
        this._new_field('color_interpolation', v);
    }
    /// getset<filter>
    get filter() {
        return this._new_field('filter', new TextValue());
    }
    set filter(v: TextValue) {
        this._new_field('filter', v);
    }
    /// getset<letter-spacing>
    get letter_spacing() {
        return this._new_field('letter_spacing', new LengthValue(0));
    }
    set letter_spacing(v: LengthValue) {
        this._new_field('letter_spacing', v);
    }
    /// getset<opacity>
    get opacity() {
        return this._new_field('opacity', new PercentageValue(1));
    }
    set opacity(v: PercentageValue) {
        this._new_field('opacity', v);
    }
    /// getset<pointer-events>
    get pointer_events() {
        return this._new_field('pointer_events', new TextValue('visiblePainted'));
    }
    set pointer_events(v: TextValue) {
        this._new_field('pointer_events', v);
    }
    /// getset<vector-effect>
    get vector_effect() {
        return this._new_field('vector_effect', new TextValue('none'));
    }
    set vector_effect(v: TextValue) {
        this._new_field('vector_effect', v);
    }
    /// Properties ////////////



};

// TODO: dash array, path