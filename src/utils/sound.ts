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
    tremolo(frequency: number = 5, depth: number = 0.5) {
        return new Tremolo2(this, { frequency, depth });
        return new Tremolo(this, frequency, depth);

    }
    reverse() {
        return new Reverse(this);
    }
    pad_start(delay: number) {
        return new ADelay(this, delay);
    }
    pad(sec: number) {
        return new APad(this, sec);
    }
    loop(n: number) {
        return new Loop(this, n);
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
            case "aevalsrc": return AEval._load(d, prev);
            case "fade_in": return AFadeIn._load(d, prev);
            case "fade_out": return AFadeOut._load(d, prev);
            case "apad": return APad._load(d, prev);
            case "adjust_volume": return AdjustVolume._load(d, prev);
            case "source": return AudioSource._load(d, prev);
            case "loop": return Loop._load(d, prev);
            case "revese": return Reverse._load(d, prev);
            case "slice": return Slice._load(d, prev);
            case "start_at": return StartAt._load(d, prev);
            case "tremolo": return Tremolo._load(d, prev);
        }
        throw new Error(`Unexpected $ = '${d.$}'`);
    }
}

export class AFirst {
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
                throw new Error(`Unexpected x<${x.constructor.name}>`);
            }
        }
        if (!input) {
            throw new Error(`input expected`);
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



export class AEval extends ASource {
    static override tag = 'aevalsrc';
    exprs: string;
    duration: number;
    constructor(exprs: string = "-2+random(0)", duration: number = 1) {
        super();
        this.exprs = exprs;
        this.duration = duration;
    }
    get start(): number {
        return 0;
    }
    get end(): number {
        return this.duration;
    }
    override _dump() {
        return { exprs: this.exprs, duration: this.duration, $: (this.constructor as typeof AudioChain).tag }
    }
    static override _load(d: any, prev: AFilter | ASource) {
        if (prev != undefined) {
            throw new Error(`Unexpected prev`);
        }
        return new AEval(d.exprs, d.duration);
    }
    static new(exprs: string, duration: number = 1) {
        return new AEval(exprs, duration);
    }
    override feed_ff(ff: FFRun, parent?: AudioChain) {
        const tag = ff.next_id();
        const filters = [{
            name: 'aevalsrc',
            exprs: this.exprs,
            d: this.duration,
        }]
        const o: FilterChain = { filters };
        if (parent) {
            o.output = tag;
        }
        ff.graph.push(o);
        return this._graph_name = tag;
    }

}

export class AudioSource extends ASource {
    static override tag = 'source';
    id: string;
    duration: number;
    path: string;
    constructor(kwargs: any) {
        super();
        const { id, duration, path } = kwargs;
        if (typeof duration !== "number" || typeof id !== "string" || !id || !duration) {
            throw new Error(`Unexpected id = '${id}' duration = '${duration}'`);
        }
        this.id = id;
        this.duration = duration;
        this.path = path;
    }
    get start(): number {
        return 0;
    }
    get end(): number {
        return this.duration;
    }
    override _dump() {
        const { id, duration, path } = this;
        return { $: (this.constructor as typeof AudioChain).tag, id, path, duration }
    }
    static override _load(d: any, prev: AFilter | ASource) {
        if (prev != undefined) {
            throw new Error(`Unexpected prev`);
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
            // https://stackoverflow.com/questions/57972761/ffmpeg-afade-not-being-applied-to-atrim
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

export class AFilter2 extends AFilter {
    data: object;
    constructor(prev: AFilter | ASource, data: object) {
        super();
        this._prev = prev;
        this.data = data;
    }
    override _dump() {
        return { ...this.data, $: (this.constructor as typeof AudioChain).tag }
    }
    static _load(d: object, prev: AFilter | ASource) {
        return new this(prev, d);
    }
}

export class Tremolo2 extends AFilter2 {
    static override tag = 'tremolo';
    *enum_filter() {
        const { frequency, depth } = this.data as any;
        yield { name: 'tremolo', f: frequency, d: depth };
    }
}

export class Tremolo extends AFilter {
    static override tag = 'tremolo';
    depth: number;
    frequency: number;
    constructor(prev: AFilter | ASource, frequency: number = 5, depth: number = 0.5) {
        super();
        if (typeof frequency !== "number" || !(prev instanceof AudioChain)) {
            throw new Error(`Unexpected`);
        }
        this._prev = prev;
        this.frequency = frequency;
        this.depth = depth;
    }
    *enum_filter() {
        yield { name: 'tremolo', f: this.frequency, d: this.depth };
    }
    override _dump() {
        return { $: (this.constructor as typeof AudioChain).tag, frequency: this.frequency, depth: this.depth }
    }
    static _load(d: any, prev: AFilter | ASource) {
        return new this(prev, d.frequency, d.depth);
    }
}

export class Reverse extends AFilter {
    static override tag = 'revese';
    constructor(prev: AFilter | ASource) {
        super();
        this._prev = prev;
    }
    *enum_filter() {
        yield { name: 'areverse' };
    }
    override _dump() {
        return { $: (this.constructor as typeof AudioChain).tag }
    }
    static _load(d: any, prev: AFilter | ASource) {
        return new this(prev);
    }
}

export class Loop extends AFilter {
    static override tag = 'loop';
    _loop: number;
    _start: number;
    _end: number;
    constructor(prev: AFilter | ASource, loop: number = -1.0) {
        super();
        this._prev = prev;
        this._start = prev.start;
        this._end = prev.start + prev.get_duration() * (loop + 1);
        this._loop = loop;
    }
    get start(): number {
        return this._start;
    }

    get end(): number {
        return this._end;
    }

    *enum_filter() {
        // https://superuser.com/questions/1391777/create-a-looped-audio-from-a-certain-part-of-audio-using-ffmpeg
        yield { name: 'asetrate', r: 48000 };
        yield { name: 'aloop', loop: this._loop, size: this.get_duration() * 48000 };
    }
    override _dump() {
        return { $: (this.constructor as typeof AudioChain).tag, loop: this._loop }
    }
    static _load(d: any, prev: AFilter | ASource) {
        return new this(prev, d.loop);
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
    static new(inputs: AudioChain[]) {
        return new AMix(inputs);
    }
    static from(...inputs: AudioChain[]) {
        return new AMix(inputs);
    }
}

function fix_num(n: number) {
    const v = n.toFixed(5);
    return v.indexOf('.') < 0 ? v : v.replace(/0+$/g, '').replace(/\.$/g, '');
}

import { FilterChain } from './ffparams.js';
import { FFRun } from './ffrun.js';