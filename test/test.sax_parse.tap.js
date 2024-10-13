"uses strict";
import test from "tap";
import { sax_parse_svg, sax_load_svg_src } from "../dist/model/mixins/parse_xml.js";

test.test("sax_load_svg_src", async (t) => {
  const dom = await sax_load_svg_src("res/the_quick.svg")
  // console.dir(dom, { depth: 110 });
  const fs = await import('fs/promises');
  const h = await fs.open('/tmp/the_quick.dom.json', 'w');
  await h.write(JSON.stringify(dom));
  t.end();
});
