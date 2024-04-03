// import { Animatable } from "../model/index.js"
export class Action {
    _start = -Infinity;
    _end = -Infinity;
    _dur = -Infinity;
    ready(track) {
        throw new Error("Not implemented");
    }
    run() {
        throw new Error("Not implemented");
    }
    resolve(frame, base_frame) {
        const dur = this._dur;
        this._start = frame;
        this._end = frame + dur;
    }
    get_active_dur() {
        return this._end - this._start;
    }
}
export class Actions extends Array {
    _start = -Infinity;
    _end = -Infinity;
    ready(track) {
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
}
export class SeqA extends Actions {
    _delay;
    _stagger;
    _dur = -Infinity;
    _easing;
    ready(track) {
        const { _delay, _stagger, _dur } = this;
        _delay && (this._delay = track.to_frame(_delay));
        _stagger && (this._stagger = track.to_frame(_stagger));
        _dur && (this._dur = track.to_frame(_dur));
        for (const act of this) {
            act.ready(track);
        }
    }
    resolve(frame, base_frame) {
        const { _delay, _stagger } = this;
        let e = frame;
        if (_stagger) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame);
                e = act._end;
                s = Math.max(s + _stagger, base_frame); // next start time
            }
        }
        else if (_delay) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame);
                e = act._end;
                s = Math.max(e + _delay, base_frame); // next start time
            }
        }
        else {
            for (const act of this) {
                act.resolve(e, base_frame);
                e = act._end;
            }
        }
        this._start = frame;
        this._end = e;
    }
    delay(sec) {
        this._delay = sec;
        return this;
    }
    stagger(sec) {
        this._stagger = sec;
        return this;
    }
}
export function Seq(...items) {
    const x = new SeqA(...items);
    return x;
}
// self._dur = track.to_frame(dur)
// self._stagger = track.to_frame(stagger)
// self._delay = track.to_frame(delay)
// self._easing = parse_easing(easing)
export class ToA extends Action {
    constructor(props, value, dur = 1) {
        super();
        this.ready = function (track) {
            this._dur = track.to_frame(dur);
        };
        this.run = function () {
            const { _start, _end } = this;
            for (const prop of props) {
                // const
                prop.set_value(_end, value, _start);
            }
        };
    }
}
export function To(props, value, dur = 1) {
    return new ToA(props, value, dur);
}
export class Track {
    frame = 0;
    frame_rate = 60;
    sec(n) {
        return this.frame_rate * n;
    }
    to_frame(sec) {
        return Math.round(this.frame_rate * sec);
    }
    feed(cur) {
        const d = feed(this, cur, this.frame, this.frame);
        this.frame += d;
        return this;
    }
    play(...args) {
        let I = this.frame;
        let B = this.frame;
        for (const [i, act] of args.entries()) {
            let D = 0;
            if (Array.isArray(act)) {
                for (const a of act) {
                    let d = feed(this, a, I, B);
                    D = Math.max(d, D);
                }
            }
            else {
                D = feed(this, act, I, B);
            }
            I += D;
        }
        this.frame = I;
    }
}
function feed(track, cur, frame, base_frame) {
    cur.ready(track);
    cur.resolve(frame, base_frame);
    const d = cur.get_active_dur();
    if (d >= 0) {
        cur.run();
    }
    else {
        throw new Error(`Unexpected`);
    }
    return d;
}
//# sourceMappingURL=index.js.map