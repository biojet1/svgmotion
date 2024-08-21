
function uulen(amount: number, units: string | undefined, ctx: { relative_length?: number, ppi?: number, vw?: number, vh?: number, font_size?: number, font_height?: number }) {
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
