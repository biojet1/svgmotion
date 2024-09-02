import { Matrix, BoundingBox } from "../geom/index.js";
import { ScalarValue, PositionValue, TextValue, EnumTextValue, PercentageValue } from "./value.js";
import { Fill, Transform, xset, xget, Font, Stroke, ValueSet } from "./valuesets.js";
import { Node, Parent } from "./linked.js";
import { Animatable } from "./value.js";
/// @@@ //////////
export class TextData extends Node {
    id?: string;
    get content() {
        return xget(this, "content", new TextValue(''));
    }
    set content(v: TextValue) {
        xset(this, "content", v);
    }
}

export class Element extends Parent {
    id?: string;
    static tag = '?';


    cat_transform(frame: number, n: Matrix) {
        if (Object.hasOwn(this, "transform")) {
            this.transform.cat_transform(frame, n);
        }
    }
    *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            } else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
    }
    update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {

    }
    bounding_box(frame: number, m?: Matrix) {
        const bb = BoundingBox.not();
        this.update_bbox(bb, frame, m);
        return bb
    }
    *ancestors() {
        let top = this._parent;
        while (top) {
            yield top
            top = top._parent;
        }
    }
    protected _new_field<T extends Animatable<any> | ValueSet>(name: string, value: T): T {
        const v = xget(this, name, value);
        value._parent = this;
        return value;
    }
    /// fill
    get fill() {
        return this._new_field("fill", new Fill());
    }
    set fill(v: Fill) {
        this._new_field("fill", v);
    }
    /// stroke
    get stroke() {
        return this._new_field("stroke", new Stroke());
    }
    set stroke(v: Stroke) {
        this._new_field("stroke", v);
    }
    /// Font
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
    // line_height
    get line_height() {
        return this._new_field("line_height", new ScalarValue(1));
    }
    set line_height(v: ScalarValue) {
        this._new_field("line_height", v);
    }
    /// anchor
    get anchor() {
        return this._new_field("anchor", new PositionValue([0, 0]));
    }
    set anchor(v: TextValue | PositionValue) {
        this._new_field("anchor", v);
    }
    /// Properties ////////////
    /// getset<font-size>
    get font_size() {
        return this._new_field('font_size', new LengthValue(16));
    }
    set font_size(v: LengthValue) {
        this._new_field('font_size', v);
    }
    /// getset<text-anchor>
    get text_anchor() {
        return this._new_field('text_anchor', new TextAnchorValue());
    }
    set text_anchor(v: TextAnchorValue) {
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
        return this._new_field('text_overflow', new TextValue('clip'));
    }
    set text_overflow(v: TextValue) {
        this._new_field('text_overflow', v);
    }
    /// getset<text-rendering>
    get text_rendering() {
        return this._new_field('text_rendering', new TextRenderingValue());
    }
    set text_rendering(v: TextRenderingValue) {
        this._new_field('text_rendering', v);
    }
    /// getset<stop-opacity>
    get stop_opacity() {
        return this._new_field('stop_opacity', new PercentageValue(1));
    }
    set stop_opacity(v: PercentageValue) {
        this._new_field('stop_opacity', v);
    }
    /// getset<image-rendering>
    get image_rendering() {
        return this._new_field('image_rendering', new ImageRenderingValue());
    }
    set image_rendering(v: ImageRenderingValue) {
        this._new_field('image_rendering', v);
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
    /// getset<shape-rendering>
    get shape_rendering() {
        return this._new_field('shape_rendering', new ShapeRenderingValue());
    }
    set shape_rendering(v: ShapeRenderingValue) {
        this._new_field('shape_rendering', v);
    }
    /// getset<stroke-dashoffset>
    get stroke_dashoffset() {
        return this._new_field('stroke_dashoffset', new LengthValue(0));
    }
    set stroke_dashoffset(v: LengthValue) {
        this._new_field('stroke_dashoffset', v);
    }
    /// getset<stroke-linecap>
    get stroke_linecap() {
        return this._new_field('stroke_linecap', new StrokeLinecapValue());
    }
    set stroke_linecap(v: StrokeLinecapValue) {
        this._new_field('stroke_linecap', v);
    }
    /// getset<stroke-linejoin>
    get stroke_linejoin() {
        return this._new_field('stroke_linejoin', new StrokeLinejoinValue());
    }
    set stroke_linejoin(v: StrokeLinejoinValue) {
        this._new_field('stroke_linejoin', v);
    }
    /// getset<stroke-miterlimit>
    get stroke_miterlimit() {
        return this._new_field('stroke_miterlimit', new ScalarValue(4));
    }
    set stroke_miterlimit(v: ScalarValue) {
        this._new_field('stroke_miterlimit', v);
    }
    /// getset<stroke-opacity>
    get stroke_opacity() {
        return this._new_field('stroke_opacity', new PercentageValue(1));
    }
    set stroke_opacity(v: PercentageValue) {
        this._new_field('stroke_opacity', v);
    }
    /// getset<stroke-width>
    get stroke_width() {
        return this._new_field('stroke_width', new LengthValue(1));
    }
    set stroke_width(v: LengthValue) {
        this._new_field('stroke_width', v);
    }
    /// getset<unicode-bidi>
    get unicode_bidi() {
        return this._new_field('unicode_bidi', new UnicodeBidiValue());
    }
    set unicode_bidi(v: UnicodeBidiValue) {
        this._new_field('unicode_bidi', v);
    }
    /// getset<vector-effect>
    get vector_effect() {
        return this._new_field('vector_effect', new TextValue('none'));
    }
    set vector_effect(v: TextValue) {
        this._new_field('vector_effect', v);
    }
    /// getset<visibility>
    get visibility() {
        return this._new_field('visibility', new VisibilityValue());
    }
    set visibility(v: VisibilityValue) {
        this._new_field('visibility', v);
    }
    /// getset<white-space>
    get white_space() {
        return this._new_field('white_space', new WhiteSpaceValue());
    }
    set white_space(v: WhiteSpaceValue) {
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
        return this._new_field('writing_mode', new WritingModeValue());
    }
    set writing_mode(v: WritingModeValue) {
        this._new_field('writing_mode', v);
    }
    /// getset<text-align>
    get text_align() {
        return this._new_field('text_align', new TextAlignValue());
    }
    set text_align(v: TextAlignValue) {
        this._new_field('text_align', v);
    }
    /// Properties ////////////




};

/// EnumTextValue ////////////
export class ImageRenderingValue extends EnumTextValue {
    static _values = ['auto', 'smooth', 'high-quality', 'pixelated', 'crisp-edges'];
    constructor(x: string = 'auto') {
        super(x)
        this.check_value(x)
    }
}

export class ShapeRenderingValue extends EnumTextValue {
    static _values = ['auto', 'optimizeSpeed', 'crispEdges', 'geometricPrecision'];
    constructor(x: string = 'auto') {
        super(x)
        this.check_value(x)
    }
}

export class StrokeLinecapValue extends EnumTextValue {
    static _values = ['butt', 'round', 'square'];
    constructor(x: string = 'butt') {
        super(x)
        this.check_value(x)
    }
}

export class StrokeLinejoinValue extends EnumTextValue {
    static _values = ['miter', 'miter-clip', 'round', 'bevel', 'arcs'];
    constructor(x: string = 'miter') {
        super(x)
        this.check_value(x)
    }
}

export class TextAnchorValue extends EnumTextValue {
    static _values = ['start', 'middle', 'end'];
    constructor(x: string = 'start') {
        super(x)
        this.check_value(x)
    }
}

export class TextRenderingValue extends EnumTextValue {
    static _values = ['auto', 'optimizeSpeed', 'optimizeLegibility', 'geometricPrecision'];
    constructor(x: string = 'auto') {
        super(x)
        this.check_value(x)
    }
}

export class UnicodeBidiValue extends EnumTextValue {
    static _values = ['normal', 'embed', 'isolate', 'bidi-override', 'isolate-override', 'plaintext'];
    constructor(x: string = 'normal') {
        super(x)
        this.check_value(x)
    }
}

export class VisibilityValue extends EnumTextValue {
    static _values = ['visible', 'hidden', 'collapse'];
    constructor(x: string = 'visible') {
        super(x)
        this.check_value(x)
    }
}

export class WhiteSpaceValue extends EnumTextValue {
    static _values = ['normal', 'pre', 'nowrap', 'pre-wrap', 'pre-line'];
    constructor(x: string = 'normal') {
        super(x)
        this.check_value(x)
    }
}

export class WritingModeValue extends EnumTextValue {
    static _values = ['horizontal-tb', 'vertical-rl', 'vertical-lr'];
    constructor(x: string = 'horizontal-tb') {
        super(x)
        this.check_value(x)
    }
}

export class TextAlignValue extends EnumTextValue {
    static _values = ['start', 'end', 'left', 'right', 'center', 'justify', 'match-parent', 'justify-all'];
    constructor(x: string = 'start') {
        super(x)
        this.check_value(x)
    }
}

/// EnumTextValue ////////////


export class LengthWValue extends ScalarValue {
}

export class LengthHValue extends ScalarValue {
}

export class LengthValue extends ScalarValue {
}
// TODO: dash array, path