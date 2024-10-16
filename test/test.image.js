"uses strict";
import test from "tap";
import { Root, Rel } from "svgmotion";
import { Matrix, BoundingBox, Pass, Easing } from "svgmotion";
import * as svgm from "svgmotion";


test.test("ts-image", async (t) => {
    const root = await Root._parse_svg(`<?xml version="1.0" standalone="no"?>
<svg width="200" height="200" viewBox="0 0 600 600"     xmlns="http://www.w3.org/2000/svg" version="1.1">
<svg  id="imvp" x="0" width="200" height="200"  viewBox="100 0 200 200" >
  <image href="file:///mnt/C1/media/Tabby_cat_with_blue_eyes-3336579.jpg"/>
    <rect width="464" fill="none" stroke="red" height="558"/>
</svg>
  <image opacity=".3" transform="skewX(45)" href="file:///mnt/C1/media/Tabby_cat_with_blue_eyes-3336579.jpg"/>

 <rect id="r1" fill="none" stroke="blue" data-rect="12"/>
</svg>

        `);

    const tr = root.track;
    const imvp = root.get_view("imvp");
    const p = imvp.view_box.position;
    const g = imvp.g_wrap();

    {
        const bb = imvp.bounding_box(0);
        const r1 = root.get_rect("r1");
        r1.x.set_value(bb.left);
        r1.y.set_value(bb.top);
        r1.width.set_value(bb.width);
        r1.height.set_value(bb.height);
    }

    tr.run(Rel(0).by(p, [0, 0])
        .at(1).by(p, [100, 0])
        .at(2).by(p, [100, 100])
        .at(3).by(p, [0, 100])
    );

    tr.run(svgm.StretchOut(g, { dir: "down" }))

    tr.run(Pass(0.4));
    tr.run(svgm.FadeIn([g], { easing: Easing.inoutexpo }))
    tr.run(Rel(1).by(p, [200, 200]));
    tr.run(svgm.FadeOut([g]));
    tr.run(Pass(0.4));

    root.save_json('/tmp/image.json')
    root.save_html('/tmp/image.html');
    t.end();
});
