import { BoundingBox, Matrix } from "../geom/index.js";
import { TextValue, LengthXValue, LengthYValue } from "./value.js";
import { ViewBox } from "./valuesets.js";
import { Container, Defs } from "./containers.js";



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
    override update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {
        const width = this.width.get_value(frame);
        const height = this.height.get_value(frame);
        const x = this.x.get_value(frame);
        const y = this.y.get_value(frame);
        if (width && height) {
            let b = BoundingBox.rect(x, y, width, height);
            if (m) {
                b = b.transform(m);
            }
            bbox.merge_self(b);
        }
    }
    ///
    override cat_transform(frame: number, n: Matrix) {
        if (Object.hasOwn(this, "view_box")) {
            let w = this.width.get_value(frame);
            let h = this.height.get_value(frame);
            if (w && h) {
                const x = this.x.get_value(frame);
                const y = this.y.get_value(frame);
                let [vx, vy] = this.view_box.position.get_value(frame);
                let [vw, vh] = this.view_box.size.get_value(frame);
                const fv = this.view_box.fit.get_value(frame);
                (vx == null || isNaN(vx)) && (vx = x);
                (vy == null || isNaN(vy)) && (vy = y);
                (vw == null || isNaN(vw)) && (vw = w);
                (vh == null || isNaN(vh)) && (vh = h);
                if (vw && vh) {
                    const [tx, ty, sx, sy] = viewbox_transform(
                        x,
                        y,
                        w,
                        h,
                        vx,
                        vy,
                        vw,
                        vh,
                        fv
                    );
                    n.cat_self(Matrix.translate(tx, ty).scale(sx, sy));
                }
            }
        }
    }
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


export function viewbox_transform(
    e_x: number,
    e_y: number,
    e_width: number,
    e_height: number,
    vb_x: number,
    vb_y: number,
    vb_width: number,
    vb_height: number,
    aspect?: string | null
) {
    // https://svgwg.org/svg2-draft/coords.html#ComputingAViewportsTransform
    //  Let align be the align value of preserveAspectRatio, or 'xMidYMid' if preserveAspectRatio is not defined.
    let [align = "xmidymid", meet_or_slice = "meet"] = aspect
        ? aspect.toLowerCase().split(" ")
        : [];
    // Initialize scale-x to e-width/vb-width.
    let scale_x = e_width / vb_width;
    // Initialize scale-y to e-height/vb-height.
    let scale_y = e_height / vb_height;
    // If align is not 'none' and meetOrSlice is 'meet', set the larger of scale-x and scale-y to the smaller.
    if (align != "none" && meet_or_slice == "meet") {
        scale_x = scale_y = Math.min(scale_x, scale_y);
    } else if (align != "none" && meet_or_slice == "slice") {
        // Otherwise, if align is not 'none' and v is 'slice', set the smaller of scale-x and scale-y to the larger
        scale_x = scale_y = Math.max(scale_x, scale_y);
    }
    // Initialize translate-x to e-x - (vb-x * scale-x).
    let translate_x = e_x - vb_x * scale_x;
    // Initialize translate-y to e-y - (vb-y * scale-y)
    let translate_y = e_y - vb_y * scale_y;
    // If align contains 'xMid', add (e-width - vb-width * scale-x) / 2 to translate-x.
    if (align.indexOf("xmid") >= 0) {
        translate_x += (e_width - vb_width * scale_x) / 2.0;
    }
    // If align contains 'xMax', add (e-width - vb-width * scale-x) to translate-x.
    if (align.indexOf("xmax") >= 0) {
        translate_x += e_width - vb_width * scale_x;
    }
    // If align contains 'yMid', add (e-height - vb-height * scale-y) / 2 to translate-y.
    if (align.indexOf("ymid") >= 0) {
        translate_y += (e_height - vb_height * scale_y) / 2.0;
    }
    //  If align contains 'yMax', add (e-height - vb-height * scale-y) to translate-y.
    if (align.indexOf("ymax") >= 0) {
        translate_y += e_height - vb_height * scale_y;
    }
    // translate(translate-x, translate-y) scale(scale-x, scale-y)
    return [translate_x, translate_y, scale_x, scale_y];
}
