import { BoundingBox } from "../../geom/bbox.js";
import { Matrix } from "../../geom/matrix.js";
import { Image } from "../elements.js";

Image.prototype.object_bbox = function (frame: number): BoundingBox {
    const width = this.width.get_value(frame);
    const height = this.height.get_value(frame);
    const left = this.x.get_value(frame);
    const top = this.y.get_value(frame);
    return BoundingBox.rect(left, top, width, height);
}

Image.prototype.update_bbox = function (bbox: BoundingBox, frame: number, m?: Matrix) {
    let w = this.transform.get_transform(frame);
    const bb = this.object_bbox(frame);
    m = m ? m.cat(w) : w;
    bbox.merge_self(bb.transform(m));
}