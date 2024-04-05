import { IAction, Action } from "./action.js";
export declare class Track {
    #private;
    frame: number;
    frame_rate: number;
    hint_dur: number;
    sec(n: number): number;
    to_frame(sec: number): number;
    to_easing(x?: (a: any) => void): ((a: any) => void) | undefined;
    feed(cur: IAction): this;
    play(...args: Array<Action | Array<Action>>): void;
}
