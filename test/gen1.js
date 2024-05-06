import { Root, Step, NVector, Easing } from "svgmotion";
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
    r2.transform.anchor.value = new NVector([30, 30]);
    tr.feed(
        Step(
            [
                { t: 0, R: [400, 400], S: [1, 1], K: 0, A: 0 },
                { dur: 1, S: [2, 1], K: 30, A: 90 },
                { dur: 1, R: [100, 400], S: [1, 1], K: 0, A: 90 },
                { dur: 1, S: [1, 2], K: 30, A: 90 },
                { dur: 1, R: [100, 100], S: [1, 1], K: 0, A: 0 },
                { dur: 1, S: [2, 1] },
                { dur: 1, R: [400, 100], S: [1, 1] },
                { dur: 1, S: [1, 2] },
                { dur: 1, R: [400, 400], S: [1, 1] },
                // { dur: 1, R: null, S: null },
            ],
            {
                // X: r.opacity,
                // B: r.position,
                S: r2.transform.scale,
                R: r2.transform.position,
                K: r2.transform.skew,
                A: r2.transform.skew_axis
            }
        )
    );
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
        }, { easing: Easing.inoutexpo })
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
    console.log(e1.ry.value);

    return anim;
}
