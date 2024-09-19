
export type AudioEntry = {
    ref?: string;
    path?: string;
    duration?: number; // full duration of this audio
    start?: number; // global playtime in seconds
    cut_from?: number; // start offset in seconds in audio (defaults to 0)
    cut_to?: number; // end offset in seconds in audio (defaults to full duration)
    loop?: number; // repeat many times
    anchor?: number; // shifts the playtime in seconds
    mix_volume?: number;
    volume?: string;
    _tag?: string;
    track?: string;
    transcript?: string;
    fade_out?: { duration: number; curve: string };
    fade_in?: { duration: number; curve: string };
};

type Track = {
    name?: number;
    mix_volume?: number;
};

type AudioNorm = {
    gauss_size?: number;
    max_gain?: number;
};

export interface AudioMix {
    streams?: AudioEntry[] | false;
    output_filters: any[];
    audio_norm?: AudioNorm;
    output_volume?: number;
    normalize?: boolean;
    fade_out?: { duration: number; curve: string };
    fade_in?: { duration: number; curve: string };
    dropout_transition?: number;
    tracks?: Track[];
}

function media_duration(path: string) {
    const { error, stdout } = spawnSync('ffprobe', [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        path,
    ]);
    if (error) {
        throw new Error(`${error}`);
    }
    const parsed = parseFloat(stdout.toString());
    // assert(!Number.isNaN(parsed));
    return parsed;
}

function duration_of(audio: AudioEntry) {
    let { duration, loop, path } = audio;
    loop = loop ?? 0;
    if (loop < 0) {
        return Infinity;
    }
    if (!path) {
        throw new Error(`AudioEntry no path`);
    }
    duration = duration ?? (audio.duration = media_duration(path));
    if (loop > 1) {
        return loop * duration;
    }
    return duration;
}

const { floor, max, min } = Math;

export function cut_duration_of(audio: AudioEntry) {
    let { cut_from, cut_to } = audio;
    const dur = duration_of(audio);
    if (cut_to) {
        return min(dur, cut_to) - (cut_from ?? 0);
    } else if (cut_from) {
        return dur - cut_from;
    } else {
        return dur;
    }
}

function fix_num(n: number) {
    const v = n.toFixed(5);
    return v.indexOf('.') < 0 ? v : v.replace(/0+$/g, '').replace(/\.$/g, '');
}

// export function audio_graph(
//     opt: AudioMix,
//     durTotal: number,
//     inputs: Array<Input>,
//     filters: Array<FilterChain>,
// ) {
//     function get_index(entry: AudioEntry) {
//         const index = inputs.length;
//         const { loop, path } = entry;
//         inputs.push({ path, loop, args: [] });
//         return index;
//     }
//     let {
//         streams,
//         // normalize,
//     } = opt;
//     if (!streams) {
//         return;
//     }
//     // find total duration
//     if (!durTotal || durTotal <= 0) {
//         const ends = streams.map((audio /*, i*/) => {
//             let { start = 0, loop = 0 /*, cut_from, cut_to*/ } = audio;
//             if (loop < 0) {
//                 return -Infinity;
//             }
//             if (start < 0) {
//                 const end = start + cut_duration_of(audio);
//                 if (end < 0) {
//                     return 0;
//                 }
//                 return end;
//             }
//             return start + cut_duration_of(audio);
//         });
//         durTotal = max(...ends);
//         // console.warn('ends', durTotal, ends);
//     }
//     const DURATION = durTotal;
//     // remove out of range
//     streams = streams.filter((audio /*, i*/) => {
//         let { start = 0, anchor = 0, cut_from = 0 } = audio;

//         if (anchor) {
//             audio.anchor = 0;
//             const anchored_start = start - anchor;
//             if (anchored_start < 0) {
//                 const end = anchored_start + cut_duration_of(audio);
//                 if (end < 0) {
//                     return false;
//                 }
//                 audio.cut_from = cut_from = -anchored_start;
//                 audio.start = start = 0;
//             } else {
//                 audio.start = start = anchored_start;
//             }
//         } else if (start < 0) {
//             const end = start + cut_duration_of(audio);
//             if (end < 0) {
//                 return false;
//             }
//             audio.cut_from = cut_from = -start;
//             audio.start = start = 0;
//         }

//         if (start >= DURATION) {
//             return false;
//         }
//         const dur = cut_duration_of(audio);
//         if (dur <= 0) {
//             return false;
//         }
//         const end = start + dur;
//         if (end > DURATION) {
//             audio.cut_to = cut_from + (DURATION - start);
//         }
//         return true;
//     });
//     console.warn('streams', streams);

//     filters.push(
//         ...streams
//             .map((audio /*, i*/): FilterChain => {
//                 const { cut_from = 0, cut_to, start, volume, fade_in, fade_out } = audio;
//                 // const filter_chain = [];
//                 const begin = start ?? 0;
//                 const curDur = cut_duration_of(audio);
//                 let pad_sec = DURATION - (begin + curDur);
//                 if (Math.abs(pad_sec) <= 1 / 44100) {
//                     pad_sec = 0;
//                 }
//                 const filters = [
//                     ...(function* () {
//                         if (cut_to) {
//                             yield { name: 'atrim', start: cut_from, end: cut_to };
//                         } else if (cut_from) {
//                             yield { name: 'atrim', start: cut_from, end: duration_of(audio) };
//                         }
//                         if (cut_from) {
//                             // https://stackoverflow.com/questions/57972761/ffmpeg-afade-not-being-applied-to-atrim
//                             yield { name: 'asetpts', expr: 'PTS-STARTPTS' };
//                         }
//                         if (volume) {
//                             yield { name: 'volume', volume: volume };
//                         }

//                         if (begin > 0) {
//                             yield { name: 'adelay', delays: floor(begin * 1000), all: 1 };
//                         } else {
//                             if (fade_in) {
//                                 const { duration: fade_dur = 1, curve } = fade_in;
//                                 yield {
//                                     name: 'afade',
//                                     t: 'in',
//                                     // st: 0,
//                                     d: fade_dur,
//                                     curve,
//                                 };
//                             }
//                         }

//                         if (pad_sec > 0) {
//                             // https://stackoverflow.com/questions/35509147/ffmpeg-amix-filter-volume-issue-with-inputs-of-different-duration
//                             yield { name: 'apad', pad_dur: fix_num(pad_sec) };
//                         } else {
//                             if (fade_out) {
//                                 const { duration: fade_dur = 1, curve } = fade_out;
//                                 yield {
//                                     name: 'afade',
//                                     t: 'out',
//                                     st: curDur - fade_dur,
//                                     d: fade_dur,
//                                     curve,
//                                 };
//                             }
//                         }
//                     })(),
//                 ];
//                 const I = get_index(audio);
//                 if (filters.length > 0) {
//                     return { input: `${I}:a`, output: (audio._tag = `a${I}`), filters };
//                 } else {
//                     audio._tag = `${I}:a`;
//                     return {};
//                 }
//             })
//             .filter((v) => !!v.filters),

//         // Inputs to final audio
//         {
//             input: streams.map((audio /*, i*/) => `${audio._tag}`),
//             filters: (function* () {
//                 const {
//                     fade_out,
//                     fade_in,
//                     output_filters,
//                     output_volume,
//                     audio_norm,
//                     dropout_transition = 0,
//                 } = opt;
//                 yield {
//                     name: 'amix',
//                     inputs: streams.length,
//                     dropout_transition: dropout_transition,
//                     normalize: 0,
//                     // weights: streams.map((audio) => audio.mixVolume ?? 10),
//                 };
//                 if (fade_in) {
//                     const { duration: fade_dur = 1, curve } = fade_in;
//                     yield {
//                         name: 'afade',
//                         t: 'in',
//                         d: fade_dur,
//                         curve,
//                     };
//                 }

//                 if (output_volume) {
//                     yield { name: 'volume', volume: output_volume };
//                 }
//                 if (audio_norm) {
//                     const { gauss_size: gaussSize, max_gain: maxGain } = audio_norm;
//                     yield { name: 'dynaudnorm', g: gaussSize ?? 5, maxgain: maxGain ?? 30 };
//                 }
//                 if (fade_out) {
//                     const { duration: fade_dur = 1, curve } = fade_out;
//                     yield { name: 'afade', t: 'out', st: DURATION - fade_dur, d: fade_dur, curve };
//                 }

//                 if (output_filters) {
//                     for (const f of output_filters) {
//                         yield f;
//                     }
//                 }
//             })(),
//         },
//     );
//     return filters;
// }


import { FilterChain, Input } from './ffparams.js';
import { spawnSync } from 'node:child_process';