"uses strict";
import test from "tap";
import { Vector, RGB, Root, Rel, ZoomTo, Pass, Easing } from "svgmotion";

test.test("load_svg the_quick", async (t) => {
    const anim = new Root();
    await anim.load_svg("res/the_quick.svg");
    const { view } = anim;
    view.width.set_value(384);
    view.height.set_value(216);
    let the = view.get_group("The");
    let dog = view.get_group("dog");
    let quick = view.get_group("quick");
    let lazy = view.get_group("lazy");
    let bb = view.bbox_of(0, dog, the);
    // console.log(bb.dump_rect());

    {
        let r = view.add_rect();
        r.x.set_value(bb.x);
        r.y.set_value(bb.y);
        r.width.set_value(bb.width);
        r.height.set_value(bb.height);
        r.set_attributes({ "stroke": "red", "stroke-width": 1, "fill": "none" })
    }
    {
        let tr = the.transform.add_translate(20, 20);

        anim.at(0).run(Rel(.8).to(tr, [100, 100], { easing: Easing.sigmoid }).at(1).to(tr, [100, 10]));
    }
    const tr = anim.at(0);
    tr.run(Pass(1))
    const bbo = view.view_box.bbox();
    tr.run(ZoomTo(view, [lazy]))
    tr.run(ZoomTo(view, [dog], { margin: 50 }))
    tr.run(ZoomTo(view, [the]))
    tr.run(ZoomTo(view, [bbo]))
    // console.log(r.fill.color.value, r.fill.color.get_rgb_repr(0) + "", r.fill.color.get_value(0));
    // console.dir(r.fill);
    // r.fill.opacity.set_value(.4)
    anim.save_json('/tmp/the_quick.json')
    anim.save_html('/tmp/the_quick.html');
    t.end();
});
