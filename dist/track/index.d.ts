export interface IProperty<V> {
    get_value(time: number): V;
    set_value(time: number, value: V, start?: number, easing?: (a: any) => void, add?: boolean): any;
}
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
export declare abstract class Actions extends Array<Action | Actions> implements IAction {
    _start: number;
    _end: number;
    ready(track: Track): void;
    run(): void;
    abstract resolve(frame: number, base_frame: number): void;
    get_active_dur(): number;
}
export declare class SeqA extends Actions {
    _delay?: number;
    _stagger?: number;
    _dur?: number;
    _easing?: (a: any) => void;
    ready(track: Track): void;
    resolve(frame: number, base_frame: number): void;
    delay(sec: number): this;
    stagger(sec: number): this;
}
export declare function Seq(...items: Array<Action | Actions>): SeqA;
export declare class ToA extends Action {
    constructor(props: IProperty<any>[], value: any, dur?: number);
}
export declare function To(props: IProperty<any>[], value: any, dur?: number): ToA;
export declare class Track {
    frame: number;
    frame_rate: number;
    sec(n: number): number;
    to_frame(sec: number): number;
    feed(cur: IAction): this;
    play(...args: Array<Action | Array<Action>>): void;
}
