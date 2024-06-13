import { Action, Actions, ExtraT, IParent, IProperty, RunGiver, ToA } from "./action.js";


type Entry = {
    offset_sec: number;
    offset_frames: number;
    end: number;
    value: any;
    extra: ExtraT;
    _: string;
    _next?: Entry;
};
type Entry2 = {
    props: IProperty<any>[];
    value: any;
    extra: ExtraT;
    _: string;
}

function list_props(x: IProperty<any>[] | IProperty<any>) {
    if (Array.isArray(x)) {
        return x;
    } else {
        return [x];
    }
}

class RelA extends Action {
    map: Map<IProperty<any>, Entry[]>;
    constructor(parent: IParent, map: Map<IProperty<any>, Entry[]>) {
        super();
        this.map = map;
        for (const [k, v] of this.map.entries()) {
            for (const e of v) {
                e.offset_frames = parent.to_frame(e.offset_sec);
                if (e.extra.start) {

                }
            }
        }
    }

    override resolve(frame: number, base_frame: number, hint_dur: number): void {
        for (const [k, v] of this.map.entries()) {
            let prev: Entry | undefined = undefined;
            for (const e of v) {
                e.end = frame + e.offset_frames;
                if (!prev) {
                    if (e.offset_frames > 0) {
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
export function Rel_(x: {
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
                        offset_sec: sec, _: e._, offset_frames: NaN, end: NaN, value:
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
        v.sort((a, b) => a.offset_sec - b.offset_sec)
    }
    return (track: IParent) => new RelA(track, map);

}

Rel.to = function (props: IProperty<any>[] | IProperty<any>, value: any, extra: ExtraT = {}) {
    return { _: 'to', props: list_props(props), value, extra };
};

Rel.add = function (props: IProperty<any>[] | IProperty<any>, value: any, extra: ExtraT = {}) {
    return { _: 'add', props: list_props(props), value, extra: { ...extra, add: true } }
};

export function Rel(x: {
    [key: string]: Array<RunGiver>;
}, { dur = -Infinity }: { dur?: number }) {
    return (track: IParent) => {
        const map = new Map<IProperty<any>, Entry[]>();
        if (dur <= 0) {
            for (const [time, _] of Object.entries(x)) {
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
                const r = e(track);
                if (r instanceof ToA) {
                    for (let cur: typeof r._first | undefined = r._first; cur; cur = cur._next) {
                        const { property, extra, value } = cur;
                        let a: Entry[] | undefined;
                        (a = map.get(property)) ?? map.set(property, a = []);
                        a.push({
                            offset_sec: sec, _: r.constructor.name, offset_frames: NaN, end: NaN, value:
                                property.check_value(value), extra
                        })
                    }
                }
            }
        }
        for (const [k, v] of map.entries()) {
            v.sort((a, b) => a.offset_sec - b.offset_sec)
        }
        return new RelA(track, map);
    }
}

Rel.at = function (t: string | number) {
    const map2 = new Map<string | number, Entry2[]>();
    let cur: Entry2[];
    map2.set(t, cur = []);
    function fn(track: IParent) {
        let dur = -Infinity;
        const map = new Map<IProperty<any>, Entry[]>();
        if (dur <= 0) {
            for (const [time, _entries] of map2.entries()) {
                // console.log('time', time, time.endsWith('%'));
                if (typeof time == 'number') {
                    const sec = time;
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
                console.log(map2);
                throw new Error(`Invalid duration: ${dur}`);
            }
        }

        for (const [time, entries] of map2.entries()) {
            let sec;
            if (typeof time == 'string') {
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
                sec = (time);
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
                            offset_sec: sec, _: e._, offset_frames: NaN, end: NaN, value:
                                p.check_value(e.value), extra: { ...e.extra }
                        })
                    }
                }
            }
        }


        for (const [k, v] of map.entries()) {
            v.sort((a, b) => a.offset_sec - b.offset_sec)
        }

        return new RelA(track, map);
    }
    fn.at = function (t: string | number) {
        const x = map2.get(t);
        x ? (cur = x) : map2.set(t, (cur = []));
        return this;
    };
    fn.to = function (props: IProperty<any>[] | IProperty<any>, value: any, extra: ExtraT = {}) {
        cur.push({ _: 'to', props: list_props(props), value, extra });
        return this;
    };
    fn.add = function (props: IProperty<any>[] | IProperty<any>, value: any, extra: ExtraT = {}) {
        cur.push({ _: 'add', props: list_props(props), value, extra: { ...extra, add: true } });
        return this;
    };
    return fn;
}
