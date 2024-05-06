import { Action, IProperty, IParent } from "./action.js";

export interface Entry {
    t: number; // offset in seconds
    ease?: Iterable<number> | boolean;
    [key: string]: any;
}

export interface UserEntry {
    dur?: number;
    t?: number; // offset in seconds
    ease?: Iterable<number> | boolean;
    [key: string]: any;
}

export interface PropMap {
    [key: string]: IProperty<any> | Array<IProperty<any>>;
}

interface KF {
    t: number;
    value: any;
    ease?: Iterable<number> | boolean;
}

interface KFMap {
    [key: string]: KF[];
}

interface Params {
    dur?: number;
    easing?: Iterable<number> | boolean;
    bounce?: boolean;
    repeat?: number;
    max_dur?: number;
}

export class StepA extends Action {
    _steps: Array<UserEntry>;
    _max_dur?: number;
    _easing?: Iterable<number> | boolean;
    _bounce?: boolean;
    _repeat?: number;
    _base_frame: number;
    _vars: PropMap;
    _kf_map?: KFMap;
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
            this._dur = (dur == undefined) ? undefined : parent.to_frame(dur);
            this._max_dur = (max_dur == undefined) ? undefined : parent.to_frame(max_dur);
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
                if (easing != undefined) {
                    if (e.ease == undefined) {
                        e.ease = easing;
                    }
                }
                for (const [k, v] of Object.entries(e)) {
                    switch (k) {
                        case "dur":
                        case "t":
                            e[k] = parent.to_frame(v);
                            continue;
                        case "ease":
                            // v == undefined || (e[k] = easing);
                            continue;

                    }
                    if (vars[k]) {
                        names.push(k);
                    } else {
                        delete e[k];
                    }

                }
            });
            // drop property not present
            for (const [k, _] of Object.entries(this._vars)) {
                if (names.indexOf(k) < 0) {
                    delete vars[k];
                }
            }
            // console.log("vars", vars, this._vars);
        };
    }
    resolve(frame: number, base_frame: number, hint_dur: number): void {
        const { _steps: steps, _kf_map, _dur = hint_dur, _max_dur = hint_dur, _vars } = this;
        if (_kf_map != undefined) {
            if (this._start != frame) {
                const d = this._end - this._start;
                this._start = frame;
                this._end = frame + d;
            }
            return;
        }
        let entries = resolve_t(steps, _vars, _dur, _max_dur);
        if (this._bounce) {
            entries = resolve_bounce(entries);
        }
        if (this._repeat) {
            entries = resolve_repeat(entries, this._repeat);
        }

        let t_max = 0;
        for (const e of entries) {
            t_max = Math.max(t_max, e.t);
        }
        // (this as any)._entries = Array.from(entries);
        this._kf_map = map_keyframes(entries);
        this._start = frame;
        this._end = frame + t_max;
        this._base_frame = base_frame;
    }

    run(): void {
        const { _start, _vars, _kf_map, _base_frame } = this;
        for (const [name, entries] of Object.entries(_kf_map!)) {
            for (const prop of enum_props(_vars, name)) {
                let prev_t = _base_frame;
                for (const { t, value, ease } of entries) {
                    const frame = _start + t;
                    let v;
                    if (value == null) {
                        v = prop.get_value(_start);
                    } else {
                        v = prop.check_value(value);
                    }
                    prop.set_value(frame, v, prev_t, ease);
                    prev_t = frame;
                }
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
    const names = Object.keys(vars);
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

function resolve_bounce(steps: Array<Entry>): Array<Entry> {
    let t_max = 0;
    for (const e of steps) {
        t_max = Math.max(t_max, e.t);
    }
    let extra: Array<Entry> = [];
    for (const { t, ease, ...vars } of steps) {
        if (t < t_max) {
            const e: Entry = { ...vars, t: t_max + (t_max - t) };
            if (ease != undefined) {
                if (ease && ease !== true) {
                    const [ox, oy, ix, iy] = ease;
                    e.ease = [1 - ix, 1 - iy, 1 - ox, 1 - oy];
                } else {
                    e.ease = ease;
                }
            }
            extra.push(e);
        } else {
            if (t != t_max) {
                throw new Error(`e.t=${t}, t_max=${t_max}`);
            }
        }
    }
    return steps.concat(extra);
}

// def resolve_repeat(steps, repeat: int):
//     t_max = 0
//     for e in steps:
//         t_max = max(t_max, e["t"])
//     n = repeat
//     t_dur = t_max + 1
//     t = t_dur
//     extra = []
//     while n > 0:
//         n -= 1
//         for i, e in enumerate(steps):
//             e2 = {**e, "t": e["t"] + t}
//             if i == 0:
//                 e2["ease"] = True
//                 pass
//             # else:
//             #     e2["t"] = e["t"] - steps[i - 1]["t"]
//             extra.append(e2)
//         t += t_dur
//     return steps + extra

function resolve_repeat(steps: Array<Entry>, repeat: number): Array<Entry> {
    let t_max = 0;
    for (const { t } of steps) {
        t_max = Math.max(t_max, t);
    }
    let extra: Array<Entry> = [];
    let n = repeat;
    const t_dur = t_max + 1;
    let u = t_dur;
    while (n-- > 0) {
        steps.forEach(({ t, ...etc }, i, a) => {
            const e = { ...etc, t: t + u };
            if (i == 0) {
                e.ease = true;
            }
            extra.push(e);
        });
        u += t_dur;
    }
    return steps.concat(extra);
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
            console.log(name, entries);
            throw new Error(`No t=0 t:${x[0].t} t:${x[0].value}`);
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

export function Step(
    steps: Array<UserEntry>,
    vars: PropMap,
    params: Params = {}
) {
    return new StepA(steps, vars, params);
}