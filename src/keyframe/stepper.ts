import { cubic_bezier_y_of_x } from './bezier.js';

type Easing = [number, number, number, number];

export function _repeat(S: number, E: number, count: number = 2): [((f: number) => number), number, number] {
    const d = E - S; // duration
    const i = d + 1; // iter duration
    const a = count * i; // active duration
    const Z = S + a - 1; // last frame
    const w = (f: number) => S + ((f - S) % i);
    return [w, S, Z];
}

export function _reverse(S: number, E: number): [((f: number) => number), number, number] {
    const d = E - S; // duration
    const i = d + 1; // iter duration
    const w = (frame: number) => E - ((frame - S) % i);
    return [w, S, E];
}

export function _bounce(S: number, E: number, repeatCount: number = 1.0): [((f: number) => number), number, number] {
    const d = E - S; // duration
    const i = (d + 1) * 2 - 1; // iter duration
    const p = i - 1;
    const h = p / 2;
    const a = p * repeatCount;
    const Z = S + a;
    const w = (frame: number) => S + (h - Math.abs(((((frame - S) % p) + p) % p) - h));
    return [w, S, Z];
}

export function _start_at(s: number, e: number, a: number): [((f: number) => number), number, number] {
    return [(t: number) => (s + (t - a)), a, a + (e - s)];
}

export function _clamp(s: number, e: number): [((f: number) => number), number, number] {
    return [(n: number) => (n >= e ? e : (n <= s ? s : n)), s, e];
}

export function _ease(s: number, e: number, easing: Easing): [((f: number) => number), number, number] {
    const [ox, oy, ix, iy] = easing;
    const d = e - s;
    return [(frame: number) => {
        const r = cubic_bezier_y_of_x([0, 0], [ox, oy], [ix, iy], [1, 1])((frame - s) / d);
        return s * (1 - r) + e * r;
    }, s, e];
}

export function _remap(s: number, e: number, a: number, b: number): [((f: number) => number), number, number] {
    return [(t: number) => s + (t - a) * (e - s) / (b - a), a, b];
}

function apply<T>(src: Array<{ $: string;[key: string]: any }>, U: (f: number) => T, S: number, E: number): [((f: number) => T), number, number] {
    const link = (x: ((f: number) => number) | null, v: ((f: number) => number)) => (f: number) => x ? x(v(f)) : v(f);
    let w: ((f: number) => number) | null = null;
    let v: ((f: number) => number) | null = null;
    for (const q of src) {
        switch (q.$) {
            case "bounce":
                [v, S, E] = _bounce(S, E, q.repeat_count ?? 1);
                break;
            case "repeat":
                [v, S, E] = _repeat(S, E, q.count ?? Infinity);
                break;
            case "reverse":
                [v, S, E] = _reverse(S, E);
                break;
            case "clamp":
                [v, S, E] = _clamp(S, E);
                break;
            case "start_at":
                [v, S, E] = _start_at(S, E, q.start);
                break;
            case "ease":
                [v, S, E] = _ease(S, E, q.points);
                break;
            case "remap":
                [v, S, E] = _remap(S, E, q.start, q.end);
                break;
            default:
                throw new Error(`${q["$"]} not implemented`);
        }

        w = link(w, v);
    }

    if (w === null) {
        return [U, S, E];
    }

    return [(f: number) => U(w(f)), S, E];
}


export class Steps {
    all: Array<{ $: string;[key: string]: any }> = [];

    repeat(count: number = 2): this {
        this.all.push({ $: "repeat", count });
        return this;
    }

    bounce(repeat_count: number = 1): this {
        this.all.push({ $: "bounce", repeat_count });
        return this;
    }

    reverse(): this {
        this.all.push({ $: "reverse" });
        return this;
    }

    clamp(): this {
        this.all.push({ $: "clamp" });
        return this;
    }

    start_at(start: number): this {
        this.all.push({ $: "start_at", start });
        return this;
    }

    ease(points: number[]): this {
        this.all.push({ $: "ease", points });
        return this;
    }

    remap(start: number, end: number): this {
        this.all.push({ $: "remap", start, end });
        return this;
    }

    apply<T>(U: ((f: number) => T), S: number, E: number): [((f: number) => T), number, number] {
        return apply<T>(this.all, U, S, E);
    }
}
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
        const [v, a, b] = _repeat(s, e, count);
        return new Stepper((f: number) => w(v(f)), a, b);
    }

    bounce(repeat_count: number = 1) {
        const { step: w, start: s, end: e } = this;
        const [v, a, b] = _bounce(s, e, repeat_count);
        return new Stepper((f: number) => w(v(f)), a, b);
    }

    clamp() {
        const { step: w, start: s, end: e } = this;
        const [v, a, b] = _clamp(s, e);
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
        const [v, a, b] = _start_at(s, e, start);
        return new Stepper((f: number) => w(v(f)), a, b);
    }

    remap_range(m?: number, n?: number) {
        const { step: w, start: s, end: e } = this;
        const [v, a, b] = _remap(s, e, m ?? s, n ?? e);
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
