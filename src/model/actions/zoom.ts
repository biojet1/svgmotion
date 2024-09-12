import { BoundingBox, Vector } from "../../geom/index.js";
import { Element } from "../base.js";
import { ViewPort } from "../elements.js";
import { Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { KeyExtra } from "../../keyframe/keyframe.js";

export interface BoxParams extends KeyExtra {
    center: Vector;
    margin?: number | number[];
    h?: string;
    v?: string;
    aspect?: number[] | false;
    //
}

export function ZoomTo(view: ViewPort, items: Element[], params: KeyExtra & { dur: number } & BoxParams): Proxy {
    let { dur, margin, ...extra } = params ?? {};
    return function (track: Track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        let bb = BoundingBox.not();
        let { position, size } = view.view_box;
        function supply(that: Track) {
            let b2 = bb.clone();
            if (margin) {
                if (Array.isArray(margin)) {
                    const n = margin.length;
                    if (n >= 4) {
                        // t,r,b,l
                        b2 = BoundingBox.rect(
                            b2.left - margin[3],
                            b2.top - margin[0],
                            margin[3] + b2.width + margin[1],
                            margin[0] + b2.height + margin[2],
                        );
                    } else if (n >= 3) {
                        // 3 t, lr, b
                        b2 = BoundingBox.rect(
                            b2.left - margin[1],
                            b2.top - margin[0],
                            margin[1] + b2.width + margin[1],
                            margin[0] + b2.height + margin[2],
                        );
                    } else if (n >= 2) {
                        // 2 lr, bt
                        b2 = b2.inflated(margin[0], margin[1]);
                    } else if (n >= 1) {
                        b2 = b2.inflated(margin[0]);
                    }
                } else {
                    b2 = b2.inflated(margin);
                }
            }
            const { start, end } = supply;
            const { left, top, width, height } = b2;
            size.key_value(end, new Vector([width, height]), { start, ...extra });
            position.key_value(end, new Vector([left, top]), { start, ...extra });
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            bb = BoundingBox.not();
            for (const x of items) {
                if (x instanceof BoundingBox) {
                    bb.merge_self(x);
                } else {
                    x.update_bbox(bb, frame, x.transform_under(frame, view));
                }
            }
            supply.start = frame;
            supply.end = frame + (_dur ?? (_dur = hint_dur));
            return supply
        };
    };
}