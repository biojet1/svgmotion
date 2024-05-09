"uses strict";
import test from "tap";

import {
    Keyframes, NumberValue, TextValue,
    NVectorValue, Point, NVector, Fill,
    ViewPort, Root, Size,
    Step, Track
} from "svgmotion";

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
    v.key_value(0, 9);
    v.key_value(60, 10);
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
    t.match(v.to_json(), { v: [3, 4, 5, 6] });
    // t.match(NVectorValue.from_json({ v: [3, 4, 5, 6] }), { v: [3, 4, 5, 6] });
    v.key_value(0, new NVector([3, 4]));
    v.key_value(60, new NVector([4, 5]));
    // console.log(new NVectorValue().value);
    t.throws(() => new NVectorValue());


    t.end();

});

test.test("ViewPort", (t) => {
    let doc = new Root();
    let vp = doc.view;
    // v.push(new Rect());
    // v.push(new Ellipse());
    let r = vp.add_rect();
    // console.info(r.size);
    vp.view_box;
    r.size.key_value(0, new Size(50, 50));
    r.size.key_value(50, new Size(50, 100));
    // v.key_value(0, new NVector([3, 4]));
    // v.key_value(60, new NVector([4, 5]));
    // v[0].fun();
    // r.opacity = 
    const json = doc.to_json();
    console.log(JSON.stringify(json, null, 4));
    console.log(vp.constructor['opacity']);
    console.log(vp.constructor['zoom_pan']);
    const { tag, nodes, ...props } = json.view;
    console.log(tag, nodes, props);
    t.equal(tag, "svg");
    t.equal(nodes[0].tag, "rect");
    t.same([...props.view_box.size.v], [100, 100]);
    let head2 = new Root();
    head2.from_json(json);
    t.same(head2.to_json(), json);
    // console.log(JSON.stringify(from_json(json).to_json(), null, 4));

    t.end();

});

test.test("Step", (t) => {
    let tr = new Track();
    let head = new Root();
    let view = head.view;
    let vp = new ViewPort();
    let r = view.add_rect();
    // r.opacity = new NumberValue(0.9);
    r.position = new NVectorValue([10, 30]);
    t.equal(r.position.value[0], 10);
    t.equal(r.position.value[1], 30);
    t.equal(vp.constructor.tag, 'svg');


    {
        t.equal(Object.getOwnPropertyDescriptor(r, 'opacity'), undefined);
        t.equal(r.opacity.value, 1);
        // console.log(Object.entries(r));
        r.opacity.value = 0.5;
        t.equal(r.opacity.value, 0.5);
        r.opacity.value = 0.75;
        t.equal(Object.getOwnPropertyDescriptor(r, 'opacity').value.value, 0.75);
        r.opacity = new NumberValue(0.9);
        t.equal(r.opacity.value, 0.9);
    }

    {
        // console.log('r.fill', r.fill);
        r.fill = new Fill();
        // console.log('r.fill', r.fill);
        r.fill = new Fill();
        // console.log('r.fill', r.fill);
        r.fill = new Fill();
        // console.log('r.fill', r.fill);
    }

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

    // console.log(r.prop5);
    r.prop5.value += 20;
    console.log("position", vp.position);

    t.end();

});


test.test("TextValue", (t) => {
    let x = new TextValue("X");
    t.equal(x.get_value(0), "X");
    t.equal(x.get_value(10), "X");
    t.equal(x.get_value(20), "X");
    x.key_value(0, "ONE");
    x.key_value(10, "TWO");
    x.key_value(20, "3");
    t.equal(x.get_value(0), "ONE");
    t.equal(x.get_value(10), "TWO");
    t.equal(x.get_value(20), "3");
    // console.log(x);
    t.equal(x.get_value(-5), "ONE");
    t.equal(x.get_value(5), "TWO");
    t.equal(x.get_value(15), "3");
    t.equal(x.get_value(25), "3");
    t.end();

});
