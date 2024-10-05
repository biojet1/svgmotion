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
        /*% for e in elements %*/
        add_/*{ e.name }*/(params?: AddOpt)/*{ ': ' ~ e.kind }*/;
        /*% endfor %*/
        ////
        _add_element(name: string): Element;
    }
}

// Container.prototype.add_...
/*% for e in elements %*/
Container.prototype.add_/*{ e.name }*/ = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = /*{ e.kind }*/.new(etc); this.insert_before(before ?? this._end, x); return x; }
/*% endfor %*/

Container.prototype._add_element = function (tag: string) {
    switch (tag) {
        /*% for e in elements %*/
        case "/*{ e.tag }*/": return this.add_/*{ e.name }*/();
        /*% endfor %*/
    }
    throw new Error("Unexpected tag: " + tag);
}
