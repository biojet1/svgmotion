import { Keyframes, NVectorValue, NumberValue, RGBValue, TextValue, kfe_from_json } from "./keyframes.js";
import { Container, Item } from "./node.js";
import { Transform, Fill, Box } from "./properties.js";



export const UPDATE: {
    [key: string]: any;
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
            if (v) {
                switch (n) {
                    case "opacity":
                        node.style.fillOpacity = (v as NumberValue).get_value(frame) + '';
                        break;
                    case "color":
                        node.style.fill = RGBValue.to_css_rgb((v as RGBValue).get_value(frame));
                        break;
                }
            }
        }
    },
};

