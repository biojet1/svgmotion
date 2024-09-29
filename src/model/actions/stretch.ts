import { BoundingBox, Matrix } from "../../geom/index.js";
import { Easing, Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { KeyExtra } from "../../keyframe/keyframe.js";
import { Element } from "../base.js";
import { Container } from "../containers.js";

export interface StretchParams extends KeyExtra {
    dur?: number;
    parent?: Container;
    dir?: string;
    speed?: number;
    times?: number;
    skew?: number;
    scale?: number;
    in?: boolean;
}

export function StretchOut(items: Element[] | Element, params: StretchParams = {}): Proxy {
    let { dur, dir, ...extra } = params;
    const nodes = Array.isArray(items) ? items : [items];
    return function (track: Track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        let bb = BoundingBox.not();
        const speed = track.to_frame(params.speed ?? 0.5);
        const times = params.times ?? 0.53;
        dur = 2 * speed * times;
        function apply(node: Element, start: number, end: number) {
            const h = node.transform.prefix_hexad();
            let t = start;
            let bb = node.bounding_box(start);
            let op = node.opacity;
            const { center_x: cx, bottom: cy } = bb;
            let m0 = h.get_matrix(t);
            let mTA: Matrix = Matrix.identity();
            let mTB: Matrix = Matrix.identity();
            let mSA: Matrix = Matrix.identity();
            let mSB: Matrix = Matrix.identity();
            //
            switch (dir) {
                case "up": {

                }
                case "down": {
                    const d = bb.height;
                    mTA = Matrix.translate(0, d);
                    mTB = Matrix.translate(0, d * 2);
                    break;
                }
                case "left": { }
                case undefined:
                case "right": {
                    dir = "right";
                    const d = bb.width;
                    mTA = Matrix.translate(d, 0);
                    mTB = Matrix.translate(d * 2, 0);
                    break;
                }
                default:
                    throw new Error(`Unexpected directiorn ${dir}`);
            }
            //
            {
                const { skew } = params;
                if (skew) {
                    switch (dir) {
                        case "up":
                        case "down": {
                            mSA = Matrix.skew(0, skew);
                            mSB = Matrix.skew(0, 0);
                            break;
                        }
                        default: {
                            mSA = Matrix.skew(skew, 0);
                            mSB = Matrix.skew(0, 0);
                            break;
                        }
                    }
                } else {
                    const { scale = 1.5 } = params;
                    switch (dir) {
                        case "top":
                        case "bottom": {
                            mSA = Matrix.scale(1, scale);
                            mSB = Matrix.scale(1, 1);
                            break;
                        }
                        default: {
                            mSA = Matrix.scale(scale, 1);
                            mSB = Matrix.scale(0, 1);
                            break;
                        }
                    }
                }
            }
            //
            let m2 = mTA.translate(cx, cy).cat(mSA).translate(-cx, -cy).multiply(m0);
            let m3 = mTB.translate(cx, cy).cat(mSB).translate(-cx, -cy).multiply(m0);
            //
            h.set_matrix(t, m0, { start });
            op.key_value(t, 1, { start });
            //
            h.set_matrix(t += speed, m2, { easing: Easing.inexpo });
            //
            h.set_matrix(t += speed, m3, { easing: Easing.outexpo });
            op.key_value(t, 0, { easing: Easing.inoutsine });
        }

        function supply(that: Track) {
            const { start, end } = supply;
            if (bb.is_valid()) {
                throw new Error(`Todo`)
            } else {
                for (const e of nodes) {
                    apply(e, start, end);
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
