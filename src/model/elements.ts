import { TextValue, LengthYValue, LengthXValue } from "./value.js";
import { Element, } from "./base.js";

export class Use extends Element {
    static override tag = "use";
    //
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get href() { return this._new_field("href", new TextValue('')); }
    //
}

export class Image extends Element {
    static override tag = "image";
    //
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get href() { return this._new_field("href", new TextValue('')); }
    get fit_view() { return this._new_field("fit_view", new TextValue('')); }
    get cross_origin() { return this._new_field("cross_origin", new TextValue('')); }
}
