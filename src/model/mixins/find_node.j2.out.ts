import { Element, TextData } from "../base.js";
import { Container, Symbol, Group, ClipPath, Marker, Mask, Pattern, Filter } from "../containers.js";
import { ViewPort } from "../viewport.js";
import { Use, Image } from "../elements.js";
import { Text, TSpan } from "../text.js";
import { Circle, Ellipse, Line, Path, Polygon, Polyline, Rect } from "../shapes.js";
import { FEDropShadow, FEGaussianBlur, LinearGradient, MeshPatch, MeshRow, RadialGradient } from "../filters.js";

function get_node<T>(
    that: Container,
    x: number | string = 0,
    K: { new(...args: any[]): T }
): T {
    const n = find_node(that, x, K);
    if (n) {
        return n;
    }
    throw new Error(`not found ${K.name} '${x}'`);
}

function find_node<T>(
    that: Container,
    x: number | string = 0,
    K: { new(...args: any[]): T }
): T | void {
    if (typeof x == "number") {
        for (const n of enum_node_type(that, K)) {
            if (!(x-- > 0)) {
                return n;
            }
        }
    } else {
        for (const n of enum_node_type(that, K)) {
            if (n.id === x) {
                return n;
            }
        }
    }
}

function* enum_node_type<T>(that: Container, x: { new(...args: any[]): T }) {
    const { _start, _end: end } = that;
    let cur: typeof _start | undefined = _start;
    do {
        if (cur instanceof Element || cur instanceof TextData) {
            if (cur instanceof x) {
                yield cur;
            }
        }
    } while (cur !== end && (cur = cur._next));
}


declare module "../containers" {
    interface Container {
        get_circle(x: number | string):Circle;
        get_clip_path(x: number | string):ClipPath;
        get_data(x: number | string):TextData;
        get_drop_shadow(x: number | string):FEDropShadow;
        get_element(x: number | string):Element;
        get_ellipse(x: number | string):Ellipse;
        get_filter(x: number | string):Filter;
        get_gaussian_blur(x: number | string):FEGaussianBlur;
        get_group(x: number | string):Group;
        get_image(x: number | string):Image;
        get_line(x: number | string):Line;
        get_linear_gradient(x: number | string):LinearGradient;
        get_marker(x: number | string):Marker;
        get_mask(x: number | string):Mask;
        get_meshpatch(x: number | string):MeshPatch;
        get_meshrow(x: number | string):MeshRow;
        get_path(x: number | string):Path;
        get_pattern(x: number | string):Pattern;
        get_polygon(x: number | string):Polygon;
        get_polyline(x: number | string):Polyline;
        get_radial_gradient(x: number | string):RadialGradient;
        get_rect(x: number | string):Rect;
        get_symbol(x: number | string):Symbol;
        get_text(x: number | string):Text;
        get_tspan(x: number | string):TSpan;
        get_use(x: number | string):Use;
        get_view(x: number | string):ViewPort;
        find_circle(x: number | string): Circle | void;
        find_clip_path(x: number | string): ClipPath | void;
        find_data(x: number | string): TextData | void;
        find_drop_shadow(x: number | string): FEDropShadow | void;
        find_element(x: number | string): Element | void;
        find_ellipse(x: number | string): Ellipse | void;
        find_filter(x: number | string): Filter | void;
        find_gaussian_blur(x: number | string): FEGaussianBlur | void;
        find_group(x: number | string): Group | void;
        find_image(x: number | string): Image | void;
        find_line(x: number | string): Line | void;
        find_linear_gradient(x: number | string): LinearGradient | void;
        find_marker(x: number | string): Marker | void;
        find_mask(x: number | string): Mask | void;
        find_meshpatch(x: number | string): MeshPatch | void;
        find_meshrow(x: number | string): MeshRow | void;
        find_path(x: number | string): Path | void;
        find_pattern(x: number | string): Pattern | void;
        find_polygon(x: number | string): Polygon | void;
        find_polyline(x: number | string): Polyline | void;
        find_radial_gradient(x: number | string): RadialGradient | void;
        find_rect(x: number | string): Rect | void;
        find_symbol(x: number | string): Symbol | void;
        find_text(x: number | string): Text | void;
        find_tspan(x: number | string): TSpan | void;
        find_use(x: number | string): Use | void;
        find_view(x: number | string): ViewPort | void;
    }
}

Container.prototype.get_circle = function (x: number | string = 0) {
    return get_node(this, x, Circle);
}
Container.prototype.find_circle = function (x: number | string = 0): Circle | void {
    return find_node(this, x, Circle);
}
Container.prototype.get_clip_path = function (x: number | string = 0) {
    return get_node(this, x, ClipPath);
}
Container.prototype.find_clip_path = function (x: number | string = 0): ClipPath | void {
    return find_node(this, x, ClipPath);
}
Container.prototype.get_data = function (x: number | string = 0) {
    return get_node(this, x, TextData);
}
Container.prototype.find_data = function (x: number | string = 0): TextData | void {
    return find_node(this, x, TextData);
}
Container.prototype.get_drop_shadow = function (x: number | string = 0) {
    return get_node(this, x, FEDropShadow);
}
Container.prototype.find_drop_shadow = function (x: number | string = 0): FEDropShadow | void {
    return find_node(this, x, FEDropShadow);
}
Container.prototype.get_element = function (x: number | string = 0) {
    return get_node(this, x, Element);
}
Container.prototype.find_element = function (x: number | string = 0): Element | void {
    return find_node(this, x, Element);
}
Container.prototype.get_ellipse = function (x: number | string = 0) {
    return get_node(this, x, Ellipse);
}
Container.prototype.find_ellipse = function (x: number | string = 0): Ellipse | void {
    return find_node(this, x, Ellipse);
}
Container.prototype.get_filter = function (x: number | string = 0) {
    return get_node(this, x, Filter);
}
Container.prototype.find_filter = function (x: number | string = 0): Filter | void {
    return find_node(this, x, Filter);
}
Container.prototype.get_gaussian_blur = function (x: number | string = 0) {
    return get_node(this, x, FEGaussianBlur);
}
Container.prototype.find_gaussian_blur = function (x: number | string = 0): FEGaussianBlur | void {
    return find_node(this, x, FEGaussianBlur);
}
Container.prototype.get_group = function (x: number | string = 0) {
    return get_node(this, x, Group);
}
Container.prototype.find_group = function (x: number | string = 0): Group | void {
    return find_node(this, x, Group);
}
Container.prototype.get_image = function (x: number | string = 0) {
    return get_node(this, x, Image);
}
Container.prototype.find_image = function (x: number | string = 0): Image | void {
    return find_node(this, x, Image);
}
Container.prototype.get_line = function (x: number | string = 0) {
    return get_node(this, x, Line);
}
Container.prototype.find_line = function (x: number | string = 0): Line | void {
    return find_node(this, x, Line);
}
Container.prototype.get_linear_gradient = function (x: number | string = 0) {
    return get_node(this, x, LinearGradient);
}
Container.prototype.find_linear_gradient = function (x: number | string = 0): LinearGradient | void {
    return find_node(this, x, LinearGradient);
}
Container.prototype.get_marker = function (x: number | string = 0) {
    return get_node(this, x, Marker);
}
Container.prototype.find_marker = function (x: number | string = 0): Marker | void {
    return find_node(this, x, Marker);
}
Container.prototype.get_mask = function (x: number | string = 0) {
    return get_node(this, x, Mask);
}
Container.prototype.find_mask = function (x: number | string = 0): Mask | void {
    return find_node(this, x, Mask);
}
Container.prototype.get_meshpatch = function (x: number | string = 0) {
    return get_node(this, x, MeshPatch);
}
Container.prototype.find_meshpatch = function (x: number | string = 0): MeshPatch | void {
    return find_node(this, x, MeshPatch);
}
Container.prototype.get_meshrow = function (x: number | string = 0) {
    return get_node(this, x, MeshRow);
}
Container.prototype.find_meshrow = function (x: number | string = 0): MeshRow | void {
    return find_node(this, x, MeshRow);
}
Container.prototype.get_path = function (x: number | string = 0) {
    return get_node(this, x, Path);
}
Container.prototype.find_path = function (x: number | string = 0): Path | void {
    return find_node(this, x, Path);
}
Container.prototype.get_pattern = function (x: number | string = 0) {
    return get_node(this, x, Pattern);
}
Container.prototype.find_pattern = function (x: number | string = 0): Pattern | void {
    return find_node(this, x, Pattern);
}
Container.prototype.get_polygon = function (x: number | string = 0) {
    return get_node(this, x, Polygon);
}
Container.prototype.find_polygon = function (x: number | string = 0): Polygon | void {
    return find_node(this, x, Polygon);
}
Container.prototype.get_polyline = function (x: number | string = 0) {
    return get_node(this, x, Polyline);
}
Container.prototype.find_polyline = function (x: number | string = 0): Polyline | void {
    return find_node(this, x, Polyline);
}
Container.prototype.get_radial_gradient = function (x: number | string = 0) {
    return get_node(this, x, RadialGradient);
}
Container.prototype.find_radial_gradient = function (x: number | string = 0): RadialGradient | void {
    return find_node(this, x, RadialGradient);
}
Container.prototype.get_rect = function (x: number | string = 0) {
    return get_node(this, x, Rect);
}
Container.prototype.find_rect = function (x: number | string = 0): Rect | void {
    return find_node(this, x, Rect);
}
Container.prototype.get_symbol = function (x: number | string = 0) {
    return get_node(this, x, Symbol);
}
Container.prototype.find_symbol = function (x: number | string = 0): Symbol | void {
    return find_node(this, x, Symbol);
}
Container.prototype.get_text = function (x: number | string = 0) {
    return get_node(this, x, Text);
}
Container.prototype.find_text = function (x: number | string = 0): Text | void {
    return find_node(this, x, Text);
}
Container.prototype.get_tspan = function (x: number | string = 0) {
    return get_node(this, x, TSpan);
}
Container.prototype.find_tspan = function (x: number | string = 0): TSpan | void {
    return find_node(this, x, TSpan);
}
Container.prototype.get_use = function (x: number | string = 0) {
    return get_node(this, x, Use);
}
Container.prototype.find_use = function (x: number | string = 0): Use | void {
    return find_node(this, x, Use);
}
Container.prototype.get_view = function (x: number | string = 0) {
    return get_node(this, x, ViewPort);
}
Container.prototype.find_view = function (x: number | string = 0): ViewPort | void {
    return find_node(this, x, ViewPort);
}
