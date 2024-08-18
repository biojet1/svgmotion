

import { Root, Rel } from "svgmotion";
export async function animate(lib) {
    const anim = new Root();
    await anim.load_svg("../../python/flottie/example/res/thank_you_tp.svg");
    console.log(anim);
    const p = anim.view.first_child().first_child().first_child();
    const R = p.transform.rotation;
    anim.at(0).run(
        Rel(0).to(R, 0)
            .d(1).to(R, 10)
            .d(1).to(R, -5)
            .d(1).to(R, 5)
            .d(1).to(R, 0)
    );
    return anim;
}