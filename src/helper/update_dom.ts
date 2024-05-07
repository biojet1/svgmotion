import { Animatable, NVectorValue, NumberValue, PointsValue, RGBValue, TextValue, Value } from "../model/keyframes.js";
import { Container, Root, Item } from "../model/node.js";
import { Node } from "../model/linked.js";
import { Transform, Fill, Box, ValueSet, Font, Stroke } from "../model/valuesets.js";

const FILL_MAP: {
    [key: string]: ((frame: number, node: SVGElement, prop: any) => void);
} = {
    opacity: function (frame: number, node: SVGElement, prop: NumberValue) {
        node.setAttribute("fill-opacity", `${prop.get_value(frame)}`);
    },
    color: function (frame: number, node: SVGElement, prop: RGBValue) {
        node.setAttribute("fill", prop.get_value_format_rgb(frame));
    },
};

const PROP_MAP: {
    [key: string]: ((frame: number, node: any, prop: any) => void);
} = {
    opacity: function (frame: number, node: SVGElement, prop: NumberValue) {
        const v = prop.get_value(frame);
        node.style.opacity = v + '';
    },
    size: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: NVectorValue) {
        let [x, y] = prop.get_value(frame);
        node.width.baseVal.value = x;
        node.height.baseVal.value = y;
    },
    position: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: NVectorValue) {
        let x = prop.get_value(frame);
        node.x.baseVal.value = x[0];
        node.y.baseVal.value = x[1];
    },

    x: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: NumberValue) {
        node.x.baseVal.value = prop.get_value(frame);
    },
    y: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: NumberValue) {
        node.y.baseVal.value = prop.get_value(frame);
    },
    cx: function (frame: number, node: SVGCircleElement | SVGEllipseElement, prop: NumberValue) {
        node.cx.baseVal.value = prop.get_value(frame);
    },
    cy: function (frame: number, node: SVGCircleElement | SVGEllipseElement, prop: NumberValue) {
        node.cy.baseVal.value = prop.get_value(frame);
    },
    r: function (frame: number, node: SVGCircleElement, prop: NumberValue) {
        node.r.baseVal.value = prop.get_value(frame);
    },
    width: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: NumberValue) {
        let q = node.width.baseVal;
        // console.log("/////", q);
        q.convertToSpecifiedUnits(1);
        q.value = prop.get_value(frame);

    },
    height: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: NumberValue) {
        let q = node.height.baseVal;
        q.convertToSpecifiedUnits(1);
        q.value = prop.get_value(frame);
    },
    rx: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: NumberValue) {
        node.rx.baseVal.value = prop.get_value(frame);
    },
    ry: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: NumberValue) {
        node.ry.baseVal.value = prop.get_value(frame);
    },
    view_box: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: Box) {
        const s = prop.size.get_value(frame);
        const p = prop.position.get_value(frame);
        node.setAttribute("viewBox", `${p[0]} ${p[1]} ${s[0]} ${s[1]}`);
    },
    d: function (frame: number, node: SVGPathElement, prop: TextValue) {
        const s = prop.get_value(frame);
        node.setAttribute("d", s);
    },
    fit_view: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: TextValue) {
        const s = prop.get_value(frame);
        node.setAttribute("preserveAspectRatio", s);
    },
    transform: function (frame: number, node: SVGElement, prop: Transform) {
        const m = prop.get_matrix(frame);
        node.setAttribute("transform", m.toString());
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
                    node.style.stroke = v.get_value_format_rgb(frame);
                    break;
                case "opacity":
                    node.style.strokeOpacity = v.get_value(frame) + '';
                    break;
                case "width":
                    node.style.strokeWidth = v.get_value(frame);
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

    line_height: function (frame: number, node: SVGElement, prop: NumberValue) {
        node.style.lineHeight = prop.get_value(frame) + '';
    },
    text_align: function (frame: number, node: SVGElement, prop: TextValue) {
        node.style.textAlign = prop.get_value(frame) + '';
    },
    white_space: function (frame: number, node: SVGElement, prop: TextValue) {
        node.style.whiteSpace = prop.get_value(frame) + '';
    },

    points: function (frame: number, node: SVGElement, prop: PointsValue) {
        const v = prop.get_value(frame);
        node.setAttribute("points", v.map(([a, b]) => `${a},${b}`).join(' '));
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
                        f(frame, elem, v);
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
declare module "../model/keyframes" {
    interface RGBValue {
        get_value_format_rgb(frame: number): string;
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
    const defs = doc.createElementNS(NS_SVG, "defs");
    for (let [n, v] of Object.entries(this.defs)) {
        defs.appendChild(v.to_dom(doc));
    }
    if (defs.firstElementChild) {
        element.insertBefore(defs, element.firstChild);
    }
    return element;
}

Item.prototype.update_dom = function (frame: number) {
    update_dom(frame, this);
}

Container.prototype.update_dom = function (frame: number) {
    update_dom(frame, this);
}

RGBValue.prototype.get_value_format_rgb = function (frame: number) {
    return (this.value == null) ? 'none' : RGBValue.to_css_rgb(this.get_value(frame));
}
