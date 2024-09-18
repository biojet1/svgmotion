import { Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { Root } from "../elements.js";
import { AudioEntry, cut_duration_of } from "../../utils/audio.js";
import { AudioChain } from "../../utils/sound.js";

export function Audio(src: string | AudioEntry, opt?: AudioEntry): Proxy {
    return function (track: Track) {
        const entry = (typeof src === 'string') ? { ...opt, path: src } : { ...src, };
        const dur = track.to_frame(cut_duration_of(entry));
        function supply(that: Track) {
            const { root } = that as any;
            if (root instanceof Root) {
                entry.start = supply.start / track.frame_rate;
                root.sounds.push(entry);
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            supply.start = frame;
            supply.end = frame + dur;
            return supply
        };
    };
}
export function Play(src: AudioChain): Proxy {
    return function (track: Track) {
        // const entry = (typeof src === 'string') ? { ...opt, path: src } : { ...src, };
        // const dur = track.to_frame(cut_duration_of(entry));
        function supply(that: Track) {
            const { root } = that as any;
            if (root instanceof Root) {
                root.audios.push(src.start_at(supply.start / track.frame_rate));
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            supply.start = frame;
            supply.end = frame + src.get_duration();
            return supply
        };
    };
}
