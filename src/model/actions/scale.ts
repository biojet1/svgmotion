import { BoundingBox, Matrix } from "../../geom/index.js";
import { Easing, Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { KeyExtra } from "../../keyframe/keyframe.js";
import { xget } from "../valuesets.js";
import { Element } from "../base.js";
import { Container } from "../containers.js";
import { BoxLength } from "../length.js";

export interface ScaleParams extends KeyExtra {
    dur?: number;
    parent?: Container;
    anchor?: [number | string, number | string];
    out?: boolean;
}

export class ElementBBoxLength extends BoxLength {
    constructor(node: Element, frame: number) {
        super();
        this._node = node;
        this.frame = frame;
    }
    override  get ref_box() {
        return xget(this, "ref_box", this.node.bounding_box(this.frame));
    }
    static get_anchor(node: Element, frame: number, anchor?: [number | string, number | string]) {
        return (new ElementBBoxLength(node, frame)).get_anchor(anchor);
    }
}
export class ElementAndBBoxLength extends BoxLength {
    private _bbox: any;
    constructor(node: Element, frame: number, bbox: BoundingBox) {
        super();
        this.frame = frame;
        this._node = node;
        this._bbox = bbox;
    }
    override get ref_box() {
        return xget(this, "ref_box", this._bbox);
    }
}

export function ScaleOut(items: Element[] | Element, params: ScaleParams = {}): Proxy {
    let { dur, anchor, parent, ...extra } = params;
    const nodes = Array.isArray(items) ? items : [items];
    return function (track: Track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        let sx = 0.001;
        let sy = 0.001;
        function supply(_that: Track) {
            const { start, end } = supply;
            function* each() {
                if (parent) {
                    let bb = BoundingBox.not();
                    for (const x of nodes) {
                        if (x instanceof BoundingBox) {
                            bb.merge_self(x);
                        } else {
                            x.update_bbox(bb, start, x.transform_under(start, parent));
                        }
                    }
                    let [cx, cy] = (new ElementAndBBoxLength(parent, start, bb)).get_anchor(anchor);
                    let m = Matrix.translate(cx, cy)
                    m = m.scale(sx, sy);
                    m = m.translate(-cx, -cy);
                    for (const node of nodes) {
                        const p = node.transform_under(start, parent);
                        yield { node, m: p.inverse().cat(m).cat(p) };
                    }
                } else {
                    for (const node of nodes) {
                        let [cx, cy] = ElementBBoxLength.get_anchor(node, start, anchor);
                        let m = Matrix.translate(cx, cy)
                        m = m.scale(sx, sy);
                        m = m.translate(-cx, -cy);
                        yield { node, m };
                    }
                }
            }
            // function scale(node: Element, t) {
            //     const p = node.transform_under(start, parent);
            //     const h = node.transform.prefix_hexad();
            //     const u = h.get_matrix(start)
            //     h.set_matrix(end, p.inverse().cat(t).cat(p).cat(u), { start, ...extra })
            // }

            for (const { node, m } of each()) {
                // let [cx, cy] = ObjectBoxLength.get_anchor(node, start, anchor);
                // console.warn("get_anchor", [cx, cy])
                const h = node.transform.prefix_hexad();
                const u = h.get_matrix(start)
                if (params.out === false) {
                    h.set_matrix(start, m)
                    h.set_matrix(end, u, { start, easing: Easing.inexpo, ...extra })
                } else {
                    h.set_matrix(end, m.cat(u), { start, easing: Easing.inexpo, ...extra })
                }
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, _base_frame: number, hint_dur: number) {
            supply.start = frame;
            supply.end = frame + (_dur ?? (_dur = hint_dur));
            return supply
        };
    };
}

export function ScaleIn(items: Element[] | Element, params: ScaleParams = {}): Proxy {
    return ScaleOut(items, { ...params, out: false })
}