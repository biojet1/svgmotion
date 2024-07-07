import { number } from "yargs";
import { Animated, KeyExtra } from "../keyframe/keyframe";
import { Track } from "./track";

type EasingT = Iterable<number> | true;

export type IProperty<V> = Animated<V>

interface Supplier {
    (that: Track): void;
    start: number;
    end: number;
}
export type Resolver = (frame: number, base_frame: number, hint_dur: number) => Supplier;
export type ResolverPlus = { (frame: number, base_frame: number, hint_dur: number): Supplier; next?: ResolverPlus; supplier?: Supplier; }
export type Proxy = (that: Track) => Resolver;

export interface Runnable {
    _start: number;
    _end: number;
    resolve(frame: number, base_frame: number, hint_dur: number): void;
    run(): void;
    get_active_dur(): number;
}

export interface IAction extends Runnable {


}

export type ParamsT = {
    easing?: EasingT;
    dur?: number;
    curve?: Iterable<number[]>;
};



export type RunGiver = (that: Track) => Runnable;

export class Action implements IAction {
    _start: number = -Infinity;
    _end: number = -Infinity;
    _dur?: number;
    /* c8 ignore start */
    run(): void {
        throw new Error("Not implemented");
    }
    /* c8 ignore stop */
    resolve(frame: number, base_frame: number, hint_dur: number): void {
        let { _dur } = this;
        this._start = frame;
        this._end = frame + (_dur ?? (this._dur = hint_dur));
    }
    get_active_dur() {
        return this._end - this._start;
    }
}
type ActionsParams = {
    easing?: EasingT;
    hint_dur?: number;
};
export abstract class Actions implements IAction {
    _start: number = -Infinity;
    _end: number = -Infinity;
    _hint_dur?: number;
    _easing?: EasingT;
    _runs: Array<Runnable>;

    constructor(track: Track, runs: Runnable[], { easing, hint_dur }: ActionsParams = {}) {
        this._runs = runs;
        easing == undefined || (this._easing = easing);
        hint_dur == undefined || (this._hint_dur = track.to_frame(hint_dur));
    }

    run() {
        for (const act of this._runs) {
            /* c8 ignore start */
            if (act instanceof Action || act instanceof Actions) {
                if (act._start < 0 || act._start > act._end) {
                    throw new Error(
                        `Unexpected _start=${act._start} _end=${act._end}`
                    );
                }
            }
            /* c8 ignore stop */
            act.run();
        }
    }
    get_active_dur() {
        return this._end - this._start;
    }

    abstract resolve(frame: number, base_frame: number, hint_dur: number): void;
}

type SeqParams = ActionsParams & { delay?: number; stagger?: number }
export class SeqA extends Actions {
    _delay?: number;
    _stagger?: number;

    constructor(track: Track, runs: Runnable[], params: SeqParams = {}) {
        super(track, runs, params);
        const { delay, stagger } = params;
        delay && (this._delay = track.to_frame(delay));
        stagger && (this._stagger = track.to_frame(stagger));
    }

    resolve(frame: number, base_frame: number, hint_dur: number) {
        const { _delay, _stagger, _hint_dur = hint_dur } = this;
        let e = frame;
        if (_stagger) {
            let s = frame; // starting time
            for (const act of this._runs) {
                act.resolve(s, base_frame, _hint_dur);
                e = act._end;
                s = Math.max(s + _stagger, base_frame); // next start time
            }
        } else if (_delay) {
            let s = frame; // starting time
            for (const act of this._runs) {
                act.resolve(s, base_frame, _hint_dur);
                e = act._end;
                s = Math.max(e + _delay, base_frame); // next start time
            }
        } else {
            for (const act of this._runs) {
                act.resolve(e, base_frame, _hint_dur);
                e = act._end;
            }
        }
        this._start = frame;
        this._end = e;
    }
}

export function Seq(items: Array<RunGiver>, params?: SeqParams) {
    if (!Array.isArray(items)) {
        throw new Error(`Unexpected`)
    } else {
        for (const a of items) {
            if (typeof a == "function") {
                continue;
            }
            throw new Error(`Unexpected`);
        }
    }
    return function (track: Track) {
        return new SeqA(track, items.map(giver => giver(track)), params);
    }
}

export class ParA extends Actions {
    _tail?: boolean;

    resolve(frame: number, base_frame: number, hint_dur_: number): void {
        let { _hint_dur = hint_dur_ } = this;
        let end = frame;

        for (const act of this._runs) {
            act.resolve(frame, base_frame, _hint_dur);
            if (_hint_dur == undefined) {
                _hint_dur = act.get_active_dur();
            } else {
                _hint_dur = Math.max(_hint_dur, act.get_active_dur());
            }
            end = Math.max(end, act._end);
        }
        if (this._tail) {
            for (const act of this._runs) {
                if (act._end != end) {
                    act.resolve(
                        end - act.get_active_dur(),
                        base_frame,
                        _hint_dur
                    );
                }
                /* c8 ignore start */
                if (act._end != end) {
                    throw new Error(
                        `Unexpected act._end=${act._end} end=${end}`
                    );
                }
                /* c8 ignore stop */
            }
        }
        this._start = frame;
        this._end = end;
    }
}

export function Par(items: Array<RunGiver>, params?: ActionsParams): RunGiver {
    if (!Array.isArray(items)) {
        throw new Error(`Unexpected`)
    } else {
        for (const a of items) {
            if (typeof a == "function") {
                continue;
            }
            throw new Error(`Unexpected`);
        }
    }
    return function (track: Track) {
        return new ParA(track, items.map(giver => giver(track)), params);
    }
}

export function ParE(items: Array<RunGiver>, params?: ActionsParams): RunGiver {
    if (!Array.isArray(items)) {
        throw new Error(`Unexpected`)
    } else {
        for (const a of items) {
            if (typeof a == "function") {
                continue;
            }
            throw new Error(`Unexpected`);
        }
    }
    return function (track: Track) {
        const x = new ParA(track, items.map(giver => giver(track)), params);
        x._tail = true;
        return x;
    }
}

export type Params2 = {
    property: IProperty<any>;
    value: any;
    add: boolean;
    extra: KeyExtra;
    _next?: Params2
};

export class ToA extends Action {
    _first: Params2;
    constructor(track: Track, props: IProperty<any>[] | IProperty<any>, value: any, params?: ParamsT) {
        super();
        let { dur, ...extra } = params ?? {};
        {
            const m = list_props(props).map((property) => ({ property, value, extra } as Params2));
            m.forEach((e, i, a) => {
                e._next = a.at(i + 1);
            });
            this._first = m.at(0)!;
        }
        dur == undefined || (this._dur = track.to_frame(dur));
        for (let cur: Params2 | undefined = this._first; cur; cur = cur._next) {
            const { property, extra } = cur;
            extra.easing ?? (extra.easing = track.easing);
            track.add_update(property);
        }
    }
    run(): void {
        const { _start: start, _end, _first } = this;
        for (let cur: Params2 | undefined = _first; cur; cur = cur._next) {
            const { property, extra, value } = cur;
            property.key_value(_end, value, { start, ...extra });
        }
    };
}

export class PassA extends Action {
    constructor(track: Track, dur?: number) {
        super();
        dur == undefined || (this._dur = track.to_frame(dur));
    }
    run(): void {

    };
}

export class AddA extends ToA {
    constructor(track: Track, props: IProperty<any>[] | IProperty<any>, value: any, params?: ParamsT) {
        super(track, props, value, params);
        for (let cur: Params2 | undefined = this._first; cur; cur = cur._next) {
            cur.extra.add = true;
        }
    }
}

function list_props(x: IProperty<any>[] | IProperty<any>) {
    if (Array.isArray(x)) {
        return x;
    } else {
        return [x];
    }
}

export function To(
    props: IProperty<any>[] | IProperty<any>,
    value: any,
    params?: ParamsT,
): RunGiver {
    return function (track: Track) {
        return new ToA(track, props, value, params);
    }
}

export function Add(
    props: IProperty<any>[] | IProperty<any>,
    value: any,
    params?: ParamsT
): RunGiver {
    return function (track: Track) {
        return new AddA(track, props, value, params);
    }
}

export function Pass(dur?: number): RunGiver {
    return function (track: Track) {
        return new PassA(track, dur);
    }
}
export function Pass2(dur: number = 1): Proxy {
    return function (track: Track) {
        dur = track.to_frame(dur);
        function sup(that: Track) { }
        sup.start = -Infinity;
        sup.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            sup.start = frame;
            sup.end = frame + dur;
            return sup;
        }
    }
}

export function To2(
    props: IProperty<any>[] | IProperty<any>,
    value: any,
    params?: ParamsT,
    add: boolean = false
): Proxy {
    return function (track: Track) {
        let { dur, ...extra } = params ?? {};
        const m = list_props(props).map((property) => ({ property, value, extra } as Params2));
        m.forEach((e, i, a) => {
            e._next = a.at(i + 1);
        });
        const _first = m.at(0)!;
        const _dur = dur == undefined ? undefined : track.to_frame(dur);
        for (let cur: Params2 | undefined = _first; cur; cur = cur._next) {
            const { property, extra } = cur;
            extra.easing ?? (extra.easing = track.easing);
            extra.add = add;
        }
        function sup(that: Track) {
            const { start, end } = sup;
            for (let cur: Params2 | undefined = _first; cur; cur = cur._next) {
                const { property, extra, value } = cur;
                property.key_value(end, value, { start, ...extra });
                track.add_update(property);
            }
        }
        sup.start = -Infinity;
        sup.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            sup.start = frame;
            sup.end = frame + (_dur ?? hint_dur);
            return sup;
        }
    }
}
export function Add2(
    props: IProperty<any>[] | IProperty<any>,
    value: any,
    params?: ParamsT,
): Proxy {
    return To2(props, value, params, true);
}

export function llsup(track: Track, items: Array<Proxy>) {
    if (!Array.isArray(items)) {
        throw new Error(`Unexpected`)
    }

    let head: ResolverPlus | undefined = undefined;
    let cur: ResolverPlus | undefined = undefined;
    for (const prox of items) {
        if (typeof prox != "function") {
            throw new Error(`Unexpected`);
        }
        const res: ResolverPlus = prox(track);
        if (cur) {
            cur.next = cur;
        } else {
            head = cur = res;
        }
        res.next = undefined;
        cur = res;
    }
    return head;
}

export function Seq2(items: Array<Proxy>, params?: SeqParams): Proxy {
    return function (track: Track) {
        const head = llsup(track, items);
        let { easing, hint_dur, delay, stagger } = params ?? {};
        const dur_hint = hint_dur && track.to_frame(hint_dur);
        delay && (delay = track.to_frame(delay));
        stagger && (stagger = track.to_frame(stagger));

        if (!head) {
            throw new Error(`Unexpected`)
        }

        function sup(that: Track) {
            for (let res = head; res; res = res.next) {
                const sup = res.supplier;
                /* c8 ignore start */
                if (!sup) {
                    throw new Error(`Unexpected`);
                } else if (sup.start < 0 || sup.start > sup.end) {
                    throw new Error(
                        `Unexpected start=${sup.start} end=${sup.end}`
                    );
                }
                /* c8 ignore stop */
                sup(that);
            }
        }
        sup.start = -Infinity;
        sup.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            let e = frame;
            dur_hint && (hint_dur = dur_hint);

            if (stagger) {
                let s = frame; // starting time
                for (let res: ResolverPlus | undefined = head; res; res = res.next) {
                    const sup = res(s, base_frame, hint_dur);
                    e = sup.end;
                    s = Math.max(s + stagger, base_frame); // next start time
                    res.supplier = sup;
                }

            } else if (delay) {
                let s = frame; // starting time
                for (let res: ResolverPlus | undefined = head; res; res = res.next) {
                    const sup = res(s, base_frame, hint_dur);
                    e = sup.end;
                    s = Math.max(e + delay, base_frame); // next start time
                    res.supplier = sup;
                }
            } else {
                for (let res: ResolverPlus | undefined = head; res; res = res.next) {
                    const sup = res(e, base_frame, hint_dur);
                    e = sup.end;
                    res.supplier = sup;
                }
            }
            sup.start = frame;
            sup.end = e;
            return sup;
        }
    }
}
export function Par2(items: Array<Proxy>, params?: ActionsParams & { tail?: boolean }): Proxy {
    return function (track: Track) {
        const head = llsup(track, items);
        let { easing, hint_dur, tail } = params ?? {};
        const dur_hint = hint_dur && track.to_frame(hint_dur);
        function sup(that: Track) {
            for (let res = head; res; res = res.next) {
                const sup = res.supplier;
                /* c8 ignore start */
                if (!sup) {
                    throw new Error(`Unexpected`);
                } else if (sup.start < 0 || sup.start > sup.end) {
                    throw new Error(
                        `Unexpected start=${sup.start} end=${sup.end}`
                    );
                }
                /* c8 ignore stop */
                sup(that);
            }
        }
        sup.start = -Infinity;
        sup.end = -Infinity;
        return function (frame: number, base_frame: number, hint_dur: number) {
            dur_hint && (hint_dur = dur_hint);
            let end = frame;

            for (let res: ResolverPlus | undefined = head; res; res = res.next) {
                const sup = res(frame, base_frame, hint_dur);
                if (hint_dur == undefined) {
                    hint_dur = sup.end - sup.start
                } else {
                    hint_dur = Math.max(hint_dur, sup.end - sup.start);
                }
                end = Math.max(end, sup.end);
                res.supplier = sup;
            }
            if (tail) {
                for (let res: ResolverPlus | undefined = head; res; res = res.next) {
                    let sup = res.supplier;
                    if (!sup) {
                        throw new Error(`Unexpected `);
                    } else if (sup.end != end) {
                        res.supplier = (sup = res(
                            end - (sup.end - sup.start),
                            base_frame,
                            hint_dur
                        ));
                    }
                    /* c8 ignore start */
                    if (sup.end != end) {
                        throw new Error(`Unexpected sup.end=${sup.end} end=${end}`);
                    }
                    /* c8 ignore stop */
                }
            }
            sup.start = frame;
            sup.end = end;
            return sup;
        }

    }
}
type RelEntry = {
    props: IProperty<any>[];
    value: any;
    extra: KeyExtra;
}
type RelEntry2 = {
    _offset: number;
    end: number;
    value: any;
    extra: KeyExtra;
};

export function Rel2(t: string | number): Proxy {
    const map2 = new Map<string | number, RelEntry[]>();
    let cur: RelEntry[] = [];
    map2.set(t, cur);
    function fn(track: Track) {
        let t_max = -Infinity;
        const map = new Map<IProperty<any>, RelEntry2[]>();
        for (const [time, _] of map2.entries()) {
            // console.log('time', time, time.endsWith('%'));
            if (typeof time == 'number') {
                if (!Number.isFinite(time)) {
                    throw new Error(`Invalid time: ${time}`);
                } else if (time < 0) {
                    continue;
                } else {
                    t_max = Math.max(t_max, time);
                }
            }
        }
        if (t_max <= 0) {
            // console.log(map2);
            throw new Error(`Invalid duration: ${t_max}`);
        }
        const frames = track.to_frame(t_max);
        for (const [time, entries] of map2.entries()) {
            // console.log('time', time, time.endsWith('%'));
            let sec: number;
            if (typeof time == 'number') {
                if (time < 0) {
                    sec = t_max + time;
                } else {
                    sec = time;
                }
            } else {
                const n = parseFloat(time.slice(0, -1))
                if ((n >= 0 || n <= 100) && time.endsWith('%')) {
                    throw new Error(`Unexpected`);
                }
                sec = t_max * n / 100.0
            }
            if (sec < 0 || sec > t_max) {
                throw new Error(`Unexpected`);
            }
            const frame = track.to_frame(sec);
            for (const e of entries) {
                // map
                for (const p of e.props) {
                    let a: RelEntry2[] | undefined;
                    (a = map.get(p)) ?? map.set(p, a = []);
                    a.push({
                        _offset: frame, end: NaN, value:
                            p.check_value(e.value), extra: { ...e.extra }
                    })
                }

            }
        }
        for (const [, v] of map.entries()) {
            v.sort((a, b) => a._offset - b._offset)
        }
        function sup(that: Track) {
            for (const [k, v] of map.entries()) {
                for (const e of v) {
                    k.key_value(e.end, e.value, e.extra);
                }
            }
        }
        sup.start = -Infinity;
        sup.end = -Infinity;

        return function (frame: number, base_frame: number, hint_dur: number) {
            for (const v of map.values()) {
                let prev: RelEntry2 | undefined = undefined;
                for (const e of v) {
                    e.end = frame + e._offset;
                    if (!prev) {
                        if (e._offset > 0) {
                            // e.extra.easing = true;
                            e.extra.start = frame;
                        }
                    }
                    prev = e;
                }
            }
            sup.start = frame;
            sup.end = frame + frames;
            return sup;
        }
    }
    fn.t = function (t: number) {
        if (t >= 0) {
            this.last_t = t;
        } else {
            throw new Error(`Unexpected `);
        }
        const x = map2.get(t);
        x ? (cur = x) : map2.set(t, (cur = []));
        return this;
    };
    fn.d = function (d: number) {
        const t = this.last_t;
        if (isNaN(t)) {
            throw new Error(`set 't' first `);
        } else if (d < 0) {
            d = t + d
        }
        if (d < 0) {
            throw new Error(`d<0`);
        }
        return this.t(d);
    };
    fn.p = function (p: number) {
        const c = p < 0 ? -p : p;
        if (c > 100 || c < 0) {
            throw new Error(`p 0-100`);
        } else if (p < 0) {
            p = 100 + p;
        }
        const k = `${p}%`
        const x = map2.get(k);
        x ? (cur = x) : map2.set(k, (cur = []));
        return this;
    };
    fn.to = function (props: IProperty<any>[] | IProperty<any>, value: any, extra: KeyExtra = {}) {
        cur.push({ props: list_props(props), value, extra });
        return this;
    };
    fn.add = function (props: IProperty<any>[] | IProperty<any>, value: any, extra: KeyExtra = {}) {
        cur.push({ props: list_props(props), value, extra: { ...extra, add: true } });
        return this;
    };
    fn.last_t = NaN;
    return fn;
}