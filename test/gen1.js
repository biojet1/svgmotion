import { Root, Step, Easing, Seq, To } from "svgmotion";
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
    delete r2.y;
    delete r2.x;
    maru1.r.set_value(20);
    r2.fill.opacity.set_value(1);
    console.log(
        "all in this 000",
        "all" in r2.transform,
        Object.hasOwn(r2.transform, "all")
    );
    const g2 = r2.g_wrap();
    r2.anchor.set_value([-30, -30]);
    console.log(
        "all in this 111",
        "all" in r2.transform,
        Object.hasOwn(r2.transform, "all")
    );
    tr.feed(
        Step(
            [
                { t: 0, R: [400, 400], C: "orange" },
                { t: 1, R: [250, 400], C: "grey", easing: Easing.inexpo },
                { t: 2, R: [100, 400], C: "red", easing: Easing.outexpo },
                { t: 3, R: [100, 250], C: "grey", easing: Easing.inexpo },
                { t: 4, R: [100, 100], C: "blue", easing: Easing.outexpo },
                { t: 5, R: [250, 100], C: "grey", easing: Easing.inexpo },
                { t: 6, R: [400, 100], C: "pink", easing: Easing.outexpo },
                { t: 7, R: [400, 250], C: "grey", easing: Easing.inexpo },
                { t: 8, R: [400, 400], C: "orange", easing: Easing.outexpo },

                // { t: 0.5, X: [2, 1], easing: Easing.inquart },
                // { t: 1, X: [1, 1], easing: Easing.outquart },
            ],
            {
                R: g2.transform.add_translate(),
                // X: r2.transform.scale,
            }
            // { easing: Easing.inoutquart }
        )
    );
    anim.track().feed(
        Step(
            [
                { t: 0, X: [1, 1], easing: Easing.linear, C: "blue" },
                { dur: 1, X: [2, 1], easing: Easing.inexpo, C: "grey" },
                { dur: 1, X: [1, 1], easing: Easing.outexpo, C: "green" },
                { dur: 1, X: [1, 2], C: "grey", easing: Easing.inexpo },
                { dur: 1, X: [1, 1], C: "red", easing: Easing.outexpo },
                { dur: 1, X: [2, 1], easing: Easing.inexpo, C: "grey" },
                { dur: 1, X: [1, 1], C: "violet", easing: Easing.outexpo },
                { dur: 1, X: [1, 2], C: "grey", easing: Easing.inexpo },
                { dur: 1, X: [1, 1], C: Step.first, easing: Easing.outexpo },
            ],
            {
                X: r2.transform.add_scale(),
                C: r2.fill.color,
            }
            // { easing }
        )
    );
    // console.log("all in this", "all" in r2.transform, Object.hasOwn(r2.transform, "all"));
    // console.log("TR", r2.transform, r2.transform.dump());
    delete e1.cy;
    delete e1.cx;
    const mov = e1.transform.add_translate();
    anim.track().feed(
        Step(
            [
                { P: [100, 100] },
                { dur: 1, P: [400, 100] },
                { dur: 1, P: [400, 400] },
                { dur: 1, P: [100, 400] },
                { dur: 1, P: [100, 100] },
            ],
            {
                P: mov,
            },
            { easing: Easing.inoutback }
        )
    );
    // mov.repeat_count = 66666666666;
    mov.repeat(1, true);
    // console.log(mov.dump());
    anim.track().feed(
        Step(
            [
                { t: 0, EX: 40, EY: 40, easing: Easing.linear },
                { dur: 1, EY: 10, easing: Easing.linear },
                { dur: 1, EX: 40, EY: 40, easing: Easing.linear },
                { dur: 1, EX: 10, EY: 10 },
                { dur: 1, EX: 40, EY: 40 },
                // { dur: 1, EX: 40, EY: 40 },
            ],
            {
                EY: e1.ry,
                EX: e1.rx,
            },
            { easing: true }
        )
    );

    {
        const S = maru1.transform.add_translate();
        anim.track(1).feed(
            Step(
                [
                    { t: 0, S: [0, 0] },
                    { dur: 0.5, S: [100, 100] },
                    { dur: 0.5, S: [200, 200] },
                    { dur: 0.5, S: [300, 300] },
                    { dur: 0.5, S: [400, 400] },
                ],
                {
                    S,
                }
            )
        );
        // S.repeat(-1, true);
        // S.get_value(1000);
        // console.log(S.dump());
        // S.load(S.dump())
        console.log(S.dump());
    }
    {
        const pos = maru2.transform.add_translate();
        const CO = maru2.fill.color;
        anim.track().feed(
            Step(
                [
                    { t: 0, CO: "yellow" },
                    { dur: 1, CO: "blue" },
                    { dur: 1, CO: "red" },
                ],
                {
                    CO,
                }
            )
        );
        CO.repeat(66666666666, true);

        const tr = anim.track();
        tr.run(
            Seq([
                To(pos, [-200, -100], {
                    curve: [
                        [100, -200],
                        [30, 40],
                    ],
                }),
                To(pos, [-0, -0], {
                    curve: [
                        [30, -30],
                        [-30, 30],
                    ],
                }),
                Step(
                    [
                        // { t: 0, pos: [-50, -50] },
                        {
                            dur: 0.5, pos: [-10, -135], curve: [
                                [30, -30],
                                [-30, 30],
                            ]
                        },
                    ],

                    { pos }
                )]
            )
        );

        console.log(pos.kfs);
    }

    // console.log(r2.transform.dump());
    // console.log(r2.transform.get_transform_repr());

    return anim;
}
