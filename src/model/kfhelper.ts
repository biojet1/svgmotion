import { cubic_bezier_y_of_x } from "./bezier.js";

export interface KeyframeEntry<V> {
    time: number;
    value: V;
    easing?: Iterable<number> | boolean;
}

export class Keyframes<V> extends Array<KeyframeEntry<V>> {
    push_value(time: number, value: V): KeyframeEntry<V> {
        let last = this[this.length - 1];
        if (last) {
            if (last.time == time) {
                last.value = value;
                return last;
            } else if (time < last.time) {
                throw new Error(`keyframe is incremental`);
            }
        }
        const kf = { time, value };
        this.push({ time, value });
        return kf;
    }
}

export function ratio_at(a: Iterable<number>, t: number) {
    const [ox, oy, ix, iy] = a;
    return cubic_bezier_y_of_x([0, 0], [ox, oy], [ix, iy], [1, 1])(t);
}


export function _off_fun(repeat_count: number, S: number, E: number, bounce: boolean = false) {
    if (S < E) {
        if (repeat_count < 0) {
            repeat_count = Infinity;
        } else if (repeat_count == 0) {
            throw Error(`Unexpected`);
        }
        const d = (E - S); // duration
        if (bounce) {
            const i = (d + 1) * 2 - 1; // iter duration
            const p = (i - 1);
            const h = p / 2;
            const a = Math.floor(p * repeat_count) + 1; // active duration
            const Z = S + a; // past end frame
            return function fn(frame: number) {
                if (frame < S) {
                    return S;
                } else if (frame < Z) {
                    return S + (h - Math.abs(((frame - S) % p) - h));
                } else {
                    return Z - 1;
                }
            }
        } else {
            const i = d + 1; // iter duration
            const a = Math.floor(repeat_count * i); // active duration
            const Z = S + a; // pass end frame
            return function fn(frame: number) {
                if (frame < S) {
                    return S;
                } else if (frame < Z) {
                    return S + (frame - S) % i;
                } else {
                    return Z - 1;
                }
            }
        }
    } else if (S === E) {
        return function fn(frame: number) {
            return S;
        }
    } else {
        throw Error(`Unexpected`);
    }
}

export function offset_fun(repeat_count: number, S: number, E: number, bounce: boolean = false, that: any) {
    if (S < E) {
        if (repeat_count < 0) {
            repeat_count = Infinity;
        } else if (repeat_count == 0) {
            throw Error(`Unexpected`);
        }
        const d = (E - S); // duration
        if (bounce) {
            const i = (d + 1) * 2 - 1; // iter duration
            const p = (i - 1);
            const h = p / 2;
            const a = Math.floor(p * repeat_count) + 1; // active duration
            const Z = S + a; // past end frame
            that._iter_dur = i;
            that._active_dur = a;
            that._start = S;
            that._end = Z;
            return function fn(frame: number) {
                if (frame < S) {
                    return S;
                } else if (frame < Z) {
                    return S + (h - Math.abs(((frame - S) % p) - h));
                } else {
                    return Z - 1;
                }
            }
        } else {
            const i = d + 1; // iter duration
            const a = Math.floor(repeat_count * i); // active duration
            const Z = S + a; // pass end frame
            that._iter_dur = i;
            that._active_dur = a;
            that._start = S;
            that._end = Z;
            return function fn(frame: number) {
                if (frame < S) {
                    return S;
                } else if (frame < Z) {
                    return S + (frame - S) % i;
                } else {
                    return Z - 1;
                }
            }
        }
    } else if (S === E) {
        that._iter_dur = 0;
        that._active_dur = 0;
        that._start = S;
        that._end = S;
        return function fn(frame: number) {
            return S;
        }
    } else {
        throw Error(`Unexpected`);
    }
}