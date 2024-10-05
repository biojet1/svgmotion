import { PathLC, BoundingBox, Matrix } from "../geom/index.js";
import { Element } from "./base.js";
import { PointsValue, TextValue, LengthYValue, LengthXValue, LengthValue } from "./value.js";

abstract class Shape extends Element {
    describe(frame: number): string {
        throw new Error(`Not implemented frame=${frame}`);
    }
    get_path(frame: number): PathLC {
        return PathLC.parse(this.describe(frame));
    }
    override update_bbox(bbox: BoundingBox, frame: number, m?: Matrix) {
        let w = this.transform.get_transform(frame);
        m = m ? m.cat(w) : w;
        const p = this.get_path(frame);
        bbox.merge_self((m ? p.transform(m) : p).bbox());
    }
    override object_bbox(frame: number) {
        return this.get_path(frame).bbox();
    }
}

class PointBase extends Shape {
    /// points
    get points() {
        return this._new_field("points", new PointsValue([]));
    }
    set points(v: PointsValue) {
        this._new_field("points", v);
    }
}

export class Path extends Shape {
    static override tag = "path";
    ///
    get d() {
        return this._new_field("d", new TextValue(""));
    }
    set d(v: TextValue) {
        this._new_field("d", v);
    }
    //
    get marker_start() {
        return this._new_field("marker_start", new TextValue("none"));
    }
    set marker_start(v: TextValue) {
        this._new_field("marker_start", v);
    }
    //
    get marker_mid() {
        return this._new_field("marker_mid", new TextValue("none"));
    }
    set marker_mid(v: TextValue) {
        this._new_field("marker_mid", v);
    }
    //
    get marker_end() {
        return this._new_field("marker_end", new TextValue("none"));
    }
    set marker_end(v: TextValue) {
        this._new_field("marker_end", v);
    }
    //
    override describe(frame: number) {
        return this.d.get_value(frame);
    }
}

export class Rect extends Shape {
    static override tag = "rect";
    ///
    get x() {
        return this._new_field("x", new LengthXValue(0));
    }
    set x(v: LengthXValue) {
        this._new_field("x", v);
    }
    ///
    get y() {
        return this._new_field("y", new LengthYValue(0));
    }
    set y(v: LengthYValue) {
        this._new_field("y", v);
    }
    ///
    get width() {
        return this._new_field("width", new LengthXValue(100));
    }
    set width(v: LengthXValue) {
        this._new_field("width", v);
    }
    ///
    get height() {
        return this._new_field("height", new LengthYValue(100));
    }
    set height(v: LengthYValue) {
        this._new_field("height", v);
    }
    ///
    get rx() {
        return this._new_field("rx", new LengthXValue(0));
    }
    set rx(v: LengthXValue) {
        this._new_field("rx", v);
    }
    ///
    get ry() {
        return this._new_field("ry", new LengthYValue(0));
    }
    set ry(v: LengthYValue) {
        this._new_field("ry", v);
    }

    override describe(frame: number) {
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
            return `M ${cpts[0]},${self.top}` +
                `L ${cpts[1]},${top} ` +
                `A ${rx},${ry} 0 0 1 ${right},${cpts[2]}` +
                `L ${right},${cpts[3]} ` +
                `A ${rx},${ry} 0 0 1 ${cpts[1]},${bottom}` +
                `L ${cpts[0]},${bottom} ` +
                `A ${rx},${ry} 0 0 1 ${left},${cpts[3]}` +
                `L ${left},${cpts[2]} ` +
                `A ${rx},${ry} 0 0 1 ${cpts[0]},${top} z`;
        }
        // TODO: rx, ry
        return `M ${left} ${top} h ${width} v ${height} h ${-width} Z`;
    }
}


export class Circle extends Shape {
    static override tag = "circle";
    override describe(frame: number) {
        const x = this.cx.get_value(frame);
        const y = this.cy.get_value(frame);
        const r = this.r.get_value(frame);
        if (r === 0) return "M0 0";
        return `M ${x - r} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y} A ${r} ${r} 0 0 0 ${x - r} ${y}`;
    }
}

export class Ellipse extends Shape {
    static override tag = "ellipse";
    ///
    override describe(frame: number) {
        const x = this.cx.get_value(frame);
        const y = this.cy.get_value(frame);
        const rx = this.rx.get_value(frame);
        const ry = this.ry.get_value(frame);
        return `M ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${x + rx} ${y} A ${rx} ${ry} 0 0 0 ${x - rx} ${y}`;
    }
}

export class Line extends Shape {
    static override tag = "line";
    /// x1
    get x1() {
        return this._new_field("x1", new LengthXValue(0));
    }
    set x1(v: LengthXValue) {
        this._new_field("x1", v);
    }
    /// y1
    get y1() {
        return this._new_field("y1", new LengthYValue(0));
    }
    set y1(v: LengthYValue) {
        this._new_field("y1", v);
    }
    /// x2
    get x2() {
        return this._new_field("x2", new LengthXValue(0));
    }
    set x2(v: LengthXValue) {
        this._new_field("x2", v);
    }
    /// y2
    get y2() {
        return this._new_field("y2", new LengthYValue(0));
    }
    set y2(v: LengthYValue) {
        this._new_field("y2", v);
    }
    ////
    override describe(frame: number) {
        const x1 = this.x1.get_value(frame);
        const x2 = this.x2.get_value(frame);
        const y1 = this.y1.get_value(frame);
        const y2 = this.y2.get_value(frame);
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
}

export class Polyline extends PointBase {
    static override tag = "polyline";
    ///
    override describe(frame: number) {
        const s = this.points.get_value(frame).map(v => `${v[0]},${v[1]}`).join(' ');
        return s ? `M ${s}` : "";
    }
}

export class Polygon extends PointBase {
    static override tag = "polygon";
    ///
    override describe(frame: number) {
        const s = this.points.get_value(frame).map(v => `${v[0]},${v[1]}`).join(' ');
        return s ? `M ${s}` : "";
    }
}
