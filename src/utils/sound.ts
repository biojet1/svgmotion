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

export class AudioFilter {
    _prev?: AudioFilter;
    get_duration() {
        return this.end - this.start;
    }
    get start(): number {
        return this._prev?.start ?? NaN;
    }
    get end(): number {
        return this._prev?.start ?? NaN;
    }
    slice(from?: number, to?: number) {
        return new Slice(this, from, to);
    }
    start_at(start: number) {
        return new StartAt(this, start);
    }
    fade_out(duration: number, curve: string) {
        return new AFadeIn(this, duration, curve);
    }
    fade_in(duration: number, curve: string) {
        return new AFadeOut(this, duration, curve);
    }
    adjust_volume(volume: number) {
        return new AdjustVolume(this, volume);
    }
    *walk() {
        for (let cur: AudioFilter | undefined = this; cur; cur = cur._prev) {
            yield cur;
        }
    }
    dump(): any {
        let a: any[] = [];
        for (let cur: AudioFilter | undefined = this; cur; cur = cur._prev) {
            a.push(cur._dump());
        }
        return a.reverse();
    }


    *enum_filter(): Generator<{ name: string;[key: string]: any; }, void, unknown> {
        throw new Error(`Not implemented`);

    }

    _dump(): any {
        throw new Error(`Not implemented`);
    }

    static load(d: { $: string;[key: string]: any; }, prev: AudioFilter): AudioFilter {
        switch (d.$) {
            case "fade_in": return AFadeIn._load(prev, d);
            case "fade_out": return AFadeOut._load(prev, d);
            case "adjust_volume": return AdjustVolume._load(prev, d);
            case "source": return AudioSource._load(d);
            case "slice": return Slice._load(prev, d);
            case "start_at": return StartAt._load(prev, d);
        }
        throw new Error(`Unexpected $ = '${d.$}'`);
    }
    static tag = '';
}

declare module "../model/elements" {
    interface Asset {
        as_sound(): AudioSource;
    }
}

Asset.prototype.as_sound = function () {
    let { id, duration, src, _parent } = this;
    if (!duration) {
        this.duration = (duration = media_duration(src));
        // if (_parent instanceof Root) {
        //     let { src } = _parent.assets[id];
        //     if (src) {
        //         this.duration = (duration = media_duration(src))
        //     }
        // }
    }
    return new AudioSource(id, duration);
}

export class AudioSource extends AudioFilter {
    static override tag = 'source';
    id: string;
    duration: number;
    constructor(id: string, duration: number) {
        super();
        if (typeof duration !== "number" || typeof id !== "string" || !id || !duration) {
            throw new Error(`Unexpected id = '${id}' duration = '${duration}'`);
        }
        this.id = id;
        this.duration = duration;
    }
    get start(): number {
        return 0;
    }
    get end(): number {
        return this.duration;
    }
    override _dump() {
        return { $: (this.constructor as typeof AudioFilter).tag, id: this.id }
    }
    static _load(d: any) {
        return new AudioSource(d.id, d.duration);
    }
}

export class StartAt extends AudioFilter {
    static override tag = 'start_at';
    _start: number;
    constructor(prev: AudioFilter, start: number) {
        super();
        if (typeof start !== "number" || !(prev instanceof AudioFilter) || !start) {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this._start = start;
    }

    get start(): number {
        return (this._prev?.start ?? NaN) + this._start;
    }

    get end(): number {
        return (this._prev?.end ?? NaN) + this._start;
    }

    override _dump() {
        return { $: (this.constructor as typeof AudioFilter).tag, start: this._start }
    }

    static _load(prev: AudioFilter, d: any) {
        return new this(prev, d.start);
    }

}

export class AFadeIn extends AudioFilter {
    static override tag = 'fade_in';
    duration: number;
    curve: string;
    constructor(prev: AudioFilter, duration: number, curve: string) {
        super();
        if (typeof duration !== "number" || !(prev instanceof AudioFilter) || typeof curve !== "string") {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.duration = duration;
        this.curve = curve;
    }
    override _dump() {
        let { duration, curve } = this;
        return { $: (this.constructor as typeof AudioFilter).tag, duration, curve }
    }
    static _load(prev: AudioFilter, d: any) {
        return new this(prev, d.duration, d.curve);
    }
}

export class AFadeOut extends AFadeIn {
    static override tag = 'fade_out';
    override _dump() {
        let { duration, curve } = this;
        return { $: (this.constructor as typeof AudioFilter).tag, duration, curve }
    }
}

export class Slice extends AudioFilter {
    static override tag = 'slice';
    _start: number;
    _end: number;
    constructor(prev: AudioFilter, from?: number, to?: number) {
        super();
        if (typeof from !== "number" || !(prev instanceof AudioFilter) || typeof to !== "number") {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this._start = from ?? prev.start;
        this._end = to ?? prev.end;
    }

    get start(): number {
        return this._start;
    }

    get end(): number {
        return this._end;
    }

    *enum_filter() {
        const { _prev } = this;
        if (_prev) {
            yield* _prev.enum_filter();
        }
        yield { name: 'atrim', start: this._start, end: this._end };
        if (this.start) {
            yield { name: 'asetpts', expr: 'PTS-STARTPTS' };
        }
    }

    override _dump() {
        return { $: (this.constructor as typeof AudioFilter).tag, start: this._start, end: this._end }
    }
    static _load(prev: AudioFilter, d: any) {
        return new this(prev, d.start, d.end);
    }

}

export class AdjustVolume extends AudioFilter {
    static override tag = 'adjust_volume';
    volume: number;
    constructor(prev: AudioFilter, volume: number) {
        super();
        if (typeof volume !== "number" || !(prev instanceof AudioFilter)) {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.volume = volume;
    }
    *enum_filter() {
        const { _prev } = this;
        if (_prev) {
            yield* _prev.enum_filter();
        }
        yield { name: 'volume', volume: this.volume };

    }
    override _dump() {
        return { $: (this.constructor as typeof AudioFilter).tag, volume: this.volume }
    }
    static _load(prev: AudioFilter, d: any) {
        return new this(prev, d.volume);
    }
}


export function audio_graph(
    duration: number,
    entries: Array<AudioFilter>,
    inputs: Array<Input>,
    filters: Array<FilterChain>,
) {
    let max_dur = 0;
    for (const e of entries) {
        max_dur = Math.max(e.end, max_dur);
    }
    max_dur = Math.min(duration, max_dur);

    for (let n = entries.length; n-- > 0;) {
        const e = entries[n];
        const { start, end } = e;
        let pad_sec = max_dur - e.end;
        if (start > 0) {

        }
        if (Math.abs(pad_sec) <= 1 / 44100) {
            pad_sec = 0;
        }
        e.enum_filter()
    }

}

import { Asset, Root } from '../model/elements.js';
import { FilterChain, Input } from './ffparams.js';
import { spawnSync } from 'node:child_process';