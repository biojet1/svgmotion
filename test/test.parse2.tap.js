"uses strict";
import test from "tap";
import { Root, Rel, ZoomTo, Pass, Easing, AlignTo } from "svgmotion";

test.test("_load_svg the_quick", async (t) => {
    const root = await Root.load_svg("res/the_quick.svg");
    const { view } = root;
    view.width.set_value(384);
    view.height.set_value(216);
    let the = view.get_group("The");
    let dog = view.get_group("dog");
    let fox = view.get_group("fox");
    let quick = view.get_group("quick");
    let lazy = view.get_group("lazy");
    let bb = view.bbox_of(0, dog, the);
    // console.warn(bb.dump_rect());

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

        root.at(0).run(Rel(.8).to(tr, [100, 100], { easing: Easing.sigmoid }).at(1).to(tr, [100, 10]));
    }
    const tr = root.at(0);
    tr.run(Pass(1))
    const bbo = view.view_box.bbox();
    tr.run(ZoomTo(view, [lazy]))
    tr.run(ZoomTo(view, [dog], { margin: 50 }))
    tr.run(ZoomTo(view, [the]))
    tr.run(ZoomTo(view, [bbo]))
    tr.run(AlignTo(view, fox, [the, dog], { v: 'bb', easing: Easing.inoutback }))

    {
        tr.run(Rel(0.5).by(view.view_box.position, [100, 0]).at(1).by(view.view_box.position, [-100, 0]))
    }




    // console.warn(r.fill.color.value, r.fill.color.get_rgb_repr(0) + "", r.fill.color.get_value(0));
    // console.dir(r.fill);
    // r.fill.opacity.set_value(.4)
    root.save_json('/tmp/the_quick.json')
    root.save_html('/tmp/the_quick.html');
    t.end();
});
