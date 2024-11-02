import { Element } from "../base.js";
import { Image, Use } from "../elements.js";
import { TSpan, Text, Style } from "../elements.js";
import { Group, Symbol, Marker, Mask, Pattern, ClipPath, Defs } from "../elements.js";
import { Container, } from "../containers.js";
import { ViewPort, Polygon, Polyline, Line, Ellipse, Circle, Rect, Path } from "../elements.js";
import { Filter, FEComponentTransfer, FEComposite, FEDropShadow, FEFlood, FEFuncA, FEFuncB, FEFuncG, FEFuncR, FEGaussianBlur, FEMerge, FEMergeNode, FEMorphology, FESpecularLighting, LinearGradient, MeshGradient, MeshPatch, MeshRow, RadialGradient, Stop, FEPointLight, FEDistantLight, FESpotLight, FETile, FEImage, FEOffset, FEBlend, FEDiffuseLighting, FETurbulence, FEDisplacementMap, FEColorMatrix, FEConvolveMatrix } from "../elements.js";

interface AddOpt {
    [key: string]: any;
    before?: Element;
}
/* <INSERT add_elements.ins.ts > */
declare module "../containers" {
    interface Container {
        add_?(params?: AddOpt): Element;
        add_group(params?: AddOpt): Group;
        add_defs(params?: AddOpt): Defs;
        add_symbol(params?: AddOpt): Symbol;
        add_pattern(params?: AddOpt): Pattern;
        add_marker(params?: AddOpt): Marker;
        add_clip_path(params?: AddOpt): ClipPath;
        add_mask(params?: AddOpt): Mask;
        add_view(params?: AddOpt): ViewPort;
        add_use(params?: AddOpt): Use;
        add_image(params?: AddOpt): Image;
        add_fe_component_transfer(params?: AddOpt): FEComponentTransfer;
        add_fe_composite(params?: AddOpt): FEComposite;
        add_fe_distant_light(params?: AddOpt): FEDistantLight;
        add_fe_drop_shadow(params?: AddOpt): FEDropShadow;
        add_fe_flood(params?: AddOpt): FEFlood;
        add_fe_func_a(params?: AddOpt): FEFuncA;
        add_fe_func_b(params?: AddOpt): FEFuncB;
        add_fe_func_g(params?: AddOpt): FEFuncG;
        add_fe_func_r(params?: AddOpt): FEFuncR;
        add_fe_gaussian_blur(params?: AddOpt): FEGaussianBlur;
        add_fe_merge(params?: AddOpt): FEMerge;
        add_fe_merge_node(params?: AddOpt): FEMergeNode;
        add_fe_morphology(params?: AddOpt): FEMorphology;
        add_fe_point_light(params?: AddOpt): FEPointLight;
        add_fe_specular_lighting(params?: AddOpt): FESpecularLighting;
        add_linear_gradient(params?: AddOpt): LinearGradient;
        add_meshgradient(params?: AddOpt): MeshGradient;
        add_meshpatch(params?: AddOpt): MeshPatch;
        add_meshrow(params?: AddOpt): MeshRow;
        add_radial_gradient(params?: AddOpt): RadialGradient;
        add_stop(params?: AddOpt): Stop;
        add_filter(params?: AddOpt): Filter;
        add_circle(params?: AddOpt): Circle;
        add_polyline(params?: AddOpt): Polyline;
        add_rect(params?: AddOpt): Rect;
        add_line(params?: AddOpt): Line;
        add_ellipse(params?: AddOpt): Ellipse;
        add_path(params?: AddOpt): Path;
        add_polygon(params?: AddOpt): Polygon;
        add_style(params?: AddOpt): Style;
        add_tspan(params?: AddOpt): TSpan;
        add_text(params?: AddOpt): Text;
        add_fe_spot_light(params?: AddOpt): FESpotLight;
        add_fe_tile(params?: AddOpt): FETile;
        add_fe_image(params?: AddOpt): FEImage;
        add_fe_offset(params?: AddOpt): FEOffset;
        add_fe_blend(params?: AddOpt): FEBlend;
        add_fe_diffuse_lighting(params?: AddOpt): FEDiffuseLighting;
        add_fe_turbulence(params?: AddOpt): FETurbulence;
        add_fe_displacement_map(params?: AddOpt): FEDisplacementMap;
        add_fe_color_matrix(params?: AddOpt): FEColorMatrix;
        add_fe_convolve_matrix(params?: AddOpt): FEConvolveMatrix;
        ////
        _add_element(name: string): Element;
    }
}

// Container.prototype.add_...
Container.prototype.add_group = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Group.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_defs = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Defs.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_symbol = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Symbol.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_pattern = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Pattern.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_marker = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Marker.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_clip_path = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = ClipPath.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_mask = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Mask.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_view = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = ViewPort.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_use = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Use.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_image = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Image.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_component_transfer = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEComponentTransfer.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_composite = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEComposite.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_distant_light = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEDistantLight.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_drop_shadow = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEDropShadow.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_flood = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEFlood.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_func_a = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEFuncA.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_func_b = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEFuncB.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_func_g = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEFuncG.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_func_r = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEFuncR.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_gaussian_blur = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEGaussianBlur.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_merge = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEMerge.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_merge_node = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEMergeNode.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_morphology = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEMorphology.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_point_light = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEPointLight.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_specular_lighting = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FESpecularLighting.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_linear_gradient = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = LinearGradient.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_meshgradient = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = MeshGradient.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_meshpatch = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = MeshPatch.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_meshrow = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = MeshRow.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_radial_gradient = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = RadialGradient.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_stop = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Stop.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_filter = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Filter.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_circle = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Circle.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_polyline = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Polyline.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_rect = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Rect.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_line = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Line.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_ellipse = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Ellipse.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_path = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Path.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_polygon = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Polygon.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_style = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Style.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_tspan = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = TSpan.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_text = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Text.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_spot_light = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FESpotLight.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_tile = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FETile.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_image = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEImage.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_offset = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEOffset.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_blend = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEBlend.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_diffuse_lighting = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEDiffuseLighting.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_turbulence = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FETurbulence.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_displacement_map = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEDisplacementMap.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_color_matrix = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEColorMatrix.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_convolve_matrix = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEConvolveMatrix.new(etc); this.insert_before(before, x); return x; }

Container.prototype._add_element = function (tag: string, params?: AddOpt) {
    switch (tag) {
        case "g": return this.add_group(params);
        case "defs": return this.add_defs(params);
        case "symbol": return this.add_symbol(params);
        case "pattern": return this.add_pattern(params);
        case "marker": return this.add_marker(params);
        case "clipPath": return this.add_clip_path(params);
        case "mask": return this.add_mask(params);
        case "svg": return this.add_view(params);
        case "use": return this.add_use(params);
        case "image": return this.add_image(params);
        case "feComponentTransfer": return this.add_fe_component_transfer(params);
        case "feComposite": return this.add_fe_composite(params);
        case "feDistantLight": return this.add_fe_distant_light(params);
        case "feDropShadow": return this.add_fe_drop_shadow(params);
        case "feFlood": return this.add_fe_flood(params);
        case "feFuncA": return this.add_fe_func_a(params);
        case "feFuncB": return this.add_fe_func_b(params);
        case "feFuncG": return this.add_fe_func_g(params);
        case "feFuncR": return this.add_fe_func_r(params);
        case "feGaussianBlur": return this.add_fe_gaussian_blur(params);
        case "feMerge": return this.add_fe_merge(params);
        case "feMergeNode": return this.add_fe_merge_node(params);
        case "feMorphology": return this.add_fe_morphology(params);
        case "fePointLight": return this.add_fe_point_light(params);
        case "feSpecularLighting": return this.add_fe_specular_lighting(params);
        case "linearGradient": return this.add_linear_gradient(params);
        case "meshgradient": return this.add_meshgradient(params);
        case "meshpatch": return this.add_meshpatch(params);
        case "meshrow": return this.add_meshrow(params);
        case "radialGradient": return this.add_radial_gradient(params);
        case "stop": return this.add_stop(params);
        case "filter": return this.add_filter(params);
        case "circle": return this.add_circle(params);
        case "polyline": return this.add_polyline(params);
        case "rect": return this.add_rect(params);
        case "line": return this.add_line(params);
        case "ellipse": return this.add_ellipse(params);
        case "path": return this.add_path(params);
        case "polygon": return this.add_polygon(params);
        case "style": return this.add_style(params);
        case "tspan": return this.add_tspan(params);
        case "text": return this.add_text(params);
        case "feSpotLight": return this.add_fe_spot_light(params);
        case "feTile": return this.add_fe_tile(params);
        case "feImage": return this.add_fe_image(params);
        case "feOffset": return this.add_fe_offset(params);
        case "feBlend": return this.add_fe_blend(params);
        case "feDiffuseLighting": return this.add_fe_diffuse_lighting(params);
        case "feTurbulence": return this.add_fe_turbulence(params);
        case "feDisplacementMap": return this.add_fe_displacement_map(params);
        case "feColorMatrix": return this.add_fe_color_matrix(params);
        case "feConvolveMatrix": return this.add_fe_convolve_matrix(params);
    }
    throw new Error("Unexpected tag: " + tag);
}
/* </INSERT> */
//
