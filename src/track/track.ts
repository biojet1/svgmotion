import { IAction, Action } from "./action.js";
import { PropMap, Step, UserEntry } from "./steps.js";


export class Track {
    frame: number = 0;
    frame_rate: number = 60;
    _hint_dur: number = 60; // 1s * frame_rate
    _easing?: Iterable<number> | boolean;
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
    step(step: UserEntry[], vars: PropMap, params: any) {
        return this.feed(Step(step, vars, params));
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