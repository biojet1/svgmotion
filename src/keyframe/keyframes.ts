import { KeyframeEntry, Keyframes, offset_fun, ratio_at } from "./kfhelper.js";

///////////
export interface KFBase {
    t: number;
    h?: boolean;
    o?: Iterable<number>;
    i?: Iterable<number>;
}

export interface KFEntry<V> extends KFBase {
    v: V;
    r?: number; // repeat_count
    b?: boolean; // bounce   
}

export type ValueT<V> = { v: V; k?: KFEntry<V>[]; r?: number; b?: boolean; _?: string };
export type ValueF<V> = { v: V; k?: KFEntry<V>[]; r?: number; b?: boolean };



export function kfe_from_json<V>(x: KFBase, value: V): KeyframeEntry<V> {
    const { t: time, h, o, i } = x;
    if (h) {
        return { time, easing: true, value };
    } else if (o && i) {
        const [ox, oy] = o;
        const [ix, iy] = o;
        return { time, easing: [ox, oy, ix, iy], value };
    }
    return { time, value };
}

function kfe_to_json<V>(kfe: KeyframeEntry<V>, value: any): KFEntry<V> {
    const { time: t, easing } = kfe;
    if (!easing) {
        return { t, v: value };
    } else if (easing === true) {
        return { t, h: true, v: value };
    } else {
        const [ox, oy, ix, iy] = easing;
        return { t, o: [ox, oy], i: [ix, iy], v: value };
    }
}

export class Animatable<V> {
    value: V | null;
    kfs: Keyframes<V> = new Keyframes<V>();
    repeat_count?: number;
    bounce?: boolean;
    _end?: number;
    _start?: number;
    // static
    lerp_value(_ratio: number, _a: V, _b: V): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // static
    add_value(_a: V, _b: V): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // static
    value_to_json(_a: V | null): any {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // static
    value_from_json(_a: any): V {
        throw Error(`Not implemented by '${this.constructor.name}'`);
    }
    // get_frame_value
    get_value(frame: number | undefined = undefined): V {
        const { kfs } = this;
        if (frame !== undefined) {
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
                    } else {
                        return k.value;
                    }
                }
                p = k;
            }
            if (p) {
                return this.get_value_off!(frame);
            }
            // throw new Error(`empty keyframe list`);
        }
        const { value } = this;
        if (value == null) {
            throw new Error(`value cant be null`);
        }
        return value;

    }
    // static
    get_value_off?(frame: number): V {
        const { kfs } = this;
        const first = kfs.at(0);
        if (first) {
            const last = kfs.at(-1);
            if (last) {
                let { repeat_count = 1, bounce } = this;
                const fo = offset_fun(first.time, last.time, repeat_count, bounce, this);
                const fg = (this.get_value_off = function (frame: number) {
                    return this.get_value(fo(frame));
                });
                if (Number.isNaN(frame)) {
                    throw new TypeError();
                } else {
                    return fg.call(this, frame);
                }
            }
        }
        throw Error(`Unexpected by '${this.constructor.name}'`);
    }

    check_value(x: any): V {
        return x as V;
    }


    key_value(
        frame: number,
        value: V,
        start?: number,
        easing?: Iterable<number> | boolean,
        add?: boolean
    ) {
        let { kfs } = this;
        let last = kfs[kfs.length - 1];
        if (last) {
            if (start == undefined) {
                // pass
            } else if (start > last.time) {
                last.easing = true;
                last = kfs.push_value(start, last.value);
            } else {
                if (start != last.time) {
                    throw new Error(
                        `unexpected start=${start} last.time=${last.time} time=${frame} value=${value}`
                    );
                }
            }
        } else {
            if (start != undefined) {
                if (this.value != null) {
                    last = kfs.push_value(start, this.value);
                }
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

    constructor(v: V) {
        if (v == null) {
            throw new Error(`unexpected value=${v}`);
        } else {
            this.value = v;
        }
    }
    set_value(value: V | any) {
        this.value = this.check_value(value);
    }

    to_json(): ValueT<V> {
        const { value, kfs } = this;
        const o: ValueT<V> = { v: this.value_to_json(value) };
        if (kfs && kfs.length > 0) {
            o.k = [...kfs.map((v) =>
                kfe_to_json(v, this.value_to_json(v.value))
            )];
        }
        if (this.repeat_count) {
            o.r = this.repeat_count;
        }
        if (this.bounce) {
            o.b = this.bounce;
        }
        return o;
    }

    from_json(x: ValueF<any>) {
        const { k, v } = x;
        if (k != undefined) {
            const { r, b } = x;
            this.kfs = new Keyframes<V>(...k.map((x) => kfe_from_json(x, this.value_from_json(x.v))));
            if (r != null) {
                this.repeat_count = r;
            }
            if (b != null) {
                this.bounce = b;
            }
        }
        if (v != undefined) {
            this.value = this.value_from_json(x.v);
        }

        if (v === null) {
            this.value = null;
        }
    }
}

export class AnimatableD<V> extends Animatable<V> {
    override get_value(frame: number) {
        const { kfs } = this;
        let p = undefined; // previous KeyframeEntry<V>
        for (const k of kfs) {
            if (k.time >= frame) {
                return k.value;
            }
            p = k;
        }
        if (p) {
            return p.value;
        }
        // throw new Error(`empty keyframe list`);
        const { value } = this;
        if (value == null) {
            throw new Error(`value cant be null`);
        }
        return value;

    }
    override key_value(
        frame: number,
        value: V,
        start?: number,
        easing?: Iterable<number> | boolean,
        add?: boolean
    ) {
        let { kfs } = this;
        let last;

        last = kfs.at(-1);
        if (last) {
            if (start == undefined) {
                // pass
            } else if (start > last.time) {
                last.easing = true;
                last = kfs.push_value(start, last.value);
            } else {
                if (start != last.time) {
                    throw new Error(
                        `unexpected start=${start} last.time=${last.time} time=${frame}`
                    );
                }
            }
        } else {
            if (start != undefined) {
                if (this.value != null) {
                    last = kfs.push_value(start, this.value);
                }
            }
        }
        if (last) {
            if (easing != undefined) {
                throw new Error(`easing not suppported`);
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        return kfs.push_value(frame, value);
    }
}
// declare module "." {
//     interface AnimBase {
//         from_json(x: any): void;
//         to_json(): any;
//     }
// }

// AnimBase.prototype.from_json = function (_x: any) {
//     throw Error(`Not implemented by '${this.constructor.name}'`);
// }

// AnimBase.prototype.to_json = function () {
//     throw Error(`Not implemented by '${this.constructor.name}'`);
// }
