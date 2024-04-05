import { Track } from "./track.js";

export interface IProperty<V> {
    get_value(time: number): V;
    set_value(
        time: number,
        value: V,
        start?: number,
        easing?: (a: any) => void,
        add?: boolean
    ): any;
    parse_value(x: any): V;
}

export interface IAction {
    _start?: number;
    _end?: number;
    ready(track: Track): void;
    resolve(frame: number, base_frame: number, hint_dur: number): void;
    get_active_dur(): number;
    run(): void;
}

export class Action implements IAction {
    _start: number = -Infinity;
    _end: number = -Infinity;
    _dur?: number;
    ready(track: Track): void {
        throw new Error("Not implemented");
    }
    run(): void {
        throw new Error("Not implemented");
    }
    resolve(frame: number, base_frame: number, hint_dur: number): void {
        const dur = this._dur ?? hint_dur;
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
    get_active_dur() {
        return this._end - this._start;
    }
    abstract resolve(frame: number, base_frame: number, hint_dur: number): void;
}

export class SeqA extends Actions {
    _delay?: number;
    _stagger?: number;
    _hint_dur?: number = -Infinity;
    _easing?: (a: any) => void;

    ready(track: Track): void {
        const { _delay, _stagger, _hint_dur } = this;
        _delay && (this._delay = track.to_frame(_delay));
        _stagger && (this._stagger = track.to_frame(_stagger));
        _hint_dur && (this._hint_dur = track.to_frame(_hint_dur));
        for (const act of this) {
            act.ready(track);
        }
    }

    resolve(frame: number, base_frame: number, hint_dur: number) {
        const { _delay, _stagger, _hint_dur } = this;
        if (_hint_dur != undefined) {
            hint_dur = _hint_dur;
        }
        let e = frame;
        if (_stagger) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, hint_dur);
                e = act._end;
                s = Math.max(s + _stagger, base_frame); // next start time
            }
        } else if (_delay) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, hint_dur);
                e = act._end;
                s = Math.max(e + _delay, base_frame); // next start time
            }
        } else {
            for (const act of this) {
                act.resolve(e, base_frame, hint_dur);
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
export class ParA extends Actions {
    _hint_dur?: number;
    _easing?: (a: any) => void;
    _tail?: boolean;

    ready(track: Track): void {
        const { _hint_dur } = this;
        _hint_dur && (this._hint_dur = track.to_frame(_hint_dur));
        for (const act of this) {
            act.ready(track);
        }
    }
    resolve(frame: number, base_frame: number, hint_dur: number): void {
        let end = frame;
        const { _hint_dur } = this;
        if (_hint_dur != undefined) {
            hint_dur = _hint_dur;
        }
        for (const act of this) {
            act.resolve(frame, base_frame, hint_dur);
            if (hint_dur == undefined) {
                hint_dur = act.get_active_dur();
            } else {
                hint_dur = Math.max(hint_dur, act.get_active_dur());
            }
            end = Math.max(end, act._end);
        }
        if (this._tail) {
            for (const act of this) {
                if (act._end != end) {
                    act.resolve(end - act.get_active_dur(), base_frame, hint_dur);
                }
                if (act._end != end) {
                    throw new Error(`Unexpected act._end=${act._end} end=${end}`);
                }
            }
        }
        this._start = frame;
        this._end = end;
    }
}
export function Par(...items: Array<Action | Actions>) {
    const x = new ParA(...items);
    return x;
}
export function ParE(...items: Array<Action | Actions>) {
    const x = new ParA(...items);
    x._tail = true;
    return x;
}
export class ToA extends Action {
    constructor(props: IProperty<any>[], value: any, dur?: number) {
        super();
        this.ready = function (track: Track): void {
            if (dur) {
                this._dur = track.to_frame(dur);
            }
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


