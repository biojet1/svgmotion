import { Action, ExtraT, IParent, IProperty } from "../track/action.js";


type Entry = {
    time: number;
    frame: number;
    end: number;
    value: any;
    extra: ExtraT;
    _: string;
};

function list_props(x: IProperty<any>[] | IProperty<any>) {
    if (Array.isArray(x)) {
        return x;
    } else {
        return [x];
    }
}

export function to(props: IProperty<any>[] | IProperty<any>, value: any) {
    return { _: 'to', props: list_props(props) };

}

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
                // e.end = frame + e.frame;
                k.key_value(e.end, e.value, e.extra);
            }
        }
    }
}
export function Rel(x: {
    [key: string]: Array<{
        _: string;
        props: IProperty<any>[];
        value: any
    }>;
}, { dur }: { dur?: number }) {

    let total_dur: number | undefined = dur;
    let dur_max = -Infinity;
    const map = new Map<IProperty<any>, Entry[]>();
    for (const [time, entries] of Object.entries(x)) {
        let sec;
        if (time.endsWith('%')) {
            const cen = parseFloat(time);
            if (!Number.isFinite(cen)) {
                throw new Error(`Invalid time %: '${time}'`);
            } else if (cen < 0 || cen > 100) {
                throw new Error(`Unexpected time % 0-100: '${time}'`);
            }
            if (total_dur == undefined) {
                if (Number.isFinite(dur)) {
                    total_dur = dur;
                } else if (Number.isFinite(dur_max)) {
                    total_dur = dur_max;
                }
            }
            if (total_dur == undefined) {
                throw new Error(`time % needs duration: '${time}'`);
            }
            sec = total_dur * cen / 100;
        } else {
            sec = parseFloat(time);
            if (!Number.isFinite(sec)) {
                throw new Error(`Invalid time: ${time}`);
            } else if (sec < 0) {
                if (total_dur != undefined) {
                    sec = total_dur + sec
                } else {
                    throw new Error(`Unexpected time < 0: '${time}'`);
                }
            } else {
                dur_max = Math.max(dur_max, sec);
            }
        }
        if (total_dur != undefined) {
            if (sec > total_dur) {
                throw new Error(`Unexpected`);
            }
        }
        for (const e of entries) {
            if (e._) {
                for (const p of e.props) {
                    let a: Entry[] | undefined;
                    (a = map.get(p)) ?? map.set(p, a = []);

                    a.push({
                        time: sec, _: e._, frame: NaN, end: NaN, value:
                            p.check_value(e.value), extra: {}
                    })
                }
            }
        }
    }
    for (const [k, v] of map.entries()) {
        v.sort((a, b) => a.time - b.time)

    }


    return new RelA(map);
}

Rel.to = function (props: IProperty<any>[] | IProperty<any>, value: any) {
    return { _: 'to', props: list_props(props), value };
}