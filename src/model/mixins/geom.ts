import { BoundingBox } from "../../geom/bbox.js";
import { Matrix } from "../../geom/matrix.js";
import { PathLC } from "../../geom/path/pathlc.js";
import { Element } from "../base.js";
import { Container } from "../containers.js";
import { Image } from "../elements.js";
import { Circle, Ellipse, Line, Path, Polygon, Polyline, Rect, Shape } from "../shapes.js";
import { ViewPort } from "../viewport.js";

Container.prototype.update_bbox = function
    (bbox: BoundingBox, frame: number, m?: Matrix) {
    let w = this.transform.get_transform(frame);
    m = m ? m.cat(w) : w;
    for (const x of this.children<Element>()) {
        x.update_bbox(bbox, frame, m);
    }
}

Container.prototype.object_bbox = function (frame: number) {
    const bb = BoundingBox.not();
    for (const x of this.children<Element>()) {
        const m = x.transform_under(frame, this);
        x.update_bbox(bb, frame, m);
    }
    return bb;
}

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



ViewPort.prototype.update_bbox = function (bbox: BoundingBox, frame: number, m?: Matrix) {
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

ViewPort.prototype.cat_transform = function (frame: number, n: Matrix) {
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

Path.prototype.describe = function (frame: number) {
    return this.d.get_value(frame);
}

Rect.prototype.describe = function (frame: number) {
    const width = this.width.get_value(frame);
    const height = this.height.get_value(frame);
    const left = this.x.get_value(frame);
    const top = this.y.get_value(frame);
    const rx = this.rx.get_value(frame);
    const ry = this.ry.get_value(frame);
    if (rx && ry) {
        const right = left + width;
        const bottom = top + height;
        const cpts = [left + rx, right - rx, top + ry, bottom - ry];
        return `M ${cpts[0]},${top}` +
            `L ${cpts[1]},${top} ` +
            `A ${rx},${ry} 0 0 1 ${right},${cpts[2]}` +
            `L ${right},${cpts[3]} ` +
            `A ${rx},${ry} 0 0 1 ${cpts[1]},${bottom}` +
            `L ${cpts[0]},${bottom} ` +
            `A ${rx},${ry} 0 0 1 ${left},${cpts[3]}` +
            `L ${left},${cpts[2]} ` +
            `A ${rx},${ry} 0 0 1 ${cpts[0]},${top} z`;
    }
    return `M ${left} ${top} h ${width} v ${height} h ${-width} Z`;
}

Circle.prototype.describe = function (frame: number) {
    const x = this.cx.get_value(frame);
    const y = this.cy.get_value(frame);
    const r = this.r.get_value(frame);
    if (r === 0) return "M0 0";
    return `M ${x - r} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y} A ${r} ${r} 0 0 0 ${x - r} ${y}`;
}

Ellipse.prototype.describe = function (frame: number) {
    const x = this.cx.get_value(frame);
    const y = this.cy.get_value(frame);
    const rx = this.rx.get_value(frame);
    const ry = this.ry.get_value(frame);
    return `M ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${x + rx} ${y} A ${rx} ${ry} 0 0 0 ${x - rx} ${y}`;
}

Line.prototype.describe = function (frame: number) {
    const x1 = this.x1.get_value(frame);
    const x2 = this.x2.get_value(frame);
    const y1 = this.y1.get_value(frame);
    const y2 = this.y2.get_value(frame);
    return `M ${x1} ${y1} L ${x2} ${y2}`;
}

Polyline.prototype.describe = function (frame: number) {
    const s = this.points.get_value(frame).map(v => `${v[0]},${v[1]}`).join(' ');
    return s ? `M ${s}` : "";
}

Polygon.prototype.describe = function (frame: number) {
    const s = this.points.get_value(frame).map(v => `${v[0]},${v[1]}`).join(' ');
    return s ? `M ${s}z` : "";
}

Shape.prototype.update_bbox = function (bbox: BoundingBox, frame: number, m?: Matrix) {
    let w = this.transform.get_transform(frame);
    m = m ? m.cat(w) : w;
    const p = PathLC.parse(this.describe(frame));
    bbox.merge_self((m ? p.transform(m) : p).bbox());
}

Shape.prototype.object_bbox = function (frame: number) {
    return PathLC.parse(this.describe(frame)).bbox();
}

