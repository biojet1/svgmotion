import test from "tap";
import * as svgmotion from "svgmotion";
export function* getr(p, start, end) {
    for (let i = start; i < end; ++i) {
        yield p.get_value(i);
    }
}

export function cata(p, start, end) {
    return [...getr(p, start, end)];
}

test.test("Par 2", (t) => {
    const { ParE, Track, To, Add, NumberValue, Easing } = svgmotion;
    let a = new NumberValue(1);
    let b = new NumberValue(11);
    let c = new NumberValue(3);
    let d = new NumberValue(3);
    let tr = new Track();
    tr.frame_rate = 5;
    tr.hint_dur = 5;
    let A1;
    tr.run(
        ParE(
            To(a, 11, 2).set({ easing: Easing.linear }),
            Add(b, -10),
            Add(d, 15, 3, Easing.linear),
            To(c, 18),
        )
    );
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
    t.same(cata(b, 0, 15 + 1).map((v) => Math.round(v)), [11, 11, 11, 11, 11, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    t.end();
});
