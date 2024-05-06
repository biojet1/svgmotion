import { Root, Step, NVector } from "svgmotion";
export async function animate(lib) {
    const anim = new Root();
    const tr = anim.track();
    await anim.load_svg("test/shapes.svg");

    const maru1 = anim.get_circle("maru");
    const maru2 = anim.get_circle("maru2");
    const r2 = anim.get_rect("r2");

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
    anim.track().feed(
        Step([{ dur: 1, Y: 100, X: 100 }], {
            X: maru2.cx,
            Y: maru2.cy,
        })
    );
    return anim;
}
