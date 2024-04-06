import { IAction, Action } from "./action.js";


export class Track {
    frame: number = 0;
    frame_rate: number = 60;
    _hint_dur: number = 60; // 1s * frame_rate
    _easing?: ((a: any) => void) | true;
    sec(n: number) {
        return this.frame_rate * n;
    }
    to_frame(sec: number) {
        return Math.round(this.frame_rate * sec);
    }
    to_easing(x?: (a: any) => void) {
        // if (typeof x === 'string' || x instanceof String) {
        // } else {
        //     return x;
        // }
        return x ?? this._easing;
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
    cur.resolve(frame, base_frame, track._hint_dur);
    const d = cur.get_active_dur();
    if (d >= 0) {
        cur.run();
    } else {
        throw new Error(`Unexpected`);
    }
    return d;
}