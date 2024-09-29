import { Stepper } from "../track/stepper.js";
import { ScalarValue, PointsValue, TextValue, Animatable, VectorValue } from "../model/value.js";
import { Container, Root } from "../model/elements.js";
import { Node } from "../model/linked.js";
import { Transform, Fill, ViewBox, Font, Stroke, ValueSet } from "../model/valuesets.js";
import { Element, TextData } from "../model/base.js";

const PROP_MAP: {
    [key: string]: ((frame: number, elem: any, prop: any, node: Element) => void);
} = {
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
    view_box: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ViewBox) {
        node.setAttribute("viewBox", prop.get_repr(frame));
    },
    d: function (frame: number, node: SVGPathElement, prop: TextValue) {
        node.setAttribute("d", prop.get_repr(frame));
    },
    fit_view: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: TextValue) {
        node.setAttribute("preserveAspectRatio", prop.get_repr(frame));
    },
    transform: function (frame: number, node: SVGElement, prop: Transform) {
        for (const { name, value } of prop.enum_attibutes(frame)) {
            node.setAttribute(name, value);
        }
    },
    fill: function (frame: number, node: SVGSVGElement, prop: Fill) {
        for (let [n, v] of Object.entries(prop)) {
            let k: string, s: string;
            switch (n) {
                case "color":
                    k = "fill";
                    s = prop.color.get_repr(frame);
                    break;
                case "opacity":
                    k = "fill-opacity";
                    s = prop.opacity.get_repr(frame);
                    break;
                case "rule":
                    k = "fill-rule";
                    s = prop.rule.get_repr(frame);
                    break;
                default:
                    continue;
            }
            node.setAttribute(k, s);
        }
    },
    stroke: function (frame: number, node: SVGSVGElement, prop: Stroke) {
        for (let [n, v] of Object.entries(prop)) {
            let k: string, s: string;
            switch (n) {
                case "color":
                    [k, s] = ["stroke", prop.color.get_repr(frame)];
                    break;
                case "opacity":
                    [k, s] = ["stroke-opacity", prop.opacity.get_repr(frame)];
                    break;
                case "width":
                    [k, s] = ["stroke-width", prop.width.get_repr(frame)];
                    break;
                case "miter_limit":
                    [k, s] = ["stroke-miterlimit", prop.miter_limit.get_repr(frame)];
                    break;
                case "dash_array":
                    [k, s] = ["stroke-dasharray", prop.dash_array.get_repr(frame)];
                    break;
                case "dash_offset":
                    [k, s] = ["stroke-dashoffset", prop.dash_offset.get_repr(frame)];
                    break;
                case "linecap":
                    [k, s] = ["stroke-linecap", prop.linecap.get_repr(frame)];
                    break;
                case "linejoin":
                    [k, s] = ["stroke-linejoin", prop.linejoin.get_repr(frame)];
                    break;
                default:
                    continue;
            }
            node.setAttribute(k, s);
        }
    },
    font: function (frame: number, node: SVGSVGElement, prop: Font) {
        for (const { name, value } of prop.enum_attibutes(frame)) {
            node.setAttribute(name, value);
        }
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
    },
};

function update_dom(frame: number, target: Element) {
    const { _start, _end: end } = target;
    let cur: Node | undefined = _start;
    console.log("update_dom", target.constructor.name);
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
                        throw new Error(`Unexpected property ${n}`);
                    }
                }
            }
        }
    } while (cur !== end && (cur = cur._next));
}

const NS_SVG = "http://www.w3.org/2000/svg";

declare module "../model/base" {
    interface TextData {
        _element?: Text;
        to_dom(doc: typeof SVGElement.prototype.ownerDocument): Text;
        update_dom(frame: number): void;
    }
    interface Element {
        _element?: SVGElement;
        to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement;
    }
}

declare module "../model/elements" {
    interface Container {
        update_dom(frame: number): void;
        stepper(): Stepper;
    }
    interface Root {
        update_dom(frame: number): void;
    }
}

function set_svg(elem: SVGElement, node: Element): SVGElement {
    const { id } = node;
    if (id) {
        elem.id = id;
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

TextData.prototype.to_dom = function (doc: typeof SVGElement.prototype.ownerDocument) {
    return (this._element = doc.createTextNode(this.content.get_value(0)));
}

Root.prototype.to_dom = function to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement {
    const element = this.view.to_dom(doc);
    element.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    element.setAttributeNS("http://www.w3.org/2000/svg", "version", "1.1");
    const defs = doc.createElementNS(NS_SVG, "defs");
    // console.log("Root.prototype.to_dom:");
    // console.dir(this.defs);
    for (let [n, v] of Object.entries(this.defs)) {
        // console.log("defs appendChild", n);
        // console.dir(v);
        defs.appendChild(v.to_dom(doc));
    }
    if (defs.firstElementChild) {
        element.insertBefore(defs, element.firstChild);
    }
    // element.setAttribute("version", "2.0");
    return element;
}

Container.prototype.update_dom = function (frame: number) {
    update_dom(frame, this);
}

Root.prototype.update_dom = function (frame: number) {
    update_dom(frame, this);
    Object.values(this.defs).map((elem) => update_dom(frame, elem));
}

TextData.prototype.update_dom = function (frame: number) {
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
