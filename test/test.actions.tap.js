import test from "tap";
import * as svgmotion from "svgmotion";

export function cata(p, start, end) {
    return [...p.enum_values(start, end)];
}

test.test("Par 2", (t) => {
    const { ParE, Track, To, Add, ScalarValue, Easing } = svgmotion;
    let a = new ScalarValue(1);
    let b = new ScalarValue(11);
    let c = new ScalarValue(3);
    let d = new ScalarValue(3);
    let tr = new Track();
    let x;
    tr.frame_rate = 5;
    tr.hint_dur = 5;
    tr.run(
        ParE([
            (x = To(a, 11, { easing: Easing.linear, dur: 2 })),
            Add(b, -10),
            Add(d, 15, { dur: 3, easing: Easing.linear }),
            To(c, 18),
        ])
    );
    console.log(x);

    t.same(
        cata(c, 0, 15 + 1),
        [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    );
    t.same(
        cata(c, 0, 15 + 1),
        [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    );
    t.same(
        cata(a, 0, 15 + 1).map((v) => Math.round(v)),
        [1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    );
    t.same(
        cata(b, 0, 15 + 1).map((v) => Math.round(v)),
        [11, 11, 11, 11, 11, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    );
    t.end();
});

test.test("Seq", (t) => {
    const { Seq, Track, To, ScalarValue } = svgmotion;
    let a = new ScalarValue(1);
    let b = new ScalarValue(2);
    let c = new ScalarValue(3);
    let tr = new Track();
    tr.run(Seq([To([a], 9), To([b], 8), To([c], 7)]));
    t.same(a.dump(), {
        k: [
            { t: 0, v: 1 },
            { t: 60, v: 9 },
        ],
        v: 1,
    });
    t.same(b.dump(), {
        k: [
            { t: 60, v: 2 },
            { t: 120, v: 8 },
        ],
        v: 2,
    });
    t.same(c.dump(), {
        k: [
            { t: 120, v: 3 },
            { t: 180, v: 7 },
        ],
        v: 3,
    });
    t.end();
});

test.test("Par", (t) => {
    const { Par, Track, To, ScalarValue } = svgmotion;
    let a = new ScalarValue(1);
    let b = new ScalarValue(2);
    let c = new ScalarValue(3);
    let tr = new Track();
    tr.run(Par([To([a], 9), To([b], 8), To([c], 7)]));
    t.same(a.dump(), {
        k: [
            { t: 0, v: 1 },
            { t: 60, v: 9 },
        ],
        v: 1,
    });
    t.same(b.dump(), {
        k: [
            { t: 0, v: 2 },
            { t: 60, v: 8 },
        ],
        v: 2,
    });
    t.same(c.dump(), {
        k: [
            { t: 0, v: 3 },
            { t: 60, v: 7 },
        ],
        v: 3,
    });
    t.end();
});

test.test("Seq then Par", (t) => {
    const { Seq, Par, Track, To, ScalarValue } = svgmotion;
    let a = new ScalarValue(1);
    let b = new ScalarValue(2);
    let c = new ScalarValue(3);
    let tr = new Track();
    tr.frame_rate = 5;
    tr.hint_dur = 5;
    tr.run(Seq([To([a], 9), To([b], 8), To([c], 7)]));
    // console.log(tr)
    t.same(a.dump(), {
        k: [
            { t: 0, v: 1 },
            { t: 5, v: 9 },
        ],
        v: 1,
    });
    t.same(b.dump(), {
        k: [
            { t: 5, v: 2 },
            { t: 10, v: 8 },
        ],
        v: 2,
    });
    t.same(c.dump(), {
        k: [
            { t: 10, v: 3 },
            { t: 15, v: 7 },
        ],
        v: 3,
    });

    tr.run(Par([To(a, 1), To(b, 1), To(c, 1)]));

    t.same(a.dump(), {
        k: [
            { t: 0, v: 1 },
            { t: 5, h: true, v: 9 },
            { t: 15, v: 9 },
            { t: 20, v: 1 },
        ],
        v: 1,
    });
    t.same(b.dump(), {
        k: [
            { t: 5, v: 2 },
            { t: 10, h: true, v: 8 },
            { t: 15, v: 8 },
            { t: 20, v: 1 },
        ],
        v: 2,
    });
    t.same(c.dump(), {
        k: [
            { t: 10, v: 3 },
            { t: 15, v: 7 },
            { t: 20, v: 1 },
        ],
        v: 3,
    });

    t.end();
});

test.test("Step", (t) => {
    const {
        VectorValue,
        Root,
        Track,
        ViewPort,
        ScalarValue,
        Fill,
        Step,
        Vector,
    } = svgmotion;
    let tr = new Track();
    let head = new Root();
    let view = head.view;
    let vp = new ViewPort();
    let r = view.add_rect();
    // r.opacity = new ScalarValue(0.9);
    r.position = new VectorValue([10, 30]);
    t.equal(r.position.value[0], 10);
    t.equal(r.position.value[1], 30);
    t.equal(vp.constructor.tag, "svg");

    {
        t.equal(Object.getOwnPropertyDescriptor(r, "opacity"), undefined);
        t.equal(r.opacity.value, 1);
        // console.log(Object.entries(r));
        r.opacity.value = 0.5;
        t.equal(r.opacity.value, 0.5);
        r.opacity.value = 0.75;
        t.equal(
            Object.getOwnPropertyDescriptor(r, "opacity").value.value,
            0.75
        );
        r.opacity = new ScalarValue(0.9);
        t.equal(r.opacity.value, 0.9);
    }

    let s = Step(
        [
            { A: 0.25, t: 0, B: [50, 50] },
            { A: 0.9, dur: 1, B: Vector.from([0, 50]) },
            { A: 0.25, dur: 1, B: [0, 0] },
            { A: 0.9, dur: 1, B: Step.first },
        ],
        { A: r.opacity, B: r.position }
    );

    s.ready(tr);
    s.resolve(0, 0, tr.hint_dur);
    s.run();

    {
        const q = r.position.kfs;
        // console.log(q[3]);
        t.same(Array.from(q[3].value), [50, 50]);
    }

    // console.log(r.prop5);
    r.prop5.value += 20;
    // console.log("position", vp.position);

    t.end();
});

test.test("Curve", (t) => {
    const { Seq, Track, To, PositionValue } = svgmotion;
    let pos = new PositionValue([4, 5]);
    let tr = new Track();
    let a;
    tr.run(
        (a = To(pos, [-200, -100], {
            curve: [
                [10, 10],
                [20, 20],
            ],
        }))
    );
    t.same(Array.from(pos.get_value(0)), [4, 5]);
    t.same(Array.from(pos.get_value(60)), [-200, -100]);
    // console.log(a);
    let d = pos.dump();
    // console.log(d);
    t.same(pos.dump(), d);
    t.end();
});
