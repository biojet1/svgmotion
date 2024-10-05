import { Element } from "../base.js";
import { Image, Use } from "../elements.js";
import { TSpan, Text } from "../text.js";
import { Container, Group, Symbol, Filter, Marker, Mask, Pattern, ClipPath } from "../containers.js";
import { ViewPort } from "../viewport.js";
import { Ellipse, Circle, Polyline, Polygon, Rect, Path, Line, } from "../shapes.js";
import { FEDropShadow, FEGaussianBlur, LinearGradient, MeshPatch, MeshRow, RadialGradient } from "../filters.js";

interface AddOpt {
    [key: string]: any;
    before?: Element;
}

declare module "../containers" {
    interface Container {
        add_circle(params?: AddOpt): Circle;
        add_clip_path(params?: AddOpt): ClipPath;
        add_drop_shadow(params?: AddOpt): FEDropShadow;
        add_ellipse(params?: AddOpt): Ellipse;
        add_filter(params?: AddOpt): Filter;
        add_gaussian_blur(params?: AddOpt): FEGaussianBlur;
        add_group(params?: AddOpt): Group;
        add_image(params?: AddOpt): Image;
        add_line(params?: AddOpt): Line;
        add_linear_gradient(params?: AddOpt): LinearGradient;
        add_marker(params?: AddOpt): Marker;
        add_mask(params?: AddOpt): Mask;
        add_meshpatch(params?: AddOpt): MeshPatch;
        add_meshrow(params?: AddOpt): MeshRow;
        add_path(params?: AddOpt): Path;
        add_pattern(params?: AddOpt): Pattern;
        add_polygon(params?: AddOpt): Polygon;
        add_polyline(params?: AddOpt): Polyline;
        add_radial_gradient(params?: AddOpt): RadialGradient;
        add_rect(params?: AddOpt): Rect;
        add_symbol(params?: AddOpt): Symbol;
        add_text(params?: AddOpt): Text;
        add_tspan(params?: AddOpt): TSpan;
        add_use(params?: AddOpt): Use;
        add_view(params?: AddOpt): ViewPort;
        ////
        _add_element(name: string): Element;
    }
}

// Container.prototype.add_...
Container.prototype.add_circle = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Circle.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_clip_path = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = ClipPath.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_drop_shadow = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEDropShadow.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_ellipse = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Ellipse.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_filter = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Filter.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_gaussian_blur = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEGaussianBlur.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_group = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Group.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_image = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Image.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_line = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Line.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_linear_gradient = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = LinearGradient.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_marker = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Marker.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_mask = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Mask.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_meshpatch = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = MeshPatch.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_meshrow = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = MeshRow.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_path = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Path.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_pattern = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Pattern.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_polygon = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Polygon.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_polyline = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Polyline.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_radial_gradient = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = RadialGradient.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_rect = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Rect.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_symbol = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Symbol.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_text = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Text.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_tspan = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = TSpan.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_use = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Use.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_view = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = ViewPort.new(etc); this.insert_before(before ?? this._end, x); return x; }


// function _add<T>(
//     that: Container,
//     klass:  (new () => T),
//     params?: AddOpt
// ): T {
//     const { before, ...etc } = params ?? {};
//     const x = klass.new(etc);
//     that.insert_before(before ?? that._end, x);
//     return x;
// }

Container.prototype._add_element = function (tag: string) {
    switch (tag) {
        case "circle": return this.add_circle();
        case "clipPath": return this.add_clip_path();
        case "feDropShadow": return this.add_drop_shadow();
        case "ellipse": return this.add_ellipse();
        case "filter": return this.add_filter();
        case "feGaussianBlur": return this.add_gaussian_blur();
        case "g": return this.add_group();
        case "image": return this.add_image();
        case "line": return this.add_line();
        case "linearGradient": return this.add_linear_gradient();
        case "marker": return this.add_marker();
        case "mask": return this.add_mask();
        case "meshpatch": return this.add_meshpatch();
        case "meshrow": return this.add_meshrow();
        case "path": return this.add_path();
        case "pattern": return this.add_pattern();
        case "polygon": return this.add_polygon();
        case "polyline": return this.add_polyline();
        case "radialGradient": return this.add_radial_gradient();
        case "rect": return this.add_rect();
        case "symbol": return this.add_symbol();
        case "text": return this.add_text();
        case "tspan": return this.add_tspan();
        case "use": return this.add_use();
        case "svg": return this.add_view();
    }
    throw new Error("Unexpected tag: " + tag);
}