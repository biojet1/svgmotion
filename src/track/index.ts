import { Animatable } from "../model/index.js"
export interface IAction {
    _start?: number;
    _end?: number;
    ready(track: Track): void;
    resolve(frame: number, base_frame: number): void;
    get_active_dur(): number;
    run(): void;
}

export class Action implements IAction {
    _start: number = -Infinity;
    _end: number = -Infinity;
    _dur: number = -Infinity;
    ready(track: Track): void {
        throw new Error("Not implemented");
    }
    run(): void {
        throw new Error("Not implemented");
    }
    resolve(frame: number, base_frame: number): void {
        const dur = this._dur;
        this._start = frame;
        this._end = frame + dur;
    }
    get_active_dur() {
        return this._end - this._start
    }

}

export class ToA extends Action {
    constructor(props: Animatable<any>[], value: any, dur: number = 1) {
        super();
        this.ready = function (track: Track): void {
            this._dur = track.to_frame(dur);
        }
        this.run = function (): void {
            const { _start, _end } = this;
            for (const prop of props) {
                // const 
                prop.set_value(_end, value, _start)
            }
        }
    }

}
export function To(props: Animatable<any>[], value: any, dur: number = 1) {
    return new ToA(props, value, dur);
}
export class Track {
    frame: number = 0;
    frame_rate: number = 60;

    sec(n: number) {
        return this.frame_rate * n;
    }
    to_frame(sec: number) {
        return Math.round(this.frame_rate * sec);
    }
    feed(cur: IAction) {
        cur.ready(this);
        cur.resolve(this.frame, this.frame)
        const d = cur.get_active_dur();
        if (d >= 0) {
            cur.run()
            this.frame += d;
        } else {
            throw new Error(`Unexpected`)
        }
        return this;
    }


}