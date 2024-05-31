import { NVector, NumberValue, PositionValue, TextValue } from "./value.js";
import { Fill, Transform, xset, xget, Font, Stroke } from "./valuesets.js";
import { Node, Parent } from "./linked.js";
export type Constructor = (new (...args: any[]) => Parent) | (new (...args: any[]) => Node);
export function BaseProps<TBase extends Constructor>(Base: TBase) {
    return class BaseProps extends Base {
        id?: string;

        static tag = '?';
        ///
        get prop5() {
            return xget(this, "prop5", new NumberValue(45));
        }
        set prop5(v: NumberValue) {
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
            return xget(this, "opacity", new NumberValue(1));
        }
        set opacity(v: NumberValue) {
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
            return xget(this, "line_height", new NumberValue(1));
        }
        set line_height(v: NumberValue) {
            xset(this, "line_height", v);
        }
        /// text-align
        get text_align() {
            return xget(this, "text_align", new TextValue('center'));
        }
        set text_align(v: TextValue) {
            xset(this, "text_align", v);
        }
        /// white-space
        get white_space() {
            return xget(this, "white_space", new TextValue('pre'));
        }
        set white_space(v: TextValue) {
            xset(this, "white_space", v);
        }
        /// anchor
        get anchor() {
            return xget(this, "anchor", new PositionValue(new NVector([0, 0])));
        }
        set anchor(v: TextValue | PositionValue) {
            xset(this, "anchor", v);
        }
        //

    };
}

