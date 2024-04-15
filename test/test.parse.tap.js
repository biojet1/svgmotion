"uses strict";
import test from "tap";
import { parse_svg } from "../dist/parse.js";

test.test("Item", (t) => {

    parse_svg("../../python/flottie/example/res/thank_you_tp.svg");

    t.end();

});
