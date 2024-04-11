export interface IEasing {
    ratio_at(t: number): number;
    reversed(): IEasing;
}
export interface IProperty<V> {
    get_value(time: number): V;
    set_value(time: number, value: V, start?: number, easing?: IEasing | boolean, add?: boolean): any;
    check_value(x: any): V;
}
export interface IAction {
    _start?: number;
    _end?: number;
    ready(parent: IParent): void;
    resolve(frame: number, base_frame: number, hint_dur: number): void;
    get_active_dur(): number;
    run(): void;
}
export interface IParent {
    _easing?: IEasing | boolean;
    _hint_dur?: number;
    frame_rate: number;
    to_frame(sec: number): number;
}
export declare class Action implements IAction {
    _start: number;
    _end: number;
    _dur?: number;
    ready(parent: IParent): void;
    run(): void;
    resolve(frame: number, base_frame: number, hint_dur: number): void;
    get_active_dur(): number;
}
export declare abstract class Actions extends Array<Action | Actions> implements IAction {
    _start: number;
    _end: number;
    frame_rate: number;
    _hint_dur?: number;
    _easing?: IEasing | boolean;
    ready(parent: IParent): void;
    run(): void;
    get_active_dur(): number;
    to_frame(sec: number): number;
    abstract resolve(frame: number, base_frame: number, hint_dur: number): void;
}
export declare class SeqA extends Actions {
    _delay?: number;
    _stagger?: number;
    ready(parent: IParent): void;
    resolve(frame: number, base_frame: number, hint_dur: number): void;
    delay(sec: number): this;
    stagger(sec: number): this;
}
export declare function Seq(...items: Array<Action | Actions>): SeqA;
export declare class ParA extends Actions {
    _tail?: boolean;
    ready(parent: IParent): void;
    resolve(frame: number, base_frame: number, hint_dur_: number): void;
}
export declare function Par(...items: Array<Action | Actions>): ParA;
export declare function ParE(...items: Array<Action | Actions>): ParA;
export declare class ToA extends Action {
    _easing?: IEasing | boolean;
    constructor(props: IProperty<any>[], value: any, dur?: number);
}
export declare function To(props: IProperty<any>[], value: any, dur?: number): ToA;
