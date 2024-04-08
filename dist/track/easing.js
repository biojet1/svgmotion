import { cubic_bezier_y_of_x } from "../model/bezier";
class Ease extends Float64Array {
    calc_ratio(r) {
        const [ox, oy, ix, iy] = this;
        return cubic_bezier_y_of_x([0, 0], [ox, oy], [ix, iy], [1, 1])(r);
    }
    reverse() {
        const [ox, oy, ix, iy] = this;
        return new Ease([1 - ix, 1 - iy], [1 - ox, 1 - oy]);
    }
    constructor(o, i) {
        const [ox, oy] = o;
        const [ix, iy] = i;
        super([ox, oy, ix, iy]);
    }
}
function Hold(kf) {
    kf.hold = true;
}
function Linear(kf) {
    kf.out_value.x = 0;
    kf.out_value.y = 0;
    kf.in_value.x = 1;
    kf.in_value.y = 1;
}
function Sigmoid(delay = 1 / 3) {
    return function (kf) {
        kf.out_value.x = delay;
        kf.out_value.y = 0;
        kf.in_value.x = 1 - delay;
        kf.in_value.y = 1;
    };
}
function Bezier(out_point, in_point) {
    return function (kf) {
        kf.out_value.x = out_point[0];
        kf.out_value.y = out_point[1];
        kf.in_value.x = in_point[0];
        kf.in_value.y = in_point[1];
    };
}
//# sourceMappingURL=easing.js.map