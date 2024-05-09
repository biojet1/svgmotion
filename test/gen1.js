import { Root, Step, Par, NVector, Easing } from "svgmotion";
export async function animate(lib) {
    const sigm = new Easing(1 / 3, 0, 1 - 1 / 3, 1);
    const anim = new Root();
    const tr = anim.track();
    await anim.load_svg("test/shapes.svg");
    const maru1 = anim.get_circle("maru");
    const maru2 = anim.get_circle("maru2");
    const r2 = anim.get_rect("r2");
    const e1 = anim.get_ellipse(0);
    delete maru1.cx;
    delete maru1.cy;
    maru1.r.value = 20;
    r2.fill.opacity.value = 1;
    r2.transform.anchor.value = new NVector([30, 30]);
    tr.feed(
        Step(
            [
                { t: 0, R: [400, 400], C: 'red' },
                { t: 0.5, R: [250, 400], C: 'blue', ease: Easing.inexpo },
                { t: 1, R: [100, 400], C: 'blue', ease: Easing.outexpo },
                { t: 2, R: [100, 100], C: 'orange' },
                { t: 3, R: [400, 100], C: 'pink' },
                { t: 4, R: [400, 400], C: 'green' },

                { t: 0.5, X: [2, 1], ease: Easing.inquart },
                { t: 1, X: [1, 1], ease: Easing.outquart },
            ],
            {
                R: r2.transform.position, X: r2.transform.scale,
            },
            // { easing: Easing.inoutquart }
        )
    );
    // anim.track(0).feed(
    //     Step(
    //         [
    //             { t: 0, X: [1, 1], ease: Easing.linear, C: 'red' },
    //             { dur: 0.5, X: [2, 1], ease: Easing.linear, C: 'blue' },
    //             { dur: 0.5, X: [1, 1], ease: Easing.linear, C: 'orange' },
    //             { dur: 0.5, X: [1, 2], C: 'pink' },
    //             { dur: 0.5, X: [1, 1], C: 'green' },
    //             { dur: 0.5, X: [2, 1], ease: Easing.linear, C: 'wheat' },
    //             { dur: 0.5, X: [1, 1], C: 'grey' },
    //             { dur: 0.5, X: [1, 2], C: 'yellow' },
    //             { dur: 0.5, X: [1, 1], C: Step.first },
    //         ],
    //         {
    //             X: r2.transform.scale,
    //             C: r2.fill.color
    //         },
    //         // { easing }
    //     )
    // );

    console.log("TR", r2.transform);
    delete e1.cy;
    delete e1.cx;
    anim.track().feed(
        Step([
            { P: [100, 100] },
            { dur: 1, P: [400, 100] },
            { dur: 1, P: [400, 400] },
            { dur: 1, P: [100, 400] },
            { dur: 1, P: [100, 100] },
        ], {
            P: e1.transform.position,
        }, { easing: Easing.inoutback })
    );
    anim.track().feed(
        Step([
            { t: 0, EX: 40, EY: 40, ease: Easing.linear },
            { dur: 1, EY: 10, ease: Easing.linear },
            { dur: 1, EX: 40, EY: 40, ease: Easing.linear },
            { dur: 1, EX: 10, EY: 10 },
            { dur: 1, EX: 40, EY: 40 },
            // { dur: 1, EX: 40, EY: 40 },
        ], {
            EY: e1.ry,
            EX: e1.rx,
        }, { easing: true })
    );
    console.log(r2.transform);

    return anim;
}
