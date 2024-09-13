import { BoundingBox } from "../geom/index.js";
import { xget } from "../model/valuesets.js";
import { Element } from "../model/base.js";

const BOTH_MATCH =
    /^\s*(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)\s*(in|pt|px|mm|cm|m|km|Q|pc|yd|ft||%|em|ex|ch|rem|vw|vh|vmin|vmax|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)\s*$/i;

export class CalcLength {
    protected _node!: Element;
    public get node(): Element {
        return this._node;
    }
    frame: number = 0;
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
    get relative_min_x(): number {
        return xget(this, "relative_min_x", 0);
    }
    get relative_min_y(): number {
        return xget(this, "relative_min_y", 0);
    }
    get relative_length_f(): number {
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
        } else {
            switch (value) {
                case 'center':
                    return this._parse(50, '%', dir);
                case 'left':
                    return this._parse(0, '%', dir);
                case 'right':
                    return this._parse(100, '%', dir);
                case 'top':
                    return this._parse(0, '%', dir);
                case 'bottom':
                    return this._parse(100, '%', dir);
            }
        }
        console.log(`Unexpected length "${value}" ${this.node.id}`);
        return 0;
        // throw new Error(`Unexpected length "${value}"`);
    }
    protected _parse(amount: number, units: string | undefined, dir?: string): number {
        switch (units) {
            case "%": {
                let n: number;
                let o: number = 0;
                switch (dir) {
                    case 'x':
                        n = this.relative_length_x;
                        o = this.relative_min_x
                        break;
                    case 'y':
                        n = this.relative_length_y;
                        o = this.relative_min_y;
                        break;
                    case 'f':
                        n = this.relative_length_f;
                        break;
                    case undefined:
                        n = this.relative_length;
                        break;
                    default:
                        throw Error(`Unexpected dir ${dir}`);
                }
                if (n == undefined) {
                    throw Error(`No relative_length`);
                }
                return o + (amount * n / 100.0);
            }
            case "mm":
                return amount * this.ppi * 0.0393701;
            case "cm":
                return amount * this.ppi * 0.393701;
            case "in":
                return amount * this.ppi;
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
            case "pt":
                return amount * 4.0 / 3.0
            case "pc":
                return amount * 16.0
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
            case "":
                return amount
        }
        throw Error(`Unexpected unit "${units}"`);
    }
}

export class ComputeLength extends CalcLength {
    constructor(node: Element, frame: number) {
        super();
        this._node = node;
        this.frame = frame;
    }
    override  get relative_length_x(): number {
        const n = this.node.get_vp_size(this.frame).x;
        return xget(this, "relative_length_x", n);
    }
    override get relative_length_y(): number {
        const n = this.node.get_vp_size(this.frame).y;
        return xget(this, "relative_length_y", n);
    }
    override get relative_length_f(): number {
        const n = this.node.get_font_size(this.frame);
        return xget(this, "relative_length", n);
    }
    override get relative_length() {
        const { x, y } = this.node.get_vp_size(this.frame);
        const n = Math.hypot(x, y) / Math.sqrt(2)
        return xget(this, "relative_length", n);
    }
}

export class BoxLength extends CalcLength {
    get ref_box(): BoundingBox {
        throw new Error(`Not implemented`);
    }
    override get relative_length_x(): number {
        return xget(this, "relative_length_x", this.ref_box.width);
    }
    override get relative_length_y(): number {
        return xget(this, "relative_length_y", this.ref_box.height);
    }
    override get relative_min_x(): number {
        return xget(this, "relative_min_x", this.ref_box.min_x);
    }
    override get relative_min_y(): number {
        return xget(this, "relative_min_y", this.ref_box.min_y);
    }
    get_anchor(anchor?: [number | string, number | string]) {
        const a = anchor ?? ['center', 'center'];
        return a.map((v, i) => {
            if (typeof v === "number") {
                return v;
            }
            return this.parse_len(v, i > 0 ? "y" : "x");
        });
    }
}
