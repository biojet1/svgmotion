import { IAction, Action } from "./action.js";
export declare class Track {
    frame: number;
    frame_rate: number;
    _hint_dur: number;
    _easing?: Iterable<number> | boolean;
    sec(n: number): number;
    to_frame(sec: number): number;
    feed(cur: IAction): this;
    play(...args: Array<Action | Array<Action>>): void;
}
