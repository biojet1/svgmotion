export class AudioChain {
    _graph_name?: string;
    static tag = '';
    protected _start: number = 0;
    protected _end: number = 0;
    get start(): number {
        return this._start;
    }
    get end(): number {
        return this._end;
    }
    get_duration() {
        return this.end - this.start;
    }
    get prev(): AudioChain | undefined {
        return undefined
    }
    *walk() {
        for (let cur: AudioChain | undefined = this; cur; cur = cur.prev) {
            yield cur;
        }
    }
    // dump
    _dump(): any {
        throw new Error(`Not implemented`);
    }

    dump(): any {
        let a: any[] = [];
        for (let cur: AudioChain | undefined = this; cur; cur = cur.prev) {
            a.push(cur._dump());
        }
        return a.reverse();
    }
    ///
    slice(from?: number, to?: number) {
        return new Slice(this, { from, to });
    }
    start_at(start: number) {
        return new StartAt(this, { start });
    }
    fade_in(duration: number, curve: string) {
        return new AFadeIn(this, { duration, curve });
    }
    fade_out(duration: number, curve: string) {
        return new AFadeOut(this, { duration, curve });
    }
    adjust_volume(volume: number) {
        return new AdjustVolume(this, { volume });
    }
    tremolo(frequency: number = 5, depth: number = 0.5) {
        return new Tremolo(this, { frequency, depth });
        // return new Tremolo(this, frequency, depth);
    }
    reverse() {
        return new Reverse(this, {});
    }
    pad_start(delay: number) {
        return new ADelay(this, { delay });
    }
    pad(pad_sec: number) {
        return new APad(this, { pad_sec });
    }
    loop(loop: number) {
        return new Loop(this, { loop });
    }
    // load
    static _load(_d: any, _prev: AFilter | ASource) {
    }
    //
    graph_name(): string {
        const { _graph_name } = this;
        if (!!_graph_name) {
            return _graph_name;
        }
        throw new Error(`No name`);
    }
    feed_ff(_ff: FFRun, _parent?: AudioChain) {
        throw new Error(`Not implemented in ${this.constructor.name}`);
    }

}

export class ALoader {
    load(d: { $: string;[key: string]: any; }, prev: AFilter | ASource): AFilter | ASource {
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

export class ASource extends AudioChain {
    protected data: object;
    constructor(
        data: { [key: string]: any }
    ) {
        super();
        this.data = data || {};
    }
    override _dump() {
        return { ...this.data, $: (this.constructor as typeof AudioChain).tag }
    }

    static override _load(d: object, prev: AudioChain) {
        if (prev != undefined) {
            throw new Error(`Unexpected prev`);
        }
        return new this(d);
    }
}

export class AFilter extends AudioChain {
    protected data: object;
    protected _prev?: AudioChain;

    override  get start(): number {
        return this._start;
    }
    override  get end(): number {
        return this._end;
    }
    override    get prev(): AudioChain | undefined {
        return this._prev;
    }
    *enum_filter(): Generator<{ name: string;[key: string]: any; }, void, unknown> {
        throw new Error(`Not implemented`);
    }
    override   feed_ff(ff: FFRun, parent?: AudioChain): string {
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
        const tag = ff.next_id();
        this._graph_name = tag;
        if (filters.length > 0) {
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

    constructor(prev: AudioChain, data: { [key: string]: any }) {
        super();
        this._prev = prev;
        this._start = prev.start;
        this._end = prev.end;
        this.data = data;
    }

    override _dump() {
        return { ...this.data, $: (this.constructor as typeof AudioChain).tag }
    }

    static override _load(d: object, prev: AudioChain) {
        return new this(prev, d);
    }
}


export class AEval extends ASource {
    static override tag = 'aevalsrc';

    // exprs: string;
    constructor(
        data: { [key: string]: any }
        // exprs: string = "-2+random(0)", duration: number = 1
    ) {
        super(data);
        // this.exprs = exprs;
        const { duration = 1 } = this.data as { duration: number };
        this._end = duration;
    }
    static new(exprs: string, duration: number = 1) {
        return new AEval({ exprs, duration });
    }
    override feed_ff(ff: FFRun, parent?: AudioChain) {
        const tag = ff.next_id();
        const { exprs = "-2+random(0)" } = this.data as { exprs: string };
        const filters = [{
            name: 'aevalsrc',
            exprs: exprs,
            d: this.get_duration(),
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
    constructor(data: { [key: string]: any }) {
        super(data);
        const { duration, id } = this.data as { id: string; duration: number };
        if (typeof duration !== "number" || typeof id !== "string" || !id || !duration) {
            throw new Error(`Unexpected id = '${id}' duration = '${duration}'`);
        }
        this._end = duration;
    }
    override feed_ff(ff: FFRun, _parent?: AudioChain) {
        const { id, path } = this.data as { id: string; path: string };
        const inp = ff.get_input_id(id);
        if (path) {
            inp.path = path;
        }
        return this._graph_name = `${inp.index}:a`;
    }
}

export class StartAt extends AFilter {
    static override tag = 'start_at';
    constructor(prev: AudioChain, data: { [key: string]: any }) {
        super(prev, data);
        this._start = data.start as number;
        if (typeof this._start !== "number") {
            throw new Error(`Unexpected`);
        }
        this._end = this._start + prev.get_duration();
    }
    override *enum_filter() {
    }
}

export class AFadeIn extends AFilter {
    static override tag = 'fade_in';
    override *enum_filter() {
        const { duration: fade_dur = 1, curve = 'tri' } = this.data as { duration: number; curve: string };
        yield {
            name: 'afade', t: 'in', st: 0, d: fade_dur, curve
        };
    }
}

export class AFadeOut extends AFadeIn {
    static override tag = 'fade_out';
    override *enum_filter() {
        const { duration: fade_dur = 1, curve = 'tri' } = this.data as { duration: number; curve: string };
        yield {
            name: 'afade',
            t: 'out',
            st: this._end - fade_dur,
            d: fade_dur,
            curve,
        };
    }
}

export class Slice extends AFilter {
    static override tag = 'slice';
    from = 0;
    to = 0;
    constructor(prev: AudioChain, data: { [key: string]: any }) {
        super(prev, data);
        const { from = prev.start, to = prev.end } = data as { from: number, to: number };
        if (typeof from !== "number" || !(prev instanceof AudioChain) || typeof to !== "number") {
            throw new Error(`Unexpected`);
        }
        this.from = from;
        this.to = to;
        this._start = prev.start;
        this._end = this._start + (to - from);
    }
    override *enum_filter() {
        const { from, to } = this;
        yield { name: 'atrim', start: from, end: to };
        if (from > 0) {
            // https://stackoverflow.com/questions/57972761/ffmpeg-afade-not-being-applied-to-atrim
            yield { name: 'asetpts', expr: 'PTS-STARTPTS' };
        }
    }
}

export class AdjustVolume extends AFilter {
    static override tag = 'adjust_volume';
    override   *enum_filter() {
        const { volume } = this.data as { volume: number };
        yield { name: 'volume', volume };
    }
}

export class Tremolo extends AFilter {
    static override tag = 'tremolo';
    override  *enum_filter() {
        const { frequency, depth } = this.data as any;
        yield { name: 'tremolo', f: frequency, d: depth };
    }
}

export class Reverse extends AFilter {
    static override tag = 'revese';
    override  *enum_filter() {
        yield { name: 'areverse' };
    }
}

export class Loop extends AFilter {
    static override tag = 'loop';
    _loop: number;

    constructor(prev: AudioChain, data: { [key: string]: any }) {
        super(prev, data);
        let { loop = -1 } = data as { loop: number }
        if (loop < 0) {
            loop = Infinity;
        }
        this._start = prev.start;
        this._end = prev.start + prev.get_duration() * (loop + 1);
        this._loop = loop;
    }
    override   *enum_filter() {
        // https://superuser.com/questions/1391777/create-a-looped-audio-from-a-certain-part-of-audio-using-ffmpeg
        yield { name: 'asetrate', r: 48000 };
        yield { name: 'aloop', loop: this._loop, size: this.get_duration() * 48000 };
    }
}

export class ADelay extends AFilter {
    static override tag = 'adelay';
    delay: number;
    constructor(prev: AudioChain, data: { [key: string]: any }) {
        super(prev, data);
        let { delay = 0 } = data as { delay: number }
        this.delay = delay;
        this._start -= delay;
    }
    override  *enum_filter() {
        yield { name: 'adelay', delays: Math.floor(this.delay * 1000), all: 1 };
    }
}

export class APad extends AFilter {
    static override tag = 'apad';
    pad_sec: number;
    constructor(prev: AudioChain, data: { [key: string]: any }) {
        super(prev, data);
        let { pad_sec = 0 } = data as { pad_sec: number }
        this._end += pad_sec;
        this.pad_sec = pad_sec;
    }
    override  get end(): number {
        return (this._prev?.end ?? NaN) - this.pad_sec;
    }
    override *enum_filter() {
        yield { name: 'apad', pad_dur: fix_num(this.pad_sec) };
    }
}

export class AMix extends ASource {
    inputs: AudioChain[];
    constructor(inputs: AudioChain[], data: { [key: string]: any }) {
        super(data);
        let _start = 0;
        let _end = 0;
        const { duration = -Infinity } = this.data as { duration?: number };
        for (const e of inputs) {
            _start = Math.min(e.start, _start);
            _end = Math.max(e.end, _end);
        }
        if (duration > 0) {
            _end = Math.min(duration, _end);
        }
        // console.warn("RANGE", _start, _end);
        inputs = inputs.map(e => {
            const { start, end } = e;
            let pad_sec = _end - end;

            if (start > _start) {
                e = e.pad_start(start - _start);
            }
            if (pad_sec > 0) {
                // https://stackoverflow.com/questions/35509147/ffmpeg-amix-filter-volume-issue-with-inputs-of-different-duration
                e = e.pad(pad_sec);
            } else if (pad_sec < 0) {
                e = e.slice(0, _end);
            }
            // console.warn("inputs", pad_sec, [start, end], [_start, _end]);
            return e;
        });
        this._start = _start;
        this._end = _end;
        this.inputs = inputs;
    }

    override feed_ff(ff: FFRun, parent?: AudioChain) {
        const inputs = this.inputs.map(v => {
            v.feed_ff(ff, this);
            // console.warn("AMIX input", v.constructor.name)
            if (v instanceof StartAt) {
                // StartAt does not add filter
                if (v.prev instanceof ASource) {
                    return v.prev.graph_name();
                }
            }
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
    static new(inputs: AudioChain[], data: { [key: string]: any } = {}) {
        return new AMix(inputs, data);
    }
    // static from(...inputs: AudioChain[]) {
    //     return new AMix(inputs);
    // }
}

function fix_num(n: number) {
    const v = n.toFixed(5);
    return v.indexOf('.') < 0 ? v : v.replace(/0+$/g, '').replace(/\.$/g, '');
}

import { FilterChain } from './ffparams.js';
import { FFRun } from './ffrun.js';