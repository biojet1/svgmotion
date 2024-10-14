import { Element } from "../base.js";
import { Image, Use } from "../elements.js";
import { TSpan, Text } from "../text.js";
import { Container, Group, Symbol, Filter, Marker, Mask, Pattern, ClipPath, Defs } from "../containers.js";
import { ViewPort } from "../viewport.js";
import { Ellipse, Circle, Polyline, Polygon, Rect, Path, Line, } from "../shapes.js";
import { FEDropShadow, FEGaussianBlur, LinearGradient, MeshGradient, MeshPatch, MeshRow, RadialGradient, Stop } from "../filters.js";

interface AddOpt {
    [key: string]: any;
    before?: Element;
}
/* <INSERT add_elements.ins.ts > */
declare module "../containers" {
    interface Container {
        add_group(params?: AddOpt): Group;
        add_defs(params?: AddOpt): Defs;
        add_filter(params?: AddOpt): Filter;
        add_symbol(params?: AddOpt): Symbol;
        add_pattern(params?: AddOpt): Pattern;
        add_marker(params?: AddOpt): Marker;
        add_clip_path(params?: AddOpt): ClipPath;
        add_mask(params?: AddOpt): Mask;
        add_view(params?: AddOpt): ViewPort;
        add_use(params?: AddOpt): Use;
        add_image(params?: AddOpt): Image;
        add_fe_drop_shadow(params?: AddOpt): FEDropShadow;
        add_fe_gaussian_blur(params?: AddOpt): FEGaussianBlur;
        add_linear_gradient(params?: AddOpt): LinearGradient;
        add_meshgradient(params?: AddOpt): MeshGradient;
        add_meshpatch(params?: AddOpt): MeshPatch;
        add_meshrow(params?: AddOpt): MeshRow;
        add_radial_gradient(params?: AddOpt): RadialGradient;
        add_stop(params?: AddOpt): Stop;
        add_circle(params?: AddOpt): Circle;
        add_polyline(params?: AddOpt): Polyline;
        add_rect(params?: AddOpt): Rect;
        add_line(params?: AddOpt): Line;
        add_ellipse(params?: AddOpt): Ellipse;
        add_path(params?: AddOpt): Path;
        add_polygon(params?: AddOpt): Polygon;
        add_tspan(params?: AddOpt): TSpan;
        add_text(params?: AddOpt): Text;
        ////
        _add_element(name: string): Element;
    }
}

// Container.prototype.add_...
Container.prototype.add_group = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Group.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_defs = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Defs.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_filter = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Filter.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_symbol = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Symbol.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_pattern = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Pattern.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_marker = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Marker.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_clip_path = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = ClipPath.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_mask = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Mask.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_view = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = ViewPort.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_use = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Use.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_image = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Image.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_drop_shadow = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEDropShadow.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_fe_gaussian_blur = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEGaussianBlur.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_linear_gradient = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = LinearGradient.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_meshgradient = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = MeshGradient.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_meshpatch = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = MeshPatch.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_meshrow = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = MeshRow.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_radial_gradient = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = RadialGradient.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_stop = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Stop.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_circle = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Circle.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_polyline = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Polyline.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_rect = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Rect.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_line = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Line.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_ellipse = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Ellipse.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_path = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Path.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_polygon = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Polygon.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_tspan = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = TSpan.new(etc); this.insert_before(before, x); return x; }
Container.prototype.add_text = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Text.new(etc); this.insert_before(before, x); return x; }

Container.prototype._add_element = function (tag: string, params?: AddOpt) {
    switch (tag) {
        case "g": return this.add_group(params);
        case "defs": return this.add_defs(params);
        case "filter": return this.add_filter(params);
        case "symbol": return this.add_symbol(params);
        case "pattern": return this.add_pattern(params);
        case "marker": return this.add_marker(params);
        case "clipPath": return this.add_clip_path(params);
        case "mask": return this.add_mask(params);
        case "svg": return this.add_view(params);
        case "use": return this.add_use(params);
        case "image": return this.add_image(params);
        case "feDropShadow": return this.add_fe_drop_shadow(params);
        case "feGaussianBlur": return this.add_fe_gaussian_blur(params);
        case "linearGradient": return this.add_linear_gradient(params);
        case "meshgradient": return this.add_meshgradient(params);
        case "meshpatch": return this.add_meshpatch(params);
        case "meshrow": return this.add_meshrow(params);
        case "radialGradient": return this.add_radial_gradient(params);
        case "stop": return this.add_stop(params);
        case "circle": return this.add_circle(params);
        case "polyline": return this.add_polyline(params);
        case "rect": return this.add_rect(params);
        case "line": return this.add_line(params);
        case "ellipse": return this.add_ellipse(params);
        case "path": return this.add_path(params);
        case "polygon": return this.add_polygon(params);
        case "tspan": return this.add_tspan(params);
        case "text": return this.add_text(params);
    }
    throw new Error("Unexpected tag: " + tag);
}
/* </INSERT> */
//
