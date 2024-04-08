import { cubic_bezier_y_of_x } from "../model/bezier";
class Easing extends Float64Array {
    ratio_at(t) {
        const [ox, oy, ix, iy] = this;
        return cubic_bezier_y_of_x([0, 0], [ox, oy], [ix, iy], [1, 1])(t);
    }
    reverse() {
        const [ox, oy, ix, iy] = this;
        return new Easing(1 - ix, 1 - iy, 1 - ox, 1 - oy);
    }
    constructor(ox, oy, ix, iy) {
        super([ox, oy, ix, iy]);
    }
}
const sigmoid = new Easing(1 / 3, 0, 1 - 1 / 3, 1);
// function Bezier(out_point: Array<number>, in_point: Array<number>) {
//     return function (kf: IEasable) {
//         kf.out_value.x = out_point[0];
//         kf.out_value.y = out_point[1];
//         kf.in_value.x = in_point[0];
//         kf.in_value.y = in_point[1];
//     }
// }
//# sourceMappingURL=easing.js.map