import { RGBValue } from "./keyframes.js";
export const UPDATE = {
    opacity: function (frame, node, prop) {
        const v = prop.get_value(frame);
        node.style.opacity = v + '';
    },
    size: function (frame, node, prop) {
        let [x, y] = prop.get_value(frame);
        node.width.baseVal.value = x;
        node.height.baseVal.value = y;
    },
    position: function (frame, node, prop) {
        let x = prop.get_value(frame);
        node.x.baseVal.value = x[0];
        node.y.baseVal.value = x[1];
    },
    x: function (frame, node, prop) {
        node.x.baseVal.value = prop.get_value(frame);
    },
    y: function (frame, node, prop) {
        node.y.baseVal.value = prop.get_value(frame);
    },
    cx: function (frame, node, prop) {
        node.cx.baseVal.value = prop.get_value(frame);
    },
    cy: function (frame, node, prop) {
        node.cy.baseVal.value = prop.get_value(frame);
    },
    r: function (frame, node, prop) {
        node.r.baseVal.value = prop.get_value(frame);
    },
    width: function (frame, node, prop) {
        let q = node.width.baseVal;
        // console.log("/////", q);
        q.convertToSpecifiedUnits(1);
        q.value = prop.get_value(frame);
    },
    height: function (frame, node, prop) {
        let q = node.height.baseVal;
        q.convertToSpecifiedUnits(1);
        q.value = prop.get_value(frame);
    },
    rx: function (frame, node, prop) {
        node.rx.baseVal.value = prop.get_value(frame);
    },
    ry: function (frame, node, prop) {
        node.ry.baseVal.value = prop.get_value(frame);
    },
    view_box: function (frame, node, prop) {
        const s = prop.size.get_value(frame);
        const p = prop.position.get_value(frame);
        node.setAttribute("viewBox", `${p[0]} ${p[1]} ${s[0]} ${s[1]}`);
    },
    d: function (frame, node, prop) {
        const s = prop.get_value(frame);
        node.setAttribute("d", s);
    },
    fit_view: function (frame, node, prop) {
        const s = prop.get_value(frame);
        node.setAttribute("preserveAspectRatio", s);
    },
    transform: function (frame, node, prop) {
        const m = prop.get_matrix(frame);
        node.setAttribute("transform", m.toString());
    },
    fill: function (frame, node, prop) {
        for (let [n, v] of Object.entries(prop)) {
            if (v) {
                switch (n) {
                    case "opacity":
                        node.style.fillOpacity = v.get_value(frame) + '';
                        break;
                    case "color":
                        node.style.fill = RGBValue.to_css_rgb(v.get_value(frame));
                        break;
                }
            }
        }
    },
};
// export const FROM_JSON: {
//     [key: string]: any;
// } = {
//     opacity: function (node: Item|Container, prop: NumberValue, x:any) {
//         const { k } = x;
//         if (k == null) {
//             return new NumberValue((x.v));
//         } else {
//             return new NumberValue(k.map((v) =>
//                 kfe_from_json(v, this.value_from_json(v.v)
//                 )
//             ));
//         }
//     },
// };
//# sourceMappingURL=update_dom.js.map