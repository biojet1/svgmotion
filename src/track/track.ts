import { Proxy, Resolver } from "./action.js";
import { Steppable, Stepper } from "../keyframe/stepper.js";

export class Track implements Steppable {
    end_frame: number = 0;
    start_frame: number = 0;
    frame_rate: number = 60;
    hint_dur: number = 60; // 1s * frame_rate
    easing?: Iterable<number> | true;
    steppers?: Set<Steppable>;

    supply(up: Steppable) {
        this.steppers?.add(up);
    }
    to_frame(sec: number) {
        return Math.round(this.frame_rate * sec);
    }
    set_frame_rate(n_per_sec: number) {
        const { hint_dur, frame_rate } = this;
        this.frame_rate = n_per_sec;
        this.hint_dur = this.to_frame(hint_dur / frame_rate);
        return this;
    }
    set_frame(sec: number) {
        this.end_frame = this.to_frame(sec);
        return this;
    }
    feed(cur: Resolver) {
        const d = feed(this, cur, this.end_frame, this.end_frame);
        this.end_frame += d;
        return this;
    }

    run(...args: Array<Proxy | Array<Proxy>>) {
        let I = this.end_frame;
        let B = this.end_frame;
        for (const act of args) {
            let D = 0;
            if (!Array.isArray(act)) {
                D = feed(this, act(this), I, B);
            } else {
                for (const a of act) {

                    let d = feed(this, a(this), I, B);
                    D = Math.max(d, D);
                }
            }
            I += D;
        }
        this.end_frame = I;
        return this;
    }

    clone(): this {
        const copy = new (this.constructor as typeof Track)();
        Object.assign(copy, this);
        return copy as this;
    }
    sub(offset: number = 0): this {
        const that = this.clone();
        that.end_frame = this.end_frame + this.to_frame(offset);
        return that;
    }
    pass(sec: number) {
        this.end_frame += this.to_frame(sec);
        return this;
    }
    stepper(): Stepper {
        const { steppers } = this;
        if (!steppers || steppers.size <= 0) {
            throw Error(`No steppers`);
        }
        let end = -1;
        let start = -1;
        let steps: Stepper[] = [];
        for (const cur of steppers) {
            const up = cur.stepper();
            const { start: S, end: E } = up;
            if (isFinite(E) && E > end) {
                end = E;
            }
            if (isFinite(S) && S < start) {
                start = S;
            }
            steps.push(up);
        }
        return Stepper.create((frame: number) => {
            for (const st of steps) {
                const { start: s, end: e } = st;
                if (frame >= s && frame <= e) {
                    st.step(frame);
                }
            }
        }, start, end);
    }

}

function feed(track: Track, cur: Resolver, frame: number, base_frame: number) {
    const x = cur(frame, base_frame, track.hint_dur);
    const d = x.end - x.start;
    /* c8 ignore start */
    if (d < 0) {
        throw new Error(`Unexpected`);
    }
    /* c8 ignore stop */
    x(track);
    return d;
}
