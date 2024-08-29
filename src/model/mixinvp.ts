import { Vector } from "../geom/index.js";
import { Element } from "./base.js";

declare module "./base" {
    interface Element {
        owner_viewport(): ViewPort | undefined;
        get_vp_width(frame: number): number;
        get_vp_height(frame: number): number;
        get_vp_size(frame: number, w?: number, h?: number): Vector;
    }
}

Element.prototype.owner_viewport = function () {
    //  nearest ancestor ‘svg’ element. 
    for (const a of this.ancestors()) {
        if (a instanceof ViewPort) {
            return a;
        }
    }
}


Element.prototype.get_vp_width = function (frame: number): number {
    const ov = this.owner_viewport();
    console.log(`get_vp_width this[${this.constructor.name}]  ov<${ov?.constructor.name}>`)
    if (ov) {
        if (Object.hasOwn(ov, "view_box")) {
            const s = ov.view_box.size.get_value(frame);
            return s.x;
        }
        return ov.get_vp_width(frame);
    }
    // throw new Error(`cant get_vp_width ${this.constructor.name}`);
    return 100;
}

Element.prototype.get_vp_height = function (frame: number): number {
    const ov = this.owner_viewport();
    console.log(`get_vp_height this[${this.constructor.name}]  ov<${ov?.constructor.name}>`)
    if (ov) {
        if (Object.hasOwn(ov, "view_box")) {
            const s = ov.view_box.size.get_value(frame);
            return s.y;
        }
        return ov.get_vp_height(frame);
    }
    // throw new Error(`cant get_vp_height`);
    return 100;
}

Element.prototype.get_vp_size = function (frame: number, w?: number, h?: number): Vector {
    const ov = this.owner_viewport();
    console.log(`get_vp_size this[${this.constructor.name}]  ov<${ov?.constructor.name}>`)
    if (ov) {
        if (Object.hasOwn(ov, "view_box")) {
            const s = ov.view_box.size.get_value(frame);
            return Vector.pos(w ?? s.x, h ?? s.y);
        }
        return ov.get_vp_size(frame, w, h);
    }
    throw new Error(`cant get_vp_size`);
}



import { ViewPort } from "./elements.js";