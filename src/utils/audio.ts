
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

const { min } = Math;

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

// function fix_num(n: number) {
//     const v = n.toFixed(5);
//     return v.indexOf('.') < 0 ? v : v.replace(/0+$/g, '').replace(/\.$/g, '');
// }


import { spawnSync } from 'node:child_process';
