import { Vector, ScalarValue, PositionValue, TextValue, UnicodeBidiValue, WritingModeValue } from "./value.js";
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
        /// getset<unicode-bidi>
        get unicode_bidi() {
            return xget(this, 'unicode_bidi', new UnicodeBidiValue('normal'));
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
            return xget(this, 'visibility', new TextValue('visible'));
        }
        set visibility(v: TextValue) {
            xset(this, 'visibility', v);
        }
        /// getset<white-space>
        get white_space() {
            return xget(this, 'white_space', new TextValue('normal'));
        }
        set white_space(v: TextValue) {
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
            return xget(this, 'writing_mode', new WritingModeValue('horizontal-tb'));
        }
        set writing_mode(v: WritingModeValue) {
            xset(this, 'writing_mode', v);
        }


    };
}

/*
alignment-baseline, baseline-shift, clip, clip-path, clip-rule, color, color-interpolation, color-interpolation-filters, color-rendering, cursor, direction, display, dominant-baseline, fill-opacity, fill-rule, filter, flood-color, flood-opacity, font-family, font-size, font-size-adjust, font-stretch, font-style, font-variant, font-weight, glyph-orientation-horizontal, glyph-orientation-vertical, image-rendering, letter-spacing, lighting-color, marker-end, marker-mid, marker-start, mask, opacity, overflow, pointer-events, shape-rendering, solid-color, solid-opacity, stop-color, stop-opacity, stroke, stroke-dasharray, stroke-dashoffset, stroke-linecap, stroke-linejoin, stroke-miterlimit, stroke-opacity, stroke-width, text-anchor, text-decoration, text-overflow, text-rendering,
, vector-effect, visibility, word-spacing, writing-mode
*/