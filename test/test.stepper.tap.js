import test from "tap";
import { Stepper } from "svgmotion";

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