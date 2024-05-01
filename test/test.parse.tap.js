"uses strict";
import test from "tap";
import { SVGDocument, XMLSerializer } from "domspec";
import { parse_svg } from "../dist/model/from_dom.js";
import { RGB, } from "../dist/index.js";
test.test("Item", (t) => {

    parse_svg("../../python/flottie/example/res/thank_you_tp.svg").then((root) => {
        // console.log("root", root);
        // for (let [n, v] of Object.entries(root)) {
        //     //  console.log("---", n, v);
        // }

        const doc = new SVGDocument();
        const nod = root.to_dom(doc);
        // console.log(`width`, nod.width.baseVal.value, nod.width.baseVal.unitType);
        // console.log(root.prop5);
        root.viewport.fill.color.value = new RGB(1, 1, 0);
        root.update_dom(0);

        // console.log(`width`, nod.width.baseVal.value, nod.width.baseVal.unitType);
        const ser = new XMLSerializer();
        console.log(ser.serializeToString(nod));
    });

    t.end();

});
