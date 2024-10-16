import { Element } from "./base.js";
import { Container } from "./containers.js";
import { ScalarPairValue, LengthYValue, LengthXValue, TextValue, PercentageValue, RGBValue, LengthValue } from "./value.js";
import { Transform } from "./valuesets.js";

export class FilterBase extends Element {
}

export class Stop extends Element {
    static override tag = "stop";
    get offset() { return this._new_field("offset", new PercentageValue(1.0)); }
    get stop_color() { return this._new_field("stop_color", new RGBValue([0, 0, 0])); }
    get path() { return this._new_field("path", new TextValue('')); }
}

export class FEGaussianBlur extends FilterBase {
    static override tag = "feGaussianBlur";
    ///   
    get std_dev() { return this._new_field("std_dev", new ScalarPairValue([0, 0])); }
    get edge_mode() { return this._new_field("edge_mode", new TextValue('duplicate')); }
    get input() { return this._new_field("input", new TextValue('')); }
}

export class FEDropShadow extends FilterBase {
    static override tag = "feDropShadow";
    ///
    get std_dev() { return this._new_field("std_dev", new ScalarPairValue([0, 0])); }
    get dx() { return this._new_field("dx", new LengthXValue(0)); }
    get dy() { return this._new_field("dy", new LengthYValue(0)); }
    get input() { return this._new_field("input", new TextValue('')); }
}

export class LinearGradient extends Container {
    static override tag = "linearGradient";
    get href() { return this._new_field("href", new TextValue('')); }
    get spread() { return this._new_field("spread", new TextValue('pad')); }
    get gradient_units() { return this._new_field("gradient_units", new TextValue('objectBoundingBox')); }
    get gradient_transform() { return this._new_field("gradient_transform", new Transform()); }
    get x1() { return this._new_field("x1", new PercentageValue(0)); }
    get y1() { return this._new_field("y1", new PercentageValue(0)); }
    get x2() { return this._new_field("x2", new PercentageValue(1)); }
    get y2() { return this._new_field("y2", new PercentageValue(0)); }
}

export class RadialGradient extends Container {
    static override tag = "radialGradient";
    get href() { return this._new_field("href", new TextValue('')); }
    get spread() { return this._new_field("spread", new TextValue('pad')); }
    get gradient_units() { return this._new_field("gradient_units", new TextValue('objectBoundingBox')); }
    get gradient_transform() { return this._new_field("gradient_transform", new Transform()); }
    get r() { return this._new_field("r", new LengthValue(0)); }
    get cx() { return this._new_field("cx", new LengthXValue(0)); }
    get cy() { return this._new_field("cy", new LengthYValue(0)); }
    get fx() { return this._new_field("fx", new LengthXValue(0)); }
    get fy() { return this._new_field("fy", new LengthYValue(0)); }
    get fr() { return this._new_field("fr", new LengthYValue(0)); }
}

export class MeshPatch extends Container {
    static override tag = "meshpatch";
}

export class MeshRow extends Container {
    static override tag = "meshrow";
}

export class MeshGradient extends Container {
    static override tag = "meshgradient";
    ////
    get href() { return this._new_field("href", new TextValue('')); }
    get x() { return this._new_field("x", new PercentageValue(0)); }
    get y() { return this._new_field("y", new PercentageValue(0)); }
    get type() { return this._new_field("type", new TextValue('bilinear')); }
    get gradient_units() { return this._new_field("gradient_units", new TextValue('objectBoundingBox')); }
}
