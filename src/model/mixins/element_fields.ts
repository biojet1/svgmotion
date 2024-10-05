import { Polygon } from "../shapes.js";
import { TextValue } from "../value.js";

declare module "../index" {
    interface Polygon {
        get marker_start(): TextValue;
        // set marker_start(v: TextValue);
    }
}

// Polygon.prototype.marker_start = function () {
//     return this._new_field("marker_start", new TextValue("none"));
// }
Object.defineProperty(Polygon.prototype, "marker_start", {
    get: function () {
        return this._new_field("marker_start", new TextValue("none"));
    },
});
// Polygon.prototype.marker_start = function (v: TextValue) {
//     this._new_field("marker_start", v);
// }