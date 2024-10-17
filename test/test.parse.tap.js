"uses strict";
import test from "tap";
import { Root, Rel } from "svgmotion";

test.test("_load_svg polygon01", async (t) => {
    const root = await Root.load_svg("res/polygon01.svg");
    const tr = root.at(0);
    // console.warn(root.view);
    const pg1 = root.get_polygon(1);
    const c = root.view.add_circle({ r: 60, cx: 850, cy: 200, fill: { color: 'pink' } });
    // console.dir(pg1.points.get_repr());
    // pg1.anchor.key_value(0, [850, 200]);
    pg1.transform.add_translate(850, 200);
    const R = pg1.transform.add_rotate();
    const S = pg1.transform.add_scale();
    pg1.transform.add_translate(-850, -200);
    tr.run(
        Rel(0).to(R, 10)
            .d(1).to(R, -20).to(S, [1, 1])
            .d(1).to(R, 30).to(S, [2, 2])
            .d(1).to(R, -30).to(S, [1, 1])
            .d(1).first(R)
    );
    // console.dir(root.dump(), { depth: 100 });
    root.save_html("/tmp/ts-polygon01.html");
    t.end();
});
test.test("ts-tspan", async (t) => {
    const root = await Root.parse_svg(`<?xml version="1.0" standalone="no"?>
<svg width="10cm" height="3cm" viewBox="0 0 1000 300"     xmlns="http://www.w3.org/2000/svg" version="1.1">
  <g font-family="Verdana" font-size="64" >
    <text x="100" y="180" fill="blue" >
        But you
        <tspan dx="2em" dy="-50" font-weight="bold" fill="red" >
          are
        </tspan>
        <tspan dy="100">
          a peach!
        </tspan>
    </text>

  </g>
</svg>
        `)
    const d1 = root.dump();
    // console.dir(d1, { depth: 100 })
    {
        const root2 = await Root.load(d1);
        const d2 = root2.dump();
        {
            const fs = await import('fs/promises');
            const h = await fs.open('/tmp/parse1.json', 'w');
            await h.write(JSON.stringify(d1));
            await h.close();
        }
        {
            const fs = await import('fs/promises');
            const h = await fs.open('/tmp/parse2.json', 'w');
            await h.write(JSON.stringify(d2));
            await h.close();
        }
        // console.dir(d2, { depth: 100 })
        t.match(d2, d1)
        root2.view.id = "q"
        t.same(root2.view.id, "q")
        const d3 = root2.dump();
        t.same(d3.view.id, "q");
    }
    const ts = root.get_tspan(0);
    const g = root.get_group(0);
    const c = ts.get_chars(0).content;
    // console.dir(ts.dx);
    console.warn(`get_font_size ${ts.get_font_size()}`);

    console.warn(ts.dx.get_value(0), ts.dx.value, ts.dx.constructor.name, ts.dx.initial_value())
    t.same(ts.dx.get_value(0), 2 * 64)
    root.at(0).run(Rel(1).to(ts.dx, -50).at(2).to(ts.dx, 50));
    root.at(0).run(Rel(0).to(c, 'A').at(0.5).to(c, 'B').at(1).to(c, 'C'));
    // root.at(0).run(Rel(0).to(ts.dx, -50).at(1).to(ts.dx, 50));
    // root.calc_time_range();
    // console.dir(c, { depth: 100 })
    // {
    //     const im = root.view.add_image(g);
    //     const src = `/mnt/C1/media/Tabby_cat_with_blue_eyes-3336579.jpg`;
    //     await im.image_blob(src);
    //     im.href.set_value(`file://${src}`);
    //     im.x.set_value(5);
    //     im.y.set_value(5);
    // }
    // console.dir(im.href, { depth: 100 })
    root.save_json('/tmp/ts-tspan.json')
    root.save_html('/tmp/ts-tspan.html');
    {
        const poly = root.view.add_polygon();
        console.warn('marker_start', poly.marker_start.get_value(0));
        poly.marker_start.set_value("lorem")
        console.warn('marker_start', poly.marker_start.get_value(0));
        poly.marker_start.set_value("ipsum")
        console.warn('marker_start', poly.marker_start.get_value(0));
    }
    t.end();
});
