export class Track {
    frame = 0;
    frame_rate = 60;
    #easing;
    hint_dur = 60; // 1s * frame_rate
    sec(n) {
        return this.frame_rate * n;
    }
    to_frame(sec) {
        return Math.round(this.frame_rate * sec);
    }
    to_easing(x) {
        // if (typeof x === 'string' || x instanceof String) {
        // } else {
        //     return x;
        // }
        return x ?? this.#easing;
    }
    feed(cur) {
        const d = feed(this, cur, this.frame, this.frame);
        this.frame += d;
        return this;
    }
    play(...args) {
        let I = this.frame;
        let B = this.frame;
        for (const [i, act] of args.entries()) {
            let D = 0;
            if (Array.isArray(act)) {
                for (const a of act) {
                    let d = feed(this, a, I, B);
                    D = Math.max(d, D);
                }
            }
            else {
                D = feed(this, act, I, B);
            }
            I += D;
        }
        this.frame = I;
    }
}
function feed(track, cur, frame, base_frame) {
    cur.ready(track);
    cur.resolve(frame, base_frame, track.hint_dur);
    const d = cur.get_active_dur();
    if (d >= 0) {
        cur.run();
    }
    else {
        throw new Error(`Unexpected`);
    }
    return d;
}
//# sourceMappingURL=track.js.map