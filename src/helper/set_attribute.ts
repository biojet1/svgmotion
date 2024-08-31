
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
    const node = this;
    switch (name) {
        case "id":
            if (value) {
                // console.log("_set_attr ID", node.constructor.name);
                node.get_root().remember_id((node.id = value), node);
            }
            break;

        case "transform":
            if (value) {
                node.transform.set_parse_transform(value);
            }
            break;
        case "font-size":
            if (value) {
                node.font_size.set_parse_length(value, node, name);
            }
        case "font-weight":
            if (value) {
                node.font.weight.set_parse_text(value, node);
            }
            break;
        // case "font-size":
        //     if (value) {
        //         node.font.size.set_parse_text(value, node);
        //     }
        //     break;
        case "font-family":
            if (value) {
                node.font.family.set_parse_text(value, node);
            }
            break;
        case "line-height":// .text?
            if (value) {
                node.line_height.set_parse_line_height(value, node);
            }
            break;
        case "text-align":// .text?
            if (value) {
                node.text_align.set_parse_text(value, node);
            }
            break;
        case "white-space": // put<>
            if (value) {
                node.white_space.set_parse_text(value, node);
            }
            break;
        case "fill":// 
            if (value) {
                node.fill.color.set_parse_rgb(value, node);
            }
            break;
        case "fill-opacity":// 
            if (value) {
                node.fill.opacity.set_parse_percentage(value, node);
            }
            break;
        case "stroke":// 
            if (value) {
                node.stroke.color.set_parse_rgb(value, node);
            }
            break;
        case "stroke-opacity":// 
            if (value) {
                node.stroke.opacity.set_parse_percentage(value, node);
            }
            break;
        case "stroke-width":// 
            if (value) {
                node.stroke.width.set_parse_length(value, node, name);
            }
            break;
        case "stroke-miterlimit":// 
            if (value) {
                node.stroke.miter_limit.set_parse_number(value, node);
            }
            break;

        case "stroke-dasharray":// 
            if (value) {
                node.stroke.dash_array.set_parse_dashes(value, node);
            }
            break;
        case "stroke-dashoffset":// 
            if (value) {
                node.stroke.dash_offset.set_parse_length(value, node, name);
            }
        case "letter-spacing":// 
            if (value) {
                node.letter_spacing.set_parse_length(value, node, name);
            }
        case "word-spacing":// 
            if (value) {
                node.word_spacing.set_parse_text(value, node);
            }

            break;
        case "transform-origin":
            if (value) {
                // node.anchor.set_parse_anchor(value);
            }
        case "opacity":
            if (value) {
                node.opacity.set_parse_percentage(value, node);
            }

        case "shape-inside":
        case "paint-order":
            break;
        default:
            if (!(name.startsWith("aria-") || name.startsWith("-inkscape"))) {
                throw new Error(
                    `Unexpected attribute [${name}]="${value}" tag="${(node.constructor as any).tag}" node="${node.constructor.name}"`
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