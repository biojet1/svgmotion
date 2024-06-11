import { Action, ExtraT, IParent, IProperty, ParamsT } from "./action.js";


type Entry = {
    time: number;
    frame: number;
    end: number;
    value: any;
    extra: ExtraT;
    _: string;
    _next?: Entry;
};

function list_props(x: IProperty<any>[] | IProperty<any>) {
    if (Array.isArray(x)) {
        return x;
    } else {
        return [x];
    }
}

// export function to(props: IProperty<any>[] | IProperty<any>, value: any) {
//     return { _: 'to', props: list_props(props) };

// }

class RelA extends Action {
    map: Map<IProperty<any>, Entry[]>;
    constructor(map: Map<IProperty<any>, Entry[]>) {
        super();
        this.map = map;
    }
    override ready(parent: IParent): void {
        for (const [k, v] of this.map.entries()) {
            for (const e of v) {
                e.frame = parent.to_frame(e.time);
                if (e.extra.start) {

                }
            }

        }
    }
    override resolve(frame: number, base_frame: number, hint_dur: number): void {
        for (const [k, v] of this.map.entries()) {
            let prev: Entry | undefined = undefined;
            for (const e of v) {
                e.end = frame + e.frame;
                if (!prev) {
                    if (e.frame > 0) {
                        // e.extra.easing = true;
                        e.extra.start = frame;
                    }
                }
                prev = e;
            }
        }
    }
    override run() {
        for (const [k, v] of this.map.entries()) {
            for (const e of v) {
                k.key_value(e.end, e.value, e.extra);
            }
        }
        // this.map.clear();
    }
}
export function Rel(x: {
    [key: string]: Array<{
        _: string;
        props: IProperty<any>[];
        value: any;
        extra: ExtraT;
    }>;
}, { dur = -Infinity }: { dur?: number }) {
    const map = new Map<IProperty<any>, Entry[]>();
    if (dur <= 0) {
        for (const [time, _entries] of Object.entries(x)) {
            if (!time.endsWith('%')) {
                const sec = parseFloat(time);
                if (!Number.isFinite(sec)) {
                    throw new Error(`Invalid time: ${time}`);
                } else if (sec < 0) {
                    continue;
                } else {
                    dur = Math.max(dur, sec);
                }
            }
        }
        if (dur <= 0) {
            throw new Error(`Invalid duration: ${dur}`);
        }
    }

    for (const [time, entries] of Object.entries(x)) {
        let sec;
        if (time.endsWith('%')) {
            const cen = parseFloat(time);
            if (!Number.isFinite(cen)) {
                throw new Error(`Invalid time %: '${time}'`);
            } else if (cen < 0 || cen > 100) {
                throw new Error(`Unexpected time % 0-100: '${time}'`);
            } else if (dur == undefined) {
                throw new Error(`time % needs duration: '${time}'`);
            }
            sec = dur * cen / 100;
        } else {
            sec = parseFloat(time);
        }
        if (sec < 0) {
            sec = dur + sec;
        }
        if (sec < 0 || sec > dur) {
            throw new Error(`time '${time}' out of range 0-${dur}`);
        }
        for (const e of entries) {
            if (e._) {
                for (const p of e.props) {
                    let a: Entry[] | undefined;
                    (a = map.get(p)) ?? map.set(p, a = []);

                    a.push({
                        time: sec, _: e._, frame: NaN, end: NaN, value:
                            p.check_value(e.value), extra: { ...e.extra }
                    })
                }
            }
        }
    }
    // return new RelA([...map.entries()].map(([k, v]) => {
    //     v.sort((a, b) => a.time - b.time)
    //     v.forEach((e, i, a) => {
    //         e._next = a.at(i + 1);
    //     });
    //     return [k, v.at(0)!];
    // }));


    for (const [k, v] of map.entries()) {
        v.sort((a, b) => a.time - b.time)
    }
    return new RelA(map);
}

Rel.to = function (props: IProperty<any>[] | IProperty<any>, value: any, extra: ExtraT = {}) {
    return { _: 'to', props: list_props(props), value, extra };
};

Rel.add = function (props: IProperty<any>[] | IProperty<any>, value: any, extra: ExtraT = {}) {
    return { _: 'add', props: list_props(props), value, extra: { ...extra, add: true } }
};

