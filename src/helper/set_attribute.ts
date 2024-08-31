
import { VectorValue, ScalarValue, PointsValue, RGB, RGBValue, TextValue } from "../model/value.js";
import { parse_css_color } from "./parse_color.js";
import { ComputeLength } from "./svg_length.js";
import { Element } from "../model/base.js";

declare module "../model/base" {
    interface Element {
        set_attribute(name: string, value: string): void;
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

Element.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "id":
            if (value) {
                // console.log("_set_attr ID", this.constructor.name);
                this.get_root().remember_id((this.id = value), this);
            }
            break;

        case "transform":
            if (value) {
                this.transform.set_parse_transform(value);
            }
            break;
        case "font-size":
            if (value) {
                this.font_size.set_parse_length(value, this, name);
            }
        case "font-weight":
            if (value) {
                this.font.weight.set_parse_text(value, this);
            }
            break;
        // case "font-size":
        //     if (value) {
        //         this.font.size.set_parse_text(value, this);
        //     }
        //     break;
        case "font-family":
            if (value) {
                this.font.family.set_parse_text(value, this);
            }
            break;
        case "line-height":// .text?
            if (value) {
                this.line_height.set_parse_line_height(value, this);
            }
            break;
        case "text-align":// .text?
            if (value) {
                this.text_align.set_parse_text(value, this);
            }
            break;
        case "white-space": // put<>
            if (value) {
                this.white_space.set_parse_text(value, this);
            }
            break;
        case "fill":// 
            if (value) {
                this.fill.color.set_parse_rgb(value, this);
            }
            break;
        case "fill-opacity":// 
            if (value) {
                this.fill.opacity.set_parse_percentage(value, this);
            }
            break;
        case "stroke":// 
            if (value) {
                this.stroke.color.set_parse_rgb(value, this);
            }
            break;
        case "stroke-opacity":// 
            if (value) {
                this.stroke.opacity.set_parse_percentage(value, this);
            }
            break;
        case "stroke-width":// 
            if (value) {
                this.stroke.width.set_parse_length(value, this, name);
            }
            break;
        case "stroke-miterlimit":// 
            if (value) {
                this.stroke.miter_limit.set_parse_number(value, this);
            }
            break;

        case "stroke-dasharray":// 
            if (value) {
                this.stroke.dash_array.set_parse_dashes(value, this);
            }
            break;
        case "stroke-dashoffset":// 
            if (value) {
                this.stroke.dash_offset.set_parse_length(value, this, name);
            }
        case "letter-spacing":// 
            if (value) {
                this.letter_spacing.set_parse_length(value, this, name);
            }
        case "word-spacing":// 
            if (value) {
                this.word_spacing.set_parse_text(value, this);
            }

            break;
        case "transform-origin":
            if (value) {
                // this.anchor.set_parse_anchor(value);
            }
        case "opacity":
            if (value) {
                this.opacity.set_parse_percentage(value, this);
            }

        case "shape-inside":
        case "paint-order":
            break;
        default:
            if (!(name.startsWith("aria-") || name.startsWith("-inkscape"))) {
                throw new Error(
                    `Unexpected attribute [${name}]="${value}" tag="${(this.constructor as any).tag}" this="${this.constructor.name}"`
                );
            }
    }
}

declare module "../model/value" {
    interface ScalarValue {
        set_parse_length(s: string, container: Element, name: string, mode?: string): void;
        set_parse_number(s: string, container: Element): void;
        set_parse_percentage(s: string, container: Element): void;
        set_parse_line_height(s: string, container: Element): void;
    }
    interface RGBValue {
        set_parse_rgb(s: string, container: Element): void;
    }
    interface TextValue {
        set_parse_text(s: string, container: Element): void;
    }
    interface PointsValue {
        set_parse_points(s: string, container: Element): void;
    }
    interface VectorValue {
        set_parse_dashes(s: string, container: Element): void;
        set_parse_anchor(s: string, container: Element): void;
    }
}

ScalarValue.prototype.set_parse_number = function (s: string, parent: Element) {
    this.value = parseFloat(s);
}

ScalarValue.prototype.set_parse_length = function (s: string, parent: Element, name: string, mode?: string) {
    // console.log(`set_parse_length ${s} [${(parent.constructor as any).tag}:${parent.id}] [${name}]`)
    const cl = new ComputeLength(parent, 0);
    cl.length_mode = mode;
    this.value = cl.parse_len(s);
    // this.value = parse_len(s);
}

ScalarValue.prototype.set_parse_percentage = function (s: string, parent: Element) {
    if (s.endsWith('%')) {
        this.value = parseFloat(s.replaceAll('%', '')) / 100;
    } else {
        this.value = parseFloat(s);
    }
}

ScalarValue.prototype.set_parse_line_height = function (s: string, parent: Element) {
    if (s.endsWith('%')) {
        this.value = parseFloat(s.replaceAll('%', '')) / 100;
    } else if (s == 'normal') {
        this.value = null;
    } else {
        const cl = new ComputeLength(parent, 0);
        this.value = cl.parse_len(s);
        // this.value = parse_len(s);
    }
}

RGBValue.prototype.set_parse_rgb = function (s: string, parent: Element) {
    if (s == "none") {
        this.value = null;
        return;
    }
    const c = parse_css_color(s);
    if (c == null) {
        throw new Error(`Invalid color "${s}"`);
    }
    this.value = new RGB(c[0] / 255, c[1] / 255, c[2] / 255);
}

TextValue.prototype.set_parse_text = function (s: string, parent: Element) {
    this.value = s;
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


import { ViewPort, Rect, Path } from "../model/elements.js";
declare module "../model/elements" {
    interface ViewPort {
        set_attribute(name: string, value: string): void;
    }
}

ViewPort.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "version":
            break;
        case "viewBox": {
            const v = value.split(/[\s,]+/).map(parseFloat);
            const u = this.view_box;
            u.position.set_value([v[0], v[1]]);
            u.size.set_value([v[2], v[3]]);
            // console.log("viewBox", e.id, value, v, u.size.dump())
        }
            break;
        case "preserveAspectRatio":
            // this.fit_view.constructor.name
            this.fit_view.set_parse_text(value, this);
            break;
        case "zoomAndPan":
            this.zoom_pan.set_parse_text(value, this);
            break;
        case "height":
            this.height.set_parse_length(value, this, name, "h");
            break;
        case "width":
            this.width.set_parse_length(value, this, name, "w");
            break;
        case "y":
            this.y.set_parse_length(value, this, name, "h");
            break;
        case "x":
            this.x.set_parse_length(value, this, name, "w");
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
        // super.set_attribute(name, value); error TS2660: 
    }
}

Rect.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "height":
            this.height.set_parse_length(value, this, name, "h");
            break;
        case "width":
            this.width.set_parse_length(value, this, name, "w");
            break;
        case "y":
            this.y.set_parse_length(value, this, name, "h");
            break;
        case "x":
            this.x.set_parse_length(value, this, name, "w");
            break;
        case "ry":
            this.ry.set_parse_length(value, this, name, "h");
            break;
        case "rx":
            this.rx.set_parse_length(value, this, name, "w");
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }
}

Path.prototype.set_attribute = function (name: string, value: string) {
    switch (name) {
        case "d":
            this.d.value = value;
            break;
        default:
            Element.prototype.set_attribute.call(this, name, value);
    }
}