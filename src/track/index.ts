// import { Animatable } from "../model/index.js"

export interface IProperty<V> {
    get_value(time: number): V;
    set_value(
        time: number,
        value: V,
        start?: number,
        easing?: (a: any) => void,
        add?: boolean
    ): any;
}
export interface IAction {
    _start?: number;
    _end?: number;
    ready(track: Track): void;
    resolve(frame: number, base_frame: number): void;
    get_active_dur(): number;
    run(): void;
}

export class Action implements IAction {
    _start: number = -Infinity;
    _end: number = -Infinity;
    _dur: number = -Infinity;
    ready(track: Track): void {
        throw new Error("Not implemented");
    }
    run(): void {
        throw new Error("Not implemented");
    }
    resolve(frame: number, base_frame: number): void {
        const dur = this._dur;
        this._start = frame;
        this._end = frame + dur;
    }
    get_active_dur() {
        return this._end - this._start;
    }
}
export abstract class Actions
    extends Array<Action | Actions>
    implements IAction {
    _start: number = -Infinity;
    _end: number = -Infinity;
    ready(track: Track): void {
        throw new Error("Not implemented");
    }
    run() {
        for (const act of this) {
            if (act._start < 0 || act._start > act._end) {
                throw new Error(`Unexpected _start=${act._start} _end=${act._end}`);
            }
            act.run();
        }
    }
    abstract resolve(frame: number, base_frame: number): void;
    get_active_dur() {
        return this._end - this._start;
    }
}

export class SeqA extends Actions {
    _delay?: number;
    _stagger?: number;
    _dur?: number = -Infinity;
    _easing?: (a: any) => void;
    ready(track: Track): void {
        const { _delay, _stagger, _dur } = this;
        _delay && (this._delay = track.to_frame(_delay));
        _stagger && (this._stagger = track.to_frame(_stagger));
        _dur && (this._dur = track.to_frame(_dur));
        for (const act of this) {
            act.ready(track);
        }
    }

    resolve(frame: number, base_frame: number) {
        const { _delay, _stagger } = this;
        let e = frame;
        if (_stagger) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame);
                e = act._end;
                s = Math.max(s + _stagger, base_frame); // next start time
            }
        } else if (_delay) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame);
                e = act._end;
                s = Math.max(e + _delay, base_frame); // next start time
            }
        } else {
            for (const act of this) {
                act.resolve(e, base_frame);
                e = act._end;
            }
        }
        this._start = frame;
        this._end = e;
    }
    delay(sec: number) {
        this._delay = sec;
        return this;
    }
    stagger(sec: number) {
        this._stagger = sec;
        return this;
    }
}
export function Seq(...items: Array<Action | Actions>) {
    const x = new SeqA(...items);
    return x;
}

// self._dur = track.to_frame(dur)
// self._stagger = track.to_frame(stagger)
// self._delay = track.to_frame(delay)
// self._easing = parse_easing(easing)

export class ToA extends Action {
    constructor(props: IProperty<any>[], value: any, dur: number = 1) {
        super();
        this.ready = function (track: Track): void {
            this._dur = track.to_frame(dur);
        };
        this.run = function (): void {
            const { _start, _end } = this;
            for (const prop of props) {
                // const
                prop.set_value(_end, value, _start);
            }
        };
    }
}
export function To(props: IProperty<any>[], value: any, dur: number = 1) {
    return new ToA(props, value, dur);
}
export class Track {
    frame: number = 0;
    frame_rate: number = 60;

    sec(n: number) {
        return this.frame_rate * n;
    }
    to_frame(sec: number) {
        return Math.round(this.frame_rate * sec);
    }
    feed(cur: IAction) {
        const d = feed(this, cur, this.frame, this.frame);
        this.frame += d;
        return this;
    }
    play(...args: Array<Action | Array<Action>>) {
        let I = this.frame;
        let B = this.frame;
        for (const [i, act] of args.entries()) {
            let D = 0;
            if (Array.isArray(act)) {
                for (const a of act) {
                    let d = feed(this, a, I, B);
                    D = Math.max(d, D);
                }
            } else {
                D = feed(this, act, I, B);
            }
            I += D;
        }
        this.frame = I;
    }
}
function feed(track: Track, cur: IAction, frame: number, base_frame: number) {
    cur.ready(track);
    cur.resolve(frame, base_frame);
    const d = cur.get_active_dur();
    if (d >= 0) {
        cur.run();
    } else {
        throw new Error(`Unexpected`);
    }
    return d;
}
