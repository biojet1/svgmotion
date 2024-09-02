import { VectorValue, ScalarValue, PointsValue, RGBValue, TextValue } from "../model/value.js";
import { Animatable } from "../model/value.js";
import { Container, Root } from "../model/elements.js";
import { Node } from "../model/linked.js";
import { Transform, Fill, Box, Font, Stroke, ValueSet } from "../model/valuesets.js";
import { Stepper } from "../track/stepper.js";
import { Element, TextData } from "../model/base.js";

const FILL_MAP: {
    [key: string]: ((frame: number, node: SVGElement, prop: any) => void);
} = {
    opacity: function (frame: number, node: SVGElement, prop: ScalarValue) {
        node.setAttribute("fill-opacity", prop.get_percentage_repr(frame));
    },
    color: function (frame: number, node: SVGElement, prop: RGBValue) {
        // console.log("Set color", prop.constructor.name);
        // console.dir(prop);
        node.setAttribute("fill", prop.get_rgb_repr(frame));
    },
};

const PROP_MAP: {
    [key: string]: ((frame: number, elem: any, prop: any, node: Element) => void);
} = {
    opacity: function (frame: number, node: SVGElement, prop: ScalarValue) {
        node.setAttribute("opacity", prop.get_percentage_repr(frame));
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
    view_box: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: Box) {
        node.setAttribute("viewBox", prop.get_repr(frame));
    },
    d: function (frame: number, node: SVGPathElement, prop: TextValue) {
        node.setAttribute("d", prop.get_repr(frame));
    },
    fit_view: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: TextValue) {
        node.setAttribute("preserveAspectRatio", prop.get_repr(frame));
    },
    transform: function (frame: number, node: SVGElement, prop: Transform) {
        node.setAttribute("transform", prop.get_repr(frame));
    },
    anchor: function (frame: number, node: SVGElement, prop: VectorValue) {
        // node.style.transformOrigin = prop.get_anchor_repr(frame);
        node.setAttribute("transform-origin", prop.get_anchor_repr(frame));

    },
    fill: function (frame: number, node: SVGSVGElement, prop: Fill) {
        for (let [n, v] of Object.entries(prop)) {
            if (v instanceof Animatable) {
                const f = FILL_MAP[n];
                if (f) {
                    f(frame, node, v);
                } else {
                    throw new Error(`Unexpected property ${n}`);
                }
            }
        }
    },
    stroke: function (frame: number, node: SVGSVGElement, prop: Stroke) {
        for (let [n, v] of Object.entries(prop)) {
            switch (n) {
                case "color":
                    node.setAttribute("stroke", v.get_rgb_repr(frame));
                    break;
                case "opacity":
                    node.style.strokeOpacity = v.get_percentage_repr(frame) + '';
                    break;
                case "width":
                    node.setAttribute("stroke-width", v.get_repr(frame));
                    break;
                case "miter_limit":
                    node.style.strokeMiterlimit = v.get_value(frame);
                    break;
                case "dash_array":
                    node.style.strokeDasharray = v.get_value(frame);
                    break;
                case "dash_offset":
                    node.style.strokeDashoffset = v.get_value(frame);
                    break;
            }
        }
    },
    font: function (frame: number, node: SVGSVGElement, prop: Font) {
        for (let [n, v] of Object.entries(prop)) {
            switch (n) {
                case "weight":
                    node.style.fontWeight = v.get_value(frame);
                    break;
                case "size":
                    node.style.fontSize = v.get_value(frame);
                    break;
                case "family":
                    node.style.fontFamily = v.get_value(frame);
                    break;
            }
        }
    },
    line_height: function (frame: number, node: SVGElement, prop: ScalarValue) {
        node.style.lineHeight = prop.get_value(frame) + '';
    },
    text_align: function (frame: number, node: SVGElement, prop: TextValue) {
        node.style.textAlign = prop.get_value(frame) + '';
    },
    white_space: function (frame: number, node: SVGElement, prop: TextValue) {
        /// update<white-space>
        node.style.whiteSpace = prop.get_value(frame) + '';
    },
    points: function (frame: number, node: SVGElement, prop: PointsValue) {
        node.setAttribute("points", prop.get_points_repr(frame));
    },
    font_size: function (frame: number, node: SVGElement, prop: ScalarValue) {
        node.setAttribute("font-size", prop.get_repr(frame));
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
};

function update_dom(frame: number, target: Element) {
    const { _start, _end: end } = target;
    let cur: Node | undefined = _start;
    do {
        const elem = (cur as any)._element;
        if (elem) {
            for (let [n, v] of Object.entries(cur)) {
                if (v instanceof ValueSet || v instanceof Animatable) {
                    const f = PROP_MAP[n];
                    if (f) {
                        f(frame, elem, v, target);
                    } else {
                        throw new Error(`Unexpected property ${n}`);
                    }
                }
            }
        }
    } while (cur !== end && (cur = cur._next));
}

const NS_SVG = "http://www.w3.org/2000/svg";

declare module "../model/elements" {
    interface Container {
        // _element?: SVGElement;
        to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement;
        update_dom(frame: number): void;
        stepper(): Stepper;
    }

    interface Root {
        to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement;
    }
}

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

declare module "../model/value" {
    interface RGBValue {
        get_rgb_repr(frame: number): string;
    }
    interface PointsValue {
        get_points_repr(frame: number): string;
    }
    interface ScalarValue {
        get_percentage_repr(frame: number): string;
        get_length_repr(frame: number): string;
    }
    interface VectorValue {
        get_anchor_repr(frame: number): string;
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
    for (let [n, v] of Object.entries(this.defs)) {
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


RGBValue.prototype.get_rgb_repr = function (frame: number) {
    return (this.value == null || (this.value as any) == 'none') ? 'none' : RGBValue.to_css_rgb(this.get_value(frame));
}

PointsValue.prototype.get_points_repr = function (frame: number) {
    return this.get_value(frame).map(([a, b]) => `${a},${b}`).join(' ')
}

ScalarValue.prototype.get_percentage_repr = function (frame: number) {
    return this.get_value(frame).toFixed(4).replace(/0$/, '');
}

ScalarValue.prototype.get_length_repr = function (frame: number) {
    return this.get_repr(frame);
}

VectorValue.prototype.get_anchor_repr = function (frame: number) {
    const [x, y] = this.get_value(frame);
    return `${x}px, ${y}px`;
}

// dump_rgb, get_rgb_rep, get_points_repr