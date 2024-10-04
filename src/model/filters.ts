import { Element } from "./base.js";
import { Container } from "./containers.js";
import { VectorValue, BiVectorValue, LengthYValue, LengthXValue, TextValue, PercentageValue, RGBValue, LengthValue } from "./value.js";

export class FilterElement extends Element {
}

export class Stop extends Element {
    /// offset
    get offset() {
        return this._new_field("offset", new PercentageValue(1));
    }
    set offset(v: PercentageValue) {
        this._new_field("opacity", v);
    }
    /// opacity
    get opacity() {
        return this._new_field("opacity", new PercentageValue(1));
    }
    set opacity(v: PercentageValue) {
        this._new_field("opacity", v);
    }
    /// color
    get color() {
        return this._new_field("color", new RGBValue([0, 0, 0]));
    }
    set color(v: RGBValue) {
        this._new_field("color", v);
    }
    /// path
    get path() {
        return this._new_field("path", new TextValue(''));
    }
    set path(v: TextValue) {
        this._new_field("path", v);
    }
}
export class FEGaussianBlur extends FilterElement {
    static override tag = "feGaussianBlur";
    ///   
    get std_dev() {
        return this._new_field("std_dev", new BiVectorValue([0, 0]));
    }
    set std_dev(v: BiVectorValue) {
        this._new_field("std_dev", v);
    }
    ///
    get edge_mode() {
        return this._new_field("edge_mode", new TextValue('duplicate'));
    }
    set edge_mode(v: TextValue) {
        this._new_field("edge_mode", v);
    }
    ///
    get in() {
        return this._new_field("in", new TextValue(''));
    }
    set in(v: TextValue) {
        this._new_field("in", v);
    }
}

export class FEDropShadow extends FilterElement {
    static override tag = "feDropShadow";
    ///
    get std_dev() {
        return this._new_field("std_dev", new VectorValue([0, 0]));
    }
    set std_dev(v: VectorValue) {
        this._new_field("std_dev", v);
    }
    ///
    get dx() {
        return this._new_field("dx", new LengthXValue(0));
    }
    set dx(v: LengthXValue) {
        this._new_field("dx", v);
    }
    ///
    get dy() {
        return this._new_field("dy", new LengthYValue(0));
    }
    set dy(v: LengthYValue) {
        this._new_field("dy", v);
    }
}

export class Gradient extends Container {
    ///
    get spread() {
        return this._new_field("spread", new TextValue('pad'));
    }
    set spread(v: TextValue) {
        this._new_field("spread", v);
    }
    ///
    get gradient_units() {
        return this._new_field("gradient_units", new TextValue("objectBoundingBox"));
    }
    set gradient_units(v: TextValue) {
        this._new_field("gradient_units", v);
    }
    /// href
    get href() {
        return this._new_field("href", new TextValue(''));
    }
    set href(v: TextValue) {
        this._new_field("href", v);
    }
}

export class LinearGradient extends Gradient {
    static override tag = "linearGradient";
    ///
    /// x1
    get x1() {
        return this._new_field("x1", new PercentageValue(0));
    }
    set x1(v: PercentageValue) {
        this._new_field("x1", v);
    }
    /// x2
    get x2() {
        return this._new_field("x2", new PercentageValue(1));
    }
    set x2(v: PercentageValue) {
        this._new_field("x2", v);
    }
    /// x1
    get y1() {
        return this._new_field("y1", new PercentageValue(0));
    }
    set y1(v: PercentageValue) {
        this._new_field("y1", v);
    }
    /// y2
    get y2() {
        return this._new_field("y2", new PercentageValue(1));
    }
    set y2(v: PercentageValue) {
        this._new_field("y2", v);
    }

}

export class RadialGradient extends Gradient {
    static override tag = "radialGradient";
    ///
    get cx() {
        return this._new_field("cx", new LengthXValue(0));
    }
    set cx(v: LengthXValue) {
        this._new_field("cx", v);
    }
    ///
    get cy() {
        return this._new_field("cy", new LengthYValue(0));
    }
    set cy(v: LengthYValue) {
        this._new_field("cy", v);
    }
    ///
    get r() {
        return this._new_field("r", new LengthValue(0));
    }
    set r(v: LengthValue) {
        this._new_field("r", v);
    }
    ///
    get fx() {
        return this._new_field("fx", new LengthXValue(0));
    }
    set fx(v: LengthXValue) {
        this._new_field("fx", v);
    }
    ///
    get fy() {
        return this._new_field("fy", new LengthYValue(0));
    }
    set fy(v: LengthYValue) {
        this._new_field("fy", v);
    }
    ///
    get fr() {
        return this._new_field("fr", new LengthValue(0));
    }
    set fr(v: LengthValue) {
        this._new_field("fr", v);
    }

}

export class MeshPatch extends Container {
    static override tag = "meshpatch";
}

export class MeshRow extends Container {
    static override tag = "meshrow";
}
