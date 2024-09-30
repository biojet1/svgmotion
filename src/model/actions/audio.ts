import { Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { Root } from "../root.js";
import { AudioChain } from "../../utils/sound.js";

export function Play(src: AudioChain): Proxy {
    return function (track: Track) {
        const { root } = track as any;
        const dur = track.to_frame(src.get_duration());
        if (src instanceof AudioChain) {
            //
        } else {
            throw new Error(``);
        }
        function supply(that: Track) {
            if (root instanceof Root) {
                root.sounds.push(src.start_at(supply.start / track.frame_rate));
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            supply.start = frame;
            supply.end = frame + dur;
            return supply;
        };
    };
}
