"uses strict";
import test from "tap";
import * as svgmotion from "svgmotion";

test.test("WritingModeValue", (t) => {
    const { BoundingInterval } = svgmotion;
    const [x, y, z, q] = [1, 2, 3];
    t.same([x, y, z, q], [1, 2, 3, undefined]);
    t.same(new BoundingInterval([0, 0]), [0, 0]);
    t.same(new BoundingInterval([10, 20]), [10, 20]);
    t.same(new BoundingInterval([7]), [7, 7]);
    t.same(new BoundingInterval([0, 0]).center, 0);
    t.same(new BoundingInterval([0, 10]).center, 5);
    t.same(new BoundingInterval([-10, 10]).center, 0);
    t.same(new BoundingInterval([7]).center, 7);
    t.end();
});

// def test_center(self):
// """Center of a scale"""
// self.assertEqual(BoundingInterval(0, 0).center, 0)
// self.assertEqual(BoundingInterval(0, 10).center, 5)
// self.assertEqual(BoundingInterval(-10, 10).center, 0)

// def test_neg(self):
// """-Span(...)"""
// self.assertEqual(tuple(-BoundingInterval(-10, 10)), (-10, 10))
// self.assertEqual(tuple(-BoundingInterval(-15, 2)), (-2, 15))
// self.assertEqual(tuple(-BoundingInterval(100, 110)), (-110, -100))
// self.assertEqual(tuple(-BoundingInterval(-110, -100)), (100, 110))

// def test_size(self):
// """Size of the scale"""
// self.assertEqual(BoundingInterval(0, 0).size, 0)
// self.assertEqual(BoundingInterval(10, 30).size, 20)
// self.assertEqual(BoundingInterval(-10, 10).size, 20)
// self.assertEqual(BoundingInterval(-30, -10).size, 20)
// def test_creation(self):
// """Creating scales"""
// self.assertEqual(BoundingInterval(0, 0), (0, 0))
// self.assertEqual(BoundingInterval(1), (1, 1))
// self.assertEqual(BoundingInterval(10), (10, 10))
// self.assertEqual(BoundingInterval(10, 20), (10, 20))
// self.assertEqual(BoundingInterval((2, 50)), (2, 50))