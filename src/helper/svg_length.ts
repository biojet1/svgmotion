import { xget } from "../model/index.js";
import { Element } from "../model/base.js";
const BOTH_MATCH =
    /^\s*(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)\s*(in|pt|px|mm|cm|m|km|Q|pc|yd|ft||%|em|ex|ch|rem|vw|vh|vmin|vmax|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)\s*$/i;

export class CalcLength {
    protected _node!: Element;
    public get node(): Element {
        return this._node;
    }
    frame!: number;
    // constructor(node: Element, frame: number) {
    //     // this.node = node;
    //     // this.frame = frame;
    // }

    get font_size() {
        const n = this.node.get_font_size(this.frame);
        if (!isFinite(n) || n <= 0) {
            throw new Error(`Invalid font_size ${n}`);
        }
        return xget(this, "font_size", n);
    }
    get ppi() {
        return xget(this, "ppi", 96);
    }
    get vw() {
        const n = this.node.get_vp_width(this.frame);
        return xget(this, "vw", n);
    }

    get vh() {
        const n = this.node.get_vp_height(this.frame);
        return xget(this, "vh", n);
    }
    get relative_length(): number {
        throw new Error(`Not implemented`)
    }
    get relative_length_x(): number {
        throw new Error(`Not implemented`)
    }
    get relative_length_y(): number {
        throw new Error(`Not implemented`)
    }
    parse_len(value: string, dir?: string) {
        const m = BOTH_MATCH.exec(value);
        if (m) {
            const num = parseFloat(m[1]);
            const suf = m.pop();
            // console.log(`parse_len ${value} ${this.node.id} ${this.node.constructor.name} ${[num, suf]}`)
            // const n = parse_svg_length(num, suf, this);
            const n = this._parse(num, suf, dir);
            // console.log(`parse_svg_length OK ${value} ${n} [${this.node.constructor.name}]`);
            return n;
        }
        console.log(`Unexpected length "${value}" ${this.node.id}`);
        return 0;
        // throw new Error(`Unexpected length "${value}"`);
    }
    protected _parse(amount: number, units: string | undefined, dir?: string) {
        switch (units) {
            case "%": {
                let n: number;
                switch (dir) {
                    case undefined:
                        {
                            n = this.relative_length;
                            break;
                        }
                    case 'x':
                        {
                            n = this.relative_length_x;
                            break;
                        }
                    case 'y':
                        {
                            n = this.relative_length_y;
                            break;
                        }
                    default:
                        throw Error(``);
                }
                if (n == undefined) {
                    throw Error(`No relative_length`);
                }
                return amount * n / 100.0;
            }
            case "mm": {
                return amount * this.ppi * 0.0393701
            }
            case "cm": {
                return amount * this.ppi * 0.393701
            }
            case "in": {
                return amount * this.ppi;
            }
            case "vw": {
                const { vw } = this;
                if (vw == undefined) {
                    throw Error(`No vw`);
                }
                return amount * vw / 100.0
            }
            case "vh": {
                const { vh } = this;
                if (vh == undefined) {
                    throw Error(`No vh`);
                }
                return amount * vh / 100.0
            }
            case "vmin": {
                const { vh, vw } = this;
                if (vh == undefined || vw == undefined) {
                    throw Error(`No vh/vw`);
                }
                return amount * Math.min(vw, vh) / 100.0
            }
            case "vmax": {
                const { vh, vw } = this;
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
                const { font_size } = this;
                if (font_size == undefined) {
                    throw Error(`No font_size`);
                }
                return amount * font_size;
            }
            // case "em": {
            //     const { font_height } = this;
            //     if (font_height == undefined) {
            //         throw Error(`No font_height`);
            //     }
            //     return amount * font_height;
            // }
            case undefined:
            case "px":
            case "": {
                return amount
            }
        }
        throw Error(`Unexpected unit "${units}"`);
    }

}

export class ComputeLength extends CalcLength {

    length_mode: string | undefined;

    constructor(node: Element, frame: number) {
        super();
        this._node = node;
        this.frame = frame;
    }


    override get relative_length() {
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
}


// export class ComputeLengthBox extends ComputeLength {
//     override get relative_length() {

//     }
// }