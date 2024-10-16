"uses strict";
import test from "tap";
import { Root, BoundingBox } from "svgmotion";

function close_enough(t, a, b, threshold = 1e-6, tag) {
    t.ok(Math.abs(b - a) <= threshold, `${tag} ${a} ${b} ${threshold}`);
}

function boxf(r) {
    return `(${r.x},${r.y})<${r.width} x ${r.height}>`
}

function eqBox(t, a, b, epsilon = 0, tag) {
    t.notOk(a === b)
    t.ok(a.equals(b, epsilon), `${tag} [${boxf(a)}] vs [${boxf(b)}]`);
}

test.test("viewport", async (t) => {
    const root = await Root._load_svg("res/viewport.svg");
    //
    const R5 = root.get_rect('R5');
    // console.dir(R5.dump(), { depth: 10 });
    //
    const V0 = root.get_view('V0');
    t.same(V0.view_box.position.get_value(0).slice(0, 2), [0, 0], `V0.view_box.position`);
    t.same(V0.view_box.size.get_value(0).slice(0, 2), [300, 400], `V0.view_box.size`);
    V0.width.set_value(300)
    V0.height.set_value(400)
    //
    const V1 = root.get_view('V1');
    t.same(V1.id, 'V1', `V1.id`);
    t.same(V1.width.get_value(0), 100, `V1.width`);
    t.same(V1.x.get_value(0), 200, `V1.x`);
    t.same(V1.y.get_value(0), 0, `V1.y`);
    t.same(V1.height.get_value(0), 400, `V1.height`);
    t.same(V1.view_box.position.get_value(0).slice(0, 2), [0, 0], `V1.view_box.position`);
    t.same(V1.view_box.size.get_value(0).slice(0, 2), [10, 8], `V1.view_box.size`);
    //
    const R3 = root.get_rect('R3');
    t.same(R3.id, 'R3', `R3.id`);
    t.ok(R3._parent === V1)
    t.same(R3.y.get_value(0), 0);
    t.same(R3.width.get_value(0), 5);
    t.same(R3.x.get_value(0), 5);
    t.same(R3.height.get_value(0), 4);
    // 
    const L9 = root.get_line('L9');
    t.same(L9.x1.get_value(0), -1);
    t.same(L9.y1.get_value(0), 2);
    t.same(L9.x2.get_value(0), -3);
    t.same(L9.y2.get_value(0), 4);
    t.same(L9.describe(0), 'M -1 2 L -3 4');
    t.same(V0.bbox_of(0, L9).dump(), BoundingBox.extrema([-3, -1], [2, 4]).dump());
    //
    const V2 = root.get_view('V2');
    t.same(V2.id, 'V2', `V2.id`);
    t.same([...V2.view_box.position.get_value(0)], [0, 0], `V2.view_box.position`);
    // console.dir(V2.view_box.size.get_value(0));
    t.same([...V2.view_box.size.get_value(0)], [10, 10], `V2.view_box.size`);
    //
    const L1 = root.get_line('L1');
    t.same(L1.x1.get_value(0), 0);
    t.same(L1.y1.get_value(0), 2.5);
    t.same(L1.x2.get_value(0), 5);
    t.same(L1.y2.get_value(0), 7.5);
    //
    [
        ["C4", 0, 150, 192],
        ["C1", 35.355342864990234, 150, 70],

        ["C2", 40, 55, 70],
        ["C3", 4.527692794799805, 5, 4],
        ["C5", 5, 5, 5],
        ["C6", 1, 5, 5],
    ].forEach(([id, r, cx, cy]) => {
        const circle = root.get_circle(id);
        close_enough(t, circle.r.get_value(0), r, 1e-3, `${id} r`);
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
        const v = root.get_element(id);
        t.same(v.id, id, `${id} id`);
        close_enough(t, v.x.get_value(0), x, 1e-4, `${id} x`);
        close_enough(t, v.y.get_value(0), y, 1e-6, `${id} y`);
        close_enough(t, v.width.get_value(0), w, 1e-6, `${id} width`);
        close_enough(t, v.height.get_value(0), h, 1e-6, `${id} height`);
    });
    //

    [
        ['C4', 0, 0, 0, 0],
        ['C1', 114.61666870117188, 34.633331298828125, 70.76666259765625, 70.710693359375],
        ['C2', 15, 30, 80, 80],
        ['V1', 200, 0, 100, 400],
        ['C3', 204.6666717529297, 154.6666717529297, 90.66665649414062, 90.66665649414062],
        ['R1', 200, 160, 50, 40],
        ['R3', 250, 160, 50, 40],
        ['R4', 200, 200, 50, 40],
        ['V2', 0, 200, 300, 100],
        ['C5', 100, 200, 100, 100],
        ['V3', 100, 200, 100, 100],
        ['L1', 100, 225, 50, 50],
        ['C6', 140, 240, 20, 20],
        ['R5', 200, 160, 50, 40],
        ['R6', 250, 200, 50, 40],
    ].forEach(([id, x, y, w, h]) => {
        // const v = document.getElementById(id);
        // const b = BoundingBox.rect(x, y, w, h);
        // const r = lay._boundingBox(v);
        // eqBox(t, b, r.is_valid() ? r : BoundingBox.empty(), x - ~~x === 0 ? 1e-9 : 1, id);
        const v = root.get_element(id);
        t.same(v.id, id, `${id} id`); const bb = V0.bbox_of(0, v);
        eqBox(t, (bb.is_valid() ? bb : BoundingBox.empty()), BoundingBox.rect(x, y, w, h), 1e-1, `${id}`)
    });

    t.end();
});
