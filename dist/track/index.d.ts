import { Animatable } from "../model/index.js";
export interface IAction {
    _start?: number;
    _end?: number;
    ready(track: Track): void;
    resolve(frame: number, base_frame: number): void;
    get_active_dur(): number;
    run(): void;
}
export declare class Action implements IAction {
    _start: number;
    _end: number;
    _dur: number;
    ready(track: Track): void;
    run(): void;
    resolve(frame: number, base_frame: number): void;
    get_active_dur(): number;
}
export declare class ToA extends Action {
    constructor(props: Animatable<any>[], value: any, dur?: number);
}
export declare function To(props: Animatable<any>[], value: any, dur?: number): ToA;
export declare class Track {
    frame: number;
    frame_rate: number;
    sec(n: number): number;
    to_frame(sec: number): number;
    feed(cur: IAction): this;
}
