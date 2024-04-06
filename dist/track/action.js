export class Action {
    _start = -Infinity;
    _end = -Infinity;
    _dur;
    ready(parent) {
        throw new Error("Not implemented");
    }
    run() {
        throw new Error("Not implemented");
    }
    resolve(frame, base_frame, hint_dur) {
        const dur = this._dur ?? hint_dur;
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
    frame_rate = -Infinity;
    _hint_dur;
    _easing;
    ready(parent) {
        this._easing = this._easing ?? parent._easing;
        this.frame_rate = parent.frame_rate;
        if (this._hint_dur != undefined) {
            this._hint_dur = this.to_frame(this._hint_dur);
        }
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
    to_frame(sec) {
        return Math.round(this.frame_rate * sec);
    }
}
export class SeqA extends Actions {
    _delay;
    _stagger;
    ready(parent) {
        super.ready(parent);
        const { _delay, _stagger } = this;
        _delay && (this._delay = parent.to_frame(_delay));
        _stagger && (this._stagger = parent.to_frame(_stagger));
        for (const act of this) {
            act.ready(this);
        }
    }
    resolve(frame, base_frame, hint_dur) {
        const { _delay, _stagger } = this;
        const _hint_dur = this._hint_dur ?? hint_dur;
        let e = frame;
        if (_stagger) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, _hint_dur);
                e = act._end;
                s = Math.max(s + _stagger, base_frame); // next start time
            }
        }
        else if (_delay) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, _hint_dur);
                e = act._end;
                s = Math.max(e + _delay, base_frame); // next start time
            }
        }
        else {
            for (const act of this) {
                act.resolve(e, base_frame, _hint_dur);
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
export class ParA extends Actions {
    _tail;
    ready(parent) {
        super.ready(parent);
        for (const act of this) {
            act.ready(this);
        }
    }
    resolve(frame, base_frame, hint_dur) {
        let end = frame;
        let _hint_dur = this._hint_dur ?? hint_dur;
        for (const act of this) {
            act.resolve(frame, base_frame, hint_dur);
            if (_hint_dur == undefined) {
                _hint_dur = act.get_active_dur();
            }
            else {
                _hint_dur = Math.max(_hint_dur, act.get_active_dur());
            }
            end = Math.max(end, act._end);
        }
        if (this._tail) {
            for (const act of this) {
                if (act._end != end) {
                    act.resolve(end - act.get_active_dur(), base_frame, _hint_dur);
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
export function Par(...items) {
    const x = new ParA(...items);
    return x;
}
export function ParE(...items) {
    const x = new ParA(...items);
    x._tail = true;
    return x;
}
export class ToA extends Action {
    _easing;
    constructor(props, value, dur) {
        super();
        this.ready = function (parent) {
            const { _easing } = this;
            this._dur = (dur == undefined) ? parent._hint_dur : parent.to_frame(dur);
            if (!_easing) {
                this._easing = parent._easing;
            }
        };
        this.run = function () {
            const { _start, _end } = this;
            for (const prop of props) {
                prop.set_value(_end, value, _start);
            }
        };
    }
}
export function To(props, value, dur = 1) {
    return new ToA(props, value, dur);
}
//# sourceMappingURL=action.js.map