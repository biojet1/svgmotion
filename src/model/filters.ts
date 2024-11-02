import { Element } from "./base.js";
import { Container } from "./containers.js";
import { ScalarPairValue, LengthYValue, LengthXValue, TextValue, PercentageValue, RGBValue, LengthValue, ScalarValue, VectorValue } from "./value.js";
import { Transform } from "./valuesets.js";

export class Stop extends Element {
    static override tag = "stop";
    get offset() { return this._new_field("offset", new PercentageValue(1.0)); }
    get stop_color() { return this._new_field("stop_color", new RGBValue([0, 0, 0])); }
    get path() { return this._new_field("path", new TextValue('')); }
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



export class Filter extends Container {
    static override tag = "filter";
    get primitive_units() { return this._new_field("primitive_units", new TextValue('userSpaceOnUse')); }
    get filter_units() { return this._new_field("filter_units", new TextValue('objectBoundingBox')); }
    get x() { return this._new_field("x", new TextValue('-10%')); }
    get y() { return this._new_field("y", new TextValue('-10%')); }
    get width() { return this._new_field("width", new TextValue('120%')); }
    get height() { return this._new_field("height", new TextValue('120%')); }
}
//###########
export class FEComponentTransfer extends Container {
    static override tag = "feComponentTransfer";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
}
export class FEComposite extends Element {
    static override tag = "feComposite";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get input2() { return this._new_field("input2", new TextValue('')); }
    get operator() { return this._new_field("operator", new TextValue('')); }
    get k1() { return this._new_field("k1", new ScalarValue(0)); }
    get k2() { return this._new_field("k2", new ScalarValue(0)); }
    get k3() { return this._new_field("k3", new ScalarValue(0)); }
    get k4() { return this._new_field("k4", new ScalarValue(0)); }
}



export class FEDropShadow extends Element {
    static override tag = "feDropShadow";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get std_dev() { return this._new_field("std_dev", new ScalarPairValue([0, 0])); }
    get dx() { return this._new_field("dx", new LengthXValue(0)); }
    get dy() { return this._new_field("dy", new LengthYValue(0)); }
}
export class FEFlood extends Element {
    static override tag = "feFlood";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get flood_opacity() { return this._new_field("flood_opacity", new PercentageValue(1.0)); }
    get flood_color() { return this._new_field("flood_color", new RGBValue([0, 0, 0])); }
}
export class FEFuncA extends Element {
    static override tag = "feFuncA";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get type() { return this._new_field("type", new TextValue('identity')); }
    get slope() { return this._new_field("slope", new ScalarValue(1)); }
    get intercept() { return this._new_field("intercept", new ScalarValue(1)); }
    get amplitude() { return this._new_field("amplitude", new ScalarValue(1)); }
    get exponent() { return this._new_field("exponent", new ScalarValue(1)); }
    get offset() { return this._new_field("offset", new ScalarValue(0)); }
    get table_values() { return this._new_field("table_values", new VectorValue([0])); }
}
export class FEFuncB extends Element {
    static override tag = "feFuncB";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get type() { return this._new_field("type", new TextValue('identity')); }
    get slope() { return this._new_field("slope", new ScalarValue(1)); }
    get intercept() { return this._new_field("intercept", new ScalarValue(1)); }
    get amplitude() { return this._new_field("amplitude", new ScalarValue(1)); }
    get exponent() { return this._new_field("exponent", new ScalarValue(1)); }
    get offset() { return this._new_field("offset", new ScalarValue(0)); }
    get table_values() { return this._new_field("table_values", new VectorValue([0])); }
}
export class FEFuncG extends Element {
    static override tag = "feFuncG";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get type() { return this._new_field("type", new TextValue('identity')); }
    get slope() { return this._new_field("slope", new ScalarValue(1)); }
    get intercept() { return this._new_field("intercept", new ScalarValue(1)); }
    get amplitude() { return this._new_field("amplitude", new ScalarValue(1)); }
    get exponent() { return this._new_field("exponent", new ScalarValue(1)); }
    get offset() { return this._new_field("offset", new ScalarValue(0)); }
    get table_values() { return this._new_field("table_values", new VectorValue([0])); }
}
export class FEFuncR extends Element {
    static override tag = "feFuncR";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get type() { return this._new_field("type", new TextValue('identity')); }
    get slope() { return this._new_field("slope", new ScalarValue(1)); }
    get intercept() { return this._new_field("intercept", new ScalarValue(1)); }
    get amplitude() { return this._new_field("amplitude", new ScalarValue(1)); }
    get exponent() { return this._new_field("exponent", new ScalarValue(1)); }
    get offset() { return this._new_field("offset", new ScalarValue(0)); }
    get table_values() { return this._new_field("table_values", new VectorValue([0])); }
}


export class FEGaussianBlur extends Element {
    static override tag = "feGaussianBlur";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get std_dev() { return this._new_field("std_dev", new ScalarPairValue([0, 0])); }
    get edge_mode() { return this._new_field("edge_mode", new TextValue('duplicate')); }
}
export class FEMerge extends Container {
    static override tag = "feMerge";
}
export class FEMergeNode extends Element {
    static override tag = "feMergeNode";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
}
export class FEMorphology extends Element {
    static override tag = "feMorphology";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get operator() { return this._new_field("operator", new TextValue('')); }
    get radius() { return this._new_field("radius", new ScalarPairValue([0, 0])); }
}
export class FESpecularLighting extends Container {
    static override tag = "feSpecularLighting";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get surface_scale() { return this._new_field("surface_scale", new ScalarValue(1)); }
    get specular_constant() { return this._new_field("specular_constant", new ScalarValue(1)); }
    get specular_exponent() { return this._new_field("specular_exponent", new ScalarValue(1)); }
    get kernel_unit_length() { return this._new_field("kernel_unit_length", new ScalarValue(1)); }
    get lighting_color() { return this._new_field("lighting_color", new RGBValue([1, 1, 1])); }
}
export class FEPointLight extends Element {
    static override tag = "fePointLight";
    get x() { return this._new_field("x", new ScalarValue(0)); }
    get y() { return this._new_field("y", new ScalarValue(0)); }
    get z() { return this._new_field("z", new ScalarValue(0)); }
}
export class FEDistantLight extends Element {
    static override tag = "feDistantLight";
    get azimuth() { return this._new_field("azimuth", new ScalarValue(0)); }
    get elevation() { return this._new_field("elevation", new ScalarValue(0)); }
}
