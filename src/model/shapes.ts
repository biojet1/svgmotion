import { Element } from "./base.js";
import { PointsValue, TextValue, LengthYValue, LengthXValue, LengthValue } from "./value.js";

export class Shape extends Element {
    describe(frame: number): string {
        throw new Error(`Not implemented frame=${frame}`);
    }
    // get_path(frame: number): PathLC {
    //     return PathLC.parse(this.describe(frame));
    // }
}

export class Path extends Shape {
    static override tag = "path";
    //
    get marker_start() { return this._new_field("marker_start", new TextValue('none')); }
    get marker_mid() { return this._new_field("marker_mid", new TextValue('none')); }
    get marker_end() { return this._new_field("marker_end", new TextValue('none')); }
    get d() { return this._new_field("d", new TextValue('')); }
}

export class Rect extends Shape {
    static override tag = "rect";
    //
    get rx() { return this._new_field("rx", new LengthXValue(0)); }
    get ry() { return this._new_field("ry", new LengthYValue(0)); }
    get width() { return this._new_field("width", new LengthXValue(100)); }
    get height() { return this._new_field("height", new LengthYValue(100)); }
    get x() { return this._new_field("x", new LengthXValue(0)); }
    get y() { return this._new_field("y", new LengthYValue(0)); }
}

export class Circle extends Shape {
    static override tag = "circle";
    //
    get cx() { return this._new_field("cx", new LengthXValue(0)); }
    get cy() { return this._new_field("cy", new LengthYValue(0)); }
    get r() { return this._new_field("r", new LengthValue(0)); }
}

export class Ellipse extends Shape {
    static override tag = "ellipse";
    //
    get rx() { return this._new_field("rx", new LengthXValue(0)); }
    get ry() { return this._new_field("ry", new LengthYValue(0)); }
    get cx() { return this._new_field("cx", new LengthXValue(0)); }
    get cy() { return this._new_field("cy", new LengthYValue(0)); }
}

export class Line extends Shape {
    static override tag = "line";
    //
    get marker_start() { return this._new_field("marker_start", new TextValue('none')); }
    get marker_mid() { return this._new_field("marker_mid", new TextValue('none')); }
    get marker_end() { return this._new_field("marker_end", new TextValue('none')); }
    get x1() { return this._new_field("x1", new LengthXValue(0)); }
    get y1() { return this._new_field("y1", new LengthYValue(0)); }
    get x2() { return this._new_field("x2", new LengthXValue(0)); }
    get y2() { return this._new_field("y2", new LengthYValue(0)); }
}

export class Polyline extends Shape {
    static override tag = "polyline";
    //
    get marker_start() { return this._new_field("marker_start", new TextValue('none')); }
    get marker_mid() { return this._new_field("marker_mid", new TextValue('none')); }
    get marker_end() { return this._new_field("marker_end", new TextValue('none')); }
    get points() { return this._new_field("points", new PointsValue([])); }
}

export class Polygon extends Shape {
    static override tag = "polygon";
    //
    get marker_start() { return this._new_field("marker_start", new TextValue('none')); }
    get marker_mid() { return this._new_field("marker_mid", new TextValue('none')); }
    get marker_end() { return this._new_field("marker_end", new TextValue('none')); }
    get points() { return this._new_field("points", new PointsValue([])); }
}
