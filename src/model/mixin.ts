import { Matrix, MatrixMut, Vector } from "../geom/index.js";
import { Element } from "./base.js";
import { Group, ViewPort, Root, Container } from "./elements.js";
import { Parent } from "./linked.js";

declare module "./base" {
    interface Element {
        owner_viewport(): ViewPort | undefined;
        farthest_viewport(): ViewPort | undefined;
        g_wrap(): Group;
        get_root(): Root;
        get_font_size(frame: number): number;
        get_vp_width(frame: number): number;
        get_vp_height(frame: number): number;
        get_vp_size(frame: number, w?: number, h?: number): Vector;
        _transform_up_to(frame: number, top: Parent): Matrix;
    }
}
Element.prototype.get_root = function () {
    for (let x of this.ancestors()) {
        if (x instanceof Root) {
            return x;
        }
    }
    throw new Error(
        `Unexpected ${this.constructor.name} ${this._parent?.constructor.name}`
    );
}
Element.prototype.g_wrap = function () {
    const p = this.parent();
    if (p) {
        const g = new Group();
        this.place_after(g);
        g.append_child(this);
        return g;
    } else {
        throw new Error(`No parent`);
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

Element.prototype.farthest_viewport = function () {
    let parent: Element | Parent | undefined = this;
    let farthest: ViewPort | undefined = undefined;
    while ((parent = parent._parent)) {
        if (parent instanceof ViewPort) {
            farthest = parent;
        }
    }
    return farthest;
}

Element.prototype.get_vp_width = function (frame: number): number {
    const ov = this.owner_viewport();
    // console.log(`get_vp_width this[${this.constructor.name}]  ov<${ov?.constructor.name}>`)
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
    // console.log(`get_vp_height this[${this.constructor.name}]  ov<${ov?.constructor.name}>`)
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
    // console.log(`get_vp_size this[${this.constructor.name}]  ov<${ov?.constructor.name}>`)
    if (ov) {
        if (Object.hasOwn(ov, "view_box")) {
            const s = ov.view_box.size.get_value(frame);
            return Vector.pos(w ?? s.x, h ?? s.y);
        }
        return ov.get_vp_size(frame, w, h);
    }
    // throw new Error(`cant get_vp_size`);
    return Vector.pos(100, 100);
}

Element.prototype.get_font_size = function (frame: number): number {
    if (Object.hasOwn(this, "font_size")) {
        const s = this.font_size.get_value(frame);
        return s;
    }
    if (Object.hasOwn(this, "font")) {
        const s = this.font.size.get_value(frame);
        return s as any as number;
    }
    const p = this.parent();
    if (p instanceof Element) {
        return p.get_font_size(0);
    }
    throw new Error(`cant get_font_size <${this.constructor.name}> <${p?.constructor.name}>`);
}
Element.prototype._transform_up_to = function (frame: number, top: Parent): Matrix {
    let cur: Element | undefined = this;
    let ls: Element[] = []
    while (cur) {
        cur = cur.parent<Container>();
        if (cur === top) {
            let m = MatrixMut.identity();
            ls.reverse();
            for (const x of ls) {
                x.cat_transform(frame, m)
            }
            return m;
        } else if (cur) {
            ls.push(cur);
        }
    }
    throw new Error(`No parent`);
}


