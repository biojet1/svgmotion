import { Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { AudioEntry, cut_duration_of } from "../../utils/audio.js";

export function Audio(src: string | AudioEntry, opt?: AudioEntry): Proxy {
    return function (track: Track) {
        const entry = (typeof src === 'string') ? { ...opt, path: src } : { ...src, };
        const dur = track.to_frame(cut_duration_of(entry));
        function supply(that: Track) {
            // track.sounds.push(entry);
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
