import { Vector, ScalarValue, PositionValue, TextValue, EnumTextValue } from "./value.js";
import { Fill, Transform, xset, xget, Font, Stroke } from "./valuesets.js";
import { Node, Parent } from "./linked.js";
export type Constructor = (new (...args: any[]) => Parent) | (new (...args: any[]) => Node);
export function BaseProps<TBase extends Constructor>(Base: TBase) {
    return class BaseProps extends Base {
        id?: string;

        static tag = '?';
        ///
        get prop5() {
            return xget(this, "prop5", new ScalarValue(45));
        }
        set prop5(v: ScalarValue) {
            xset(this, "prop5", v);
        }
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

        /// opacity
        get opacity() {
            return xget(this, "opacity", new ScalarValue(1));
        }
        set opacity(v: ScalarValue) {
            xset(this, "opacity", v);
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
        /// text-align
        get text_align() {
            return xget(this, "text_align", new TextValue('center'));
        }
        set text_align(v: TextValue) {
            xset(this, "text_align", v);
        }

        /// anchor
        get anchor() {
            return xget(this, "anchor", new PositionValue([0, 0]));
        }
        set anchor(v: TextValue | PositionValue) {
            xset(this, "anchor", v);
        }
        ////////
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

    };
}

/// EnumTextValue ////////////
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


