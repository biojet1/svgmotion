import { Vector } from "../geom/index.js";
import { xget } from "../model/index.js";
import { Element } from "../model/elements.js";
const BOTH_MATCH =
    /^\s*(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)\s*(in|pt|px|mm|cm|m|km|Q|pc|yd|ft||%|em|ex|ch|rem|vw|vh|vmin|vmax|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)\s*$/i;

export function parse_svg_length(amount: number, units: string | undefined, ctx: { relative_length?: number, ppi?: number, vw?: number, vh?: number, font_size?: number, font_height?: number }) {
    switch (units) {
        case "%": {
            const { relative_length } = ctx;
            if (relative_length == undefined) {
                throw Error(`No relative_length`);
            }
            return amount * relative_length / 100.0;
        }
        case "mm": {
            const { ppi = 96 } = ctx;
            return amount * ppi * 0.0393701
        }
        case "cm": {
            const { ppi = 96 } = ctx;
            return amount * ppi * 0.393701
        }
        case "in": {
            const { ppi = 96 } = ctx;
            return amount * ppi
        }
        case "vw": {
            const { vw } = ctx;
            if (vw == undefined) {
                throw Error(`No vw`);
            }
            return amount * vw / 100.0
        }
        case "vh": {
            const { vh } = ctx;
            if (vh == undefined) {
                throw Error(`No vh`);
            }
            return amount * vh / 100.0
        }
        case "vmin": {
            const { vh, vw } = ctx;
            if (vh == undefined || vw == undefined) {
                throw Error(`No vh/vw`);
            }
            return amount * Math.min(vw, vh) / 100.0
        }
        case "vmax": {
            const { vh, vw } = ctx;
            if (vh == undefined || vw == undefined) {
                throw Error(`No vh/vw`);
            }
            return amount * Math.max(vw, vh) / 100.0
        }
        case "pt": {
            return amount * 4.0 / 3.0
        }
        case "pc": {
            return amount * 16.0
        }
        case "em": {
            const { font_size } = ctx;
            if (font_size == undefined) {
                throw Error(`No font_size`);
            }
            return amount * font_size;
        }
        case "em": {
            const { font_height } = ctx;
            if (font_height == undefined) {
                throw Error(`No font_height`);
            }
            return amount * font_height;
        }
        case undefined:
        case "px":
        case "": {
            return amount
        }
    }
    throw Error(`Unexpected unit "${units}"`);
}


function get_vp_width(node: Element, frame: number): number {
    const ov = node.owner_viewport();
    if (ov) {
        if (Object.hasOwn(ov, "view_box")) {
            const s = ov.view_box.size.get_value(frame);
            return s.x;
        }
        return get_vp_width(ov, frame);
    }
    throw new Error(`cant get_vp_width`);
    // return 100;
}

function get_vp_height(node: Element, frame: number): number {
    const ov = node.owner_viewport();
    if (ov) {
        if (Object.hasOwn(ov, "view_box")) {
            const s = ov.view_box.size.get_value(frame);
            return s.y;
        }
        return get_vp_height(ov, frame);
    }
    throw new Error(`cant get_vp_height`);
    // return 100;
}

function get_vp_size(node: Element, frame: number, w?: number, h?: number): Vector {
    const ov = node.owner_viewport();
    if (ov) {
        if (Object.hasOwn(ov, "view_box")) {
            const s = ov.view_box.size.get_value(frame);
            return Vector.pos(w ?? s.x, h ?? s.y);
        }
        return get_vp_size(ov, frame, w, h);
    }
    throw new Error(`cant get_vp_size`);
    // return Vector.pos(100, 100);
}

export class ComputeLength {
    node: Element;
    frame: number;
    length_mode: string | undefined;
    constructor(node: Element, frame: number) {
        this.node = node;
        this.frame = frame;
        // this.length_mode = undefined;
    }
    get vw() {
        const n = get_vp_width(this.node, this.frame);
        return xget(this, "vw", n);
    }
    get vh() {
        const n = get_vp_height(this.node, this.frame);
        return xget(this, "vh", n);
    }
    get relative_length() {
        if (!this.length_mode) {
            // const x = get_vp_width(this.node, this.frame);
            // const y = get_vp_height(this.node, this.frame);
            const { x, y } = get_vp_size(this.node, this.frame);
            // const n = Math.sqrt((x ** 2 + y ** 2)c
            // const n = Math.sqrt(((x + y) * (x + y) - 2 * x * y) / 2)
            const n = Math.hypot(x, y) / Math.sqrt(2)
            //  * Math.SQRT1_2
            return xget(this, "relative_length", n);
        } else if (this.length_mode.startsWith("w")) {
            const n = get_vp_width(this.node, this.frame);
            return xget(this, "relative_length", n);
        } else if (this.length_mode.startsWith("h")) {
            const n = get_vp_height(this.node, this.frame);
            return xget(this, "relative_length", n);
        } else {
            throw new Error(``);
        }
    }

    // relative_length?: number, ppi?: number, ,
    parse_len(value: string, per_len = -1) {
        const m = BOTH_MATCH.exec(value);
        // console.log(`parse_len ${value} ${this.node.id}`)
        if (m) {
            const num = parseFloat(m[1]);
            const suf = m.pop();
            const n = parse_svg_length(num, suf, this);
            // console.log(`parse_svg_length OK ${value} ${n} [${this.node.constructor.name}]`);
            return n;
        }
        console.log(`Unexpected length "${value}" ${this.node.id}`);
        return 0;
        // throw new Error(`Unexpected length "${value}"`);
    }
}