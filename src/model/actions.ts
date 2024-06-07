import { Action, IProperty } from "../track/action";



export class AddA extends Action {
    _easing?: Iterable<number> | boolean;
    constructor(props: IProperty<any>[], value: {
        x?: number;
        y?: number;
        dx?: number;
        dy?: number;


    }) {
        super();
        // this.ready = function (parent: IParent): void {
        //     const { dur, easing } = this._params ?? {};
        //     this._dur = (dur == undefined) ? undefined : parent.to_frame(dur);
        //     this._easing = easing ?? parent.easing;
        //     for (const prop of props) {
        //         parent.add_prop(prop);
        //     }
        // };
        // this.run = function (): void {
        //     const { _start, _end, _easing } = this;
        //     for (const prop of props) {
        //         prop.key_value(_end, value, _start, _easing, true);
        //     }
        // };
    }
}