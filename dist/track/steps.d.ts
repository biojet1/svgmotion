import { Action, IProperty, IEasing } from "./action.js";
export interface Entry {
    t: number;
    ease?: IEasing | boolean;
    [key: string]: any;
}
export interface UserEntry {
    dur?: number;
    t?: number;
    ease?: IEasing | boolean;
    [key: string]: any;
}
export interface PropMap {
    [key: string]: IProperty<any> | Array<IProperty<any>>;
}
interface Params {
    dur?: number;
    easing?: IEasing | boolean;
    bounce?: boolean;
    repeat?: number;
    max_dur?: number;
}
export declare class StepA extends Action {
    _steps: Array<UserEntry>;
    _max_dur?: number;
    _easing?: IEasing | boolean;
    _bounce?: boolean;
    _repeat?: number;
    _base_frame: number;
    _vars: PropMap;
    private _kf_map?;
    constructor(steps: Array<UserEntry>, vars: PropMap, { dur, easing, bounce, repeat, max_dur, }: Params);
    resolve(frame: number, base_frame: number, hint_dur: number): void;
    run(): void;
}
export declare function Step(steps: Array<UserEntry>, vars: PropMap, params?: Params): StepA;
export {};
