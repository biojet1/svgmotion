import { BoundingBox, Matrix } from "../../geom/index.js";
import { Easing, Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { KeyExtra } from "../../keyframe/keyframe.js";
import { xget } from "../valuesets.js";
import { Element } from "../base.js";
import { Container } from "../elements.js";
import { CalcLength } from "../../helper/svg_length.js";

export interface ScaleParams extends KeyExtra {
    dur?: number;
    parent?: Container;
    anchor?: [number | string, number | string];
}
export class BoxLength extends CalcLength {
    get ref_box(): BoundingBox {
        throw new Error(`Not implemented`)
    }
    override get relative_length_x(): number {
        return xget(this, "relative_length_x", this.ref_box.width);
    }
    override get relative_length_y(): number {
        return xget(this, "relative_length_y", this.ref_box.height);
    }
    override  get relative_min_x(): number {
        return xget(this, "relative_min_x", this.ref_box.min_x);
    }
    override  get relative_min_y(): number {
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
export class ObjectBoxLength extends BoxLength {
    constructor(node: Element, frame: number) {
        super();
        this._node = node;
        this.frame = frame;
    }
    override  get ref_box() {
        return xget(this, "ref_box", this.node.bounding_box(this.frame));
    }
}

export function ScaleOut(items: Element[] | Element, params: ScaleParams = {}): Proxy {
    let { dur, anchor, ...extra } = params;
    const nodes = Array.isArray(items) ? items : [items];
    return function (track: Track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        let bb = BoundingBox.not();
        let sx = 0.001;
        let sy = 0.001;
        function supply(that: Track) {
            const { start, end } = supply;
            if (bb.is_valid()) {
                throw new Error(`Todo`)
            } else {
                for (const e of nodes) {
                    let [cx, cy] = (new ObjectBoxLength(e, start)).get_anchor(anchor)
                    console.log("get_anchor", [cx, cy])
                    let m = Matrix.translate(cx, cy)
                    m = m.scale(sx, sy);
                    m = m.translate(-cx, -cy);

                    const h = e.transform.prefix_hexad();
                    const u = h.get_matrix(start)
                    h.set_matrix(end, m.cat(u), { start, easing: Easing.inexpo, ...extra })

                }
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            supply.start = frame;
            supply.end = frame + (_dur ?? (_dur = hint_dur));
            return supply
        };
    };
}

export function ScaleIn(items: Element[] | Element, params: ScaleParams = {}): Proxy {
    let { dur, anchor, ...extra } = params;
    const nodes = Array.isArray(items) ? items : [items];
    return function (track: Track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        let bb = BoundingBox.not();
        let sx = 0.001;
        let sy = 0.001;
        function supply(that: Track) {
            const { start, end } = supply;
            if (bb.is_valid()) {
                throw new Error(`Todo`)
            } else {
                for (const e of nodes) {
                    let [cx, cy] = (new ObjectBoxLength(e, start)).get_anchor(anchor)
                    let m = Matrix.translate(cx, cy)
                    m = m.scale(sx, sy);
                    m = m.translate(-cx, -cy);

                    const h = e.transform.prefix_hexad();
                    const u = h.get_matrix(start)
                    h.set_matrix(start, m)
                    h.set_matrix(end, u, { start, easing: Easing.inexpo, ...extra })

                }
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            supply.start = frame;
            supply.end = frame + (_dur ?? (_dur = hint_dur));
            return supply
        };
    };
}