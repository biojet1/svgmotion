"uses strict";
import test from "tap";

import {
    NumberValue,
    Rect
} from "../dist/model/index.js";
import {
    Transform
} from "../dist/model/properties.js";

test.test("KeyframeEntry", (t) => {
    let x = new Rect();
    let tr = x.transform = new Transform();
    tr.rotation = new NumberValue(30);
    tr.rotation.set_value(30, 10);
    for (const v of x.enum_values()) {

        // console.log(v);
    }



    t.end();

});