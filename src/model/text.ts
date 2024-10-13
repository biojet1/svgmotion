import { Node } from "./linked.js";
import { TextData } from "./base.js";
import { LengthXValue, LengthYValue } from "./value.js";
import { Container } from "./containers.js";

export class Text extends Container {
    static override tag = "text";
    //
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get dx() { return this._new_field("dx", new LengthXValue(0)); }
    get dy() { return this._new_field("dy", new LengthYValue(0)); }
    ///
    add_chars(text: string, before?: Node) {
        const n = new TextData();
        // n.data = text;
        n.content.set_value(text);
        this.insert_before(before ?? this._end, n);
    }
    add_content(before?: Node) {
        const n = new TextData();
        this.insert_before(before ?? this._end, n);
        return n;
    }
}
export class TSpan extends Text {
    static override tag = "tspan";
}

