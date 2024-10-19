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
    return [
        (n: number) => (n >= e ? e : (n <= s ? s : n)),
        s,
        e
    ];
}

export function _ease(s: number, e: number, easing: Easing): [((f: number) => number), number, number] {
    const [ox, oy, ix, iy] = easing;
    const d = e - s;

    const w = (frame: number) => {
        const r = cubic_bezier_y_of_x([0, 0], [ox, oy], [ix, iy], [1, 1])((frame - s) / d);
        return s * (1 - r) + e * r;
    };

    return [w, s, e];
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
                [v, S, E] = _repeat(S, E, q.count ?? 2);
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
