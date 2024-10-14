import { Stepper } from "../../track/stepper.js";
import { Node } from "../../tree/linked3.js";
import { ScalarValue, PointsValue, TextValue, Animatable, VectorValue } from "../value.js";
import { Transform, Fill, ViewBox, Font, Stroke, ValueSet } from "../valuesets.js";
import { Element, Chars } from "../base.js";
import { Root } from "../root.js";
import { Container } from "../containers.js";

const PROP_MAP: {
    [key: string]: ((frame: number, elem: any, prop: any, node: Element) => void);
} = {
    transform: function (frame: number, node: SVGElement, prop: Transform) {
        for (const { name, value } of prop.enum_attibutes(frame)) {
            node.setAttribute(name, value);
        }
    },
    fill: function (frame: number, node: SVGSVGElement, prop: Fill) {
        for (const { name, value } of prop.enum_attibutes(frame)) {
            node.setAttribute(name, value);
        }
    },
    stroke: function (frame: number, node: SVGSVGElement, prop: Stroke) {
        for (const { name, value } of prop.enum_attibutes(frame)) {
            node.setAttribute(name, value);
        }
    },
    font: function (frame: number, node: SVGSVGElement, prop: Font) {
        for (const { name, value } of prop.enum_attibutes(frame)) {
            node.setAttribute(name, value);
        }
    },
    view_box: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ViewBox) {
        node.setAttribute("viewBox", prop.get_repr(frame));
    },
    fit_view: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: TextValue) {
        node.setAttribute("preserveAspectRatio", prop.get_repr(frame));
    },

    opacity: function (frame: number, node: SVGElement, prop: ScalarValue) {
        node.setAttribute("opacity", prop.get_repr(frame));
    },
    x: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ScalarValue) {
        node.setAttribute("x", prop.get_repr(frame));
    },
    y: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ScalarValue) {
        node.setAttribute("y", prop.get_repr(frame));
    },
    cx: function (frame: number, node: SVGCircleElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("cx", prop.get_repr(frame));
    },
    cy: function (frame: number, node: SVGCircleElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("cy", prop.get_repr(frame));
    },
    r: function (frame: number, node: SVGCircleElement, prop: ScalarValue) {
        node.setAttribute("r", prop.get_repr(frame));
    },
    width: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ScalarValue) {
        node.setAttribute("width", prop.get_repr(frame));
    },
    height: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ScalarValue) {
        node.setAttribute("height", prop.get_repr(frame));
    },
    rx: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("rx", prop.get_repr(frame));
    },
    ry: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("ry", prop.get_repr(frame));
    },

    d: function (frame: number, node: SVGPathElement, prop: TextValue) {
        node.setAttribute("d", prop.get_repr(frame));
    },


    line_height: function (frame: number, node: SVGElement, prop: ScalarValue) {
        node.style.lineHeight = prop.get_repr(frame);
    },
    text_align: function (frame: number, node: SVGElement, prop: TextValue) {
        node.style.textAlign = prop.get_value(frame) + '';
    },
    white_space: function (frame: number, node: SVGElement, prop: TextValue) {
        node.style.whiteSpace = prop.get_value(frame) + '';
    },
    points: function (frame: number, node: SVGElement, prop: PointsValue) {
        node.setAttribute("points", prop.get_repr(frame));
    },

    dx: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("dx", prop.get_repr(frame));
    },
    dy: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("dy", prop.get_repr(frame));
    },
    content: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: TextValue) {
        node.textContent = prop.get_repr(frame);
    },
    href: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: TextValue) {
        node.setAttribute("href", prop.get_repr(frame));
    },

    letter_spacing: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: TextValue) {
        node.setAttribute("letter-spacing", prop.get_repr(frame));
    },
    word_spacing: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: TextValue) {
        node.setAttribute("word-spacing", prop.get_repr(frame));
    },
    shape_rendering: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: TextValue) {
        node.setAttribute("shape-rendering", prop.get_repr(frame));
    },
    color_rendering: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: TextValue) {
        node.setAttribute("color-rendering", prop.get_repr(frame));
    },
    text_rendering: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: TextValue) {
        node.setAttribute("text-rendering", prop.get_repr(frame));
    },
    color_interpolation: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: TextValue) {
        node.setAttribute("color-rendering", prop.get_repr(frame));
    },

    std_dev: function (frame: number, node: SVGFEGaussianBlurElement, prop: VectorValue) {
        node.setAttribute("stdDeviation", prop.get_repr(frame));
    },
    filter: function (frame: number, node: SVGElement, prop: TextValue) {
        node.setAttribute("filter", prop.get_repr(frame));
    },
    in: function (frame: number, node: SVGElement, prop: TextValue) {
        node.setAttribute("in", prop.get_repr(frame));
    },
    // <feBlend>, <feComposite>, <feDisplacementMap>
    in2: function (frame: number, node: SVGElement, prop: TextValue) {
        node.setAttribute("in2", prop.get_repr(frame));
    }
};
/* <INSERT name-to-attr.ins.ts > */
const name_to_attr : {
    [key: string]: string
}  = {
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
 "std_dev": "stdDeviation",
 "dx": "dx",
 "dy": "dy",
 "input": "in",
 "edge_mode": "edgeMode",
 "spread": "spreadMethod",
 "gradient_units": "gradientUnits",
 "gradient_transform": "gradientTransform",
 "x1": "x1",
 "y1": "y1",
 "x2": "x2",
 "y2": "y2",
 "type": "type",
 "r": "r",
 "cx": "cx",
 "cy": "cy",
 "fx": "fx",
 "fy": "fy",
 "fr": "fr",
 "offset": "offset",
 "color": "stop-color",
 "path": "path",
 "marker_start": "marker-start",
 "marker_mid": "marker-mid",
 "marker_end": "marker-end",
 "points": "points",
 "rx": "rx",
 "ry": "ry",
 "d": "d"
};
/* </INSERT> */
function update_dom(frame: number, target: Element) {
    const { _start, _end: end } = target;
    let cur: Node | undefined = _start;
    // console.log("update_dom", target.constructor.name);
    do {
        const elem = (cur as any)._element;
        if (elem) {
            for (let [n, v] of Object.entries(cur)) {
                if (v instanceof ValueSet || v instanceof Animatable) {
                    const f = PROP_MAP[n];
                    if (f) {
                        f(frame, elem, v, target);
                    } else if (n.startsWith("data-")) {
                        // TODO
                    } else {
                        const a = name_to_attr[n];
                        if (a) {
                            elem.setAttribute(a, v.get_repr(frame));
                            continue;
                        }
                        throw new Error(`Unexpected property ${n}`);
                    }
                }
            }
        }
    } while (cur !== end && (cur = cur._next));
}

const NS_SVG = "http://www.w3.org/2000/svg";

declare module "../base" {
    interface Chars {
        _element?: Text;
        to_dom(doc: typeof SVGElement.prototype.ownerDocument): Text;
        update_dom(frame: number): void;
    }
    interface Element {
        _element?: SVGElement;
        to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement;
    }
}

declare module "../root" {
    interface Root {
        update_dom(frame: number): void;
    }
}

declare module "../containers" {
    interface Container {
        update_dom(frame: number): void;
        stepper(): Stepper;
    }
}

function set_svg(elem: SVGElement, node: Element): SVGElement {
    if (Object.hasOwn(node, 'id')) {
        const { id } = node;
        if (id) {
            elem.id = id;
        }
    }
    return elem;
}

Container.prototype.to_dom = function (doc: typeof SVGElement.prototype.ownerDocument): SVGElement {
    const con = (this._element = doc.createElementNS(
        NS_SVG,
        (<typeof Container>this.constructor).tag
    ));
    for (const sub of this.children<Element>()) {
        con.appendChild(sub.to_dom(doc));
    }
    return set_svg(con, this);
}

Element.prototype.to_dom = function (doc: typeof SVGElement.prototype.ownerDocument): SVGElement {
    const e = (this._element = doc.createElementNS(
        NS_SVG,
        (<typeof Element>this.constructor).tag
    ));
    return set_svg(e, this);
}

Chars.prototype.to_dom = function (doc: typeof SVGElement.prototype.ownerDocument) {
    return (this._element = doc.createTextNode(this.content.get_value(0)));
}

Root.prototype.to_dom = function to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement {
    const element = this.view.to_dom(doc);
    element.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    element.setAttributeNS("http://www.w3.org/2000/svg", "version", "1.1");
    return element;
}

Container.prototype.update_dom = function (frame: number) {
    update_dom(frame, this);
}

Root.prototype.update_dom = function (frame: number) {
    update_dom(frame, this);
}

Chars.prototype.update_dom = function (frame: number) {
    // TODO: this function not called
    const elem: Text = (this as any)._element;
    if (elem) {
        elem.textContent = this.content.get_value(frame);
    }
}

Container.prototype.stepper = function () {
    let max = 0;
    let min = 0;
    for (let v of this.enum_values()) {
        const { start, end } = v.kfs_stepper!;
        if (isFinite(end) && end > max) {
            max = end;
        }
        if (isFinite(start) && start < min) {
            min = start;
        }
    }
    return Stepper.create((n) => update_dom(n, this), min, max);
}

Font.prototype.enum_attibutes = function* (frame: number) {
    for (let [n, _] of Object.entries(this)) {
        switch (n) {
            case "family":
                yield { name: "font-family", value: this.family.get_repr(frame) }
                break;
            case "size":
                yield { name: "font-size", value: this.size.get_repr(frame) }
                break;
            case "style":
                yield { name: "font-style", value: this.style.get_repr(frame) }
                break;
            case "weight":
                yield { name: "font-weight", value: this.weight.get_repr(frame) }
                break;
            case "variant":
                yield { name: "font-variant", value: this.variant.get_repr(frame) }
                break;
            case "stretch":
                yield { name: "font-stretch", value: this.stretch.get_repr(frame) }
                break;
            case "size-adjust":
                yield { name: "font-size-adjust", value: this.size_adjust.get_repr(frame) }
                break;
        }
    }
}

Stroke.prototype.enum_attibutes = function* (frame: number) {
    for (let [n, _] of Object.entries(this)) {
        switch (n) {
            case "color":
                yield { name: "stroke", value: this.color.get_repr(frame) }
                break;
            case "opacity":
                yield { name: "stroke-opacity", value: this.opacity.get_repr(frame) }
                break;
            case "width":
                yield { name: "stroke-width", value: this.width.get_repr(frame) }
                break;
            case "miter_limit":
                yield { name: "stroke-miterlimit", value: this.miter_limit.get_repr(frame) }
                break;
            case "dash_array":
                yield { name: "stroke-dasharray", value: this.dash_array.get_repr(frame) }
                break;
            case "dash_offset":
                yield { name: "stroke-dashoffset", value: this.dash_offset.get_repr(frame) }
                break;
            case "linecap":
                yield { name: "stroke-linecap", value: this.line_cap.get_repr(frame) }
                break;
            case "linejoin":
                yield { name: "stroke-linejoin", value: this.line_join.get_repr(frame) }
                break;
            default:
                continue;
        }
    }
}

Fill.prototype.enum_attibutes = function* (frame: number) {
    for (let [n,] of Object.entries(this)) {
        let name: string, value: string;
        switch (n) {
            case "color":
                name = "fill";
                value = this.color.get_repr(frame);
                break;
            case "opacity":
                name = "fill-opacity";
                value = this.opacity.get_repr(frame);
                break;
            case "rule":
                name = "fill-rule";
                value = this.rule.get_repr(frame);
                break;
            default:
                continue;
        }
        yield { name, value: value }
    }
}

Transform.prototype.enum_attibutes = function* (frame: number) {
    for (let [n,] of Object.entries(this)) {
        let name: string, value: string;
        switch (n) {
            case "all":
                name = "transform";
                value = this.all.map((x) => x.get_repr(frame)).join(" ");
                break;
            case "origin":
                name = "transform-origin";
                value = this.origin.get_repr(frame);
                break;
            case "box":
                name = "transform-box";
                value = this.box.get_repr(frame);
                break;
            default:
                continue;
        }
        yield { name, value: value }
    }
}

ViewBox.prototype.enum_attibutes = function* (frame: number) {
    let box = false;
    for (let [n,] of Object.entries(this)) {
        switch (n) {
            case "size":
            case "position":
                box = true;
                break;
            case "fit":
                yield { name: "preserveAspectRatio", value: this.fit.get_repr(frame) }
                break;
            default:
                continue;
        }
    }
    if (box) {
        const s = this.size.get_value(frame);
        const p = this.position.get_value(frame);
        const value = `${p[0]} ${p[1]} ${s[0]} ${s[1]}`;
        yield { name: "viewBox", value }
    }
}
