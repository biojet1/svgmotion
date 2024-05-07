"uses strict";
import test from "tap";
import { SVGDocument, XMLSerializer } from "domspec";
import { NVector, RGB, Root, Step } from "svgmotion";
test.test("Item", async (t) => {
    const anim = new Root();
    const tr = anim.track();
    await anim.load_svg("../../python/flottie/example/res/thank_you_tp.svg");
    // console.log("doc", doc);
    {
        anim.view.fill.color.value = new RGB(1, 1, 0);
        const p = anim.view.first_child().first_child().first_child();

        // console.log("first_child", );

        tr.feed(
            Step(
                [
                    {
                        A: 0.25,
                        t: 0,
                        B: [50, 50],
                        C: [0.9, 0.1, 0.9],
                        R: 0,
                    },
                    { A: 0.9, dur: 1, B: [0, 50], C: [1, 1, 0], R: 10 },
                    {
                        A: 0.25,
                        dur: 1,
                        B: [50, 0],
                        C: [0, 1, 0],
                        R: -5,
                    },
                    { A: 0.9, dur: 1, B: [0, 0], C: [0, 0, 0], R: 5 },
                    {
                        A: 0.25,
                        dur: 1,
                        B: null,
                        C: [0.5, 0.5, 0.5],
                        R: 0,
                    },
                ],
                {
                    // X: r.opacity,
                    // B: r.position,
                    // C: r.fill.color,
                    R: p.transform.rotation,
                }
            )
        );
    }

    const nod = anim.to_dom(new SVGDocument());

    anim.update_dom(0);

    // console.log(`width`, nod.width.baseVal.value, nod.width.baseVal.unitType);
    const ser = new XMLSerializer();
    // console.log(ser.serializeToString(nod));
    console.log(anim.save_html("/tmp/svgm.html"));
    t.end();
});

test.test("Item", async (t) => {
    const anim = new Root();
    await anim.load_svg("res/polygon01.svg");
    const tr = anim.track();
    console.log(anim.view);

    const pg1 = anim.get_polygon(1);
    const c = anim.view.add_circle();
    c.r.set_value(0, 10);
    c.cx.set_value(0, 850);
    c.cy.set_value(0, 200);
    c.fill.color.set_value(0, "orange");
    pg1.transform.anchor.set_value(0, [850, 200]);

    tr.step(
        [
            { R: 10 },
            { R: -20, dur: 1, P: [50, 50], S: [1, 1] },
            { R: 30, dur: 1, S: [2, 2] },
            { R: -30, dur: 1, S: [1, 1] },
            { R: Step.first, P: Step.first, dur: 1 },
        ],

        {
            R: pg1.transform.rotation,
            //P: pg1.transform.position,
            S: pg1.transform.scale
        }
    );
    console.log(anim.save_html("/tmp/polygon01.html"));

    const nod = anim.to_dom(new SVGDocument());
    anim.update_dom(0);
    const ser = new XMLSerializer();
    console.log(ser.serializeToString(nod));

    t.end();
});
