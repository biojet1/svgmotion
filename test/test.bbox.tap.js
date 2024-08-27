"uses strict";
import test from "tap";
import { SVGDocument, XMLSerializer } from "domspec";
import { Vector, RGB, Root, Rel } from "svgmotion";

function close_enough(t, a, b, threshold = 1e-6, tag) {
    t.ok(Math.abs(b - a) <= threshold, `${tag} ${a} ${b} ${threshold}`);
}

test.test("Item", async (t) => {
    const anim = new Root();
    //
    await anim.load_svg("res/viewport.svg");
    //
    const R5 = anim.get_rect('R5');
    console.dir(R5.dump(), { depth: 10 });
    //
    const V0 = anim.get_view('V0');
    t.same(V0.view_box.position.get_value(0).slice(0, 2), [0, 0], `V0.view_box.position`);
    t.same(V0.view_box.size.get_value(0).slice(0, 2), [300, 400], `V0.view_box.size`);
    V0.width.set_value(300)
    V0.height.set_value(400)
    //
    const V1 = anim.get_view('V1');
    t.same(V1.id, 'V1', `V1.id`);
    t.same(V1.width.get_value(0), 100, `V1.width`);
    t.same(V1.x.get_value(0), 200, `V1.x`);
    t.same(V1.y.get_value(0), 0, `V1.y`);
    t.same(V1.height.get_value(0), 400, `V1.height`);
    t.same(V1.view_box.position.get_value(0).slice(0, 2), [0, 0], `V1.view_box.position`);
    t.same(V1.view_box.size.get_value(0).slice(0, 2), [10, 8], `V1.view_box.size`);
    //
    const R3 = anim.get_rect('R3');
    t.same(R3.id, 'R3', `R3.id`);
    t.ok(R3._parent === V1)
    t.same(R3.y.get_value(0), 0);
    t.same(R3.width.get_value(0), 5);
    t.same(R3.x.get_value(0), 5);
    t.same(R3.height.get_value(0), 4);


    [
        ["C4", 0, 150, 192],
        ["C1", 35.355342864990234, 150, 70],
        ["C2", 40, 55, 70],
        ["C3", 4.527692794799805, 5, 4],
        ["C5", 5, 5, 5],
        ["C6", 1, 5, 5],
    ].forEach(([id, r, cx, cy]) => {
        const circle = anim.get_circle(id);
        close_enough(t, circle.r.get_value(0), r, 1e-4, `${id} r`);
        close_enough(t, circle.cx.get_value(0), cx, 1e-6, `${id} cx`);
        close_enough(t, circle.cy.get_value(0), cy, 1e-3, `${id} cy`);
    });
    //
    [
        ["V0", 0, 0, 300, 400],
        ["V1", 200, 0, 100, 400],
        ["R1", 0, 0, 5, 4],
        ["R3", 5, 0, 5, 4],
        ["R4", 0, 4, 5, 4],
        ["V3", 0, 0, 10, 10],
        ["V2", 0, 200, 300, 100],
        ["R5", 200, 160, 50, 40],
        ["R6", 200, 160, 50, 40],
    ].forEach(([id, x, y, w, h]) => {
        const v = anim.get_any(id);
        t.same(v.id, id, `${id} id`);
        close_enough(t, v.x.get_value(0), x, 1e-4, `${id} x`);
        close_enough(t, v.y.get_value(0), y, 1e-6, `${id} y`);
        close_enough(t, v.width.get_value(0), w, 1e-6, `${id} width`);
        close_enough(t, v.height.get_value(0), h, 1e-6, `${id} height`);
    });
    t.end();
});
