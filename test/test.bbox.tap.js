"uses strict";
import test from "tap";
import { SVGDocument, XMLSerializer } from "domspec";
import { Vector, RGB, Root, Rel } from "svgmotion";

test.test("Item", async (t) => {
    const anim = new Root();
    // anim.view.owner_viewport()
    // await anim.load_svg("res/viewport.svg");
    t.end();
});
