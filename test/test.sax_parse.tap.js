"uses strict";
import test from "tap";
import { sax_parse_svg } from "../dist/helper/from_dom.js";
import { Vector, RGB, Root, Rel } from "svgmotion";

test.test("sax_parse_svg", async (t) => {
  const anim = new Root();
  const res = await sax_parse_svg(anim, `<?xml version="1.0" standalone="no"?>
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
        `);
  console.dir(res, { depth: 110 });
  t.end();
});
