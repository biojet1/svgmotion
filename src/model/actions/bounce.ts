import { Easing, Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { KeyExtra } from "../../keyframe/keyframe.js";
import { Element } from "../base.js";
import { Container } from "../containers.js";

export interface BounceParams extends KeyExtra {
    parent?: Container;
    dir?: string;
    mode?: string;
    times?: number;
    dur?: number;
    dist?: number;
    ease1?: Easing;
    ease2?: Easing;
}

export function Bounce(items: Element[] | Element, params: BounceParams = {}): Proxy {
    const nodes = Array.isArray(items) ? items : [items];
    return function (track: Track) {
        let { mode = '', times = 5, dur, dir = 'down', dist: span, /*...extra*/ } = params;
        const show = mode === 'show' || mode === 'in';
        const hide = mode === 'hide' || mode === 'out';
        const motion = dir === 'up' || dir === 'left' ? -1 : 1;
        const anims = times * 2 + (show || hide ? 1 : 0);
        // const speed = _speed == null ? Math.max(1 / anims, 3 / FPS) : _speed / anims;
        const speed = dur ? Math.ceil(track.to_frame(dur / anims)) : Math.max(Math.ceil(track.frame_rate / anims), 3);
        const ease0 = params.ease1 ?? Easing.outquad;
        const ease1 = params.ease2 ?? Easing.inquad;

        function apply(node: Element, start: number, _end: number) {
            const h = node.transform.prefix_hexad();
            let m0 = h.get_matrix(start);
            let t = start;
            let mf = (dir === 'up' || dir === 'down' ? (v: number) => m0.translate(0, v) : (v: number) => m0.translate(v, 0));
            //
            let dist = span ?? 0;
            // Default distance for the BIGGEST bounce is the outer Distance / 3
            if (!dist) {
                const { height, width } = node.bounding_box(start);
                dist = (dir == 'up' || dir == 'down' ? height : width) / 3;
            }
            //
            if (show) {
                const s = t;
                t += speed;
                h.set_matrix(t, mf(motion ? -dist * 2 : dist * 2), { easing: ease1, start: s });
                node.opacity.key_value(s, 0);
                node.opacity.key_value(t, 1, { easing: ease1 });
            }
            // Start at the smallest distance if we are hiding
            if (hide) {
                dist = dist / Math.pow(2, times - 1);
            }
            // Bounces up/down/left/right then back to 0 -- _times * 2 animations happen here
            for (let i = 0; i < times; i++) {
                const s = t;
                h.set_matrix(t += speed, mf(motion ? -dist : dist), { easing: ease0, start: s });
                h.set_matrix(t += speed, m0, { easing: ease1 });
                //
                dist = hide ? dist * 2 : dist / 2;
            }
            // Last Bounce when Hiding
            if (hide) {
                const e = t + speed;
                h.set_matrix(e, mf(motion ? -dist : dist), { easing: ease0 });
                node.opacity.key_value(e, 0, { easing: ease0, start: t });
            }
            //
        }

        function supply(_that: Track) {
            const { start, end } = supply;
            for (const e of nodes) {
                apply(e, start, end);
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, _base_frame: number, _hint_dur: number) {
            supply.start = frame;
            supply.end = frame + (anims * speed);
            return supply
        };
    };
}

export function Pulsate(items: Element[] | Element, params: BounceParams = {}): Proxy {
    const nodes = Array.isArray(items) ? items : [items];
    return function (track: Track) {
        let { mode = 'show', times = 5, dur, /*...extra*/ } = params;
        const show = mode === 'show' || mode === 'in';
        const hide = mode === 'hide' || mode === 'out';
        const anims = times * 2 + (show || hide ? 1 : 0);
        // const speed = _speed == null ? Math.max(1 / anims, 3 / FPS) : _speed / anims;
        const speed = dur ? Math.ceil(track.to_frame(dur / anims)) : Math.max(Math.ceil(track.frame_rate / anims), 3);
        const ease1 = params.ease1 ?? Easing.outexpo;
        const ease2 = params.ease2 ?? Easing.inexpo;

        function apply(node: Element, start: number, _end: number) {
            let animateTo = show ? 1 : 0;
            let i = 1;
            let t = start;
            if (animateTo == 0) {
                node.opacity.key_value(t, 1);
            } else {
                node.opacity.key_value(t, 0);
            }
            for (; i < anims; i++) {
                if (animateTo == 0) {
                    node.opacity.key_value(t += speed, 0, { easing: ease1 });
                } else {
                    node.opacity.key_value(t += speed, 1, { easing: ease2 });
                }
                animateTo = 1 - animateTo;
            }
            node.opacity.key_value(t += speed, animateTo, { easing: ease2 });
        }

        function supply(_that: Track) {
            const { start, end } = supply;
            for (const e of nodes) {
                apply(e, start, end);
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, _base_frame: number, _hint_dur: number) {
            supply.start = frame;
            supply.end = frame + (anims * speed);
            return supply
        };
    };
}
