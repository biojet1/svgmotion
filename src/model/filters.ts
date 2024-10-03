import { Element } from "./base.js";
import { VectorValue, BiVectorValue, LengthYValue, LengthXValue, TextValue } from "./value.js";

export class FilterElement extends Element {
}

export class FEGaussianBlur extends FilterElement {
    static override tag = "feGaussianBlur";
    ///   
    get std_dev() {
        return this._new_field("std_dev", new BiVectorValue([0, 0]));
    }
    set std_dev(v: BiVectorValue) {
        this._new_field("std_dev", v);
    }
    ///
    get edge_mode() {
        return this._new_field("edge_mode", new TextValue('duplicate'));
    }
    set edge_mode(v: TextValue) {
        this._new_field("edge_mode", v);
    }
    ///
    get in() {
        return this._new_field("in", new TextValue(''));
    }
    set in(v: TextValue) {
        this._new_field("in", v);
    }
}

export class FEDropShadow extends FilterElement {
    static override tag = "feDropShadow";
    ///
    get std_dev() {
        return this._new_field("std_dev", new VectorValue([0, 0]));
    }
    set std_dev(v: VectorValue) {
        this._new_field("std_dev", v);
    }
    ///
    get dx() {
        return this._new_field("dx", new LengthXValue(0));
    }
    set dx(v: LengthXValue) {
        this._new_field("dx", v);
    }
    ///
    get dy() {
        return this._new_field("dy", new LengthYValue(0));
    }
    set dy(v: LengthYValue) {
        this._new_field("dy", v);
    }
}
