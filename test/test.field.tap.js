"uses strict";
import test from "tap";
import { Root, Rel } from "svgmotion";

test.test("field 1", async (t) => {
    const anim = new Root();
    await anim.parse_svg(`<?xml version="1.0" standalone="no"?>
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

    {
        const poly = anim.view.add_polygon();
        t.same(poly.marker_start.get_value(0), "none");
        poly.marker_start.set_value("lorem");
        t.same(poly.marker_start.get_value(0), "lorem");
        poly.marker_start.set_value("ipsum");
        t.same(poly.marker_start.get_value(0), "ipsum");
    }
    {
        const c = anim.view.add_circle();
        t.same(c.r.get_value(0), 0);
        t.same(c.cx.get_value(0), 0);

    }

    t.end();
});
