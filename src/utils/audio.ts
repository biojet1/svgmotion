export type AudioEntry = {
    path?: string;
    duration?: number; // full duration of this audio
    start?: number; // global playtime in seconds
    cut_from?: number; // start offset in seconds in audio (defaults to 0)
    cut_to?: number; // end offset in seconds in audio (defaults to full duration)
    loop?: number; // repeat many times
    anchor?: number; // shifts the playtime in seconds
    mixVolume?: number;
    volume?: string;
    _tag?: string;
    track?: string;
    transcript?: string;
    fade_out?: { duration: number; curve: string };
    fade_in?: { duration: number; curve: string };
};

type Track = {
    name?: number;
    mixVolume?: number;
};

type AudioNorm = {
    gaussSize?: number;
    maxGain?: number;
};
export interface MixOption {
    streams?: AudioEntry[] | false;
    outputFilters: any[];
    audioNorm?: AudioNorm;
    outputVolume?: number;
    normalize?: boolean;
    fadeOut?: { duration: number; curve: string };
    fadeIn?: { duration: number; curve: string };
    dropoutTransition?: number;
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
    let { cut_from: cutFrom, cut_to: cutTo } = audio;
    const dur = duration_of(audio);
    if (cutTo) {
        return min(dur, cutTo) - (cutFrom ?? 0);
    } else if (cutFrom) {
        return dur - cutFrom;
    } else {
        return dur;
    }
}

function fixNum(n: number) {
    const v = n.toFixed(5);
    return v.indexOf('.') < 0 ? v : v.replace(/0+$/g, '').replace(/\.$/g, '');
}

export function audioGraph(
    opt: MixOption,
    durTotal: number,
    inputs: Array<Input>,
    filters: Array<FilterChain>,
) {
    function getIndex(entry: AudioEntry) {
        const index = inputs.length;
        const { loop, path } = entry;
        inputs.push({ path, loop, args: [] });
        return index;
    }
    function getMixVolume(entry: AudioEntry) {
        const index = inputs.length;
        const { loop, path } = entry;
        inputs.push({ path, loop, args: [] });
        return index;
    }
    let {
        streams,
        // normalize,
    } = opt;
    if (!streams) {
        return;
    }
    // find total duration
    if (!durTotal || durTotal <= 0) {
        const ends = streams.map((audio /*, i*/) => {
            let { start = 0, loop = 0 /*, cutFrom, cutTo*/ } = audio;
            if (loop < 0) {
                return -Infinity;
            }
            if (start < 0) {
                const end = start + cut_duration_of(audio);
                if (end < 0) {
                    return 0;
                }
                return end;
            }
            return start + cut_duration_of(audio);
        });
        durTotal = max(...ends);
        // console.warn('ends', durTotal, ends);
    }
    const DURATION = durTotal;
    // remove out of range
    streams = streams.filter((audio /*, i*/) => {
        let { start = 0, anchor = 0, cut_from: cutFrom = 0 } = audio;

        if (anchor) {
            audio.anchor = 0;
            const anchored_start = start - anchor;
            if (anchored_start < 0) {
                const end = anchored_start + cut_duration_of(audio);
                if (end < 0) {
                    return false;
                }
                audio.cut_from = cutFrom = -anchored_start;
                audio.start = start = 0;
            } else {
                audio.start = start = anchored_start;
            }
        } else if (start < 0) {
            const end = start + cut_duration_of(audio);
            if (end < 0) {
                return false;
            }
            audio.cut_from = cutFrom = -start;
            audio.start = start = 0;
        }

        if (start >= DURATION) {
            return false;
        }
        const dur = cut_duration_of(audio);
        if (dur <= 0) {
            return false;
        }
        const end = start + dur;
        if (end > DURATION) {
            audio.cut_to = cutFrom + (DURATION - start);
        }
        return true;
    });
    // console.warn('streams', streams);

    filters.push(
        ...streams
            .map((audio /*, i*/): FilterChain => {
                const { cut_from: cutFrom = 0, cut_to: cutTo, start, volume, fade_in: fadeIn, fade_out: fadeOut } = audio;
                // const filter_chain = [];
                const begin = start ?? 0;
                const curDur = cut_duration_of(audio);
                let pad_sec = DURATION - (begin + curDur);
                if (Math.abs(pad_sec) <= 1 / 44100) {
                    pad_sec = 0;
                }
                const filters = [
                    ...(function* () {
                        if (cutTo) {
                            yield { name: 'atrim', start: cutFrom, end: cutTo };
                        } else if (cutFrom) {
                            yield { name: 'atrim', start: cutFrom, end: duration_of(audio) };
                        }
                        if (cutFrom) {
                            // https://stackoverflow.com/questions/57972761/ffmpeg-afade-not-being-applied-to-atrim
                            yield { name: 'asetpts', expr: 'PTS-STARTPTS' };
                        }
                        if (volume) {
                            yield { name: 'volume', volume: volume };
                        }

                        if (begin > 0) {
                            yield { name: 'adelay', delays: floor(begin * 1000), all: 1 };
                        } else {
                            if (fadeIn) {
                                const { duration: fadeDur = 1, curve } = fadeIn;
                                yield {
                                    name: 'afade',
                                    t: 'in',
                                    // st: 0,
                                    d: fadeDur,
                                    curve,
                                };
                            }
                        }

                        if (pad_sec > 0) {
                            // https://stackoverflow.com/questions/35509147/ffmpeg-amix-filter-volume-issue-with-inputs-of-different-duration
                            yield { name: 'apad', pad_dur: fixNum(pad_sec) };
                        } else {
                            if (fadeOut) {
                                const { duration: fadeDur = 1, curve } = fadeOut;

                                yield {
                                    name: 'afade',
                                    t: 'out',
                                    st: curDur - fadeDur,
                                    d: fadeDur,
                                    curve,
                                };
                            }
                        }
                    })(),
                ];
                const I = getIndex(audio);
                if (filters.length > 0) {
                    return { input: `${I}:a`, output: (audio._tag = `a${I}`), filters };
                } else {
                    audio._tag = `${I}:a`;
                    return {};
                }
            })
            .filter((v) => !!v.filters),

        // Inputs to final audio
        {
            input: streams.map((audio /*, i*/) => `${audio._tag}`),
            filters: (function* () {
                const {
                    fadeOut,
                    fadeIn,
                    outputFilters,
                    outputVolume,
                    audioNorm,
                    dropoutTransition = 0,
                } = opt;
                yield {
                    name: 'amix',
                    inputs: streams.length,
                    dropout_transition: dropoutTransition,
                    normalize: 0,
                    // weights: streams.map((audio) => audio.mixVolume ?? 10),
                };
                if (fadeIn) {
                    const { duration: fadeDur = 1, curve } = fadeIn;
                    yield {
                        name: 'afade',
                        t: 'in',
                        d: fadeDur,
                        curve,
                    };
                }

                if (outputVolume) {
                    yield { name: 'volume', volume: outputVolume };
                }
                if (audioNorm) {
                    const { gaussSize, maxGain } = audioNorm;
                    yield { name: 'dynaudnorm', g: gaussSize ?? 5, maxgain: maxGain ?? 30 };
                }
                if (fadeOut) {
                    const { duration: fadeDur = 1, curve } = fadeOut;
                    yield { name: 'afade', t: 'out', st: DURATION - fadeDur, d: fadeDur, curve };
                }

                if (outputFilters) {
                    for (const f of outputFilters) {
                        yield f;
                    }
                }
            })(),
        },
    );
    return filters;
}
import { FilterChain, Input } from './ffparams.js';
import { spawnSync } from 'child_process';