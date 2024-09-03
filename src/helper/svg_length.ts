import { xget } from "../model/index.js";
import { Element } from "../model/base.js";
const BOTH_MATCH =
    /^\s*(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)\s*(in|pt|px|mm|cm|m|km|Q|pc|yd|ft||%|em|ex|ch|rem|vw|vh|vmin|vmax|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)\s*$/i;

export function parse_svg_length(amount: number, units: string | undefined, ctx: { relative_length?: number, ppi?: number, vw?: number, vh?: number, font_size?: number, font_height?: number }) {
    // console.log(`parse_svg_length ${amount} ${units}`)
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

export class ComputeLength {
    node: Element;
    frame: number;
    length_mode: string | undefined;

    constructor(node: Element, frame: number) {
        this.node = node;
        this.frame = frame;
        // this.length_mode = undefined;
    }

    get font_size() {
        const n = this.node.get_font_size(this.frame);
        if (!isFinite(n) || n <= 0) {
            throw new Error(`Invalid font_size ${n}`);
        }
        return xget(this, "font_size", n);
    }

    get vw() {
        const n = this.node.get_vp_width(this.frame);
        return xget(this, "vw", n);
    }

    get vh() {
        const n = this.node.get_vp_height(this.frame);
        return xget(this, "vh", n);
    }

    get relative_length() {
        if (!this.length_mode) {
            const { x, y } = this.node.get_vp_size(this.frame);
            // const n = Math.sqrt((x ** 2 + y ** 2)c
            // const n = Math.sqrt(((x + y) * (x + y) - 2 * x * y) / 2)
            const n = Math.hypot(x, y) / Math.sqrt(2)
            //  * Math.SQRT1_2
            return xget(this, "relative_length", n);
        } else if (this.length_mode.startsWith("w")) {
            const n = this.node.get_vp_size(this.frame).x;
            return xget(this, "relative_length", n);
        } else if (this.length_mode.startsWith("h")) {
            const n = this.node.get_vp_size(this.frame).y;
            return xget(this, "relative_length", n);
        } else if (this.length_mode.startsWith("f")) {
            const n = this.node.get_font_size(this.frame);
            return xget(this, "relative_length", n);
        } else {
            throw new Error(``);
        }
    }

    // relative_length?: number, ppi?: number, ,
    parse_len(value: string, per_len = -1) {
        const m = BOTH_MATCH.exec(value);
        if (m) {
            const num = parseFloat(m[1]);
            const suf = m.pop();
            // console.log(`parse_len ${value} ${this.node.id} ${this.node.constructor.name} ${[num, suf]}`)
            const n = parse_svg_length(num, suf, this);
            // console.log(`parse_svg_length OK ${value} ${n} [${this.node.constructor.name}]`);
            return n;
        }
        console.log(`Unexpected length "${value}" ${this.node.id}`);
        return 0;
        // throw new Error(`Unexpected length "${value}"`);
    }
}