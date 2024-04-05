
export interface IEasable {
    in_value: { x: number, y: number };
    out_value: { x: number, y: number };
    hold: boolean;
}

function Hold(kf: IEasable) {
    kf.hold = true;
}

function Linear(kf: IEasable) {
    kf.out_value.x = 0;
    kf.out_value.y = 0;
    kf.in_value.x = 1;
    kf.in_value.y = 1;
}

function Sigmoid(delay = 1 / 3) {
    return function (kf: IEasable) {
        kf.out_value.x = delay;
        kf.out_value.y = 0;
        kf.in_value.x = 1 - delay;
        kf.in_value.y = 1;
    }
}

function Bezier(out_point: Array<number>, in_point: Array<number>) {
    return function (kf: IEasable) {
        kf.out_value.x = out_point[0];
        kf.out_value.y = out_point[1];
        kf.in_value.x = in_point[0];
        kf.in_value.y = in_point[1];
    }
}


