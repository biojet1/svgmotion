import { VectorValue, ScalarValue, PointsValue, RGBValue, TextValue } from "../model/value.js";
import { Animatable } from "../model/value.js";
import { Container, Root, Item } from "../model/node.js";
import { Node } from "../model/linked.js";
import { Transform, Fill, Box, Font, Stroke, ValueSet } from "../model/valuesets.js";

const FILL_MAP: {
    [key: string]: ((frame: number, node: SVGElement, prop: any) => void);
} = {
    opacity: function (frame: number, node: SVGElement, prop: ScalarValue) {
        node.setAttribute("fill-opacity", prop.get_percentage_repr(frame));
    },
    color: function (frame: number, node: SVGElement, prop: RGBValue) {
        node.setAttribute("fill", prop.get_rgb_repr(frame));
    },
};

const PROP_MAP: {
    [key: string]: ((frame: number, elem: any, prop: any, node: Container | Item) => void);
} = {
    opacity: function (frame: number, node: SVGElement, prop: ScalarValue) {
        node.setAttribute("opacity", prop.get_percentage_repr(frame));
    },
    x: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ScalarValue) {
        node.setAttribute("x", prop.get_length_repr(frame));
    },
    y: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ScalarValue) {
        node.setAttribute("y", prop.get_length_repr(frame));
    },
    cx: function (frame: number, node: SVGCircleElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("cx", prop.get_length_repr(frame));
    },
    cy: function (frame: number, node: SVGCircleElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("cy", prop.get_length_repr(frame));
    },
    r: function (frame: number, node: SVGCircleElement, prop: ScalarValue) {
        node.setAttribute("r", prop.get_length_repr(frame));
    },
    width: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ScalarValue) {
        node.setAttribute("width", prop.get_length_repr(frame));
    },
    height: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: ScalarValue) {
        node.setAttribute("height", prop.get_length_repr(frame));
    },
    rx: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("rx", prop.get_length_repr(frame));
    },
    ry: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: ScalarValue) {
        node.setAttribute("ry", prop.get_length_repr(frame));
    },
    view_box: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: Box) {
        const s = prop.size.get_value(frame);
        const p = prop.position.get_value(frame);
        // get_vbox_repr
        node.setAttribute("viewBox", `${p[0]} ${p[1]} ${s[0]} ${s[1]}`);
    },
    d: function (frame: number, node: SVGPathElement, prop: TextValue) {
        const s = prop.get_value(frame);
        node.setAttribute("d", s);
    },
    fit_view: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: TextValue) {
        const s = prop.get_value(frame);
        // prop.format_par()
        node.setAttribute("preserveAspectRatio", s);
    },
    transform: function (frame: number, node: SVGElement, prop: Transform) {
        node.setAttribute("transform", prop.get_transform_repr(frame));
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
                    node.setAttribute("stroke-width", v.get_length_repr(frame));
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
        node.style.whiteSpace = prop.get_value(frame) + '';
    },

    points: function (frame: number, node: SVGElement, prop: PointsValue) {
        node.setAttribute("points", prop.get_points_repr(frame));
    },

};

function update_dom(frame: number, target: Item | Container) {
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

declare module "../model/node" {
    interface Container {
        _element?: SVGElement;
        to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement;
        update_dom(frame: number): void;
    }
    interface Item {
        _element?: SVGElement;
        to_dom(doc: typeof SVGElement.prototype.ownerDocument): SVGElement;
        update_dom(frame: number): void;
    }
    interface Root {
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

function set_svg(elem: SVGElement, node: Item | Container): SVGElement {
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
    for (const sub of this.children<Container | Item>()) {
        con.appendChild(sub.to_dom(doc));
    }
    return set_svg(con, this);
}

Item.prototype.to_dom = function (doc: typeof SVGElement.prototype.ownerDocument): SVGElement {
    const e = (this._element = doc.createElementNS(
        NS_SVG,
        (<typeof Item>this.constructor).tag
    ));
    return set_svg(e, this);
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

Item.prototype.update_dom = function (frame: number) {
    update_dom(frame, this);
}

Container.prototype.update_dom = function (frame: number) {
    update_dom(frame, this);
}

RGBValue.prototype.get_rgb_repr = function (frame: number) {
    return (this.value == null) ? 'none' : RGBValue.to_css_rgb(this.get_value(frame));
}

PointsValue.prototype.get_points_repr = function (frame: number) {
    return this.get_value(frame).map(([a, b]) => `${a},${b}`).join(' ')
}

ScalarValue.prototype.get_percentage_repr = function (frame: number) {
    return this.get_value(frame).toFixed(4).replace(/0$/, '');
}

ScalarValue.prototype.get_length_repr = function (frame: number) {
    return this.get_value(frame) + '';
}

VectorValue.prototype.get_anchor_repr = function (frame: number) {
    const [x, y] = this.get_value(frame);
    return `${x}px, ${y}px`;
}

// dump_rgb, get_rgb_rep, get_points_repr