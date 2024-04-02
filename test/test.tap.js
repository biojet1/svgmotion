"uses strict";
import test from "tap";

import {
    Handle, KeyframeEntry, Keyframes, NumberValue,
    NVectorValue, Point, NVector,
    ViewPort, Rect, Size, Root
} from "../dist/model/index.js";

test.test("handle", (t) => {
    let h = new Handle();
    t.equal(h.x, 0);
    t.equal(h.y, 0);
    t.end();

});

test.test("KeyframeEntry", (t) => {
    let kfe = new KeyframeEntry();

    // console.log(kfe);

    t.end();

});

test.test("Keyframes", (t) => {
    let kfs = new Keyframes();
    kfs.set_value(0, 9);
    kfs.set_value(60, 10);
    // console.log(kfs);

    t.end();

});

test.test("NumberValue", (t) => {
    let v = new NumberValue();
    v.set_value(0, 9);
    v.set_value(60, 10);
    // console.log(v);

    t.end();

});
test.test("Point", (t) => {
    let v = new Point(4, 5, 6, 7);

    // console.log(v);
    t.end();

});
test.test("NVectorValue", (t) => {
    let v = new NVectorValue();
    v.set_value(0, new NVector([3, 4]));
    v.set_value(60, new NVector([4, 5]));

    // console.log(v.get_value(60));
    t.end();

});

test.test("ViewPort", (t) => {
    let root = new Root();
    // v.push(new Rect());
    // v.push(new Ellipse());
    let r = root.add_rect();
    console.info(r.size);
    r.size.set_value(0, new Size(50, 50));
    r.size.set_value(50, new Size(50, 100));
    // v.set_value(0, new NVector([3, 4]));
    // v.set_value(60, new NVector([4, 5]));
    // v[0].fun();
    // r.opacity = 

    console.log(root.calc_time_range());

    t.end();

});





