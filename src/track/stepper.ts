import { _bounce, _clamp, _remap, _repeat, _start_at } from "../keyframe/steps.js";

export class Stepper<V = void> {
    start: number;
    end: number;
    step: ((frame: number) => V);

    constructor(step: (frame: number) => V, start: number, end: number) {
        this.step = step;
        this.start = start;
        this.end = end;
    }

    repeat(count: number) {
        const { step: w, start: s, end: e } = this;
        const [v, a, b] = _repeat(s, e, count)
        return new Stepper((f: number) => w(v(f)), a, b);
    }

    bounce(repeat_count: number = 1) {
        const { step: w, start: s, end: e } = this;
        const [v, a, b] = _bounce(s, e, repeat_count)
        return new Stepper((f: number) => w(v(f)), a, b);
    }

    clamp() {
        const { step: w, start: s, end: e } = this;
        const [v, a, b] = _clamp(s, e)
        return new Stepper((f: number) => w(v(f)), a, b);
    }

    // slice2(start: number, end: number) {
    //     const { step: w, start: s, end: e } = this;
    //     const [v, a, b] = _clamp(s, e)
    //     return new Stepper((f: number) => w(v(f)), a, b);
    // }

    slice(start: number, end: number) {
        const { start: S, end: E } = this;
        let e = end ?? E;
        let s = start ?? S;
        if (e < 0) e += E;
        if (s < 0) s += E;
        return new Stepper(this.step, s, e);
    }

    start_at(start: number) {
        const { step: w, start: s, end: e } = this;
        const [v, a, b] = _start_at(s, e, start)
        return new Stepper((f: number) => w(v(f)), a, b);
    }

    remap_range(m?: number, n?: number) {
        const { step: w, start: s, end: e } = this;
        const [v, a, b] = _remap(s, e, m ?? s, n ?? e)
        return new Stepper((f: number) => w(v(f)), a, b);
    }

    stepper() {
        return this;
    }

    *iter(start?: number, end?: number, inc: number = 1) {
        const e = end ?? this.end;
        for (let i = start ?? this.start; i <= e; i += inc) {
            yield this.step(i);
        }
    }

    static create<U>(step: (frame: number) => U, start: number, end: number) {
        return new Stepper<U>(step, start, end);
    }
    static echo(start: number, end: number) {
        return new Stepper((x) => x, start, end);
    }
}

export interface Steppable {
    stepper(): Stepper;
}
