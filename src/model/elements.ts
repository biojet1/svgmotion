import { Element, Shape } from "./base.js";
import { PathValue } from "./bezshape.js";
import { Container, Content } from "./containers.js";
import { ScalarPairValue, LengthYValue, LengthXValue, TextValue, PercentageValue, RGBValue, LengthValue, ScalarValue, VectorValue, PointsValue } from "./value.js";
import { Transform, ViewBox } from "./valuesets.js";

/* <INSERT elements2.ins.ts > */
export class Rect extends Shape {
    static override tag = "rect";
    get rx() { return this._new_field("rx", new LengthXValue(0)); }
    get ry() { return this._new_field("ry", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
}
export class Polyline extends Shape {
    static override tag = "polyline";
    get marker_start() { return this._new_field("marker_start", new TextValue('none')); }
    get marker_mid() { return this._new_field("marker_mid", new TextValue('none')); }
    get marker_end() { return this._new_field("marker_end", new TextValue('none')); }
    get points() { return this._new_field("points", new PointsValue([])); }
}
export class Polygon extends Shape {
    static override tag = "polygon";
    get marker_start() { return this._new_field("marker_start", new TextValue('none')); }
    get marker_mid() { return this._new_field("marker_mid", new TextValue('none')); }
    get marker_end() { return this._new_field("marker_end", new TextValue('none')); }
    get points() { return this._new_field("points", new PointsValue([])); }
}
export class Path extends Shape {
    static override tag = "path";
    get marker_start() { return this._new_field("marker_start", new TextValue('none')); }
    get marker_mid() { return this._new_field("marker_mid", new TextValue('none')); }
    get marker_end() { return this._new_field("marker_end", new TextValue('none')); }
    get d() { return this._new_field("d", new PathValue('')); }
}
export class Line extends Shape {
    static override tag = "line";
    get marker_start() { return this._new_field("marker_start", new TextValue('none')); }
    get marker_mid() { return this._new_field("marker_mid", new TextValue('none')); }
    get marker_end() { return this._new_field("marker_end", new TextValue('none')); }
    get x1() { return this._new_field("x1", new LengthXValue(0)); }
    get y1() { return this._new_field("y1", new LengthYValue(0)); }
    get x2() { return this._new_field("x2", new LengthXValue(0)); }
    get y2() { return this._new_field("y2", new LengthYValue(0)); }
}
export class Ellipse extends Shape {
    static override tag = "ellipse";
    get rx() { return this._new_field("rx", new LengthXValue(0)); }
    get ry() { return this._new_field("ry", new LengthYValue(0)); }
    get cx() { return this._new_field("cx", new LengthXValue(0)); }
    get cy() { return this._new_field("cy", new LengthYValue(0)); }
}
export class Circle extends Shape {
    static override tag = "circle";
    get cx() { return this._new_field("cx", new LengthXValue(0)); }
    get cy() { return this._new_field("cy", new LengthYValue(0)); }
    get r() { return this._new_field("r", new LengthValue(0)); }
}
export class Text extends Content {
    static override tag = "text";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get dx() { return this._new_field("dx", new LengthXValue(0)); }
    get dy() { return this._new_field("dy", new LengthYValue(0)); }
}
export class TSpan extends Content {
    static override tag = "tspan";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get dx() { return this._new_field("dx", new LengthXValue(0)); }
    get dy() { return this._new_field("dy", new LengthYValue(0)); }
}
export class Style extends Content {
    static override tag = "style";
    get type() { return this._new_field("type", new TextValue('text/css')); }
}
export class FETurbulence extends Element {
    static override tag = "feTurbulence";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get base_frequency() { return this._new_field("base_frequency", new ScalarPairValue([0, 0])); }
    get num_octaves() { return this._new_field("num_octaves", new ScalarValue(1)); }
    get seed() { return this._new_field("seed", new ScalarValue(0)); }
    get stitch_tiles() { return this._new_field("stitch_tiles", new TextValue('noStitch')); }
    get type() { return this._new_field("type", new TextValue('turbulence')); }
}
export class FETile extends Element {
    static override tag = "feTile";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
}
export class FESpotLight extends Element {
    static override tag = "feSpotLight";
    get x() { return this._new_field("x", new ScalarValue(1)); }
    get y() { return this._new_field("y", new ScalarValue(1)); }
    get z() { return this._new_field("z", new ScalarValue(1)); }
    get points_at_x() { return this._new_field("points_at_x", new ScalarValue(0)); }
    get points_at_y() { return this._new_field("points_at_y", new ScalarValue(0)); }
    get points_at_z() { return this._new_field("points_at_z", new ScalarValue(0)); }
    get specular_exponent() { return this._new_field("specular_exponent", new ScalarValue(1)); }
    get limiting_cone_angle() { return this._new_field("limiting_cone_angle", new ScalarValue(1)); }
}
export class FEPointLight extends Element {
    static override tag = "fePointLight";
    get x() { return this._new_field("x", new ScalarValue(0)); }
    get y() { return this._new_field("y", new ScalarValue(0)); }
    get z() { return this._new_field("z", new ScalarValue(0)); }
}
export class FEOffset extends Element {
    static override tag = "feOffset";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get dx() { return this._new_field("dx", new ScalarValue(0)); }
    get dy() { return this._new_field("dy", new ScalarValue(0)); }
}
export class FEMorphology extends Element {
    static override tag = "feMorphology";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get operator() { return this._new_field("operator", new TextValue('')); }
    get radius() { return this._new_field("radius", new ScalarPairValue([0, 0])); }
}
export class FEMergeNode extends Element {
    static override tag = "feMergeNode";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
}
export class FEImage extends Element {
    static override tag = "feImage";
    get href() { return this._new_field("href", new TextValue('')); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get fit_view() { return this._new_field("fit_view", new TextValue('')); }
    get cross_origin() { return this._new_field("cross_origin", new TextValue('')); }
}
export class FEGaussianBlur extends Element {
    static override tag = "feGaussianBlur";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get std_dev() { return this._new_field("std_dev", new ScalarPairValue([0, 0])); }
    get edge_mode() { return this._new_field("edge_mode", new TextValue('duplicate')); }
}
export class FEFuncR extends Element {
    static override tag = "feFuncR";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
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
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
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
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
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
export class FEFuncA extends Element {
    static override tag = "feFuncA";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
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
export class FEFlood extends Element {
    static override tag = "feFlood";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get flood_opacity() { return this._new_field("flood_opacity", new PercentageValue(1)); }
    get flood_color() { return this._new_field("flood_color", new RGBValue([0, 0, 0])); }
}
export class FEDropShadow extends Element {
    static override tag = "feDropShadow";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get std_dev() { return this._new_field("std_dev", new ScalarPairValue([0, 0])); }
    get dx() { return this._new_field("dx", new LengthXValue(0)); }
    get dy() { return this._new_field("dy", new LengthYValue(0)); }
}
export class FEDistantLight extends Element {
    static override tag = "feDistantLight";
    get azimuth() { return this._new_field("azimuth", new ScalarValue(0)); }
    get elevation() { return this._new_field("elevation", new ScalarValue(0)); }
}
export class FEDisplacementMap extends Element {
    static override tag = "feDisplacementMap";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get input2() { return this._new_field("input2", new TextValue('')); }
    get scale() { return this._new_field("scale", new ScalarValue(0)); }
    get x_channel_selector() { return this._new_field("x_channel_selector", new TextValue('A')); }
    get y_channel_selector() { return this._new_field("y_channel_selector", new TextValue('A')); }
}
export class FEConvolveMatrix extends Element {
    static override tag = "feConvolveMatrix";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get order() { return this._new_field("order", new ScalarPairValue([3, 3])); }
    get kernel_matrix() { return this._new_field("kernel_matrix", new VectorValue([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0])); }
    get divisor() { return this._new_field("divisor", new ScalarValue(1)); }
    get bias() { return this._new_field("bias", new ScalarValue(0)); }
    get target_x() { return this._new_field("target_x", new ScalarValue(0)); }
    get target_y() { return this._new_field("target_y", new ScalarValue(0)); }
    get edge_mode() { return this._new_field("edge_mode", new TextValue('duplicate')); }
    get kernel_unit_length() { return this._new_field("kernel_unit_length", new ScalarPairValue([0, 0])); }
    get preserve_alpha() { return this._new_field("preserve_alpha", new TextValue('false')); }
}
export class FEComposite extends Element {
    static override tag = "feComposite";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
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
export class FEColorMatrix extends Element {
    static override tag = "feColorMatrix";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get type() { return this._new_field("type", new TextValue('matrix')); }
    get values() { return this._new_field("values", new VectorValue([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0])); }
}
export class FEBlend extends Element {
    static override tag = "feBlend";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get input2() { return this._new_field("input2", new TextValue('')); }
    get mode() { return this._new_field("mode", new TextValue('normal')); }
}
export class FESpecularLighting extends Container {
    static override tag = "feSpecularLighting";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
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
export class FEMerge extends Container {
    static override tag = "feMerge";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
}
export class FEDiffuseLighting extends Container {
    static override tag = "feDiffuseLighting";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
    get surface_scale() { return this._new_field("surface_scale", new ScalarValue(1)); }
    get diffuse_constant() { return this._new_field("diffuse_constant", new ScalarValue(1)); }
    get kernel_unit_length() { return this._new_field("kernel_unit_length", new ScalarPairValue([0, 0])); }
}
export class FEComponentTransfer extends Container {
    static override tag = "feComponentTransfer";
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get input() { return this._new_field("input", new TextValue('')); }
    get result() { return this._new_field("result", new TextValue('')); }
}
export class Use extends Element {
    static override tag = "use";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get href() { return this._new_field("href", new TextValue('')); }
}
export class Stop extends Element {
    static override tag = "stop";
    get offset() { return this._new_field("offset", new PercentageValue(1)); }
    get stop_color() { return this._new_field("stop_color", new RGBValue([0, 0, 0])); }
    get path() { return this._new_field("path", new TextValue('')); }
}
export class Image extends Element {
    static override tag = "image";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get href() { return this._new_field("href", new TextValue('')); }
    get fit_view() { return this._new_field("fit_view", new TextValue('')); }
    get cross_origin() { return this._new_field("cross_origin", new TextValue('')); }
}
export class ViewPort extends Container {
    static override tag = "svg";
    get width() { return this._new_field("width", new LengthXValue('100%')); }
    get height() { return this._new_field("height", new LengthYValue('100%')); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get view_box() { return this._new_field("view_box", new ViewBox([0, 0], [100, 100])); }
    get zoom_pan() { return this._new_field("zoom_pan", new TextValue('disable')); }
}
export class Symbol extends Container {
    static override tag = "symbol";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get ref_x() { return this._new_field("ref_x", new LengthXValue(0)); }
    get ref_y() { return this._new_field("ref_y", new LengthYValue(0)); }
    get view_box() { return this._new_field("view_box", new ViewBox([0, 0], [100, 100])); }
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
export class Pattern extends Container {
    static override tag = "pattern";
    get href() { return this._new_field("href", new TextValue('')); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get view_box() { return this._new_field("view_box", new ViewBox([0, 0], [100, 100])); }
    get pattern_units() { return this._new_field("pattern_units", new TextValue('objectBoundingBox')); }
    get pattern_content_units() { return this._new_field("pattern_content_units", new TextValue('userSpaceOnUse')); }
    get pattern_transform() { return this._new_field("pattern_transform", new TextValue('')); }
}
export class MeshRow extends Container {
    static override tag = "meshrow";
}
export class MeshPatch extends Container {
    static override tag = "meshpatch";
}
export class MeshGradient extends Container {
    static override tag = "meshgradient";
    get href() { return this._new_field("href", new TextValue('')); }
    get x() { return this._new_field("x", new PercentageValue(0)); }
    get y() { return this._new_field("y", new PercentageValue(0)); }
    get type() { return this._new_field("type", new TextValue('bilinear')); }
    get gradient_units() { return this._new_field("gradient_units", new TextValue('objectBoundingBox')); }
}
export class Mask extends Container {
    static override tag = "mask";
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get mask_units() { return this._new_field("mask_units", new TextValue('objectBoundingBox')); }
    get mask_content_units() { return this._new_field("mask_content_units", new TextValue('userSpaceOnUse')); }
}
export class Marker extends Container {
    static override tag = "marker";
    get ref_x() { return this._new_field("ref_x", new LengthXValue(0)); }
    get ref_y() { return this._new_field("ref_y", new LengthYValue(0)); }
    get view_box() { return this._new_field("view_box", new ViewBox([0, 0], [100, 100])); }
    get marker_units() { return this._new_field("marker_units", new TextValue('strokeWidth')); }
    get marker_width() { return this._new_field("marker_width", new LengthXValue(3)); }
    get marker_height() { return this._new_field("marker_height", new LengthYValue(3)); }
    get orient() { return this._new_field("orient", new LengthValue(0)); }
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
export class Group extends Container {
    static override tag = "g";
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
export class Defs extends Container {
    static override tag = "defs";
}
export class ClipPath extends Container {
    static override tag = "clipPath";
    get clip_path_units() { return this._new_field("clip_path_units", new TextValue('userSpaceOnUse')); }
}
/* </INSERT> */
