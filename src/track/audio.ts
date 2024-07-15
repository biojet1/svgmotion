// import { Action } from "./action.js";
export type AudioEntry = {
    path?: string;
    duration?: number;
    mixVolume?: number;
    volume?: string;
    start?: number;
    anchor?: number;
    cutFrom?: number;
    cutTo?: number;
    loop?: number;
    _tag?: string;
    track?: string;
    transcript?: string;
    fadeOut?: { duration: number; curve: string };
    fadeIn?: { duration: number; curve: string };
};
// export abstract class AudioActionBase extends Action {
//     protected abstract entry(): AudioEntry;
//     resolve(frame: number, base_frame: number, hint_dur_: number): void {

//     }
//     override ready(track: IParent): void {
//         // const { dur } = this._params ?? {};
//         // this._dur = (dur == undefined) ? undefined : parent.to_frame(dur);

//     }
// }