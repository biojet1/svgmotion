import { Matrix } from "../geom/index.js";
import { Element } from "./base.js";
import { Container, ViewPort } from "./elements.js";
import { Track } from "../track/index.js";
import { Proxy } from "../track/action.js";
import { KeyExtra } from "../keyframe/keyframe.js";

export interface AlignParams {
    hgap?: number;
    vgap?: number;
    anchor?: Element;
    h?: string;
    v?: string;
}

function align_to(frame: number, end: number, parent: Container, ref: Element, items: Element[], params: KeyExtra & AlignParams = {}) {
    const { h, v, hgap = 0, vgap = 0, ...extra } = params;
    const ref_box = parent.bbox_of(frame, ref);
    let xOAnchor: string,
        xRAnchor,
        xRMark = 0;
    if (h) {
        [xRAnchor, xOAnchor] = h;
        switch (xRAnchor) {
            case 'm':
            case 'c':
                xRMark = ref_box.center_x + hgap;
                break;
            case 'l':
                xRMark = ref_box.min_x - hgap;
                break;
            case 'r':
                xRMark = ref_box.max_x + hgap;
                break;
            default:
                throw new Error(`Unexpected _hAlign='${xRAnchor}'`);
        }
    }
    let yOAnchor: string,
        yRAnchor,
        yRMark = 0;
    if (v) {
        [yRAnchor, yOAnchor] = v;
        switch (yRAnchor) {
            case 'm':
            case 'c':
                yRMark = ref_box.center_y + vgap;
                break;
            case 't':
                yRMark = ref_box.min_y - vgap;
                break;
            case 'b':
                yRMark = ref_box.max_y + vgap;
                break;
            default:
                throw new Error(`Unexpected _vAlign='${yRAnchor}'`);
        }
    }



    function transalte_of(arg: Element): [number, number] {
        let x = 0; // current x translate
        let y = 0; // current y translate
        const box = parent.bbox_of(frame, arg);
        switch (xOAnchor) {
            case 'm':
            case 'c':
                x = xRMark - box.center_x;
                break;
            case 'r':
                x = xRMark - box.max_x;
                break;
            case 'l':
                x = xRMark - box.min_x;
                break;
            default:
            case undefined:
                break;
                throw new Error(`Unexpected xOAnchor='${xOAnchor}'`);
        }
        switch (yOAnchor) {
            case 'm':
            case 'c':
                y = yRMark - box.center_y;
                break;
            case 'b':
                y = yRMark - box.max_y;
                break;
            case 't':
                y = yRMark - box.min_y;
                break;
            case undefined:
                break;
            default:
                throw new Error(`Unexpected yOAnchor='${yOAnchor}'`);
        }
        return [x, y];
    }
    function translate(node: Element, x: number, y: number): any {
        const T = node.transform;
        const p = node.transform_under(frame, parent);
        const t = Matrix.translate(x, y);
        const h = T.prefix_hexad();
        const u = h.get_matrix(frame)
        h.set_matrix(end, p.inverse().cat(t).cat(p).cat(u), { start: frame, ...extra })
    }
    for (const arg of items) {
        const [x, y] = transalte_of(arg);
        translate(arg, x, y);
    }

}
export function AlignTo(parent: Container, ref: Element, items: Element[], params: KeyExtra & { dur: number } & AlignParams): Proxy {
    let { dur, ...extra } = params ?? {};
    return function (track: Track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        function supply(that: Track) {
            const { start, end } = supply;
            align_to(start, end, parent, ref, items, extra)
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {

            if (_dur == undefined) {
                _dur = hint_dur;
            }
            supply.start = frame;
            supply.end = frame + _dur;
            return supply
        };
    };
}