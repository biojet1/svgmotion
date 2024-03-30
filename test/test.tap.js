"uses strict";
import test from "tap";

import { Handle, KeyframeEntry, Keyframes } from "../dist/model/keyframes.js";

test.test("handle", (t) => {
    let h = new Handle();
    t.equal(h.x, 0);
    t.equal(h.y, 0);
    t.end();

});

test.test("KeyframeEntry", (t) => {
    let kfe = new KeyframeEntry();

    console.log(kfe);

    t.end();

});

test.test("Keyframes", (t) => {
    let kfs = new Keyframes();
    kfs.set_value(0, 9);
    kfs.set_value(60, 10);
    console.log(kfs);

    t.end();

});


