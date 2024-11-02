"uses strict";
import test from "tap";
import { FEGaussianBlur, Element, Root, To, Filter } from "svgmotion";

test.test("add_filter", async (t) => {
    const root = new Root();
    let f = root.view.defs().add_filter();
    t.ok(f instanceof Filter);
    t.ok(f instanceof Element);
    const gb = new FEGaussianBlur();
    f.append_child(gb);
    let d = root.dump();
    t.end();
});

test.test("add_fe_gaussian_blur", async (t) => {
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

    const tr = root.at(0);

    let f = view.defs().add_filter();
    const gb = f.add_fe_gaussian_blur({ std_dev: 2 });

    dog.filter.set_value(`url(#${f.id})`);



    tr.run(To(gb.std_dev, [0.5, 0.5]));
    tr.run(To(gb.std_dev, 4));
    tr.run(To(gb.std_dev, [0, 0]));

    root.save_json('/tmp/ts-filter.json');
    root.save_html('/tmp/ts-filter.html');
    // {
    //     const A = new Root();
    //     await A.load_json("/tmp/the_quick_ef.json");
    //     A.save_json('/tmp/the_quick_ef_2.json');
    // }
    t.end();
});