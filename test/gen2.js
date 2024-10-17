

import { Root, Rel } from "svgmotion";
export async function animate(lib) {
    const root = await Root.load_svg("../../python/flottie/example/res/thank_you_tp.svg");
    console.warn(root);
    const p = root.view.first_child().first_child().first_child();
    const R = p.transform.rotation;
    root.at(0).run(
        Rel(0).to(R, 0)
            .d(1).to(R, 10)
            .d(1).to(R, -5)
            .d(1).to(R, 5)
            .d(1).to(R, 0)
    );
    return root;
}