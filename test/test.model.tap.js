"uses strict";
import test from "tap";

import { ScalarValue, Rect, Transform, Track } from "svgmotion";

class Track2 extends Track {

}

test.test("Track2", (t) => {
    let x = new Track2();

    t.ok(x.sub() instanceof Track2);

    t.end();

});

test.test("Keyframe", (t) => {
    let x = new Rect();
    let tr = x.transform;
    tr.rotation = new ScalarValue(30);
    tr.rotation.key_value(30, 10);
    // console.info(tr.dump());
    for (const v of x.enum_values()) {

        // console.warn(v);
    }

    x.stroke.dash_array.set_repr("4 5 6");
    t.same(x.stroke.dash_array.dump(), { v: "4 5 6" });
    let v = x.stroke.dash_array.get_value(0);
    console.warn(v);

    t.end();

});

test.test("Rect.new", (t) => {
    const r = Rect.new({ x: 45 });
    t.ok(r instanceof Rect);
    t.same(r.x.get_value(0), 45);
    t.same(r.y.get_value(0), 0);
    t.end();
});

test.test("id", (t) => {
    let r = Rect.new({ x: 45 });
    t.same(Object.getOwnPropertyDescriptor(r, 'id')?.value, undefined);
    r.id = 'ID'
    t.same(Object.getOwnPropertyDescriptor(r, 'id')?.value, 'ID');
    t.same(r.id, 'ID');
    r.id = 'ID2'
    t.same(Object.getOwnPropertyDescriptor(r, 'id')?.value, 'ID2');
    t.same(r.id, 'ID2');
    r = Rect.new({ x: 45 });
    t.ok(r.id);
    t.same(Object.getOwnPropertyDescriptor(r, 'id')?.value, r.id);
    t.end();
});