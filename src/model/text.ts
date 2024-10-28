import { Node } from "../tree/linked3.js";
import { Chars } from "./base.js";
import { LengthXValue, LengthYValue, TextValue } from "./value.js";
import { Container } from "./containers.js";

export class Content extends Container {
    add_chars(text: string, before?: Node) {
        const n = new Chars();
        n.content.set_value(text);
        this.insert_before(before, n);
    }
    add_content(before?: Node) {
        const n = new Chars();
        this.insert_before(before, n);
        return n;
    }
}
export class Text extends Content {
    static override tag = "text";
    //
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get dx() { return this._new_field("dx", new LengthXValue(0)); }
    get dy() { return this._new_field("dy", new LengthYValue(0)); }
}

export class TSpan extends Text {
    static override tag = "tspan";
}

export class Style extends Content {
    static override tag = "style";
    get type() { return this._new_field("type", new TextValue('text/css')); }
}
