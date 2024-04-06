import { Action, IProperty, IParent } from "./action.js";

export interface Entry {
    t: number; // offset in seconds
    ease?: any;
    [key: string]: any;
}

export interface UserEntry {
    dur?: number;
    t?: number; // offset in seconds
    ease?: any;
    [key: string]: any;
}

export interface PropMap {
    [key: string]: IProperty<any> | Array<IProperty<any>>;
}

interface KF {
    t: number;
    value: any;
    ease: any;
}

interface KFMap {
    [key: string]: KF[];
}

interface Params {
    dur?: number;
    easing?: any;
    bounce?: boolean;
    repeat?: number;
    max_dur?: number;
}

export class StepA extends Action {
    _steps: Array<UserEntry>;
    _max_dur?: number;
    _easing?: ((a: any) => void) | true;
    _bounce?: boolean;
    _repeat?: number;
    _base_frame: number;
    _vars: PropMap;
    private _kf_map?: KFMap;
    constructor(
        steps: Array<UserEntry>,
        vars: PropMap,
        {
            dur,
            easing,
            bounce,
            repeat,
            max_dur,
        }: Params
    ) {
        super();
        this._steps = steps;
        this._vars = vars;
        this._base_frame = Infinity;
        this.ready = function (parent: IParent): void {
            this._dur = (dur == undefined) ? parent._hint_dur : parent.to_frame(dur);
            this._max_dur = (max_dur == undefined) ? parent._hint_dur : parent.to_frame(max_dur);
            if (repeat) {
                this._repeat = repeat;
            }
            if (bounce) {
                this._bounce = bounce;
            }
            easing = this._easing ?? easing;

            // collect names, parse inputs
            const names: Array<string> = [];
            this._steps.map((e, i, a) => {
                for (const [k, v] of Object.entries(e)) {
                    switch (k) {
                        case "dur":
                        case "t":
                            e[k] = parent.to_frame(v);
                            continue;
                        case "ease":
                            e[k] = e[k] ?? easing;
                            continue;
                    }
                    names.push(k);
                }
            });
            // drop propertye not present
            for (const [k, _] of Object.entries(this._vars)) {
                if (names.indexOf(k) < 0) {
                    delete vars[k];
                }
            }
        };
    }
    resolve(frame: number, base_frame: number, hint_dur: number): void {
        let { _steps: steps, _kf_map, _dur, _max_dur, _vars } = this;
        if (_kf_map != undefined) {
            if (this._start != frame) {
                const d = this._end - this._start;
                this._start = frame;
                this._end = frame + d;
            }
            return;
        }
        if (_dur != undefined) {
            hint_dur = _dur;
        }
        if (_max_dur == undefined) {
            _max_dur = hint_dur;
        }
        const entries = resolve_t(steps, _vars, hint_dur, _max_dur);
        if (this._bounce) {
            // TODO
        }
        if (this._repeat) {
            // TODO
        }

        let t_max = 0;
        for (const e of entries) {
            t_max = Math.max(t_max, e.t);
        }

        this._kf_map = map_keyframes(entries);
        this._start = frame;
        this._end = frame + t_max;
        this._base_frame = base_frame;
    }

    run(): void {
        const start = this._start;
        const B = this._base_frame;
        for (const { prop, entries } of separate_keyframes(
            this._vars,
            this._kf_map!
        )) {
            let prev_t = 0;
            for (let { t, value, ease } of entries) {
                const frame = start + t;
                if (value == undefined) {
                    value = prop.get_value(start);
                } else {
                    // TODO
                }
                prop.set_value(frame, value, prev_t, ease);
                prev_t = t;
            }
        }
    }
}

function resolve_t(
    steps: Array<UserEntry>,
    vars: { [key: string]: IProperty<any> | IProperty<any>[] },
    hint_dur?: number,
    max_dur?: number
) {
    const entries = new Array<Entry>();
    steps.forEach((e, i, a) => {
        let t_max: number | undefined = undefined;
        if (e.t == undefined) {
            const { dur } = e;
            if (dur == undefined) {
                if (i == 0) {
                    e.t = 0;
                } else {
                    const prev = steps[i - 1];
                    if (!(i > 0 && prev.t != undefined)) {
                        throw new Error(`Unexpected`);
                    } else if (hint_dur == undefined) {
                        throw new Error(`for no "t" and no "dur" provide hint duration'`);
                    }
                    e.t = prev.t + hint_dur;
                }
            } else if (i > 0) {
                if (!(dur >= 0)) {
                    throw new Error(`Unexpected`);
                }
                e.t = dur + steps[i - 1].t!;
            } else {
                if (!(i === 0 || dur >= 0)) {
                    throw new Error(`Unexpected`);
                }
                e.t = dur;
            }
        }
        if (e.t < 0) {
            if (t_max == undefined) {
                if (max_dur == undefined) {
                    throw new Error(`for negative "t" provide max duration`);
                }
                t_max = max_dur;
            }
            e.t = t_max + e.t;
        }
        const { t } = e;
        if (t_max != undefined) {
            if (t > t_max) {
                throw new Error(`"t" is > max duration`);
            }
        }
        if (t < 0) {
            throw new Error(`"t" is negative`);
        } else if (t > 0) {
            if (i == 0) {
                // first item is not t=0
                const first: Entry = { t: 0 };
                for (const [n, _] of Object.entries(vars)) {
                    first[n] = null;
                }
                entries.push(first);
            }
        } else {
            if (!(i === 0 && t == 0)) {
                throw new Error(`Unexpected`);
            }
            for (const [k, _] of Object.entries(vars)) {
                if (Object.hasOwn(e, k)) {
                    if (e[k] == null) {
                        throw new Error(`Unexpected`);
                    }
                } else {
                    e[k] = null;
                }
            }
        }
        entries.push(e as Entry);
    });
    return entries;
}

function map_keyframes(steps: Array<Entry>): KFMap {
    const entry_map: { [key: string]: Array<Entry> } = {};
    for (const e of steps) {
        for (const [k, _] of Object.entries(e)) {
            switch (k) {
                case "dur":
                case "t":
                case "ease":
                    continue;
            }
            if (!k) {
                throw new Error(`Unexpected key ${k} in steps ${steps}`);
            }
            let a = entry_map[k];
            if (!a) {
                a = entry_map[k] = [];
            }
            a.push(e);
        }
    }
    const kf_map: KFMap = {};
    for (const [name, entries] of Object.entries(entry_map)) {
        const x = entries
            .map((v, i, a) => {
                return { t: v.t, value: v[name], ease: v.ease };
            })
            .sort((a, b) => a.t - b.t);
        if (x[0].t != 0) {
            throw new Error(`No t=0 ${x[0]}`);
        }
        kf_map[name] = x;
    }
    return kf_map;
}

function* enum_props(vars: PropMap, name: string) {
    const x = vars[name];
    if (x) {
        if (Array.isArray(x)) {
            yield* x;
        } else {
            yield x;
        }
    }
}

function* separate_keyframes(vars: PropMap, kf_map: KFMap) {
    for (const [name, entries] of Object.entries(kf_map)) {
        for (const prop of enum_props(vars, name)) {
            for (const a of entries) {
                a.value = prop.parse_value(a.value);
            }
            // a._name = name;
            yield { prop, entries };
        }
    }
}

export function Step(
    steps: Array<UserEntry>,
    vars: PropMap,
    params: Params = {}
) {
    return new StepA(steps, vars, params);
}