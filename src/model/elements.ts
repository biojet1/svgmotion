import { BoundingBox, Matrix } from "../geom/index.js";
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
    //
    // override object_bbox(frame: number): BoundingBox {
    //     const width = this.width.get_value(frame);
    //     const height = this.height.get_value(frame);
    //     const left = this.x.get_value(frame);
    //     const top = this.y.get_value(frame);
    //     return BoundingBox.rect(left, top, width, height);
    // }
    // override update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {
    //     let w = this.transform.get_transform(frame);
    //     const bb = this.object_bbox(frame);
    //     m = m ? m.cat(w) : w;
    //     bbox.merge_self(bb.transform(m));
    // }
}
