"uses strict";
import test from "tap";

import { NumberValue, Rect, Transform } from "svgmotion";

test.test("KeyframeEntry", (t) => {
    let x = new Rect();
    let tr = x.transform = new Transform();
    tr.rotation = new NumberValue(30);
    tr.rotation.set_value(30, 10);
    console.info(tr.to_json());
    for (const v of x.enum_values()) {

        // console.log(v);
    }

    x.stroke.dash_array.parse_value("4 5 6");

    console.log("x.stroke.dash_array", x.stroke.dash_array.to_json());
    t.same(x.stroke.dash_array.to_json(), { v: [4, 5, 6] });

    t.end();

});