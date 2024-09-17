import { writeFileSync } from 'fs';
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

export class AudioChain {

}

export class AudioFilterable extends AudioChain {
    _tag?: string;
    _prev?: AudioFilterable;
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
    fade_in(duration: number, curve: string) {
        return new AFadeIn(this, duration, curve);
    }
    fade_out(duration: number, curve: string) {
        return new AFadeOut(this, duration, curve);
    }
    adjust_volume(volume: number) {
        return new AdjustVolume(this, volume);
    }
    pad_start(delay: number) {
        return new ADelay(this, delay);
    }
    pad(sec: number) {
        return new APad(this, sec);
    }
    *walk() {
        for (let cur: AudioFilterable | undefined = this; cur; cur = cur._prev) {
            yield cur;
        }
    }
    dump(): any {
        let a: any[] = [];
        for (let cur: AudioFilterable | undefined = this; cur; cur = cur._prev) {
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

    static load(d: { $: string;[key: string]: any; }, prev: AudioFilterable): AudioFilterable {
        switch (d.$) {
            case "adelay": return ADelay._load(d, prev);
            case "fade_in": return AFadeIn._load(d, prev);
            case "fade_out": return AFadeOut._load(d, prev);
            case "apad": return APad._load(d, prev);
            case "adjust_volume": return AdjustVolume._load(d, prev);
            case "source": return AudioSource._load(d, prev);
            case "slice": return Slice._load(d, prev);
            case "start_at": return StartAt._load(d, prev);
        }
        throw new Error(`Unexpected $ = '${d.$}'`);
    }
    static tag = '';

    feed_ff(ff: FFRun, parent?: AudioFilterable): string {
        const es = [...this.walk()].reverse();
        const inp = es.at(0);
        let input: Input;
        if (inp instanceof AudioSource) {
            input = inp;
        } else {
            throw new Error(`Unexpected ${es.constructor.name}`);
        }
        // input
        // output
        // filters

        // let I: Input;
        // if (last instanceof AudioSource) {
        //     I = get_index(last.id)
        // } else {
        //     throw new Error(`Unexpected`);
        // }
        let filters = [];
        for (const e of es) {
            for (const f of e.enum_filter()) {
                filters.push(f);
            }
        }
        // 56.toString()

        if (filters.length > 0) {
            const tag = ff.next_id();
            this._tag = tag;
            const o: FilterChain = { input: inp.feed_ff(ff, this), filters };
            if (parent) {
                o.output = tag;
            }
            ff.graph.push(o);
            return tag;
        } else {
            return inp.feed_ff(ff, this);
        }


    }
    // override toString() {

    // }

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
    }
    return new AudioSource({ id, duration, path: src });
}

export class AudioSource extends AudioFilterable {
    static override tag = 'source';
    id: string;
    duration: number;
    path: string;
    loop: number;
    seq: number = 0;
    constructor(kwargs: any) {
        super();
        const { id, duration, path, loop } = kwargs;
        if (typeof duration !== "number" || typeof id !== "string" || !id || !duration) {
            throw new Error(`Unexpected id = '${id}' duration = '${duration}'`);
        }
        this.id = id;
        this.duration = duration;
        this.path = path;
        this.loop = loop;
    }
    get start(): number {
        return 0;
    }
    get end(): number {
        return this.duration;
    }
    override _dump() {
        const { id, duration, path, loop } = this;
        return { $: (this.constructor as typeof AudioFilterable).tag, id, path, loop, duration }
    }
    static _load(d: any, prev: AudioFilterable) {
        if (prev == undefined) {
            throw new Error(`Unexpected`);
        }
        return new AudioSource(d);
    }
    override *enum_filter() {
    }
    override feed_ff(ff: FFRun, parent?: AudioFilterable) {
        const inp = ff.get_input_id(this.id);
        const { id, duration, path, loop } = this;
        if (path) {
            inp.path = path;
        }

        return this._tag = `${inp.index}:a`;
    }
}

export class StartAt extends AudioFilterable {
    static override tag = 'start_at';
    _start: number;
    constructor(prev: AudioFilterable, start: number) {
        super();
        if (typeof start !== "number" || !(prev instanceof AudioFilterable) || !start) {
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
        return { $: (this.constructor as typeof AudioFilterable).tag, start: this._start }
    }
    override *enum_filter() {
    }

    static _load(d: any, prev: AudioFilterable) {
        return new this(prev, d.start);
    }
}

export class AFadeIn extends AudioFilterable {
    static override tag = 'fade_in';
    duration: number;
    curve: string;
    constructor(prev: AudioFilterable, duration: number, curve: string) {
        super();
        if (typeof duration !== "number" || !(prev instanceof AudioFilterable) || typeof curve !== "string") {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.duration = duration;
        this.curve = curve;
    }
    override _dump() {
        let { duration, curve } = this;
        return { $: (this.constructor as typeof AudioFilterable).tag, duration, curve }
    }
    static _load(d: any, prev: AudioFilterable) {
        return new this(prev, d.duration, d.curve);
    }
    override *enum_filter() {
        const { duration: fade_dur = 1, curve } = this;
        yield {
            name: 'afade',
            t: 'in',
            // st: 0,
            d: this.duration,
            curve,
        };
    }
}

export class AFadeOut extends AFadeIn {
    static override tag = 'fade_out';
    override _dump() {
        let { duration, curve } = this;
        return { $: (this.constructor as typeof AudioFilterable).tag, duration, curve }
    }
    *enum_filter() {
        const { duration: fade_dur = 1, curve } = this;
        yield {
            name: 'afade',
            t: 'out',
            st: (this._prev?.get_duration() ?? NaN) - this.duration,
            d: this.duration,
            curve,
        };
    }
}

export class Slice extends AudioFilterable {
    static override tag = 'slice';
    _start: number;
    _end: number;
    constructor(prev: AudioFilterable, from?: number, to?: number) {
        super();
        if (typeof from !== "number" || !(prev instanceof AudioFilterable) || typeof to !== "number") {
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

    override *enum_filter() {
        const { start, end } = this;
        yield { name: 'atrim', start, end };
        if (start) {
            // https://stackoverflow.com/questions/57972761/ffmpeg-afade-not-being-applied-to-atrim
            yield { name: 'asetpts', expr: 'PTS-STARTPTS' };
        }
    }

    override _dump() {
        return { $: (this.constructor as typeof AudioFilterable).tag, start: this._start, end: this._end }
    }


    static _load(d: any, prev: AudioFilterable) {
        return new this(prev, d.start, d.end);
    }

}

export class AdjustVolume extends AudioFilterable {
    static override tag = 'adjust_volume';
    volume: number;
    constructor(prev: AudioFilterable, volume: number) {
        super();
        if (typeof volume !== "number" || !(prev instanceof AudioFilterable)) {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.volume = volume;
    }
    *enum_filter() {
        yield { name: 'volume', volume: this.volume };

    }
    override _dump() {
        return { $: (this.constructor as typeof AudioFilterable).tag, volume: this.volume }
    }
    static _load(d: any, prev: AudioFilterable) {
        return new this(prev, d.volume);
    }
}

export class ADelay extends AudioFilterable {
    static override tag = 'adelay';
    delay: number;
    constructor(prev: AudioFilterable, delay: number) {
        super();
        if (typeof delay !== "number" || !(prev instanceof AudioFilterable)) {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.delay = delay;
    }
    get start(): number {
        return (this._prev?.start ?? NaN) - this.delay;
    }
    *enum_filter() {
        yield { name: 'adelay', delays: Math.floor(this.delay * 1000), all: 1 };
    }
    override _dump() {
        return { $: (this.constructor as typeof AudioFilterable).tag, delay: this.delay }
    }
    static _load(d: any, prev: AudioFilterable) {
        return new this(prev, d.delay);
    }
}

export class APad extends AudioFilterable {
    static override tag = 'apad';
    pad_sec: number;
    constructor(prev: AudioFilterable, sec: number) {
        super();
        if (typeof sec !== "number" || !(prev instanceof AudioFilterable)) {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.pad_sec = sec;
    }
    get end(): number {
        return (this._prev?.end ?? NaN) - this.pad_sec;
    }
    *enum_filter() {
        yield { name: 'apad', pad_dur: fix_num(this.pad_sec) };
    }
    override _dump() {
        return { $: (this.constructor as typeof AudioFilterable).tag, pad_sec: this.pad_sec }
    }
    static _load(d: any, prev: AudioFilterable) {
        return new this(prev, d.pad_sec);
    }
}

export class FFRun {
    input: Input[] = [];
    graph: FilterChain[] = [];
    bin = 'ffmpeg';
    args = ['-hide_banner', '-y'];
    _next_no = 0;

    get_input_id(id: string) {
        for (const x of this.input) {
            if (x.id === id) {
                return x;
            }
        }
        let x = new Source();
        x.id = id;
        x.index = this.input.length;
        this.input.push(x); return x;
    }

    get_input_path(path: string) {
        for (const x of this.input) {
            if (x.path === path) {
                return x;
            }
        }
        let x = new Source();
        x.path = path;
        x.index = this.input.length;
        this.input.push(x);
        return x;
    }

    next_id() {
        return 'S' + (++this._next_no).toString(36);
    }

    ff_params() {
        return ff_params(this);
    }
    filter_complex_script(g: string) {

        const file = `/tmp/fcs.txt`;
        writeFileSync(file, g);
        return file;

    }
}

export class AMix extends AudioFilterable {
    inputs: AudioFilterable[];
    _start = 0;
    _end = 0;
    constructor(inputs: AudioFilterable[]) {
        super();
        let _start = 0;
        let _end = 0;
        for (const e of inputs) {
            _start = Math.min(e.start, _start);
            _end = Math.max(e.end, _end);
        }
        inputs = inputs.map(e => {
            const { start, end } = e;
            let pad_sec = _end - end;
            if (start > _start) {
                e = e.pad_start(start - _start);
            }
            if (pad_sec > 0) {
                // https://stackoverflow.com/questions/35509147/ffmpeg-amix-filter-volume-issue-with-inputs-of-different-duration
                e = e.pad(pad_sec);
            }
            return e;
        });
        this._start = _start;
        this._end = _end;
        this.inputs = inputs;
    }
    get start(): number {
        return this._start;
    }
    get end(): number {
        return this._end;
    }
    override *enum_filter() {
        yield {
            name: 'amix',
            inputs: this.inputs.length,
            dropout_transition: 0,
            normalize: 0,
            // weights: streams.map((audio) => audio.mixVolume ?? 10),
        };
    }
    override feed_ff(ff: FFRun, parent?: AudioFilterable) {
        const inputs = this.inputs.map(v => {
            return v.feed_ff(ff, this)
        })
        const filters = [{
            name: 'amix',
            inputs: this.inputs.length,
            dropout_transition: 0,
            normalize: 0,
            // weights: streams.map((audio) => audio.mixVolume ?? 10),
        }]
        ff.graph.push({
            input: inputs, filters
        });
        const tag = ff.next_id();
        return this._tag = tag;
    }
}

export function mix_sounds(
    ff: FFRun,
    duration: number,
    entries: Array<AudioFilterable>,
    sources: { [key: string]: { [key: string]: string | number; path: string; loop: number } },
    inputs: Array<Input>,
    filter_chain: Array<FilterChain>,
) {
    // let id_map: { [key: string]: number } = {}
    function get_index(id: string) {
        const inp = ff.get_input_id(id);
        const asset = sources[id];
        if (asset) {
            const { loop = 0, path } = asset;
            if (loop) {
                inp.loop = loop;
            }
            if (path) {
                inp.path = path;
            }
        }
        return inp;
    }


    let max_dur = 0;
    for (const e of entries) {
        max_dur = Math.max(e.end, max_dur);
    }
    max_dur = Math.min(duration, max_dur);

    const outputs = [];

    entries.map(e => {
        const { start, end } = e;
        let pad_sec = max_dur - e.end;
        if (start > 0) {
            e = e.pad_start(start);
        }
        if (pad_sec > 0) {
            // https://stackoverflow.com/questions/35509147/ffmpeg-amix-filter-volume-issue-with-inputs-of-different-duration
            e = e.pad(pad_sec);
        }
        return e;
    });

    for (let n = entries.length; n-- > 0;) {
        const e = entries[n];
        const es = [...e.walk()].reverse();
        const last = es.at(0);
        let I: Input;
        if (last instanceof AudioSource) {
            I = get_index(last.id)
        } else {
            throw new Error(`Unexpected`);
        }
        let filters = [];
        for (const e of es) {
            for (const f of e.enum_filter()) {
                filters.push(f);
            }
        }
        if (filters.length > 0) {
            const tag = `a${I}`;
            filter_chain.push({ input: StreamRef.audio(I), output: `a${I}`, filters: filters })
            outputs.push(tag);
        } else {
            const tag = `${I}:a`;
            outputs.push(tag);
        }
    }
    filter_chain.push({
        input: outputs,
        filters: (function* () {
            yield {
                name: 'amix',
                inputs: outputs.length,
                dropout_transition: 0,
                normalize: 0,
            };
        })()
    });
}

// // Inputs to final audio

function fix_num(n: number) {
    const v = n.toFixed(5);
    return v.indexOf('.') < 0 ? v : v.replace(/0+$/g, '').replace(/\.$/g, '');
}
import { Asset, Root } from '../model/elements.js';
import { ff_params, FilterChain, Input, Source, StreamRef } from './ffparams.js';
import { spawnSync } from 'node:child_process';