import { Vector } from "../geom/index.js";
import { ScalarValue, TextValue } from "./value.js";
import { xget, Box, xset } from "./valuesets.js";
import { Container, ViewPort } from "./elements.js";
import { Element } from "./baseprops.js";
declare module "./baseprops" {
    interface Element {
        owner_viewport(): void;
    }
}

Element.prototype.owner_viewport = function () {
    //  nearest ancestor ‘svg’ element. 
    for (const a of this.ancestors()) {
        if (a instanceof ViewPort) {
            return a;
        }
    }
}
