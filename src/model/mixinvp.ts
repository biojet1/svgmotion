import { Vector } from "../geom/index.js";
import { Element } from "./base.js";

declare module "./base" {
    interface Element {
        owner_viewport(): ViewPort | undefined;
    }
}

declare module "./elements" {
    interface ViewPort {
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

ViewPort.prototype.get_vp_width = function (frame: number): number {
    // if (Object.hasOwn(this, "width")) {
    //     const s = this.width.get_value(frame);
    //     return s;
    // }
    if (Object.hasOwn(this, "view_box")) {
        const s = this.view_box.size.get_value(frame);
        return s.x;
    }
    const ov = this.owner_viewport();
    if (ov) {
        return ov.get_vp_width(frame);
    }
    throw new Error(`cant get_vp_width`);
    // return 100;
}

ViewPort.prototype.get_vp_height = function (frame: number): number {
    if (Object.hasOwn(this, "view_box")) {
        const s = this.view_box.size.get_value(frame);
        return s.y;
    }
    // if (Object.hasOwn(this, "height")) {
    //     const s = this.height.get_value(frame);
    //     return s;
    // }
    const ov = this.owner_viewport();
    if (ov) {
        return ov.get_vp_height(frame);
    }
    throw new Error(`cant get_vp_height`);
    // return 100;
}

ViewPort.prototype.get_vp_size = function (frame: number, w?: number, h?: number): Vector {
    if (Object.hasOwn(this, "view_box")) {
        const s = this.view_box.size.get_value(frame);
        return Vector.pos(w ?? s.x, h ?? s.y);
    }
    // if (typeof h == 'undefined' && Object.hasOwn(this, "height")) {
    //     h = this.height.get_value(frame);
    //     if (typeof w !== 'undefined') {
    //         return Vector.pos(w, h);
    //     }
    // }
    // if (typeof w == 'undefined' && Object.hasOwn(this, "width")) {
    //     w = this.width.get_value(frame);
    //     if (typeof h !== 'undefined') {
    //         return Vector.pos(w, h);
    //     }
    // }
    const ov = this.owner_viewport();
    if (ov) {
        return ov.get_vp_size(frame, w, h);
    }
    throw new Error(`cant get_vp_height`);
    // return Vector.pos(100, 100);
}

import { ViewPort } from "./elements.js";