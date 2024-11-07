import { Animatable, TextValue, UnknownValue } from "../value.js";
import { Transform, Fill, ViewBox, Font, Stroke, ValueSet } from "../valuesets.js";
import { Element, Chars } from "../base.js";
import { Root } from "../root.js";
import { Container } from "../containers.js";
import { PathValue } from "../bezshape.js";
const NS_SVG = "http://www.w3.org/2000/svg";

interface AttUP {
    attr?: string;
    value?: string;
    call?: (frame: number) => string;
    kfv?: Animatable<any>;
}

declare module "../value" {
    interface Animatable<V> {
        attr_field_updater(name: string): AttUP;
    }
}

declare module "../valuesets" {
    interface ValueSet {
        enum_attr_field_updater(): Generator<AttUP, void, unknown>;
    }
}
declare module "../bezshape" {
    interface PathValue {
        attr_field_updater(name: string): AttUP;
    }
}

Animatable.prototype.attr_field_updater = function (attr: string) {
    return {
        attr,
        value: (typeof this.value === "string") ? this.value : this.value_repr(this.value),
        kfv: (this.kfs.length > 0) ? this : undefined
    };
}
PathValue.prototype.attr_field_updater = function (attr: string) {
    return {
        attr,
        value: (typeof this.value === "string") ? this.value : this.get_repr(0),
        call: (frame: number) => {
            return this.get_repr(frame);
        }
    };
}
Transform.prototype.enum_attr_field_updater = function* () {
    for (let n of Object.keys(this)) {
        switch (n) {
            case "all":
                let all = this.all;
                yield {
                    attr: "transform",
                    value: all.map((x) => x.get_repr(0)).join(" "),
                    call: all.some(x => x.kfs.length > 0)
                        ? ((frame: number) => all.map((x) => x.get_repr(frame)).join(" "))
                        : undefined
                }
                break;
            case "origin":
                yield this.origin.attr_field_updater("transform-origin")
                break;
            case "box":
                yield this.box.attr_field_updater("transform-box")
                break;
            default:
                continue;
        }
    }
}

ViewBox.prototype.enum_attr_field_updater = function* () {
    let box = false;
    for (let n of Object.keys(this)) {
        switch (n) {
            case "size":
            case "position":
                box = true;
                break;
            case "fit":
                yield this.fit.attr_field_updater("preserveAspectRatio")
                break;
            default:
                continue;
        }
    }
    if (box) {
        let { size, position } = this;
        const s = size.get_value(0);
        const p = position.get_value(0);
        yield {
            attr: "viewBox",
            value: `${p[0]} ${p[1]} ${s[0]} ${s[1]}`,
            call: (size.kfs.length > 0 || position.kfs.length > 0) ? (function (frame: number) {
                const s = size.get_value(frame);
                const p = position.get_value(frame);
                return `${p[0]} ${p[1]} ${s[0]} ${s[1]}`;
            }) : undefined
        }
    }
}

Fill.prototype.enum_attr_field_updater = function* () {
    for (let n of Object.keys(this)) {
        switch (n) {
            case "color":
                yield this.color.attr_field_updater("fill");
                break;
            case "opacity":
                yield this.opacity.attr_field_updater("fill-opacity");
                break;
            case "rule":
                yield this.rule.attr_field_updater("fill-rule");
                break;
            default:
                continue;
        }
    }
}

Stroke.prototype.enum_attr_field_updater = function* () {
    for (let n of Object.keys(this)) {
        switch (n) {
            case "color":
                yield this.color.attr_field_updater("stroke");
                break;
            case "opacity":
                yield this.opacity.attr_field_updater("stroke-opacity");
                break;
            case "width":
                yield this.width.attr_field_updater("stroke-width");
                break;
            case "miter_limit":
                yield this.miter_limit.attr_field_updater("stroke-miterlimit");
                break;
            case "dash_array":
                yield this.dash_array.attr_field_updater("stroke-dasharray");
                break;
            case "dash_offset":
                yield this.dash_offset.attr_field_updater("stroke-dashoffset");
                break;
            case "linecap":
                yield this.line_cap.attr_field_updater("stroke-linecap");
                break;
            case "linejoin":
                yield this.line_join.attr_field_updater("stroke-linejoin");
                break;
        }
    }
}

Font.prototype.enum_attr_field_updater = function* () {
    for (let [n, _] of Object.entries(this)) {
        switch (n) {
            case "family":
                yield this.family.attr_field_updater("font-family");
                break;
            case "size":
                yield this.size.attr_field_updater("font-size");
                break;
            case "style":
                yield this.style.attr_field_updater("font-style");
                break;
            case "weight":
                yield this.weight.attr_field_updater("font-weight");
                break;
            case "variant":
                yield this.variant.attr_field_updater("font-variant");
                break;
            case "stretch":
                yield this.stretch.attr_field_updater("font-stretch");
                break;
            case "size-adjust":
                yield this.size_adjust.attr_field_updater("font-size-adjust");
                break;
        }
    }
}
function element_dom(self: Element,
    doc: typeof SVGElement.prototype.ownerDocument,
    add_upd: (attup: AttUP, elem?: globalThis.SVGElement, text?: globalThis.Text) => void): SVGElement {
    const elem = doc.createElementNS(NS_SVG, (<typeof Element>self.constructor).tag);
    for (let [n, v] of Object.entries(self)) {
        if (n == 'id') {
            elem.id = v.toString();
        } else if (v instanceof Animatable) {
            let attr = name_to_attr[n];
            if (!attr) {
                if (v instanceof UnknownValue || v instanceof TextValue) {
                    attr = n;
                    // } else if (n.startsWith("data-")) {
                    //     continue;
                } else {
                    throw new Error(`Unexpected property "${n}"`);
                }
            }
            add_upd(v.attr_field_updater(attr), elem);
        } else if (v instanceof ValueSet) {
            for (const u of v.enum_attr_field_updater()) {
                add_upd(u, elem);
            }
        }
    }

    if (self instanceof Container) {
        for (const sub of self.children<Element | Chars>()) {
            if (sub instanceof Element) {
                const s = element_dom(sub, doc, add_upd)
                elem.appendChild(s);
            } else if (sub instanceof Chars) {
                const txt = doc.createTextNode(sub.content.get_value(0));
                if (sub.content.kfs.length > 0) {
                    add_upd({ kfv: sub.content }, undefined, txt);
                }
                elem.appendChild(txt);
            }
        }
    }
    return elem;
}

export function updater_dom(root: Root, doc: typeof SVGElement.prototype.ownerDocument) {
    const updates: Array<(frame: number) => void> = [];
    function add_upd(attup: AttUP, elem?: globalThis.SVGElement, text?: globalThis.Text) {
        let { kfv, attr, call, value } = attup;
        // console.warn(attr, value, elem?.constructor.name, text?.constructor.name, kfv)
        if (kfv) {
            if (elem) {
                if (!attr || text) {
                    throw new Error(``);
                }
                value == undefined || elem.setAttribute(attr, value);
                updates.push((frame: number) =>
                    elem.setAttribute(attr, kfv.get_repr(frame))
                );
            } else if (text) {
                if (attr) {
                    throw new Error(``);
                }
                value == undefined || (text.textContent = value);
                updates.push(function (frame: number) {
                    text.textContent = kfv.get_repr(frame)
                });
            }
        } else if (call) {
            if (elem) {
                if (!attr || text) {
                    throw new Error(``);
                }
                value == undefined || elem.setAttribute(attr, value);
                updates.push(function (frame: number) {
                    elem.setAttribute(attr, call(frame));
                })
            } else if (text) {
                if (attr) {
                    throw new Error(``);
                }
                value == undefined || (text.textContent = value);
                updates.push(function (frame: number) {
                    text.textContent = call(frame);
                });
            }
        } else {
            if (elem) {
                if (!attr || text) {
                    throw new Error(``);
                }
                value == undefined || elem.setAttribute(attr, value);
            } else if (text) {
                if (attr) {
                    throw new Error(``);
                }
                value == undefined || (text.textContent = value);
            }
        }
    }
    const svg = element_dom(root.view, doc, add_upd);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttributeNS("http://www.w3.org/2000/svg", "version", "1.1");
    return { svg, updates };
}

/* <INSERT name-to-attr.ins.ts > */
const name_to_attr: {
    [key: string]: string
} = {
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
