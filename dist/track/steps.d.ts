import { Action, IProperty } from "./action.js";
export interface Entry {
    t: number;
    ease?: Iterable<number> | boolean;
    [key: string]: any;
}
export interface UserEntry {
    dur?: number;
    t?: number;
    ease?: Iterable<number> | boolean;
    [key: string]: any;
}
export interface PropMap {
    [key: string]: IProperty<any> | Array<IProperty<any>>;
}
interface KF {
    t: number;
    value: any;
    ease?: Iterable<number> | boolean;
}
interface KFMap {
    [key: string]: KF[];
}
interface Params {
    dur?: number;
    easing?: Iterable<number> | boolean;
    bounce?: boolean;
    repeat?: number;
    max_dur?: number;
}
export declare class StepA extends Action {
    _steps: Array<UserEntry>;
    _max_dur?: number;
    _easing?: Iterable<number> | boolean;
    _bounce?: boolean;
    _repeat?: number;
    _base_frame: number;
    _vars: PropMap;
    _kf_map?: KFMap;
    constructor(steps: Array<UserEntry>, vars: PropMap, { dur, easing, bounce, repeat, max_dur, }: Params);
    resolve(frame: number, base_frame: number, hint_dur: number): void;
    run(): void;
}
export declare function Step(steps: Array<UserEntry>, vars: PropMap, params?: Params): StepA;
export {};
