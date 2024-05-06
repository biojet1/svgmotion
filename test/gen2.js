

import { Doc, Track, Step } from "svgmotion";
export async function animate(lib) {
    const doc = new Doc();
    const tr = new Track();
    await doc.load_svg("../../python/flottie/example/res/thank_you_tp.svg");
    console.log(doc);
    const p = doc.view.first_child().first_child().first_child();

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
        ));

    return doc;

}