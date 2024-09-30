import { Element } from "../base.js";
import { Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { KeyExtra } from "../../keyframe/keyframe.js";

export function FadeOut(items: Element[], params: KeyExtra & { dur?: number } = {}): Proxy {
    let { dur, ...extra } = params;
    return function (track: Track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        function supply(_that: Track) {
            const { start, end } = supply;
            for (const e of items) {
                e.opacity.key_value(end, 0, { ...extra, start })
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

export function FadeIn(items: Element[], params: KeyExtra & { dur?: number } = {}): Proxy {
    let { dur, ...extra } = params;
    return function (track: Track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        function supply(_that: Track) {
            const { start, end } = supply;
            for (const e of items) {
                e.opacity.key_value(end, 1, { ...extra, start })
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