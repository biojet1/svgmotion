"uses strict";
import test from "tap";
import { sax_parse_svg, sax_load_svg_src } from "../dist/model/mixins/parse_xml.js";

// test.test("sax_parse_svg", async (t) => {
//   const anim = new Root();
//   const res = await sax_parse_svg(anim, `<?xml version="1.0" standalone="no"?>
// <svg width="10cm" height="3cm" viewBox="0 0 1000 300"     xmlns="http://www.w3.org/2000/svg" version="1.1">
//   <g font-family="Verdana" font-size="64" >
//     <text x="100" y="180" fill="blue" >
//         But you
//         <tspan dx="2em" dy="-50" font-weight="bold" fill="red" >
//           are
//         </tspan>
//         <tspan dy="100">
//           a peach!
//         </tspan>
//     </text>
//   </g>
// </svg>
//         `);
//   t.end();
// });

test.test("sax_load_svg_src", async (t) => {
  const dom = await sax_load_svg_src("res/the_quick.svg")
  // console.dir(dom, { depth: 110 });
  const fs = await import('fs/promises');
  const h = await fs.open('/tmp/the_quick.dom.json', 'w');
  await h.write(JSON.stringify(dom));
  t.end();
});

// test.test("sax_load_svg_src 2", async (t) => {
//   const dom = await sax_parse_svg(`
// <svg width="10cm" height="3cm" viewBox="0 0 1000 300"     xmlns="http://www.w3.org/2000/svg" version="1.1">
//   <tspan dx="2em" dy="-50" font-weight="bold" fill="red" >
//     are
//   </tspan>
//   <tspan dy="100">
//     a peach!
//   </tspan>
// </svg>`);
//   console.dir(dom, { depth: 110 });
//   t.end();
// });