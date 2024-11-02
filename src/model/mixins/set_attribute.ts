import { Animatable, ScalarValue, UnknownValue } from "../value.js";
import { LengthYValue, LengthXValue, LengthValue, FontSizeValue } from "../value.js";
import { Element } from "../base.js";
import { ComputeLength } from "../length.js";
import { ViewPort, Image, Use, Symbol } from "../elements.js";

declare module "../base" {
    interface Element {
        set_attribute(name: string, value: string): this;
        set_attributes(all: {
            [key: string]: string
        }): void;
    }
}

Element.prototype.set_attributes = function (all: {
    [key: string]: string
}) {
    for (const [name, value] of Object.entries(all)) {
        this.set_attribute(name, value);
    }
}

Element.prototype.set_attribute = function (name: string, value: string): Element {
    switch (name) {
        case "id":
            if (value) {
                this.id = value;
            }
            break;
        case "opacity":
            if (value) {
                this.opacity.set_repr(value);
            }
            break;
        /// TRANSFORM //////////   
        case "transform":
            if (value) {
                this.transform.set_repr(value);
            }
            break;
        case "transform-origin":
            if (value) {
                this.transform.origin.set_repr(value);
            }
            break;
        case "transform-box":
            if (value) {
                this.transform.box.set_repr(value);
            }
            break;
        /// FONT //////////
        case "font-size":
            if (value) {
                this.font.size.set_repr(value);
            }
            break;
        case "font-weight":
            if (value) {
                this.font.weight.set_repr(value);
            }
            break;
        case "font-family":
            if (value) {
                this.font.family.set_repr(value);
            }
            break;
        case "font-variant":
            if (value) {
                this.font.variant.set_repr(value);
            }
            break;
        case "font-style":
            if (value) {
                this.font.style.set_repr(value);
            }
            break;
        case "font-stretch":
            if (value) {
                this.font.stretch.set_repr(value);
            }
            break;
        case "font-size-adjust":
            if (value) {
                this.font.size_adjust.set_repr(value);
            }
            break;
        /// FILL //////////
        case "fill":// 
            if (value) {
                this.fill.color.set_repr(value);
            }
            break;
        case "fill-opacity":// 
            if (value) {
                this.fill.opacity.set_repr(value);
            }
            break;
        case "fill-rule":// 
            if (value) {
                this.fill.rule.set_repr(value);
            }
            break;
        /// STROKE //////////
        case "stroke":// 
            if (value) {
                this.stroke.color.set_repr(value);
            }
            break;
        case "stroke-opacity":// 
            if (value) {
                this.stroke.opacity.set_repr(value);
            }
            break;
        case "stroke-width":// 
            if (value) {
                this.stroke.width.set_repr(value);
            }
            break;
        case "stroke-miterlimit":// 
            if (value) {
                this.stroke.miter_limit.set_repr(value);
            }
            break;
        case "stroke-dasharray":// 
            if (value) {
                this.stroke.dash_array.set_repr(value);
            }
            break;
        case "stroke-dashoffset":// 
            if (value) {
                this.stroke.dash_offset.set_repr(value);
            }
            break;
        case "stroke-linecap":// 
            if (value) {
                this.stroke.line_cap.set_repr(value);
            }
            break;
        case "stroke-linejoin":// 
            if (value) {
                this.stroke.line_join.set_repr(value);
            }
            break;
        /// TEXT //////////
        case "letter-spacing":// 
            if (value) {
                this.letter_spacing.set_repr(value);
            }
            break;
        case "word-spacing":// 
            if (value) {
                this.word_spacing.set_repr(value);
            }
            break;
        case "line-height":// .text?
            if (value) {
                this.line_height.set_repr(value);
            }
            break;
        case "text-align":// .text?
            if (value) {
                this.text_align.set_repr(value);
            }
            break;
        case "white-space": // put<>
            if (value) {
                this.white_space.set_repr(value);
            }
            break;
        /// ETC //////////
        default:


            for (const [n, a] of Object.entries(Element._prop_attr)) {
                // console.warn("SET", n, a, name)
                if (a == name) {
                    const f = (this as any)[n];
                    if (f instanceof Animatable) {
                        f.set_repr(value);
                        return this;
                    }
                }
            }
            // if (name.startsWith("data-")) 
            {
                (this as any)[name] = new UnknownValue(value);
                // (this as any)[`${name}?`] = new UnknownValue(value);
                console.warn(`Unexpected attribute [${name}]="${value}"`)
                return this;
            }
            throw new Error(
                `Unexpected attribute [${name}]="${value}" tag="${(this.constructor as any).tag}" this="${this.constructor.name}"`
            );

    }
    return this;
}


import { TSpan, Text, Polygon, Polyline, Line, Ellipse, Circle, Rect, Path } from "../elements.js";

declare module "../elements" {
    interface ViewPort {
        set_attribute(name: string, value: string): this;
    }
}

ViewPort.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "version":
            break;
        case "viewBox":
            this.view_box.set_repr(value);
            break;
        case "preserveAspectRatio":
            this.view_box.fit.set_repr(value);
            // this.view_box.fit.set_repr(value);
            break;
        case "zoomAndPan":
            this.zoom_pan.set_repr(value);
            break;
        case "height":
            this.height.set_repr(value);
            break;
        case "width":
            this.width.set_repr(value);
            break;
        case "y":
            this.y.set_repr(value);
            break;
        case "x":
            this.x.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
        // super.set_attribute(name, value); error TS2660: 
    }
    return this;
}

Rect.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "height":
            this.height.set_repr(value);
            break;
        case "width":
            this.width.set_repr(value);
            break;
        case "y":
            this.y.set_repr(value);
            break;
        case "x":
            this.x.set_repr(value);
            break;
        case "ry":
            this.ry.set_repr(value);
            break;
        case "rx":
            this.rx.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }
    return this;
}

Circle.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "r":
            this.r.set_repr(value);
            break;
        case "cx":
            this.cx.set_repr(value);
            break;
        case "cy":
            this.cy.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }    return this;
}

Ellipse.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "rx":
            this.rx.set_repr(value);
            break;
        case "ry":
            this.ry.set_repr(value);
            break;
        case "cx":
            this.cx.set_repr(value);
            break;
        case "cy":
            this.cy.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }    return this;
}

Polygon.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "points":
            this.points.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }    return this;
}

Polyline.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "points":
            this.points.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }    return this;
}

Line.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "x1":
            this.x1.set_repr(value);
            break;
        case "x2":
            this.x2.set_repr(value);
            break
        case "y1":
            this.y1.set_repr(value);
            break;
        case "y2":
            this.y2.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }    return this;
}

Text.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "y":
            this.y.set_repr(value);
            break;
        case "x":
            this.x.set_repr(value);
            break;
        case "dy":
            this.dy.set_repr(value);
            break;
        case "dx":
            this.dx.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }    return this;
}

TSpan.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "y":
            this.y.set_repr(value);
            break;
        case "x":
            this.x.set_repr(value);
            break;
        case "dy":
            this.dy.set_repr(value);
            break;
        case "dx":
            this.dx.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }    return this;
}

Image.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "height":
            this.height.set_repr(value);
            break;
        case "width":
            this.width.set_repr(value);
            break;
        case "y":
            this.y.set_repr(value);
            break;
        case "x":
            this.x.set_repr(value);
            break;
        case "href":
            this.href.set_repr(value);
            break;
        case "preserveAspectRatio":
            this.fit_view.set_repr(value);
            break;
        case "crossorigin":
            this.cross_origin.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }
    return this;
}

Use.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "y":
            this.y.set_repr(value);
            break;
        case "x":
            this.x.set_repr(value);
            break;
        case "height":
            this.height.set_repr(value);
            break;
        case "width":
            this.width.set_repr(value);
            break;
        case "href":
            this.href.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }
    return this;
}

Symbol.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "y":
            this.y.set_repr(value);
            break;
        case "x":
            this.x.set_repr(value);
            break;
        case "height":
            this.height.set_repr(value);
            break;
        case "width":
            this.width.set_repr(value);
            break;
        case "viewBox":
            this.view_box.set_repr(value);
            break;
        case "preserveAspectRatio":
            this.view_box.fit.set_repr(value);
            break;
        case "refX":
            this.ref_x.set_repr(value);
            break;
        case "refY":
            this.ref_y.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }
    return this;
}

Path.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "d":
            this.d.set_repr(value);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }    return this;
}

LengthValue.prototype.initial_value = function () {
    const { value, _parent } = this;
    if (typeof value === "string") {
        if (_parent instanceof Element) {
            const cl = new ComputeLength(_parent, 0);
            return cl.parse_len(value);
        }
    }
    return ScalarValue.prototype.initial_value.call(this);
}

LengthXValue.prototype.initial_value = function () {
    const { value, _parent } = this;
    if (typeof value === "string") {
        if (_parent instanceof Element) {
            const cl = new ComputeLength(_parent, 0);
            return cl.parse_len(value, "x");
        }
    }
    return ScalarValue.prototype.initial_value.call(this);
}

LengthYValue.prototype.initial_value = function () {
    const { value, _parent } = this;
    if (typeof value === "string") {
        if (_parent instanceof Element) {
            const cl = new ComputeLength(_parent, 0);
            return cl.parse_len(value, "y");
        }
    }
    return ScalarValue.prototype.initial_value.call(this);
}

FontSizeValue.prototype.initial_value = function () {
    const { value, _parent } = this;
    if (typeof value === "string") {
        if (_parent instanceof Element) {
            const cl = new ComputeLength(_parent, 0);
            return cl.parse_len(value, 'f');
        }
    }
    return ScalarValue.prototype.initial_value.call(this);
}

/* <INSERT element-prop-attr.ins.ts > */
Element._prop_attr = {
 "transform": "",
 "fill": "",
 "stroke": "",
 "font": "",
 "classes": "class",
 "alignment_baseline": "alignment-baseline",
 "text_anchor": "text-anchor",
 "text_decoration": "text-decoration",
 "text_overflow": "text-overflow",
 "unicode_bidi": "unicode-bidi",
 "white_space": "white-space",
 "word_spacing": "word-spacing",
 "writing_mode": "writing-mode",
 "text_align": "text-align",
 "line_height": "line-height",
 "stop_opacity": "stop-opacity",
 "display": "display",
 "overflow": "overflow",
 "visibility": "visibility",
 "image_rendering": "image-rendering",
 "shape_rendering": "shape-rendering",
 "text_rendering": "text-rendering",
 "color_rendering": "color-rendering",
 "clip": "clip",
 "clip_path": "clip-path",
 "clip_rule": "clip-rule",
 "color": "color",
 "color_interpolation": "color-interpolation",
 "filter": "filter",
 "letter_spacing": "letter-spacing",
 "mask": "mask",
 "opacity": "opacity",
 "pointer_events": "pointer-events",
 "vector_effect": "vector-effect",
 "width": "width",
 "height": "height",
 "x": "x",
 "y": "y",
 "ref_x": "refX",
 "ref_y": "refY",
 "view_box": "",
 "href": "href",
 "pattern_units": "patternUnits",
 "pattern_content_units": "patternContentUnits",
 "pattern_transform": "patternTransform",
 "marker_units": "markerUnits",
 "marker_width": "markerWidth",
 "marker_height": "markerHeight",
 "orient": "orient",
 "clip_path_units": "clipPathUnits",
 "mask_units": "maskUnits",
 "mask_content_units": "maskContentUnits",
 "zoom_pan": "zoomAndPan",
 "fit_view": "preserveAspectRatio",
 "cross_origin": "crossorigin",
 "input": "in",
 "result": "result",
 "input2": "in2",
 "mode": "mode",
 "type": "type",
 "values": "values",
 "operator": "operator",
 "k1": "k1",
 "k2": "k2",
 "k3": "k3",
 "k4": "k4",
 "order": "order",
 "kernel_matrix": "kernelMatrix",
 "divisor": "divisor",
 "bias": "bias",
 "target_x": "targetX",
 "target_y": "targetY",
 "edge_mode": "edgeMode",
 "kernel_unit_length": "kernelUnitLength",
 "preserve_alpha": "preserveAlpha",
 "surface_scale": "surfaceScale",
 "diffuse_constant": "diffuseConstant",
 "scale": "scale",
 "x_channel_selector": "xChannelSelector",
 "y_channel_selector": "yChannelSelector",
 "azimuth": "azimuth",
 "elevation": "elevation",
 "std_dev": "stdDeviation",
 "dx": "dx",
 "dy": "dy",
 "flood_opacity": "flood-opacity",
 "flood_color": "flood-color",
 "slope": "slope",
 "intercept": "intercept",
 "amplitude": "amplitude",
 "exponent": "exponent",
 "offset": "offset",
 "table_values": "tableValues",
 "radius": "radius",
 "z": "z",
 "specular_constant": "specularConstant",
 "specular_exponent": "specularExponent",
 "lighting_color": "lighting-color",
 "points_at_x": "pointsAtX",
 "points_at_y": "pointsAtY",
 "points_at_z": "pointsAtZ",
 "limiting_cone_angle": "limitingConeAngle",
 "base_frequency": "baseFrequency",
 "num_octaves": "numOctaves",
 "seed": "seed",
 "stitch_tiles": "stitchTiles",
 "spread": "spreadMethod",
 "gradient_units": "gradientUnits",
 "gradient_transform": "gradientTransform",
 "x1": "x1",
 "y1": "y1",
 "x2": "x2",
 "y2": "y2",
 "r": "r",
 "cx": "cx",
 "cy": "cy",
 "fx": "fx",
 "fy": "fy",
 "fr": "fr",
 "stop_color": "stop-color",
 "path": "path",
 "primitive_units": "primitiveUnits",
 "filter_units": "filterUnits",
 "marker_start": "marker-start",
 "marker_mid": "marker-mid",
 "marker_end": "marker-end",
 "points": "points",
 "rx": "rx",
 "ry": "ry",
 "d": "d"
};
/* </INSERT> */
