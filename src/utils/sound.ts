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
    _graph_name?: string;
    static tag = '';
    get_duration() {
        return this.end - this.start;
    }
    get start(): number {
        return NaN;
    }
    get end(): number {
        return NaN;
    }
    get prev(): AudioChain | undefined {
        return undefined
    }
    _dump(): any {
        throw new Error(`Not implemented`);
    }
    graph_name(): string {
        const { _graph_name } = this;
        if (_graph_name) {
            return _graph_name;
        }
        throw new Error(`No name`);
    }
    static _load(d: any, prev: AFilter | ASource) {
    }
    feed_ff(ff: FFRun, parent?: AudioChain) {
        throw new Error(`Not implemented in ${this.constructor.name}`);
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
        for (let cur: AudioChain | undefined = this; cur; cur = cur.prev) {
            yield cur;
        }
    }
    dump(): any {
        let a: any[] = [];
        for (let cur: AFilter | ASource | undefined = this; cur; cur = cur.prev) {
            a.push(cur._dump());
        }
        return a.reverse();
    }
    static load(d: { $: string;[key: string]: any; }, prev: AFilter | ASource): AFilter | ASource {
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
}

export class ASource extends AudioChain {

}

export class AFilter extends AudioChain {
    _prev?: AudioChain;
    get start(): number {
        return this._prev?.start ?? NaN;
    }
    get end(): number {
        return this._prev?.end ?? NaN;
    }
    get prev(): AudioChain | undefined {
        return this._prev;
    }
    *enum_filter(): Generator<{ name: string;[key: string]: any; }, void, unknown> {
        throw new Error(`Not implemented`);
    }
    feed_ff(ff: FFRun, parent?: AudioChain): string {
        let filters = [];
        let input: ASource | undefined;
        for (const x of this.walk()) {
            if (x instanceof ASource) {
                x.feed_ff(ff, this);
                input = x;
            } else if (x instanceof AFilter) {
                filters.unshift(...x.enum_filter())
            } else {
                throw new Error(`Unexpected`);
            }
        }
        if (!input) {
            throw new Error(`Unexpected`);
        }
        if (filters.length > 0) {
            const tag = ff.next_id();
            this._graph_name = tag;
            const o: FilterChain = { input: input.graph_name(), filters };
            if (parent) {
                o.output = tag;
            }
            ff.graph.push(o);
            return tag;
        } else {
            return input.graph_name();
        }
    }
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

export class AudioSource extends ASource {
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
        return { $: (this.constructor as typeof AudioChain).tag, id, path, loop, duration }
    }
    static override _load(d: any, prev: AFilter | ASource) {
        if (prev == undefined) {
            throw new Error(`Unexpected`);
        }
        return new AudioSource(d);
    }

    override feed_ff(ff: FFRun, parent?: AudioChain) {
        const inp = ff.get_input_id(this.id);
        const { id, duration, path, loop } = this;
        if (path) {
            inp.path = path;
        }
        return this._graph_name = `${inp.index}:a`;
    }
}

export class StartAt extends AFilter {
    static override tag = 'start_at';
    _start: number;
    constructor(prev: AFilter | ASource, start: number) {
        super();
        if (typeof start !== "number" || !(prev instanceof AudioChain) || !start) {
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
        return { $: (this.constructor as typeof AudioChain).tag, start: this._start }
    }
    override *enum_filter() {
    }

    static _load(d: any, prev: AFilter | ASource) {
        return new this(prev, d.start);
    }
}

export class AFadeIn extends AFilter {
    static override tag = 'fade_in';
    duration: number;
    curve: string;
    constructor(prev: AFilter | ASource, duration: number, curve: string) {
        super();
        if (typeof duration !== "number" || !(prev instanceof AudioChain) || typeof curve !== "string") {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.duration = duration;
        this.curve = curve;
        // this.filter = prev.
    }
    override _dump() {
        let { duration, curve } = this;
        return { $: (this.constructor as typeof AudioChain).tag, duration, curve }
    }
    static _load(d: any, prev: AFilter | ASource) {
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
        return { $: (this.constructor as typeof AudioChain).tag, duration, curve }
    }
    *enum_filter() {
        const { duration, curve } = this;
        yield {
            name: 'afade',
            t: 'out',
            st: (this._prev?.end ?? NaN) - duration,
            d: this.duration,
            curve,
        };
    }
}

export class Slice extends AFilter {
    static override tag = 'slice';
    _start: number;
    _end: number;
    from = 0;
    to = 0;
    constructor(prev: AFilter | ASource, from?: number, to?: number) {
        super();
        if (typeof from !== "number" || !(prev instanceof AudioChain) || typeof to !== "number") {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.from = from ?? prev.start;
        this.to = to ?? prev.end;
        this._start = prev.start;
        this._end = this._start + (this.to - this.from);
    }

    get start(): number {
        return this._start;
    }

    get end(): number {
        return this._end;
    }

    override *enum_filter() {
        const { start, end, from, to } = this;
        yield { name: 'atrim', start: from, end: to };
        if (from > 0) {
            https://stackoverflow.com/questions/57972761/ffmpeg-afade-not-being-applied-to-atrim
            yield { name: 'asetpts', expr: 'PTS-STARTPTS' };
        }
    }

    override _dump() {
        return { $: (this.constructor as typeof AudioChain).tag, start: this.from, end: this.to }
    }


    static _load(d: any, prev: AFilter | ASource) {
        return new this(prev, d.start, d.end);
    }

}

export class AdjustVolume extends AFilter {
    static override tag = 'adjust_volume';
    volume: number;
    constructor(prev: AFilter | ASource, volume: number) {
        super();
        if (typeof volume !== "number" || !(prev instanceof AudioChain)) {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.volume = volume;
    }
    *enum_filter() {
        yield { name: 'volume', volume: this.volume };

    }
    override _dump() {
        return { $: (this.constructor as typeof AudioChain).tag, volume: this.volume }
    }
    static _load(d: any, prev: AFilter | ASource) {
        return new this(prev, d.volume);
    }
}

export class ADelay extends AFilter {
    static override tag = 'adelay';
    delay: number;
    constructor(prev: AFilter | ASource, delay: number) {
        super();
        if (typeof delay !== "number" || !(prev instanceof AudioChain)) {
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
        return { $: (this.constructor as typeof AudioChain).tag, delay: this.delay }
    }
    static _load(d: any, prev: AFilter | ASource) {
        return new this(prev, d.delay);
    }
}

export class APad extends AFilter {
    static override tag = 'apad';
    pad_sec: number;
    constructor(prev: AFilter | ASource, sec: number) {
        super();
        if (typeof sec !== "number" || !(prev instanceof AudioChain)) {
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
        return { $: (this.constructor as typeof AudioChain).tag, pad_sec: this.pad_sec }
    }
    static _load(d: any, prev: AFilter | ASource) {
        return new this(prev, d.pad_sec);
    }
}

export class FFRun {
    input: Input[] = [];
    graph: FilterChain[] = [];
    bin = 'ffmpeg';
    args = ['-hide_banner', '-y'];
    _next_no = 0;
    filter_script_path = `/tmp/fcs.txt`;

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
        const file = this.filter_script_path;
        writeFileSync(file, g);
        return file;
    }
    _run() {
        const cmd = this.ff_params();
        return import('node:child_process').then(cp => {
            let [bin, ...args] = cmd;
            return cp.spawn(bin, args, { stdio: 'inherit' });
        })
    }


}

export class AMix extends ASource {
    inputs: AudioChain[];
    _start = 0;
    _end = 0;
    constructor(inputs: AudioChain[]) {
        super();
        let _start = 0;
        let _end = 0;
        for (const e of inputs) {
            _start = Math.min(e.start, _start);
            _end = Math.max(e.end, _end);
        }
        // console.log("RANGE", _start, _end);
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
            // console.log("inputs", pad_sec, [start, end], [_start, _end]);
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

    override feed_ff(ff: FFRun, parent?: AudioChain) {
        const inputs = this.inputs.map(v => {
            v.feed_ff(ff, this);
            return v.graph_name();
        })
        const filters = [{
            name: 'amix',
            inputs: this.inputs.length,
            dropout_transition: 0,
            normalize: 0,
            // weights: streams.map((audio) => audio.mixVolume ?? 10),
        }]
        const tag = ff.next_id();
        const o: FilterChain = { input: inputs, filters }
        if (parent) {
            o.output = tag;
        }
        ff.graph.push(o);
        return this._graph_name = tag;
    }
}


function fix_num(n: number) {
    const v = n.toFixed(5);
    return v.indexOf('.') < 0 ? v : v.replace(/0+$/g, '').replace(/\.$/g, '');
}
import { Asset, Root } from '../model/elements.js';
import { ff_params, FilterChain, Input, Source, StreamRef } from './ffparams.js';
import { spawnSync } from 'node:child_process';