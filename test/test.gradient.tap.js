"uses strict";
import test from "tap";
import { Root, Rel, Add } from "svgmotion";


test.test("linearGradient", async (t) => {
  const root = await Root.parse_svg(`<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg"
     version="1.1"
     width="300"
     viewBox="0 0 300 200" >

  <title>Example lingrag01</title>
  <desc>Fill a rectangle using a linear-gradient paint server.</desc>

  <defs>
    <linearGradient id="MyGradient">
      <stop offset="5%" stop-color="#A8F" />
      <stop offset="95%" stop-color="#FDC" />
    </linearGradient>
  </defs>

  <!-- The rectangle is filled using a linear-gradient paint server -->
  <rect fill="url(#MyGradient)"
	stroke="black"
	stroke-width="2"
	x="25" y="25" width="250" height="150"/>
</svg> `)
  const d1 = root.dump();
  const t1 = root.track.sub();
  const lg1 = root.get_linear_gradient();
  const st1 = lg1.get_stop(0);
  const st2 = lg1.get_stop(1);
  root.at(0).run(Rel(0).to(st1.stop_color, "blue").at(0.5)
    .to(st1.stop_color, "green").at(1)
    .to(st1.stop_color, "grey"))
  root.at(0).run(Rel(0).to(st2.stop_color, "grey").at(0.5)
    .to(st2.stop_color, "red").at(1)
    .to(st2.stop_color, "blue"))
  t1.run(Add(st1.offset, .3), Add(st2.offset, -.4))
  t1.run(Add(st1.offset, -.2), Add(st2.offset, .1))
  root.save_json('/tmp/ts-linearGradient.json')
  root.save_html('/tmp/ts-linearGradient.html');
  root.view.add_circle({ fill: { color: 'none' } })
  t.end();
});
