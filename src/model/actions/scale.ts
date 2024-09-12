import { Element } from "../base.js";
import { Easing, Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { KeyExtra } from "../../keyframe/keyframe.js";
import { Container } from "../elements.js";
import { BoundingBox, Matrix } from "../../geom/index.js";

export interface ScaleParams extends KeyExtra {
    dur?: number;
    parent?: Container;
}

export function ScaleOut(items: Element[] | Element, params: ScaleParams = {}): Proxy {
    let { dur, ...extra } = params;
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
                    const bo = e.bounding_box(start);
                    let [cx, cy] = bo.center;
                    cy = bo.max_y;
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
    let { dur, ...extra } = params;
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
                    const bo = e.bounding_box(start);
                    let [cx, cy] = bo.center;
                    cy = bo.max_y;
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