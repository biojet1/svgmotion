import { cubic_bezier_y_of_x } from "./bezier.js";

export class Handle {
    x: number = 0;
    y: number = 0;
}

export class KeyframeEntry<V> {
    time: number = 0;
    in_value: Handle = new Handle();
    out_value: Handle = new Handle();
    hold: boolean = false;
    value!: V;
}

export class Keyframes<V> extends Array<KeyframeEntry<V>> {
    set_value(time: number, value: V) {
        let last = this[this.length - 1];
        if (last) {
            if (last.time == time) {
                last.value = value;
                return last;
            } else if (time < last.time) {
                throw new Error(`keyframe is incremental`);
            }
        }
        const kf = new KeyframeEntry<V>();
        kf.time = time;
        kf.value = value;
        this.push(kf);
        return kf;
    }
}


export abstract class Animatable<V> {
    value!: Keyframes<V> | V;
    abstract lerp_value(ratio: number, a: V, b: V): V;
    abstract add_value(a: V, b: V): V;
    get_value(time: number) {
        const { value } = this;
        if (value instanceof Array) {
            let p = undefined; // previous KeyframeEntry<V>
            for (const k of value) {
                if (time <= k.time) {
                    if (p) {
                        if (k.hold) {
                            return p.value;
                        }
                        const r = (time - p.time) / (k.time - p.time);
                        if (r == 0) {
                            return p.value;
                        } else if (r == 1) {
                            return k.value;
                        }
                        return this.lerp_value(
                            cubic_bezier_y_of_x(
                                [0, 0],
                                [p.out_value.x, p.out_value.y],
                                [p.in_value.x, p.in_value.y],
                                [1, 1]
                            )(r),
                            p.value,
                            k.value
                        );
                    } else {
                        return k.value;
                    }
                }
                p = k;
            }
            if (p) {
                return p.value;
            }
            throw new Error(`empty keyframe list`);
        } else {
            return value;
        }
    }

    set_value(
        time: number,
        value: V,
        start?: number,
        easing?: (a: KeyframeEntry<V>) => void,
        add?: boolean
    ) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                } else if (start > last.time) {
                    last.hold = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                } else {
                    if (start != last.time) {
                        throw new Error(`unexpected`);
                    }
                }
            }
        } else {
            const v = kfs;
            kfs = this.value = new Keyframes<V>();
            if (start != undefined) {
                last = kfs.set_value(start, v);
            }
        }
        if (last) {
            if (easing) {
                easing(last);
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        return kfs.set_value(time, value);
    }

}

export class NumberValue extends Animatable<number> {
    lerp_value(r: number, a: number, b: number): number {
        return a * (1 - r) + b * r;
    }
    add_value(a: number, b: number): number {
        return a + b;
    }
}