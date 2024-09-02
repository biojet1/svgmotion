
import { VectorValue, ScalarValue, PointsValue, RGB, RGBValue, TextValue, UnknownValue } from "../model/value.js";
import { parse_css_color } from "./parse_color.js";
import { ComputeLength } from "./svg_length.js";
import { Element, LengthHValue, LengthWValue, LengthValue } from "../model/base.js";

declare module "../model/base" {
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
                // console.log("_set_attr ID", this.constructor.name);
                this.get_root().remember_id((this.id = value), this);
            }
            break;
        case "transform":
            if (value) {
                this.transform.set_repr(value);
            }
            break;
        case "font-size":
            if (value) {
                this.font_size.set_repr(value);
            }
            break;
        case "font-weight":
            if (value) {
                this.font.weight.set_repr(value);
            }
            break;
        // case "font-size":
        //     if (value) {
        //         this.font.size.set_repr(value);
        //     }
        //     break;
        case "font-family":
            if (value) {
                this.font.family.set_repr(value);
            }
            break;
        case "line-height":// .text?
            if (value) {
                this.line_height.set_parse_line_height(value, this);
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
                this.stroke.dash_array.set_parse_dashes(value, this);
            }
            break;
        case "stroke-dashoffset":// 
            if (value) {
                this.stroke.dash_offset.set_repr(value);
            }
            break;
        case "stroke-linecap":// 
            if (value) {
                this.stroke.linecap.set_repr(value);
            }
            break;
        case "stroke-linejoin":// 
            if (value) {
                this.stroke.linejoin.set_repr(value);
            }
            break;
        /////////////
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
        case "transform-origin":
            if (value) {
                // this.anchor.set_parse_anchor(value);
            }
            break;
        case "opacity":
            if (value) {
                this.opacity.set_repr(value);
            }
            break;
        case "shape-inside":
        case "paint-order":
            break;
        default:
            if (name === "*") {
                (this as any)[name] = new UnknownValue(value);
                return this;
            }
            throw new Error(
                `Unexpected attribute [${name}]="${value}" tag="${(this.constructor as any).tag}" this="${this.constructor.name}"`
            );

    }
    return this;
}

declare module "../model/value" {
    interface ScalarValue {
        set_parse_line_height(s: string, container: Element): void;
    }
    interface PointsValue {
        set_parse_points(s: string, container: Element): void;
    }
    interface VectorValue {
        set_parse_dashes(s: string, container: Element): void;
        set_parse_anchor(s: string, container: Element): void;
    }
}


ScalarValue.prototype.set_parse_line_height = function (s: string, parent: Element) {
    if (s.endsWith('%')) {
        this.value = parseFloat(s.replaceAll('%', '')) / 100;
    } else if (s == 'normal') {
        this.value = s;
    } else {
        const cl = new ComputeLength(parent, 0);
        this.value = cl.parse_len(s);
        // this.value = parse_len(s);
    }
}


PointsValue.prototype.set_parse_points = function (s: string, parent: Element) {
    const nums = s.split(/[\s,]+/).map(function (str) {
        return parseFloat(str.trim());
    });
    const points: number[][] = [];
    for (let n = nums.length - 1; n-- > 0; n--) {
        points.push([nums.shift()!, nums.shift()!]);
    }
    this.value = points;
}

VectorValue.prototype.set_parse_dashes = function (s: string, parent: Element) {
    this.value = this.load_value(s.split(/[\s,]+/).map(function (str) {
        return parseFloat(str.trim());
    }));
}

VectorValue.prototype.set_parse_anchor = function (s: string, parent: Element) {
    this.value = this.load_value(s.split(/[\s,]+/).map(function (str) {
        return parseFloat(str.trim());
    }));
}


import {
    ViewPort, Rect, Path, Line, Group,
    Ellipse, Circle, Polyline, Polygon, Image, Symbol,
    Use,
    TSpan, Text
} from "../model/elements.js";

declare module "../model/elements" {
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
            this.fit_view.set_repr(value);
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
            this.points.set_parse_points(value, this);
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }    return this;
}

Polyline.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "points":
            this.points.set_parse_points(value, this);
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
            // this.dx.set_repr(value);
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
            // this.dx.set_repr(value);
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
        //             ‘preserveAspectRatio’
        // ‘crossorigin’
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }
    return this;
}

Use.prototype.set_attribute = function (name: string, value: string) {
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
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }
    return this;
}

Symbol.prototype.set_attribute = function (name: string, value: string) {
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
        // ‘preserveAspectRatio’
        // ‘viewBox’
        // ‘refX’
        // ‘refY’

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

LengthWValue.prototype.initial_value = function () {
    const { value, _parent } = this;
    if (typeof value === "string") {
        if (_parent instanceof Element) {
            const cl = new ComputeLength(_parent, 0);
            cl.length_mode = 'w';
            // console.log(`LengthWValue.prototype.initial_value ${value}`)
            return cl.parse_len(value);
        }
    }
    return ScalarValue.prototype.initial_value.call(this);
}

LengthHValue.prototype.initial_value = function () {
    const { value, _parent } = this;
    if (typeof value === "string") {
        if (_parent instanceof Element) {
            const cl = new ComputeLength(_parent, 0);
            cl.length_mode = 'h';
            // console.log(`LengthHValue.prototype.initial_value ${value}`)
            return cl.parse_len(value);
        }
    }
    return ScalarValue.prototype.initial_value.call(this);
}
