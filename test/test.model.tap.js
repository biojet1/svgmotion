"uses strict";
import test from "tap";

import { ScalarValue, Rect, Transform } from "svgmotion";

test.test("Keyframe", (t) => {
    let x = new Rect();
    let tr = x.transform = new Transform();
    tr.rotation = new ScalarValue(30);
    tr.rotation.key_value(30, 10);
    // console.info(tr.dump());
    for (const v of x.enum_values()) {

        // console.log(v);
    }

    x.stroke.dash_array.set_parse_dashes("4 5 6");

    // console.log("x.stroke.dash_array", x.stroke.dash_array.dump());
    t.same(x.stroke.dash_array.dump(), { v: [4, 5, 6] });

    t.end();

});