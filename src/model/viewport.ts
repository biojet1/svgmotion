import { TextValue, LengthXValue, LengthYValue } from "./value.js";
import { ViewBox } from "./valuesets.js";
import { Container } from "./containers.js";
import { Defs } from "./elements.js";

export class ViewPort extends Container {
    static override tag = "svg";
    //
    get width() { return this._new_field("width", new LengthXValue('100%')); }
    get height() { return this._new_field("height", new LengthYValue('100%')); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
    get view_box() { return this._new_field("view_box", new ViewBox([0, 0], [100, 100])); }
    get zoom_pan() { return this._new_field("zoom_pan", new TextValue('disable')); }
    // 
    get defs(): Defs {
        for (let cur = this.first_child(); cur; cur = cur.next_sibling()) {
            if (cur instanceof Defs) {
                return cur;
            }
        }
        return this.add_defs();
    }
}

