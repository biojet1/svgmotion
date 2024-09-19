import { Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { Asset, Root } from "../elements.js";
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
export function Play(src: AudioChain | { path: string }): Proxy {

    return function (track: Track) {
        let ac: AudioChain | undefined;
        const { root } = track as any;
        if (root instanceof Root) {
            if (src instanceof AudioChain) {
                ac = src;
                // } else if (src instanceof Asset) {
                //     ac = src.as_sound();
                // } else {
                //     const { path } = src;
                //     if (root instanceof Root) {
                //         ac = root.add_file_asset(path).as_sound();
                //     }
            }
        } else {
            throw new Error(``);
        }

        if (ac instanceof AudioChain) {
            //
        } else {
            throw new Error(``);
        }

        function supply(that: Track) {
            if (ac instanceof AudioChain) {
                root.audios.push(ac.start_at(supply.start / track.frame_rate));
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            supply.start = frame;
            supply.end = frame + ac.get_duration();
            return supply;
        };
    };
}
