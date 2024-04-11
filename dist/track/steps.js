import { Action } from "./action.js";
export class StepA extends Action {
    _steps;
    _max_dur;
    _easing;
    _bounce;
    _repeat;
    _base_frame;
    _vars;
    _kf_map;
    constructor(steps, vars, { dur, easing, bounce, repeat, max_dur, }) {
        super();
        this._steps = steps;
        this._vars = vars;
        this._base_frame = Infinity;
        this.ready = function (parent) {
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
            const names = [];
            this._steps.map((e, i, a) => {
                for (const [k, v] of Object.entries(e)) {
                    switch (k) {
                        case "dur":
                        case "t":
                            e[k] = parent.to_frame(v);
                            continue;
                        case "ease":
                            v == undefined || (e[k] = easing);
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
    resolve(frame, base_frame, hint_dur) {
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
    run() {
        const { _start, _vars, _kf_map } = this;
        for (const [name, entries] of Object.entries(_kf_map)) {
            for (const prop of enum_props(_vars, name)) {
                let prev_t = 0;
                for (const { t, value, ease } of entries) {
                    const frame = _start + t;
                    let v;
                    if (value == null) {
                        v = prop.get_value(_start);
                    }
                    else {
                        v = prop.check_value(value);
                    }
                    prop.set_value(frame, v, prev_t, ease);
                    prev_t = t;
                }
            }
        }
    }
}
function resolve_t(steps, vars, hint_dur, max_dur) {
    const entries = new Array();
    steps.forEach((e, i, a) => {
        let t_max = undefined;
        if (e.t == undefined) {
            const { dur } = e;
            if (dur == undefined) {
                if (i == 0) {
                    e.t = 0;
                }
                else {
                    const prev = steps[i - 1];
                    if (!(i > 0 && prev.t != undefined)) {
                        throw new Error(`Unexpected`);
                    }
                    else if (hint_dur == undefined) {
                        throw new Error(`for no "t" and no "dur" provide hint duration'`);
                    }
                    e.t = prev.t + hint_dur;
                }
            }
            else if (i > 0) {
                if (!(dur >= 0)) {
                    throw new Error(`Unexpected`);
                }
                e.t = dur + steps[i - 1].t;
            }
            else {
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
        }
        else if (t > 0) {
            if (i == 0) {
                // first item is not t=0
                const first = { t: 0 };
                for (const [n, _] of Object.entries(vars)) {
                    first[n] = null;
                }
                entries.push(first);
            }
        }
        else {
            if (!(i === 0 && t == 0)) {
                throw new Error(`Unexpected`);
            }
            for (const [k, _] of Object.entries(vars)) {
                if (Object.hasOwn(e, k)) {
                    if (e[k] == null) {
                        throw new Error(`Unexpected`);
                    }
                }
                else {
                    e[k] = null;
                }
            }
        }
        entries.push(e);
    });
    return entries;
}
// def resolve_bounce(steps: list[Entry]):
//     t_max = 0
//     for e in steps:
//         t_max = max(t_max, e["t"])
//     extra = []
//     for e in steps:
//         if e["t"] < t_max:
//             t2 = t_max + (t_max - e["t"])
//             e2 = {**e, "t": t2}
//             if e.get("ease"):
//                 e2["ease"] = e["ease"].reverse()
//             extra.append(e2)
//         else:
//             assert e["t"] == t_max, f't:{e["t"]} t_max:{t_max}'
//     return steps + extra
function resolve_bounce(steps) {
    let t_max = 0;
    for (const e of steps) {
        t_max = Math.max(t_max, e.t);
    }
    let extra = [];
    for (const { t, ease, ...vars } of steps) {
        if (t < t_max) {
            const e = { ...vars, t: t_max + (t_max - t) };
            if (ease != undefined) {
                if (ease && ease !== true) {
                    e.ease = ease.reversed();
                }
                else {
                    e.ease = ease;
                }
            }
            extra.push(e);
        }
        else {
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
function resolve_repeat(steps, repeat) {
    let t_max = 0;
    for (const { t } of steps) {
        t_max = Math.max(t_max, t);
    }
    let extra = [];
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
function map_keyframes(steps) {
    const entry_map = {};
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
    const kf_map = {};
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
function* enum_props(vars, name) {
    const x = vars[name];
    if (x) {
        if (Array.isArray(x)) {
            yield* x;
        }
        else {
            yield x;
        }
    }
}
export function Step(steps, vars, params = {}) {
    return new StepA(steps, vars, params);
}
//# sourceMappingURL=steps.js.map