"uses strict";
import test from "tap";
import { sax_parse_svg, sax_load_svg_src } from "../dist/helper/from_dom.js";
import { FEGaussianBlur, Element, Root, To, Filter } from "svgmotion";

test.test("sax_load_svg_src", async (t) => {
    const anim = new Root();
    let f = anim.def_filter();
    t.ok(f instanceof Filter);
    t.ok(f instanceof Element);
    const gb = new FEGaussianBlur();
    f.append_child(gb);
    // console.dir(f);
    let d = anim.dump();
    t.same(d.defs[f.id].id, f.id);
    t.same(d.defs[f.id].tag, 'filter');
    // console.dir(d, { depth: 100 });

    t.end();
});

test.test("load_svg the_quick", async (t) => {
    const anim = new Root();
    await anim.load_svg("res/the_quick.svg");
    const { view } = anim;
    view.width.set_value(384);
    view.height.set_value(216);
    let the = view.get_group("The");
    let dog = view.get_group("dog");
    let fox = view.get_group("fox");
    let quick = view.get_group("quick");
    let lazy = view.get_group("lazy");
    let bb = view.bbox_of(0, dog, the);

    const tr = anim.at(0);

    let f = anim.def_filter();
    const gb = new FEGaussianBlur();
    f.append_child(gb);
    gb.std_dev.set_value(2);


    dog.filter.set_value(`url(#${f.id})`);



    tr.run(To(gb.std_dev, [0.5, 0.5]));
    tr.run(To(gb.std_dev, 4));
    tr.run(To(gb.std_dev, [0, 0]));

    anim.save_json('/tmp/the_quick_ef.json');
    anim.save_html('/tmp/the_quick_ef.html');
    // {
    //     const A = new Root();
    //     await A.load_json("/tmp/the_quick_ef.json");
    //     A.save_json('/tmp/the_quick_ef_2.json');
    // }
    t.end();
});