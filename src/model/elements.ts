import { BoundingBox, Matrix } from "../geom/index.js";
import { TextValue, LengthYValue, LengthXValue } from "./value.js";
import { Element, } from "./base.js";

export class Use extends Element {
    static override tag = "use";
}

export class Image extends Use {
    static override tag = "image";
    //
    get fit_view() {
        return this._new_field("fit_view", new TextValue(""));
    }
    set fit_view(v: TextValue) {
        this._new_field("fit_view", v);
    }
    //
    override object_bbox(frame: number): BoundingBox {
        const width = this.width.get_value(frame);
        const height = this.height.get_value(frame);
        const left = this.x.get_value(frame);
        const top = this.y.get_value(frame);
        return BoundingBox.rect(left, top, width, height);
    }
    override update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {
        let w = this.transform.get_transform(frame);
        const bb = this.object_bbox(frame);
        m = m ? m.cat(w) : w;
        bbox.merge_self(bb.transform(m));
    }
}


