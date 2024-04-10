"uses strict";
import test from "tap";

import {
    KeyframeEntry, Keyframes, NumberValue,
    NVectorValue, Point, NVector,
    ViewPort, Rect, Size, Root
} from "../dist/model/index.js";
import {
    Step, Track
} from "../dist/index.js";
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
    t.equal(v.value, 0);
    v.set_value(0, 9);
    v.set_value(60, 10);
    t.equal(v.get_value(0), 9);
    t.equal(v.get_value(60), 10);
    v = new NumberValue(9);
    t.equal(v.value, 9);
    t.equal(v.add_value(-10, 10), 0);

    for (const r of [0, .1, .5, .7, 1]) {
        t.equal(v.lerp_value(r, 7, 7), 7);
    }
    t.end();
});

test.test("Point", (t) => {
    let v = new Point(4, 5, 6, 7);
    // console.log(v);
    t.end();
});

test.test("NVectorValue", (t) => {
    let v = new NVectorValue([3, 4, 5, 6]);
    // console.log(v, v.value);
    t.equal(v.value[0], 3);
    t.equal(v.value[1], 4);
    t.equal(v.value[2], 5);
    t.equal(v.value[3], 6);
    t.equal(v.value[4], undefined);
    for (const r of [0, 1, -1, 5]) {
        const u = v.get_value(r);
        t.equal(u[0], 3);
        t.equal(u[1], 4);
        t.equal(u[2], 5);
        t.equal(u[3], 6);
        t.equal(u[4], undefined);
    }

    v.set_value(0, new NVector([3, 4]));
    v.set_value(60, new NVector([4, 5]));
    // console.log(v, v.value);
    t.throws(() => new NVectorValue());
    t.end();

});

test.test("ViewPort", (t) => {
    let root = new Root();
    // v.push(new Rect());
    // v.push(new Ellipse());
    let r = root.add_rect();
    // console.info(r.size);
    r.size.set_value(0, new Size(50, 50));
    r.size.set_value(50, new Size(50, 100));
    // v.set_value(0, new NVector([3, 4]));
    // v.set_value(60, new NVector([4, 5]));
    // v[0].fun();
    // r.opacity = 

    // console.log(root.calc_time_range());

    t.end();

});

test.test("Step", (t) => {
    let tr = new Track();
    let root = new Root();
    let r = root.add_rect();
    r.opacity = new NumberValue(0.9);
    r.position = new NVectorValue([10, 30]);
    t.equal(r.position.value[0], 10);
    t.equal(r.position.value[1], 30);

    let s = Step(
        [
            { A: 0.25, t: 0, B: [50, 50] },
            { A: 0.9, dur: 1, B: NVector.from([0, 50]) },
            { A: 0.25, dur: 1, B: [0, 0] },
            { A: 0.9, dur: 1, B: null },
        ],
        { A: r.opacity, B: r.position }
    );

    s.ready(tr);
    s.resolve(0, 0, tr._hint_dur);
    s.run();

    {
        const q = r.position.value;
        // console.log(q[3]);
        t.same(Array.from(q[3].value), [50, 50]);
    }
    // console.log(r.position.get_value(0));
    // console.log("LOG", s._kf_map, s._entries, r.position.value);

    // tr.feed(
    //     Step(
    //         [
    //             { A: 0.25, t: 0, B: [50, 50] },
    //             { A: 0.9, dur: 1, B: [0, 50] },
    //             { A: 0.25, dur: 1, B: [0, 0] },
    //             { A: 0.9, dur: 1, B: null },
    //         ],
    //         { A: r.opacity, B: r.position }
    //     )
    // );

    t.end();

});




