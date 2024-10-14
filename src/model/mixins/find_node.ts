import { Element, TextData } from "../base.js";
import { Container, Symbol, Group, ClipPath, Marker, Mask, Pattern, Filter, Defs } from "../containers.js";
import { ViewPort } from "../viewport.js";
import { Use, Image } from "../elements.js";
import { Text, TSpan } from "../text.js";
import { Circle, Ellipse, Line, Path, Polygon, Polyline, Rect } from "../shapes.js";
import { FEDropShadow, FEGaussianBlur, LinearGradient, MeshGradient, MeshPatch, MeshRow, RadialGradient, Stop } from "../filters.js";

/* <INSERT find_elements.ins.ts > */
declare module "../containers" {
    interface Container {
        get_group(x: number | string): Group;
        get_defs(x: number | string): Defs;
        get_filter(x: number | string): Filter;
        get_symbol(x: number | string): Symbol;
        get_pattern(x: number | string): Pattern;
        get_marker(x: number | string): Marker;
        get_clip_path(x: number | string): ClipPath;
        get_mask(x: number | string): Mask;
        get_view(x: number | string): ViewPort;
        get_use(x: number | string): Use;
        get_image(x: number | string): Image;
        get_fe_drop_shadow(x: number | string): FEDropShadow;
        get_fe_gaussian_blur(x: number | string): FEGaussianBlur;
        get_linear_gradient(x: number | string): LinearGradient;
        get_meshgradient(x: number | string): MeshGradient;
        get_meshpatch(x: number | string): MeshPatch;
        get_meshrow(x: number | string): MeshRow;
        get_radial_gradient(x: number | string): RadialGradient;
        get_stop(x: number | string): Stop;
        get_circle(x: number | string): Circle;
        get_polyline(x: number | string): Polyline;
        get_rect(x: number | string): Rect;
        get_line(x: number | string): Line;
        get_ellipse(x: number | string): Ellipse;
        get_path(x: number | string): Path;
        get_polygon(x: number | string): Polygon;
        get_tspan(x: number | string): TSpan;
        get_text(x: number | string): Text;
        find_group(x: number | string): Group | void;
        find_defs(x: number | string): Defs | void;
        find_filter(x: number | string): Filter | void;
        find_symbol(x: number | string): Symbol | void;
        find_pattern(x: number | string): Pattern | void;
        find_marker(x: number | string): Marker | void;
        find_clip_path(x: number | string): ClipPath | void;
        find_mask(x: number | string): Mask | void;
        find_view(x: number | string): ViewPort | void;
        find_use(x: number | string): Use | void;
        find_image(x: number | string): Image | void;
        find_fe_drop_shadow(x: number | string): FEDropShadow | void;
        find_fe_gaussian_blur(x: number | string): FEGaussianBlur | void;
        find_linear_gradient(x: number | string): LinearGradient | void;
        find_meshgradient(x: number | string): MeshGradient | void;
        find_meshpatch(x: number | string): MeshPatch | void;
        find_meshrow(x: number | string): MeshRow | void;
        find_radial_gradient(x: number | string): RadialGradient | void;
        find_stop(x: number | string): Stop | void;
        find_circle(x: number | string): Circle | void;
        find_polyline(x: number | string): Polyline | void;
        find_rect(x: number | string): Rect | void;
        find_line(x: number | string): Line | void;
        find_ellipse(x: number | string): Ellipse | void;
        find_path(x: number | string): Path | void;
        find_polygon(x: number | string): Polygon | void;
        find_tspan(x: number | string): TSpan | void;
        find_text(x: number | string): Text | void;
    }
}

Container.prototype.get_group = function (x: number | string = 0) {
    return this._get_node(x, Group);
}
Container.prototype.find_group = function (x: number | string = 0): Group | void {
    return this._find_node(x, Group);
}
Container.prototype.get_defs = function (x: number | string = 0) {
    return this._get_node(x, Defs);
}
Container.prototype.find_defs = function (x: number | string = 0): Defs | void {
    return this._find_node(x, Defs);
}
Container.prototype.get_filter = function (x: number | string = 0) {
    return this._get_node(x, Filter);
}
Container.prototype.find_filter = function (x: number | string = 0): Filter | void {
    return this._find_node(x, Filter);
}
Container.prototype.get_symbol = function (x: number | string = 0) {
    return this._get_node(x, Symbol);
}
Container.prototype.find_symbol = function (x: number | string = 0): Symbol | void {
    return this._find_node(x, Symbol);
}
Container.prototype.get_pattern = function (x: number | string = 0) {
    return this._get_node(x, Pattern);
}
Container.prototype.find_pattern = function (x: number | string = 0): Pattern | void {
    return this._find_node(x, Pattern);
}
Container.prototype.get_marker = function (x: number | string = 0) {
    return this._get_node(x, Marker);
}
Container.prototype.find_marker = function (x: number | string = 0): Marker | void {
    return this._find_node(x, Marker);
}
Container.prototype.get_clip_path = function (x: number | string = 0) {
    return this._get_node(x, ClipPath);
}
Container.prototype.find_clip_path = function (x: number | string = 0): ClipPath | void {
    return this._find_node(x, ClipPath);
}
Container.prototype.get_mask = function (x: number | string = 0) {
    return this._get_node(x, Mask);
}
Container.prototype.find_mask = function (x: number | string = 0): Mask | void {
    return this._find_node(x, Mask);
}
Container.prototype.get_view = function (x: number | string = 0) {
    return this._get_node(x, ViewPort);
}
Container.prototype.find_view = function (x: number | string = 0): ViewPort | void {
    return this._find_node(x, ViewPort);
}
Container.prototype.get_use = function (x: number | string = 0) {
    return this._get_node(x, Use);
}
Container.prototype.find_use = function (x: number | string = 0): Use | void {
    return this._find_node(x, Use);
}
Container.prototype.get_image = function (x: number | string = 0) {
    return this._get_node(x, Image);
}
Container.prototype.find_image = function (x: number | string = 0): Image | void {
    return this._find_node(x, Image);
}
Container.prototype.get_fe_drop_shadow = function (x: number | string = 0) {
    return this._get_node(x, FEDropShadow);
}
Container.prototype.find_fe_drop_shadow = function (x: number | string = 0): FEDropShadow | void {
    return this._find_node(x, FEDropShadow);
}
Container.prototype.get_fe_gaussian_blur = function (x: number | string = 0) {
    return this._get_node(x, FEGaussianBlur);
}
Container.prototype.find_fe_gaussian_blur = function (x: number | string = 0): FEGaussianBlur | void {
    return this._find_node(x, FEGaussianBlur);
}
Container.prototype.get_linear_gradient = function (x: number | string = 0) {
    return this._get_node(x, LinearGradient);
}
Container.prototype.find_linear_gradient = function (x: number | string = 0): LinearGradient | void {
    return this._find_node(x, LinearGradient);
}
Container.prototype.get_meshgradient = function (x: number | string = 0) {
    return this._get_node(x, MeshGradient);
}
Container.prototype.find_meshgradient = function (x: number | string = 0): MeshGradient | void {
    return this._find_node(x, MeshGradient);
}
Container.prototype.get_meshpatch = function (x: number | string = 0) {
    return this._get_node(x, MeshPatch);
}
Container.prototype.find_meshpatch = function (x: number | string = 0): MeshPatch | void {
    return this._find_node(x, MeshPatch);
}
Container.prototype.get_meshrow = function (x: number | string = 0) {
    return this._get_node(x, MeshRow);
}
Container.prototype.find_meshrow = function (x: number | string = 0): MeshRow | void {
    return this._find_node(x, MeshRow);
}
Container.prototype.get_radial_gradient = function (x: number | string = 0) {
    return this._get_node(x, RadialGradient);
}
Container.prototype.find_radial_gradient = function (x: number | string = 0): RadialGradient | void {
    return this._find_node(x, RadialGradient);
}
Container.prototype.get_stop = function (x: number | string = 0) {
    return this._get_node(x, Stop);
}
Container.prototype.find_stop = function (x: number | string = 0): Stop | void {
    return this._find_node(x, Stop);
}
Container.prototype.get_circle = function (x: number | string = 0) {
    return this._get_node(x, Circle);
}
Container.prototype.find_circle = function (x: number | string = 0): Circle | void {
    return this._find_node(x, Circle);
}
Container.prototype.get_polyline = function (x: number | string = 0) {
    return this._get_node(x, Polyline);
}
Container.prototype.find_polyline = function (x: number | string = 0): Polyline | void {
    return this._find_node(x, Polyline);
}
Container.prototype.get_rect = function (x: number | string = 0) {
    return this._get_node(x, Rect);
}
Container.prototype.find_rect = function (x: number | string = 0): Rect | void {
    return this._find_node(x, Rect);
}
Container.prototype.get_line = function (x: number | string = 0) {
    return this._get_node(x, Line);
}
Container.prototype.find_line = function (x: number | string = 0): Line | void {
    return this._find_node(x, Line);
}
Container.prototype.get_ellipse = function (x: number | string = 0) {
    return this._get_node(x, Ellipse);
}
Container.prototype.find_ellipse = function (x: number | string = 0): Ellipse | void {
    return this._find_node(x, Ellipse);
}
Container.prototype.get_path = function (x: number | string = 0) {
    return this._get_node(x, Path);
}
Container.prototype.find_path = function (x: number | string = 0): Path | void {
    return this._find_node(x, Path);
}
Container.prototype.get_polygon = function (x: number | string = 0) {
    return this._get_node(x, Polygon);
}
Container.prototype.find_polygon = function (x: number | string = 0): Polygon | void {
    return this._find_node(x, Polygon);
}
Container.prototype.get_tspan = function (x: number | string = 0) {
    return this._get_node(x, TSpan);
}
Container.prototype.find_tspan = function (x: number | string = 0): TSpan | void {
    return this._find_node(x, TSpan);
}
Container.prototype.get_text = function (x: number | string = 0) {
    return this._get_node(x, Text);
}
Container.prototype.find_text = function (x: number | string = 0): Text | void {
    return this._find_node(x, Text);
}
/* </INSERT> */
