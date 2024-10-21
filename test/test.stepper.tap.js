import test from "tap";
import { Stepper, Steps } from "svgmotion";

// import { Steps } from "../dist/keyframe/steps.js";

function echo(n) {
    return n;
}
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

function arange(u, s, e) {
    return range(s, e, 1).map(i => u(i))
}

test.test("stepper_slice", (t) => {
    let s = Stepper.echo(0, 10);
    t.same([...s.slice(-2).iter(8, 10)], [8, 9, 10]);
    t.same([...s.slice(-2, -1).iter()], [8, 9]);
    t.same([...s.slice(0, 2).iter()], [0, 1, 2]);
    t.same([...s.slice(0, 2).start_at(3).iter(3, 5)], [0, 1, 2]);
    t.same([...s.slice(0, 2).start_at(3).iter(0, 5)], [-3, -2, -1, 0, 1, 2]);
    t.same([...s.slice(-2).start_at(0).iter(0, 2)], [8, 9, 10]);
    t.same([...s.slice().iter(1, 3)], [1, 2, 3]);
    t.end();
});

test.test("test_bounce_then_repeat_2x", (t) => {
    let x = new Steps();
    let u, s, e;
    [u, s, e] = x.bounce().apply(echo, 70, 70 + 3);
    t.same([s, e], [70, 76]);
    t.same(arange(u, s, e + 1), [70, 71, 72, 73, 72, 71, 70]);
    [u, s, e] = x.reverse().apply(echo, 70, 70 + 3);
    t.same(arange(u, s, e + 1), [70, 71, 72, 73, 72, 71, 70]);
    [u, s, e] = x.repeat().apply(echo, 70, 70 + 3);
    t.same(arange(u, s, e + 1), [70, 71, 72, 73, 72, 71, 70, 70, 71, 72, 73, 72, 71, 70]);
    t.end();
});

test.test("test_clamp_bounce", (t) => {
    let x = new Steps();
    let u, s, e;
    [u, s, e] = x.bounce(1).apply(echo, 70, 70 + 3);
    t.same([s, e], [70, 76]);
    t.same(arange(u, 67, 79 + 1), [73, 72, 71, 70, 71, 72, 73, 72, 71, 70, 71, 72, 73]);
    [u, s, e] = x.clamp(1).apply(echo, 70, 70 + 3);
    t.same(arange(u, 67, 79 + 1), [70, 70, 70, 70, 71, 72, 73, 72, 71, 70, 70, 70, 70]);
    // console.log(x.all);
    x.all.pop();
    // console.log(x.all);
    [u, s, e] = x.start_at(0).apply(echo, 70, 70 + 3);
    // console.log(x.all);
    t.same(arange(u, -3, 9 + 1), [73, 72, 71, 70, 71, 72, 73, 72, 71, 70, 71, 72, 73]);
    t.end();
});

test.test("test_empty", (t) => {
    let x = new Steps();
    let u, s, e;
    [u, s, e] = x.apply(echo, 70, 70 + 3);
    t.same([s, e], [70, 73]);
    t.same(arange(u, s, e + 1), [70, 71, 72, 73]);
    t.end();
});

test.test("test_stepper_remap_range_2", (t) => {
    let x = new Steps();
    let u, s, e;
    [u, s, e] = x.remap(70, 75).apply(echo, 70, 80);
    t.same([s, e], [70, 75]);
    t.same(arange(u, 70, 80), [70, 72, 74, 76, 78, 80, 82, 84, 86, 88]);
    t.end();
});

test.test("test_remap_range_shift", (t) => {
    let x = new Steps();
    let u, s, e;
    [u, s, e] = x.remap(10, 20).apply(echo, 70, 80);
    t.same([s, e], [10, 20]);
    t.same(arange(u, 10, 30), [70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87, 88, 89]);
    t.end();
});

test.test("test_start_at_range_shift", (t) => {
    let x = new Steps();
    let u, s, e;
    [u, s, e] = x.start_at(10).apply(echo, 70, 80);
    t.same([s, e], [10, 20]);
    t.same(arange(u, 10, 30), [70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87, 88, 89]);
    t.end();
});
