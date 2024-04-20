import { Animatable, NVectorValue, NumberValue, RGBValue } from "./keyframes.js";
export class ValueSet {
    *enum_values() {
        for (const sub of Object.values(this)) {
            if (sub instanceof Animatable) {
                // let { value } = sub;
                // if (value instanceof Keyframes) {
                //     yield value;
                // }
                yield sub;
            }
        }
    }
    update_prop(frame, node) {
        throw new Error(`Not implemented`);
    }
}
export class Box extends ValueSet {
    size;
    position;
    constructor(position, size) {
        super();
        this.size = new NVectorValue(size);
        this.position = new NVectorValue(position);
    }
    update_prop(frame, node) {
        const size = this.size.get_value(frame);
        const pos = this.position.get_value(frame);
        node.x.baseVal.value = pos[0];
        node.y.baseVal.value = pos[1];
        node.width.baseVal.value = size[0];
        node.height.baseVal.value = size[1];
    }
}
export class Stroke extends ValueSet {
    width;
}
export class Fill extends ValueSet {
    get opacity() {
        const v = new NumberValue(1);
        Object.defineProperty(this, "opacity", { value: v, writable: true, enumerable: true });
        return v;
    }
    get color() {
        const v = new RGBValue([0, 0, 0]);
        Object.defineProperty(this, "color", { value: v, writable: true, enumerable: true });
        return v;
    }
}
export class Transform extends ValueSet {
    anchor;
    position;
    scale;
    rotation;
    skew;
    skew_axis;
}
export class OpacityProp extends NumberValue {
}
export class RectSizeProp extends NVectorValue {
}
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
    transform: function (frame, node, prop) {
        const { anchor, position, scale, rotation } = prop;
        // node.transform.baseVal.
        // let x = prop.get_value(frame);
        // node.width.baseVal.value = x[0];
        // node.height.baseVal.value = x[1];
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
};
//# sourceMappingURL=properties.js.map