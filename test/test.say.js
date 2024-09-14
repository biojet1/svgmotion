"uses strict";
import test from "tap";
import { Matrix, Vector, BoundingBox, Root, Rel, ZoomTo, Pass, Easing, Par } from "svgmotion";
import * as svgmo from "svgmotion";


test.test("Say the_quick", async (t) => {
    const anim = new Root();
    await anim.load_svg("res/the_quick.svg");
    const { view } = anim;
    view.width.set_value(384);
    view.height.set_value(216);
    let the = view.get_group("The");
    let dog = view.get_group("dog");
    let fox = view.get_group("fox");
    let quick = view.get_group("quick");
    let jumps = view.get_group("jumps");
    let brown = view.get_group("brown");
    let lazy = view.get_group("lazy");
    let the2 = view.get_group("the");
    let over = view.get_group("over");
    let bb = view.bbox_of(0, dog, the);
    // console.log(bb.dump_rect());

    const tr = anim.at(0);
    const voc = new svgmo.WatsonTTS();
    tr.run(svgmo.Bounce(dog));
    tr.run(svgmo.Audio(await voc.say(`Hello`)));

    tr.run(Par([svgmo.Bounce(brown), svgmo.Audio(await voc.say(`Goodbye`))]));

    tr.run(svgmo.Bounce(the));


    anim.save_json('/tmp/say.json')
    anim.save_html('/tmp/say.html');
    t.end();
});
