import { Animatable, NVectorValue, NumberValue, PositionValue, RGBValue } from "./keyframes.js";

export class ValueSet {
    *enum_values(): Generator<Animatable<any>, void, unknown> {
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
    update_prop(frame: number, node: SVGElement) {
        throw new Error(`Not implemented`);
    }
}

export class Box extends ValueSet {
    size: PositionValue;
    position: PositionValue;
    constructor(position: Iterable<number>, size: Iterable<number>) {
        super();
        this.size = new NVectorValue(size);
        this.position = new NVectorValue(position);
    }
    update_prop(frame: number, node: SVGSVGElement) {
        const size = this.size.get_value(frame);
        const pos = this.position.get_value(frame);
        node.x.baseVal.value = pos[0];
        node.y.baseVal.value = pos[1];
        node.width.baseVal.value = size[0];
        node.height.baseVal.value = size[1];
    }
}

export class Stroke extends ValueSet {
    width?: NumberValue;
}

export class Fill extends ValueSet {
    get opacity() {
        const v = new NumberValue(1);
        const o = { value: v, writable: true, enumerable: true };
        Object.defineProperty(this, "opacity", o)
        return v;
    }
    get color() {
        const v = new RGBValue([0, 0, 0]);
        const o = { value: v, writable: true, enumerable: true };
        Object.defineProperty(this, "color", o)
        return v;
    }
}


export class Transform extends ValueSet {
    anchor?: PositionValue;
    position?: PositionValue;
    scale?: NVectorValue;
    rotation?: NumberValue;
    skew?: NumberValue;
    skew_axis?: NumberValue;

}



export class OpacityProp extends NumberValue {
    // update_prop(frame: number, node: SVGElement) {
    //     const v = this.get_value(frame);
    //     node.style.opacity = v + '';
    // }
}

export class RectSizeProp extends NVectorValue {
    // update_prop(frame: number, node: SVGRectElement) {
    //     let x = this.get_value(frame);
    //     node.width.baseVal.value = x[0];
    //     node.height.baseVal.value = x[1];
    // }
}


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
    transform: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: Transform) {
        const { anchor, position, scale, rotation } = prop;
        // node.transform.baseVal.
        // let x = prop.get_value(frame);
        // node.width.baseVal.value = x[0];
        // node.height.baseVal.value = x[1];
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
        node.width.baseVal.value = prop.get_value(frame);
    },
    height: function (frame: number, node: SVGRectElement | SVGSVGElement, prop: NumberValue) {
        node.height.baseVal.value = prop.get_value(frame);
    },
    rx: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: NumberValue) {
        node.rx.baseVal.value = prop.get_value(frame);
    },
    ry: function (frame: number, node: SVGRectElement | SVGEllipseElement, prop: NumberValue) {
        node.ry.baseVal.value = prop.get_value(frame);
    },
}