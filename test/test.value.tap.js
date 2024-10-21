"uses strict";
import test from "tap";
import {
    ScalarValue,
    TextValue,
    VectorValue,
    Vector,
    Root,
    Transform,
    Easing,
} from "svgmotion";
import * as svgmotion from "svgmotion";

export function cata(p, start, end) {
    return [...p.enum_values(start, end)];
}

test.test("ScalarValue", (t) => {
    let v = new ScalarValue();
    t.equal(v.value, 0);
    v.key_value(0, 9);
    t.equal(v.get_value(0), 9);
    t.equal(v.get_value(60), 9);
    v.key_value(60, 10);
    t.equal(v.get_value(0), 9);
    t.equal(v.get_value(60), 10);
    v = new ScalarValue(9);
    t.equal(v.value, 9);
    t.equal(v.add_value(-10, 10), 0);
    for (const r of [0, 0.1, 0.5, 0.7, 1]) {
        t.equal(v.lerp_value(r, 7, 7), 7);
    }
    t.end();
});

test.test("VectorValue", (t) => {
    let v = new VectorValue([3, 4, 5, 6]);
    // console.warn(v, v.value);
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
    t.match(v.dump(), { v: [3, 4, 5, 6] });
    // t.match(VectorValue.load({ v: [3, 4, 5, 6] }), { v: [3, 4, 5, 6] });
    v.key_value(0, new Vector([3, 4]));
    v.key_value(60, new Vector([4, 5]));
    // console.warn(`v=[${new VectorValue().value}]`);
    // t.throws(() => new VectorValue());

    t.end();
});

test.test("ViewPort", async (t) => {
    let doc = new Root();
    let vp = doc.view;
    // v.push(new Rect());
    // v.push(new Ellipse());
    let r = vp.add_rect();
    // console.info(r.size);
    vp.view_box;
    // r.size.key_value(0, new Size(50, 50));
    // r.size.key_value(50, new Size(50, 100));
    // v.key_value(0, new Vector([3, 4]));
    // v.key_value(60, new Vector([4, 5]));
    // v[0].fun();
    // r.opacity =
    const json = doc.dump();
    // console.warn(JSON.stringify(json, null, 4));
    // console.warn(vp.constructor["opacity"]);
    // console.warn(vp.constructor["zoom_pan"]);
    const { tag, nodes, ...props } = json.view;
    // console.warn(tag, nodes, props);
    t.equal(tag, "svg");
    t.equal(nodes[0].tag, "rect");
    t.same(props.view_box.size.v.slice(0, 2), [100, 100]);
    let head2 = await Root.load(json);
    t.same(head2.dump(), json);
    // console.warn(JSON.stringify(load(json).dump(), null, 4));

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
    // console.warn(x);
    t.equal(x.get_value(-5), "ONE");
    t.equal(x.get_value(5), "ONE");
    t.equal(x.get_value(15), "TWO");
    t.equal(x.get_value(25), "3");
    t.end();
});

test.test("Transform", (t) => {
    let x = new Transform();
    t.not("all" in x);
    x.set_repr(
        "translate(4,5) rotate(30) skewX(-7) scale(3, .5) translate(-2 -3) skewY(99) scale(1 , 1) matrix(1 2 3 4 5 6) rotate(2 0 4)"
    );
    t.ok("all" in x);
    // console.warn(x.dump());

    t.equal(
        x.get_repr(0),
        "translate(4 5) rotate(30) skewX(-7) scale(3 0.5) translate(-2 -3) skewY(99) scale(1 1) matrix(1 2 3 4 5 6) rotate(2 0 4)"
    );
    t.same([...x.get_translate().get_value(0).values()], [4, 5]);
    t.same(x.get_rotate().get_value(0), 30);
    t.same([...x.get_scale().get_value(0).values()], [3, 0.5]);
    t.same([...x.get_translate(1).get_value(0).values()], [-2, -3]);
    t.same([...x.get_scale(1).get_value(0).values()], [1, 1]);
    t.same([...x.get_rotate_at(0).get_value(0).values()], [2, 0, 4]);
    t.same([...x.get_hexad(0).get_value(0).values()], [1, 2, 3, 4, 5, 6]);
    t.same(x.get_skewx().get_value(0), -7);
    t.same(x.get_skewy().get_value(0), 99);
    t.equal(x.get_translate(), x.get_translate(0));
    t.throws(() => x.get_translate(5));
    t.throws(() => x.get_translate(2));
    t.throws(() => x.set_parse_transform("skewU(-7)"));
    {
        x = new Transform();
        x.origin.set_repr("center center");
        t.same(x.dump(), { origin: { v: "center center" } });
    }
    {
        x = new Transform();
        x.box.set_value("fill-box");
        t.same(x.dump(), { box: { v: "fill-box" } });
    }
    {
        x = new Transform();
        x.add_translate(3, 5)
        t.same(x.dump(), [{ $: 't', v: [3, 5] }]);
    }
    {
        x = new Transform();
        t.same(x.dump(), []);
    }
    {
        x = new Transform();
        x.box.set_value("stroke-box");
        x.add_scale(3, 4)
        t.same(x.dump(), {
            box: { v: "stroke-box" }, all: [
                { $: "s", v: [3, 4] }
            ]
        });
    }
    {
        x = new Transform();
        x.origin.set_repr("right top");
        x.add_rotate(-30, -4, -5)
        t.same(x.dump(), {
            origin: { v: "right top" }, all: [
                { $: "R", v: [-30, -4, -5] }
            ]
        });
        x.load([]);
        t.same(x.dump(), []);
    }
    {
        x = new Transform();
        x.origin.set_repr("left bottom");
        x.box.set_value("content-box");
        x.add_rotate(-30, -4, -5)
        t.same(x.dump(), {
            origin: { v: "left bottom" },
            box: { v: "content-box" },
            all: [
                { $: "R", v: [-30, -4, -5] }
            ]
        });
        x.load([]);
        t.same(x.dump(), []);
    }
    {
        x = new Transform();
        const d = { origin: { v: "left bottom" } }
        x.load(d);
        t.same(x.dump(), d);
    }
    t.end();
});

test.test("Repeat", (t) => {
    let v = new ScalarValue();
    v.key_value(1, 5);
    v.key_value(7, 13);
    v.key_value(9, 7);
    v.steps.repeat(2);
    t.same(v.get_value(0), 5);
    t.same(v.get_value(9), 7);
    t.same(v.get_value(10), 5);
    t.same(v.get_value(16), 13);
    t.same(v.get_value(18), 7);
    t.same(v.get_value(19), 7);
    t.same(v.get_value(20), 7);
    // t.same(cata(v, 0, 15),[]);
    // ;
    // console.log(cata(v, 0, 21))
    t.end();
});

test.test("Repeat Infinite", (t) => {
    let v = new ScalarValue();
    v.key_value(1, 7);
    v.key_value(7, 13);
    v.key_value(9, 15);
    v.steps.repeat(Infinity);
    let o = 0;
    for (const x of "7 8 9 10 11 12 13 14 15 7 8 9 10 11 12 13 14 15 7 8 9 10 11 12 13 14 15 7 8 9 10 11 12 13 14 15".split(
        " "
    )) {
        o++;
        t.same(v.get_value(o), parseInt(x));
    }
    t.end();
});

test.test("Repeat fraction", (t) => {
    let v = new ScalarValue();
    v.key_value(1, 7);
    v.key_value(7, 13);
    v.key_value(9, 15);
    v.steps.repeat(3.3333333333333).clamp();
    let o = 0;
    v.get_value(50);
    // console.warn([...v.enum_values(0, 33)]);
    for (const x of "7 8 9 10 11 12 13 14 15 7 8 9 10 11 12 13 14 15 7 8 9 10 11 12 13 14 15 7 8 9 9 9 9 9".split(
        " "
    )) {
        o++;
        t.same(Math.round(v.get_value(o)), parseInt(x), `o:${o} x:${x}`);
    }
    t.end();
});

test.test("Bounce once", (t) => {
    let v = new ScalarValue();
    v.key_value(1, 7);
    v.key_value(7, 13);
    v.key_value(9, 15);
    v.steps.bounce();
    let o = 0;
    for (const x of (
        `7 8 9 10 11 12 13 14 15 14 13 12 11 10 9 8 7` + ` 7 7 7`
    ).split(/s+/)) {
        o++;
        t.same(v.get_value(o), parseInt(x), `o:${o} x:${x}`);
    }
    t.end();
});

test.test("Bounce twice", (t) => {
    let v = new ScalarValue();
    v.key_value(1, 7);
    v.key_value(7, 13);
    v.key_value(9, 15);
    v.steps.bounce(2);
    let o = 0 - 3;
    for (const x of (
        `7 7 7 7 8 9 10 11 12 13 14 15 14 13 12 11 10 9 8 7` +
        ` 8 9 10 11 12 13 14 15 14 13 12 11 10 9 8 7 7 7 7 7 7 7`
    ).split(" ")) {
        o++;
        if (!t.same(v.get_value(o), parseInt(x), `o:${o} x:${x}`)) {
            break;
        }
    }
    t.end();
});

test.test("Bounce 2.5x", (t) => {
    let v = new ScalarValue();
    v.key_value(1, 7);
    v.key_value(7, 13);
    v.key_value(9, 15);
    v.steps.bounce(2.5);
    let o = 0 - 2;
    for (const x of (
        `7 7 7 8 9 10 11 12 13 14 15 14 13 12 11 10 9 8 7` +
        ` 8 9 10 11 12 13 14 15 14 13 12 11 10 9 8 7 8 9 10 11 12 13 14 15 15 15 15 15`
    ).split(" ")) {
        o++;
        // console.warn(`o:${o} x:${x}`);
        if (!t.same(v.get_value(o), parseInt(x), `o:${o} x:${x}`)) {
            break;
        }
    }

    let j = v.dump();
    t.same(j.s, [{ $: "bounce", repeat_count: 2.5 }]);

    t.end();
});

test.test("Easing", (t) => {
    let n =
        "9999,9812,9306,8559,7653,6666,5679,4773,4026,3520,3333,2391,1693,1216,930,796,775,823,901,971,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,5000,4700,4400,4100,3800,3500,3200,2900,2600,2300,2000"
            .split(",")
            .map((v) => parseFloat(v));
    let v = new ScalarValue(6);
    v.key_value(0, 9999);
    v.key_value(10, 3333, { easing: Easing.sigmoid });
    v.key_value(20, 1000, { easing: Easing.outback });
    v.key_value(30, 5000, { easing: true });
    v.key_value(40, 2000);
    const d = v.dump();
    // console.warn(d)
    let u = new ScalarValue(9);
    u.load(d);

    t.same(
        [...v.enum_values(0, 40)].map((v) => Math.round(v)),
        n
    );
    delete v.kfs_stepper
    t.same(
        [...v.enum_values(0, 40)].map((v) => Math.round(v)),
        n
    );
    t.same(
        [...u.enum_values(0, 40)].map((v) => Math.round(v)),
        n
    );

    t.end();
});

test.test("PositionValue", (t) => {
    const { PositionValue, Vector } = svgmotion;
    let p = new PositionValue([4, 5]);
    // let k = p.key_value(0, 9999);

    let a = p.add_keyframe(0, new Vector([10, 10]));
    let b = p.add_keyframe(10, new Vector([10 - 40, 10 - 30]));
    let c = p.add_keyframe(20, new Vector([10 - 40 + 50, 10 - 30 + 50]));
    a.in_tan = new Vector([5, -20]);
    a.out_tan = new Vector([-25, -40]);

    function RND(x) {
        return Math.round(x * 1000);
    }

    // console.warn(a, b);

    // console.warn([...p.enum_values(0, 3)]);

    for (const [i, x, y] of [
        [0, 10, 10],
        [1, 2.94, -1.1000000000000012],
        [2, -3.2800000000000016, -10.400000000000004],
        [3, -8.719999999999999, -17.9],
        [4, -13.440000000000001, -23.6],
        [5, -17.5, -27.5],
        [6, -20.96, -29.6],
        [7, -23.879999999999995, -29.9],
        [8, -26.32, -28.4],
        [9, -28.340000000000003, -25.1],
        [10, -30, -20],
        [11, -25, -15],
        [12, -20, -10],
        [13, -15, -5],
        [14, -10, 0],
        [15, -5, 5],
        [16, 0, 10],
    ]) {
        const [x2, y2] = p.get_value(i);
        t.same(RND(x2), RND(x), `[${i}] ${x},${y} ${x2},${y2}`);
        t.same(RND(y2), RND(y));
    }
    // Along(p, "C 5,6 7,8")
    // CurveTo(p, [5, 6], [8, 7], [9, 6]), SmoothTo, QuadTo
    // Step([{curve=[[7,8],[9,6]]}])
    //CurveTo(p, {x:6,y:6, easing, dur, to, delta_to, p1}), SmoothTo, QuadTo   
    [
        [[5, 6], [8, 7]],
        [[5, 6], [9, 6]],
    ]
    t.end();
});

test.test("Vector", (t) => {
    const { Vector } = svgmotion;
    let e = new Vector([1, -2, 3, -4]);
    t.same(e, [1, -2, 3, -4]);
    t.same(e[1], -2);
    t.same(e[3], -4);
    t.same([...e], [1, -2, 3, -4]);
    t.end();
});