"uses strict";
import test from "tap";
import * as svgmotion from "svgmotion";

test.test("BoundingInterval", (t) => {
    const { BoundingInterval } = svgmotion;
    const [x, y, z, q] = [1, 2, 3];
    t.same([x, y, z, q], [1, 2, 3, undefined]);
    t.same(new BoundingInterval([0, 0]), [0, 0]);
    t.same(new BoundingInterval([10, 20]), [10, 20]);
    t.same(new BoundingInterval([7]), [7, 7]);
    ///
    t.same(new BoundingInterval([0, 0]).center, 0);
    t.same(new BoundingInterval([0, 10]).center, 5);
    t.same(new BoundingInterval([-10, 10]).center, 0);
    t.same(new BoundingInterval([7]).center, 7);
    ///
    t.same(new BoundingInterval([0, 0]).size, 0);
    t.same(new BoundingInterval([-30, -10]).size, 20);
    t.same(new BoundingInterval([-10, 10]).size, 20);
    t.same(new BoundingInterval([10, 30]).size, 20);
    ///
    t.same(new BoundingInterval([9, 10]).add(new BoundingInterval([4, 5])), [4, 10]);
    t.same(new BoundingInterval([4]).add(new BoundingInterval([3])).add(new BoundingInterval([10])), [3, 10]);
    ///
    t.same(new BoundingInterval([2, 2]).mul(2), [4, 4]);
    ///
    t.same(new BoundingInterval([-10, 10]).neg(), [-10, 10]);
    t.same(new BoundingInterval([-15, 2]).neg(), [-2, 15]);
    t.same(new BoundingInterval([100, 110]).neg(), [-110, -100]);
    t.same(new BoundingInterval([-110, -100]).neg(), [100, 110]);
    ///
    t.same(new BoundingInterval(new BoundingInterval([9, 7])), [7, 9]);
    ///
    t.end();
});

test.test("BoundingBox", (t) => {
    const { BoundingBox } = svgmotion;


    ///
    t.same(
        (new BoundingBox([0, 10], [0, 10]).add(new BoundingBox([-10, 0], [-10, 0]))),
        [[-10, 10], [-10, 10]],
    )
    // ret = sum(
    //     [
    //         BoundingBox((-5, 0), (0, 0)),
    //         BoundingBox((0, 5), (0, 0)),
    //         BoundingBox((0, 0), (-5, 0)),
    //         BoundingBox((0, 0), (0, 5)),
    //     ],
    //     None,
    // )
    // self.assertEqual(tuple(ret), ((-5, 5), (-5, 5)))
    // self.assertEqual(tuple(BoundingBox(-10, 2) + ret), ((-10, 5), (-5, 5)))
    // self.assertEqual(tuple(ret + BoundingBox(1, -10)), ((-5, 5), (-10, 5)))
    ///
    t.end();
});