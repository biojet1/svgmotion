import { Track } from "../../track/index.js";
import { Proxy } from "../../track/action.js";
import { Root } from "../elements.js";
import { AudioEntry, cut_duration_of } from "../../utils/audio.js";
import { Resource, Sluggable } from "../../utils/resource.js";
import fs from 'fs';
import path from 'path';
import { Voice } from "../../tts/core.js";

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

// export function Say(src: Voice, text: string): Proxy {
//     return function (track: Track) {

//         let entry: AudioEntry & { text: string } = { text: text };

//         const k = src.slug_id(text);
//         const f = Resource.get().get_cache_file(k, 'sounds');
//         const j = `${f}.json`;

//         if (!fs.existsSync(f)) {
//             const p = path.dirname(f);
//             fs.existsSync(p) || fs.mkdirSync(p, { recursive: true });
//             const t = f.replace(/(\.[^\.]+)$/, '.tmp$1');
//             const m = src.save(t, text);
//             fs.renameSync(t, f);
//             if (m) {
//                 fs.writeFileSync(j, JSON.stringify(m));
//             }
//         }
//         if (fs.existsSync(j)) {
//             const c = fs.readFileSync(j, { encoding: 'utf8', flag: 'r' });
//             entry = { ...entry, ...JSON.parse(c) };
//         }
//         entry.path = f;




//         // const entry = (typeof src === 'string') ? { ...opt, path: src } : { ...src, };
//         const dur = track.to_frame(cut_duration_of(entry));
//         function supply(that: Track) {
//             const { root } = that as any;
//             if (root instanceof Root) {
//                 entry.start = supply.start / track.frame_rate;
//                 root.sounds.push(entry);
//             }

//         };
//         supply.start = -Infinity;
//         supply.end = -Infinity;
//         return function (frame: number, base_frame: number, hint_dur: number) {
//             supply.start = frame;
//             supply.end = frame + dur;
//             return supply
//         };
//     };
// }


// export class SayAction extends AudioActionSupply {
// 	private _src?: Sluggable;
// 	private _text?: string;
// 	constructor(src: Sluggable, text: string) {
// 		super();
// 		this._src = src;
// 		this._text = text;
// 	}
// 	override supply() {
// 		const { _text: text, _src } = this;
// 		if (!_src) throw new Error(`no source`);
// 		if (!text) throw new Error(`no text`);

// 		let meta: any = { text: text };

// 		const k = _src.slug_id(text);
// 		const f = resource.getCacheFile(k, 'sounds');
// 		const j = `${f}.json`;

// 		if (!fs.existsSync(f)) {
// 			const p = path.dirname(f);
// 			fs.existsSync(p) || fs.mkdirSync(p, { recursive: true });
// 			// const t = `${f}.tmp`;
// 			const t = f.replace(/(\.[^\.]+)$/, '.tmp$1');
// 			const m = _src.save(t, text);
// 			fs.renameSync(t, f);
// 			if (m) {
// 				fs.writeFileSync(j, JSON.stringify(m));
// 			}
// 		}
// 		if (fs.existsSync(j)) {
// 			const c = fs.readFileSync(j, { encoding: 'utf8', flag: 'r' });
// 			meta = { ...meta, ...JSON.parse(c) };
// 		}
// 		meta.path = f;
// 		return meta;
// 	}
// }