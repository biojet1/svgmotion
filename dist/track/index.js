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
        cur.ready(this);
        cur.resolve(this.frame, this.frame);
        const d = cur.get_active_dur();
        if (d >= 0) {
            cur.run();
            this.frame += d;
        }
        else {
            throw new Error(`Unexpected`);
        }
        return this;
    }
}
//# sourceMappingURL=index.js.map