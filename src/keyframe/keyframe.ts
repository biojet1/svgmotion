import { Keyframes, offset_fun, ratio_at } from "./kfhelper.js";

export class Animated<V> {
    kfs: Keyframes<V> = new Keyframes<V>();
    _repeat_count?: number;
    _bounce?: boolean;
    _end?: number;
    _start?: number;
    // static
    /* c8 ignore start */
    // should be static
    lerp_value(ratio: number, a: V, b: V): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // should be static
    add_value(a: V, b: V): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // should be static
    value_to_json(_a: V | null): any {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // should be static
    value_from_json(_a: any): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    initial_value(): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    /* c8 ignore stop */
    check_value(x: any): V {
        return x as V;
    }
    // get_frame_value
    get_value(frame: number): V {
        const { kfs } = this;
        if (kfs instanceof Keyframes) {
            let p = undefined; // previous KeyframeEntry<V>
            for (const k of kfs) {
                if (frame <= k.time) {
                    if (p) {
                        if (p.easing === true) {
                            return k.value;
                        }
                        let r = (frame - p.time) / (k.time - p.time);
                        if (r == 0) {
                            return p.value;
                        } else if (r == 1) {
                            return k.value;
                        } else if (p.easing) {
                            r = ratio_at(p.easing, r);
                        }
                        return this.lerp_value(r, p.value, k.value);
                    } else if (frame < k.time) {
                        return this.get_value_off!(frame);
                        // return k.value;
                    } else {
                        return k.value;
                    }
                }
                p = k;
            }
            if (p) {
                return this.get_value_off!(frame);
                // return p.value;
            }
            const last = kfs.push_value(frame, this.initial_value());
            return last.value;
            // throw new Error(`empty keyframe list`);
        }
        /* c8 ignore start */
        throw new Error(`unexpected`);
        /* c8 ignore stop */
    }
    // static
    get_value_off?(frame: number): V {
        const { kfs } = this;
        const first = kfs.at(0);
        if (first) {
            const last = kfs.at(-1);
            if (last) {
                let { _repeat_count, _bounce } = this;
                const fo = offset_fun(first.time, last.time, _repeat_count, _bounce, this);
                const fg = (this.get_value_off = function (frame: number) {
                    return this.get_value(fo(frame));
                })
                if (Number.isNaN(frame)) {
                    throw new TypeError();
                } else {
                    return fg.call(this, frame);
                }
            }
        }
        /* c8 ignore start */
        throw Error(`Unexpected by '${this.constructor.name}'`);
        /* c8 ignore stop */
    }
    key_value(
        frame: number,
        value: V,
        start?: number,
        easing?: Iterable<number> | boolean,
        add?: boolean
    ) {
        const { kfs } = this;
        /* c8 ignore start */
        if (!(kfs instanceof Keyframes)) {
            throw new Error(`unexpected`);
        }
        /* c8 ignore stop */
        let last = kfs.at(-1);
        if (last) {
            if (start == undefined) {
                // pass
            } else if (start > last.time) {
                last.easing = true;
                last = kfs.push_value(start, last.value);
            } else {
                if (start != last.time) {
                    throw new Error(
                        `unexpected start=${start} last.time=${last.time} time=${frame} value=${value} by '${this.constructor.name}'`
                    );
                }
            }
        } else {
            if (start == undefined) {
                // pass
            } else {
                last = kfs.push_value(start, this.initial_value());
            }
        }

        value = this.check_value(value);
        if (last) {
            if (easing != undefined) {
                last.easing = easing;
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        delete this['get_value_off'];
        delete this['_end'];
        return kfs.push_value(frame, value);
    }

    hold_last_value(frame: number) {
        const { kfs } = this;
        let last = kfs.at(-1);
        if (last) {
            if (frame > last.time) {
                last.easing = true;
                last = kfs.push_value(frame, last.value);
            } else {
                if (frame != last.time) {
                    throw new Error(
                        `unexpected frame=${frame} last.time=${last.time} time=${frame} by '${this.constructor.name}'`
                    );
                }
            }
        } else {
            last = kfs.push_value(frame, this.initial_value());
        }
        return last;
    }

    frame_range(): [number, number] {

        if (this._end == undefined) {
            try {
                this.get_value_off?.(NaN);
            } catch (e) {
                if (!(e instanceof TypeError)) {
                    throw Error(`Unexpected`);
                }
            }
        }

        const { _start, _end } = this;
        /* c8 ignore start */
        if (_end == undefined || _start == undefined) {
            throw Error(`Unexpected by '${this.constructor.name}'`);
        }
        /* c8 ignore stop */
        return [_start, _end];
    }
    repeat(count: number = 2, bounce: boolean = false) {
        this._repeat_count = count;
        this._bounce = bounce;
        delete this['get_value_off'];
        delete this['_end'];
        return this;
    }
}
