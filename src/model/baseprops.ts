import { ScalarValue, PositionValue, TextValue, EnumTextValue, LengthValue, PercentageValue } from "./value.js";
import { Fill, Transform, xset, xget, Font, Stroke } from "./valuesets.js";
import { Node, Parent } from "./linked.js";
import { Matrix, MatrixMut } from "../geom/matrix.js";
import { BoundingBox } from "../geom/bbox.js";
export type Constructor = (new (...args: any[]) => Parent) | (new (...args: any[]) => Node);
export function BaseProps<TBase extends Constructor>(Base: TBase) {
    return class BaseProps extends Base {
        id?: string;
        static tag = '?';
        cat_transform(frame: number, n: Matrix) {
            if (Object.hasOwn(this, "transform")) {
                this.transform.cat_transform(frame, n);
            }
        }

        update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {

        }
        bounding_box(frame: number, m?: Matrix) {
            const bb = BoundingBox.not();
            this.update_bbox(bb, frame, m);
            return bb
        }

        // def update_bbox(self, bb: BoundingBox, time: float, tm: Optional[Matrix] = None):
        // # raise NotImplementedError(f"{self.__class__.__name__}")
        // # print("update_bbox:", f"{self.__class__.__name__}")
        // return
        /// fill
        get fill() {
            return xget(this, "fill", new Fill());
        }
        set fill(v: Fill) {
            xset(this, "fill", v);
        }
        /// stroke
        get stroke() {
            return xget(this, "stroke", new Stroke());
        }
        set stroke(v: Stroke) {
            xset(this, "stroke", v);
        }
        /// Font
        get font() {
            return xget(this, "font", new Font());
        }
        set font(v: Font) {
            xset(this, "font", v);
        }
        /// transform
        get transform() {
            return xget(this, "transform", new Transform());
        }
        set transform(v: Transform) {
            xset(this, "transform", v);
        }
        // line_height
        get line_height() {
            return xget(this, "line_height", new ScalarValue(1));
        }
        set line_height(v: ScalarValue) {
            xset(this, "line_height", v);
        }


        /// anchor
        get anchor() {
            return xget(this, "anchor", new PositionValue([0, 0]));
        }
        set anchor(v: TextValue | PositionValue) {
            xset(this, "anchor", v);
        }
        /// Properties ////////////
        /// getset<image-rendering>
        get image_rendering() {
            return xget(this, 'image_rendering', new ImageRenderingValue());
        }
        set image_rendering(v: ImageRenderingValue) {
            xset(this, 'image_rendering', v);
        }
        /// getset<opacity>
        get opacity() {
            return xget(this, 'opacity', new PercentageValue(1));
        }
        set opacity(v: PercentageValue) {
            xset(this, 'opacity', v);
        }
        /// getset<shape-rendering>
        get shape_rendering() {
            return xget(this, 'shape_rendering', new ShapeRenderingValue());
        }
        set shape_rendering(v: ShapeRenderingValue) {
            xset(this, 'shape_rendering', v);
        }
        /// getset<stop-opacity>
        get stop_opacity() {
            return xget(this, 'stop_opacity', new PercentageValue(1));
        }
        set stop_opacity(v: PercentageValue) {
            xset(this, 'stop_opacity', v);
        }
        /// getset<stroke-dashoffset>
        get stroke_dashoffset() {
            return xget(this, 'stroke_dashoffset', new LengthValue(0));
        }
        set stroke_dashoffset(v: LengthValue) {
            xset(this, 'stroke_dashoffset', v);
        }
        /// getset<stroke-linecap>
        get stroke_linecap() {
            return xget(this, 'stroke_linecap', new StrokeLinecapValue());
        }
        set stroke_linecap(v: StrokeLinecapValue) {
            xset(this, 'stroke_linecap', v);
        }
        /// getset<stroke-linejoin>
        get stroke_linejoin() {
            return xget(this, 'stroke_linejoin', new StrokeLinejoinValue());
        }
        set stroke_linejoin(v: StrokeLinejoinValue) {
            xset(this, 'stroke_linejoin', v);
        }
        /// getset<stroke-miterlimit>
        get stroke_miterlimit() {
            return xget(this, 'stroke_miterlimit', new ScalarValue(4));
        }
        set stroke_miterlimit(v: ScalarValue) {
            xset(this, 'stroke_miterlimit', v);
        }
        /// getset<stroke-opacity>
        get stroke_opacity() {
            return xget(this, 'stroke_opacity', new PercentageValue(1));
        }
        set stroke_opacity(v: PercentageValue) {
            xset(this, 'stroke_opacity', v);
        }
        /// getset<stroke-width>
        get stroke_width() {
            return xget(this, 'stroke_width', new LengthValue(1));
        }
        set stroke_width(v: LengthValue) {
            xset(this, 'stroke_width', v);
        }
        /// getset<text-anchor>
        get text_anchor() {
            return xget(this, 'text_anchor', new TextAnchorValue());
        }
        set text_anchor(v: TextAnchorValue) {
            xset(this, 'text_anchor', v);
        }
        /// getset<text-decoration>
        get text_decoration() {
            return xget(this, 'text_decoration', new TextValue('none'));
        }
        set text_decoration(v: TextValue) {
            xset(this, 'text_decoration', v);
        }
        /// getset<text-overflow>
        get text_overflow() {
            return xget(this, 'text_overflow', new TextValue('clip'));
        }
        set text_overflow(v: TextValue) {
            xset(this, 'text_overflow', v);
        }
        /// getset<text-rendering>
        get text_rendering() {
            return xget(this, 'text_rendering', new TextRenderingValue());
        }
        set text_rendering(v: TextRenderingValue) {
            xset(this, 'text_rendering', v);
        }
        /// getset<unicode-bidi>
        get unicode_bidi() {
            return xget(this, 'unicode_bidi', new UnicodeBidiValue());
        }
        set unicode_bidi(v: UnicodeBidiValue) {
            xset(this, 'unicode_bidi', v);
        }
        /// getset<vector-effect>
        get vector_effect() {
            return xget(this, 'vector_effect', new TextValue('none'));
        }
        set vector_effect(v: TextValue) {
            xset(this, 'vector_effect', v);
        }
        /// getset<visibility>
        get visibility() {
            return xget(this, 'visibility', new VisibilityValue());
        }
        set visibility(v: VisibilityValue) {
            xset(this, 'visibility', v);
        }
        /// getset<white-space>
        get white_space() {
            return xget(this, 'white_space', new WhiteSpaceValue());
        }
        set white_space(v: WhiteSpaceValue) {
            xset(this, 'white_space', v);
        }
        /// getset<word-spacing>
        get word_spacing() {
            return xget(this, 'word_spacing', new TextValue('pre'));
        }
        set word_spacing(v: TextValue) {
            xset(this, 'word_spacing', v);
        }
        /// getset<writing-mode>
        get writing_mode() {
            return xget(this, 'writing_mode', new WritingModeValue());
        }
        set writing_mode(v: WritingModeValue) {
            xset(this, 'writing_mode', v);
        }
        /// getset<text-align>
        get text_align() {
            return xget(this, 'text_align', new TextAlignValue());
        }
        set text_align(v: TextAlignValue) {
            xset(this, 'text_align', v);
        }
        /// Properties ////////////






    };
}

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

// TODO: dash array, path