

import { Doc } from "svgmotion";
export async function animate(lib) {
    const doc = new Doc();
    await doc.load_svg("../../python/flottie/example/res/thank_you_tp.svg");
    return doc;

}