"uses strict";
import test from "tap";
import { SVGDocument, XMLSerializer } from "domspec";
import { Vector, RGB, Root, Rel } from "svgmotion";

test.test("load_svg the_quick", async (t) => {
    const anim = new Root();
    await anim.load_svg("res/the_quick.svg");
    const { view } = anim;
    view.width.set_value(384);
    view.height.set_value(216);
    let the = view.get_group("The");
    let bb = view.bbox_of(0, the);
    console.log(bb.dump_rect());

    let r = view.add_rect();
    r.x.set_value(bb.x);
    r.y.set_value(bb.y);
    r.width.set_value(bb.width);
    r.height.set_value(bb.height);
    // r.stroke.width.set_value(1);
    // r.stroke.color.set_value("red");
    r.fill.color.set_value("none")
    r.set_attributes({
        "stroke": "red",
        "stroke-width": 1,
    })
    // console.log(r.fill.color.value, r.fill.color.get_rgb_repr(0) + "", r.fill.color.get_value(0));
    // console.dir(r.fill);

    // r.fill.opacity.set_value(.4)
    // anim.save_json('/tmp/the_quick.json')
    anim.save_html('/tmp/the_quick.html');
    t.end();
});
