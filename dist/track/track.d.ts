import { IAction, Action } from "./action.js";
export declare class Track {
    frame: number;
    frame_rate: number;
    _hint_dur: number;
    _easing?: ((a: any) => void) | true;
    sec(n: number): number;
    to_frame(sec: number): number;
    to_easing(x?: (a: any) => void): true | ((a: any) => void) | undefined;
    feed(cur: IAction): this;
    play(...args: Array<Action | Array<Action>>): void;
}
