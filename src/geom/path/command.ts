import { DescParams, check_t, normalize_t } from './index.js';
import { BoundingBox } from "../bbox.js";
import { Vector } from "../vector.js";
import { quad_split_at, quad_slope_at, quad_point_at, quad_bbox } from './quadhelp.js';
import { quad_length } from './quadhelp.js';
import { cubic_length, cubic_slope_at, cubic_point_at, cubic_box, cubic_split_at } from './cubichelp.js';
const { min, max, abs, PI, cos, sin, sqrt, acos, tan } = Math;
export abstract class Command {

}
function pos(p: Iterable<number>) {
    return Vector.pos(...p)
}
const tau = 2 * PI;
const epsilon = 1e-6;
const tauEpsilon = tau - epsilon;
let digits = 6;
function fmtN(n: number) {
    const v = n.toFixed(digits);
    return v.indexOf('.') < 0 ? v : v.replace(/0+$/g, '').replace(/\.$/g, '');
}
export abstract class BaseLC extends Command {
    _prev?: BaseLC;
    protected readonly _to: Vector;
    static get digits() {
        return digits;
    }
    static set digits(n: number) {
        digits = n;
    }
    constructor(prev: BaseLC | undefined, to: Vector) {
        super();
        this._prev = prev;
        this._to = to;
    }
    get prev() {
        const { _prev } = this;
        if (_prev) {
            return _prev;
        }
        throw new Error('No prev');
    }
    get from() {
        const { _prev } = this;
        if (_prev) {
            return _prev.to;
        }
        throw new Error('No prev');
    }
    get to() {
        return this._to;
    }
    get first(): BaseLC | undefined {
        let cur: BaseLC | undefined = this;
        while (cur) {
            const _prev: BaseLC | undefined = cur._prev;
            if (_prev) {
                cur = _prev;
            } else {
                break;
            }
        }
        return cur;
    }
    get last_move(): BaseLC | undefined {
        for (let cur: BaseLC | undefined = this; cur; cur = cur._prev) {
            if (cur instanceof MoveLC) {
                return cur;
            }
        }
    }
    bbox() {
        return BoundingBox.not();
    }

    abstract split_at(t: number): [BaseLC, BaseLC];
    abstract transform(M: any): BaseLC;
    abstract reversed(next?: BaseLC): BaseLC | undefined;
    abstract with_prev(prev: BaseLC | undefined): BaseLC;
    abstract point_at(t: number): Vector;
    abstract get length(): number;
    abstract slope_at(t: number): Vector;
    abstract term(opt?: DescParams): (number | string)[];
    //// Length calc methods
    cut_at(t: number) {
        return t < 0 ? this.split_at(1 + t)[1] : this.split_at(t)[0];
    }
    crop_at(t0: number, t1: number): BaseLC | undefined {
        t0 = normalize_t(t0);
        t1 = normalize_t(t1);
        if (t0 <= 0) {
            if (t1 >= 1) {
                return this;
            } else if (t1 > 0) {
                return this.cut_at(t1); // t1 < 1
            }
        } else if (t0 < 1) {
            if (t1 >= 1) {
                return this.cut_at(t0 - 1);
            } else if (t0 < t1) {
                return this.cut_at(t0 - 1).cut_at((t1 - t0) / (1 - t0));
            } else if (t0 > t1) {
                return this.crop_at(t1, t0); // t1 < 1
            }
        } else if (t1 < 1) {
            return this.crop_at(t1, t0); // t0 >= 1
        }
    }
    path_len(): number {
        const { _prev } = this;
        const len = this.segment_len();
        return _prev ? _prev.path_len() + len : len;
    }
    segment_len() {
        return this.length;
    }
    tangent_at(t: number) {
        const vec = this.slope_at(t);
        return vec.divide(vec.abs());
    }
    //// Add methods
    move_to(p: Iterable<number>) {
        return new MoveLC(this, pos(p));
    }
    line_to(p: Iterable<number>) {
        return new LineCL(this, pos(p));
    }
    curve_to(c1: Iterable<number>, c2: Iterable<number>, p2: Iterable<number>) {
        return new CubicLC(this, pos(c1), pos(c2), pos(p2));
    }
    quad_to(c: Iterable<number>, p: Iterable<number>) {
        return new QuadLC(this, pos(c), pos(p));
    }
    close(): BaseLC {
        const to = this.last_move?.to;
        return to ? new CloseLC(this, to) : this;
    }
    arc_to(rx: number, ry: number, φ: number, bigArc: boolean | number, sweep: boolean | number, p: Iterable<number>) {
        return new ArcLC(this, rx, ry, φ, bigArc, sweep, pos(p));
    }

    arc_centered_at(c: Iterable<number>, radius: number, startAngle: number, endAngle: number, counterclockwise = false): BaseLC {
        return arc_centered_at(this, c, radius, startAngle, endAngle, counterclockwise);
    }
    arc_tangent_to(p1: Iterable<number>, p2: Iterable<number>, r: number): BaseLC {
        return arc_tangent_to(this, p1, p2, r);
    }
    ////// Canvas method
    lineTo(x: number, y: number) {
        return this.line_to([x, y])
    }
    moveTo(x: number, y: number) {
        return this.move_to([x, y])
    }
    closePath() {
        return this.close();
    }
    quadraticCurveTo(cx: number, cy: number, px: number, py: number) {
        return this.quad_to([cx, cy], [px, py]);
    }
    bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, px2: number, py2: number) {
        return this.curve_to([cx1, cy1], [cx2, cy2], [px2, py2]);
    }
    arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, counterclockwise = false) {
        return arc_centered_at(this, [cx, cy], radius, startAngle, endAngle, counterclockwise);
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
        return arc_tangent_to(this, [x1, y1], [x2, y2], radius);
    }
    rect(x: number, y: number, w: number, h: number) {
        return this.M([x, y]).h(w).v(h).h(-w).z();
    }

    ////// to string methods
    override toString() {
        return this.describe();
    }
    terms(opt?: DescParams): (number | string)[] {
        const { _prev } = this;
        if (_prev) {
            const a = _prev.terms(opt);
            a.push(...this.term(opt));
            return a;
        } else {
            return [...this.term(opt)];
        }
    }
    describe(opt?: DescParams): string {
        const { _prev } = this;
        const [cmd, ...args] = this.term(opt);
        const d = `${cmd}${args.map(v => fmtN(v as number)).join(',')}`;
        return _prev ? _prev.describe(opt) + d : d;
    }

    ////// etc method
    with_far_prev(farPrev: BaseLC, newPrev: BaseLC): BaseLC {
        const { _prev } = this;
        if (farPrev === this) {
            return newPrev;
        } else if (_prev) {
            return this.with_prev(_prev.with_far_prev(farPrev, newPrev));
        } else {
            throw new Error(`No prev`);
        }
    }
    with_far_prev_3(farPrev: BaseLC, newPrev: BaseLC | undefined): BaseLC | undefined {
        const { _prev } = this;
        if (farPrev === this) {
            return this.with_prev(newPrev);
        } else if (_prev) {
            return this.with_prev(_prev.with_far_prev_3(farPrev, newPrev));
        } else {
            throw new Error(`No prev`);
        }
    }
    as_curve(): BaseLC {
        let { _prev } = this;
        if (_prev) {
            const newPrev = _prev.as_curve();
            if (newPrev !== _prev) {
                return this.with_prev(newPrev);
            }
        }
        return this;
    }
    *walk() {
        for (let cur: BaseLC | undefined = this; cur; cur = cur._prev) {
            yield cur;
        }
    }
    //////
    M(p: Iterable<number>) {
        return this.move_to(p)
    }
    m(p: Iterable<number>) {
        return this.move_to(this.to.add(p));
    }
    Z(): BaseLC {
        return this.close();
    }
    z() {
        return this.Z();
    }
    L(p: Iterable<number>) {
        return this.line_to(p);
    }
    l(p: Iterable<number>) {
        return this.line_to(this.to.add(p));
    }
    H(n: number) {
        return this.line_to(this.to.with_x(n));
    }
    h(n: number) {
        return this.line_to(this.to.shift_x(n));
    }
    V(n: number) {
        return this.line_to(this.to.with_y(n));
    }
    v(n: number) {
        return this.line_to(this.to.shift_y(n));
    }
    Q(c: Iterable<number>, p: Iterable<number>) {
        return this.quad_to(c, p);
    }
    q(c: Iterable<number>, p: Iterable<number>) {
        const { to: rel } = this;
        return this.quad_to(rel.add(c), rel.add(p));
    }
    C(c1: Iterable<number>, c2: Iterable<number>, p2: Iterable<number>) {
        return this.curve_to(c1, c2, p2)
    }
    c(c1: Iterable<number>, c2: Iterable<number>, p2: Iterable<number>) {
        const { to: rel } = this;
        return this.curve_to(rel.add(c1), rel.add(c2), rel.add(p2))
    }
    S(c: Iterable<number>, p: Iterable<number>): CubicLC {
        const { to } = this;
        if (this instanceof CubicLC) {
            return this.curve_to(this.c2.reflect_at(to), c, p)
        } else {
            return this.curve_to(to, c, p)
        }
    }
    s(c: Iterable<number>, p: Iterable<number>): CubicLC {
        const { to } = this;
        if (this instanceof CubicLC) {
            return this.curve_to(this.c2.reflect_at(to), to.add(c), to.add(p))
        } else {
            return this.curve_to(to, to.add(c), to.add(p))
        }
    }
    T(p: Iterable<number>): QuadLC {
        const { to } = this;
        if (this instanceof QuadLC) {
            return this.quad_to(this.p.reflect_at(to), p);
        } else {
            return this.quad_to(to, p);
        }
    }
    t(p: Iterable<number>): QuadLC {
        const { to } = this;
        if (this instanceof QuadLC) {
            return this.quad_to(this.p.reflect_at(to), to.add(p));
        } else {
            return this.quad_to(to, to.add(p));
        }
    }

    A(rx: number, ry: number, φ: number, bigArc: boolean | number, sweep: boolean | number, p: Iterable<number>) {
        return new ArcLC(this, rx, ry, φ, bigArc, sweep, pos(p));
    }

    a(rx: number, ry: number, φ: number, bigArc: boolean | number, sweep: boolean | number, p: Iterable<number>) {
        const { to: rel } = this;
        return new ArcLC(this, rx, ry, φ, bigArc, sweep, rel.add(p));
    }

    //////
    static move_to(p: Iterable<number>) {
        return new MoveLC(undefined, pos(p));
    }
    static line_to(p: Iterable<number>) {
        return this.move_to([0, 0]).line_to(p);
    }
    static lineTo(x: number, y: number) {
        return this.line_to([x, y]);
    }
    static moveTo(x: number, y: number) {
        return this.move_to([x, y]);
    }

    static curve_to(c1: Iterable<number>, c2: Iterable<number>, p2: Iterable<number>) {
        return this.move_to([0, 0]).curve_to(c1, c2, p2);
    }
    static quad_to(c: Iterable<number>, p: Iterable<number>) {
        return this.move_to([0, 0]).quad_to(c, p);
    }
    static arc_centered_at(c: Iterable<number>, radius: number, startAngle: number, endAngle: number, counterclockwise = false) {
        return arc_centered_at(undefined, c, radius, startAngle, endAngle, counterclockwise);
    }
    static rect(x: number, y: number, w: number, h: number) {
        return this.move_to([x, y]).h(w).v(h).h(-w).z();
    }
    static arc_tangent_to(p1: Iterable<number>, p2: Iterable<number>, r: number) {
        return arc_tangent_to(undefined, p1, p2, r);
    }
    static parse(d: string) {
        return parse(d, undefined);
    }
    static bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, px2: number, py2: number) {
        return this.curve_to([cx1, cy1], [cx2, cy2], [px2, py2]);
    }
    static quadraticCurveTo(cx: number, cy: number, px: number, py: number) {
        return this.quad_to([cx, cy], [px, py]);
    }
    static arcd(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, counterclockwise = false) {
        return this.arc_centered_at([cx, cy], radius, (startAngle * PI) / 180, (endAngle * PI) / 180, counterclockwise);
    }

}

export class LineCL extends BaseLC {
    override bbox() {
        const { to: [x2, y2], _prev } = this;
        if (_prev) {
            const [x1, y1] = _prev.to;
            return BoundingBox.extrema([min(x1, x2), max(x1, x2)], [min(y1, y2), max(y1, y2)]);
        }
        return BoundingBox.not();
    }
    override get length() {
        const { from, to } = this;
        return to.subtract(from).abs();
    }
    override point_at(t: number) {
        const { from, to } = this;
        return to.subtract(from).multiply(check_t(t)).post_add(from);
    }
    override slope_at(_: number) {
        const { from, to } = this;
        const vec = to.subtract(from);
        return vec.divide(vec.abs());
    }
    override split_at(t: number): [BaseLC, BaseLC] {
        const { to } = this;
        const c = this.point_at(t);
        return [new LineCL(this._prev, c), new LineCL(new MoveLC(undefined, c), to)];
    }
    override term(opt?: DescParams) {
        const {
            to: [x, y],
        } = this;
        if (opt) {
            const { relative, short } = opt;
            const { _prev } = this;
            if (_prev) {
                const [sx, sy] = _prev.to;
                if (relative) {
                    if (short) {
                        if (sx === x) {
                            return ['v', y - sy];
                        } else if (sy === y) {
                            return ['h', x - sx];
                        }
                    }
                    return ['l', x - sx, y - sy];
                } else if (short) {
                    if (sx === x) {
                        return ['V', y];
                    } else if (sy === y) {
                        return ['H', x];
                    }
                }
            }
        }
        return ['L', x, y];
    }

    override reversed(next?: BaseLC): BaseLC | undefined {
        const { to, _prev } = this;
        next || (next = new MoveLC(undefined, to));
        if (_prev) {
            const rev = new LineCL(next, _prev.to);
            return _prev.reversed(rev) ?? rev;
        } else {
            return next;
        }
    }
    override transform(M: any) {
        const { to, _prev } = this;
        return new LineCL(_prev?.transform(M), to.transform(M));
    }
    override with_prev(newPrev: BaseLC | undefined) {
        const { to } = this;
        return new LineCL(newPrev, to);
    }

}
export class MoveLC extends LineCL {
    override term(opt?: DescParams) {
        const {
            to: [x, y],
        } = this;

        if (opt?.relative) {
            const { _prev } = this;
            if (_prev) {
                const [sx, sy] = _prev.to;
                return ['m', x - sx, y - sy];
            }
        }

        return ['M', x, y];
    }
    override split_at(t: number): [BaseLC, BaseLC] {
        const c = this.point_at(t);
        return [new MoveLC(this._prev, c), new MoveLC(new MoveLC(undefined, c), this.to)];
    }
    override transform(M: any) {
        const { to, _prev } = this;
        return new MoveLC(_prev?.transform(M), to.transform(M));
    }
    override reversed(next?: BaseLC): BaseLC | undefined {
        const { _prev } = this;
        if (_prev) {
            const seg = new MoveLC(next, _prev.to);
            return _prev.reversed(seg) ?? seg;
        } else {
            return next;
        }
    }
    override with_prev(prev: BaseLC | undefined) {
        return new MoveLC(prev, this.to);
    }
    override segment_len() {
        return 0;
    }
}
export class CloseLC extends LineCL {
    override split_at(t: number): [BaseLC, BaseLC] {
        const { to } = this;
        const c = this.point_at(t);
        return [new LineCL(this._prev, c), new CloseLC(new MoveLC(undefined, c), to)];
    }
    override transform(M: any) {
        const { to, _prev } = this;
        return new CloseLC(_prev?.transform(M), to.transform(M));
    }
    override term(opt?: DescParams) {
        if (opt) {
            const { relative, close } = opt;
            if (close === false) {
                return super.term(opt);
            } else if (relative) {
                return ['z'];
            }
        }
        return ['Z'];
    }
    override reversed(next?: BaseLC): BaseLC | undefined {
        const { to, _prev } = this;
        next || (next = new MoveLC(undefined, to));
        if (_prev) {
            const rev = new LineCL(next, _prev.to);
            return _prev.reversed(rev) ?? rev;
        } else {
            return next;
        }
    }
    override with_prev(prev: BaseLC | undefined) {
        const { to } = this;
        return new CloseLC(prev, to);
    }
}
export class QuadLC extends BaseLC {
    readonly p: Vector;
    constructor(prev: BaseLC | undefined, p: Vector, to: Vector) {
        super(prev, to);
        this.p = p;
    }
    private get _qpts(): Vector[] {
        const { from, p, to } = this;
        return [from, p, to];
    }
    override get length() {
        return quad_length(this._qpts);
    }
    override slope_at(t: number): Vector {
        return quad_slope_at(this._qpts, check_t(t));
    }
    override point_at(t: number) {
        return quad_point_at(this._qpts, check_t(t));
    }
    override split_at(t: number): [BaseLC, BaseLC] {
        const [a, b] = quad_split_at(this._qpts, check_t(t));
        return [new QuadLC(this._prev, a[1], a[2]), new QuadLC(new MoveLC(undefined, b[0]), b[1], b[2])];
    }
    override bbox() {
        const { _prev } = this;
        return _prev ? quad_bbox(this._qpts) : BoundingBox.not();
    }
    override term(opt?: DescParams) {
        const {
            p: [x1, y1],
            to: [ex, ey],
        } = this;
        if (opt) {
            const { relative, smooth } = opt;
            const { p, _prev } = this;
            if (_prev) {
                const [sx, sy] = _prev.to;
                if (smooth && (_prev instanceof QuadLC ? _prev.p.reflect_at(_prev.to).close_to(p) : _prev.to.close_to(p))) {
                    return relative ? ['t', ex - sx, ey - sy] : ['T', ex, ey];
                } else if (relative) {
                    return ['q', x1 - sx, y1 - sy, ex - sx, ey - sy];
                }
            }
        }
        return ['Q', x1, y1, ex, ey];
    }
    override reversed(next?: BaseLC): BaseLC | undefined {
        const { to, p, _prev } = this;
        next || (next = new MoveLC(undefined, to));
        if (_prev) {
            const rev = new QuadLC(next, p, _prev.to);
            return _prev.reversed(rev) ?? rev;
        } else {
            return next;
        }
    }
    override transform(M: any) {
        const { p, to, _prev } = this;
        return new QuadLC(_prev?.transform(M), p.transform(M), to.transform(M));
    }
    override with_prev(prev: BaseLC | undefined) {
        const { p, to } = this;
        return new QuadLC(prev, p, to);
    }
}
export class CubicLC extends BaseLC {
    readonly c1: Vector;
    readonly c2: Vector;
    constructor(prev: BaseLC | undefined, c1: Vector, c2: Vector, to: Vector) {
        super(prev, to);
        this.c1 = c1;
        this.c2 = c2;
    }
    private get _cpts(): Vector[] {
        const { from, c1, c2, to } = this;
        return [from, c1, c2, to];
    }
    /////
    override point_at(t: number) {
        return Vector.new(cubic_point_at(this._cpts, check_t(t)));
    }
    override bbox() {
        const { _prev } = this;
        return _prev ? cubic_box(this._cpts) : BoundingBox.not();
    }
    override slope_at(t: number): Vector {
        return cubic_slope_at(this._cpts, check_t(t));
    }
    override split_at(t: number): [BaseLC, BaseLC] {
        const { _prev, _cpts } = this;
        const [a, b] = cubic_split_at(_cpts, check_t(t));
        return [
            new CubicLC(_prev, Vector.new(a[1]), Vector.new(a[2]), Vector.new(a[3])),
            new CubicLC(new MoveLC(undefined, Vector.new(b[0])), Vector.new(b[1]), Vector.new(b[2]), Vector.new(b[3]))
        ];
    }
    override get length() {
        return cubic_length(this._cpts);
    }
    override reversed(next?: BaseLC): BaseLC | undefined {
        const { to, c1, c2, _prev } = this;
        next || (next = new MoveLC(undefined, to));
        if (_prev) {
            const rev = new CubicLC(next, c2, c1, _prev.to);
            return _prev.reversed(rev) ?? rev;
        } else {
            return next;
        }
    }
    override transform(M: any) {
        const { c1, c2, to, _prev } = this;
        return new CubicLC(_prev?.transform(M), c1.transform(M), c2.transform(M), to.transform(M));
    }
    override term(opt?: DescParams) {
        const {
            c1: [x1, y1],
            c2: [x2, y2],
            to: [ex, ey],
        } = this;

        if (opt) {
            const { smooth, relative } = opt;
            const { c1, _prev } = this;
            if (_prev) {
                const { to: from } = _prev;
                const [sx, sy] = from;
                if (smooth && (_prev instanceof CubicLC ? _prev.c2.reflect_at(from).close_to(c1) : from.close_to(c1))) {
                    return relative ? ['s', x2 - sx, y2 - sy, ex - sx, ey - sy] : ['S', x2, y2, ex, ey];
                } else if (relative) {
                    return ['c', x1 - sx, y1 - sy, x2 - sx, y2 - sy, ex - sx, ey - sy];
                }
            }
        }
        return ['C', x1, y1, x2, y2, ex, ey];
    }
    override with_prev(prev: BaseLC | undefined) {
        const { c1, c2, to } = this;
        return new CubicLC(prev, c1, c2, to);
    }
}

import { arc_bbox, arc_length, arc_point_at, arc_slope_at, arc_transform } from './archelp.js';
import { arc_params, arc_to_curve } from './archelp.js';
export class ArcLC extends BaseLC {
    readonly rx: number;
    readonly ry: number;
    readonly phi: number;
    readonly bigArc: boolean;
    readonly sweep: boolean;
    //
    readonly cosφ: number;
    readonly sinφ: number;
    readonly rtheta: number;
    readonly rdelta: number;
    readonly cx: number;
    readonly cy: number;
    constructor(
        prev: BaseLC | undefined,
        rx: number,
        ry: number,
        φ: number,
        bigArc: boolean | number,
        sweep: boolean | number,
        to: Vector
    ) {
        if (!(isFinite(φ) && isFinite(rx) && isFinite(ry))) throw Error(`${JSON.stringify(arguments)}`);
        super(prev, to);
        const [x1, y1] = this.from;
        const [x2, y2] = this.to;
        [this.phi, this.rx, this.ry, this.sinφ, this.cosφ, this.cx, this.cy, this.rtheta, this.rdelta] = arc_params(
            x1,
            y1,
            rx,
            ry,
            φ,
            (this.bigArc = !!bigArc),
            (this.sweep = !!sweep),
            x2,
            y2
        );
    }
    override bbox() {
        const { _prev } = this;
        return _prev ? arc_bbox(this) : BoundingBox.not();
    }
    override get length() {
        return arc_length(this);
    }
    override point_at(t: number) {
        return arc_point_at(this, check_t(t));
    }
    override slope_at(t: number): Vector {
        return arc_slope_at(this, check_t(t));
    }
    override split_at(t: number): [BaseLC, BaseLC] {
        const { rx, ry, phi, sweep, rdelta, to, _prev } = this;
        const deltaA = abs(rdelta);
        const mid = arc_point_at(this, check_t(t));
        return [
            new ArcLC(_prev, rx, ry, phi, deltaA * t > PI, sweep, mid),
            new ArcLC(new MoveLC(undefined, mid), rx, ry, phi, deltaA * (1 - t) > PI, sweep, to),
        ];
    }
    override transform(M: any) {
        const { bigArc, to, _prev } = this;
        const [rx, ry, phi, sweep] = arc_transform(this, M);
        return new ArcLC(_prev?.transform(M), rx, ry, phi, bigArc, sweep, to.transform(M));
    }
    override reversed(next?: BaseLC): BaseLC | undefined {
        const { rx, ry, phi, bigArc, sweep, to, _prev } = this;
        next || (next = new MoveLC(undefined, to));
        if (_prev) {
            const rev = new ArcLC(next, rx, ry, phi, bigArc, !sweep, _prev.to);
            return _prev.reversed(rev) ?? rev;
        } else {
            return next;
        }
    }

    override term(opt?: DescParams) {
        const {
            rx,
            ry,
            phi,
            sweep,
            bigArc,
            to: [x, y],
        } = this;
        if (opt?.relative) {
            const { _prev } = this;
            if (_prev) {
                const [sx, sy] = _prev.to;
                return ['a', rx, ry, phi, bigArc ? 1 : 0, sweep ? 1 : 0, x - sx, y - sy];
            }
        }

        return ['A', rx, ry, phi, bigArc ? 1 : 0, sweep ? 1 : 0, x, y];
    }
    override as_curve() {
        let { _prev, to } = this;
        if (_prev) {
            const { rx, ry, cx, cy, cosφ, sinφ, rdelta, rtheta } = this;
            const segments = arc_to_curve(rx, ry, cx, cy, sinφ, cosφ, rtheta, rdelta);
            _prev = _prev.as_curve();
            if (segments.length === 0) {
                // Degenerated arcs can be ignored by renderer, but should not be dropped
                // to avoid collisions with `S A S` and so on. Replace with empty line.
                _prev = _prev.line_to(to);
            } else {
                for (const s of segments) {
                    _prev = _prev?.curve_to([s[2], s[3]], [s[4], s[5]], [s[6], s[7]]);
                }
            }
            return _prev;
        }
        return BaseLC.line_to(to);
    }

    override with_prev(prev: BaseLC | undefined) {
        const { rx, ry, phi, sweep, bigArc, to } = this;
        return new ArcLC(prev, rx, ry, phi, bigArc, sweep, to);
    }
}

function parse(d: string, prev: BaseLC | undefined): BaseLC {
    // let mat: RegExpExecArray | null;
    const dRE = /[\s,]*(?:([MmZzLlHhVvCcSsQqTtAa])|([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?))/y;
    const peek = function () {
        const i = dRE.lastIndex;
        const m = dRE.exec(d);
        dRE.lastIndex = i;
        return m;
    };
    const get = function () {
        const m = dRE.exec(d);
        return m;
    };
    const cmd = function () {
        const m = get();
        if (m) {
            const v = m[1];
            if (v) {
                return v;
            }
            throw new Error(`Command expected '${v}' '${d}'`);
        }
    };
    const num = function () {
        const v = get()?.[2];
        if (v) {
            return parseFloat(v);
        }
        throw new Error(`Number expected '${v}' '${d}'`);
    };
    const isNum = () => peek()?.[2];
    const vec = () => Vector.pos(num(), num());
    const first = BaseLC.move_to([0, 0]);
    let cur: BaseLC = prev ?? first;
    let command;
    while ((command = cmd())) {
        switch (command) {
            case 'M':
                cur = cur === first ? BaseLC.move_to(vec()) : cur.M(vec());
                while (isNum() && (cur = cur.L(vec())));
                break;
            case 'm':
                cur = cur === first ? BaseLC.move_to(vec()) : cur.m(vec());
                while (isNum() && (cur = cur.l(vec())));
                break;
            case 'Z':
            case 'z':
                cur === first || (cur = cur.Z());
                break;
            case 'L':
                while ((cur = cur.L(vec())) && isNum());
                break;
            case 'l':
                while ((cur = cur.l(vec())) && isNum());
                break;
            case 'H':
                while ((cur = cur.H(num())) && isNum());
                break;
            case 'h':
                while ((cur = cur.h(num())) && isNum());
                break;
            case 'V':
                while ((cur = cur.V(num())) && isNum());
                break;
            case 'v':
                while ((cur = cur.v(num())) && isNum());
                break;
            case 'Q':
                while ((cur = cur.Q(vec(), vec())) && isNum());
                break;
            case 'q':
                while ((cur = cur.q(vec(), vec())) && isNum());
                break;
            case 'C':
                while ((cur = cur.C(vec(), vec(), vec())) && isNum());
                break;
            case 'c':
                while ((cur = cur.c(vec(), vec(), vec())) && isNum());
                break;
            case 'S':
                while ((cur = cur.S(vec(), vec())) && isNum());
                break;
            case 's':
                while ((cur = cur.s(vec(), vec())) && isNum());
                break;
            case 'T':
                while ((cur = cur.T(vec())) && isNum());
                break;
            case 't':
                while ((cur = cur.t(vec())) && isNum());
                break;
            case 'A':
                while ((cur = cur.A(num(), num(), num(), num(), num(), vec())) && isNum());
                break;
            case 'a':
                while ((cur = cur.a(num(), num(), num(), num(), num(), vec())) && isNum());
                break;
            default:
                throw new Error(`Invalid path command ${command} from "${d}"`);
        }
    }
    return cur;
}

function arc_centered_at(cur: BaseLC | undefined, c: Iterable<number>, radius: number, startAngle: number, endAngle: number, counterclockwise = false): BaseLC {
    const [x, y] = c;
    const a0 = startAngle;
    const a1 = endAngle;
    const cw = !counterclockwise;
    const r = radius;
    const dx = r * cos(a0);
    const dy = r * sin(a0);
    const x0 = x + dx;
    const y0 = y + dy;
    if (r < 0) {
        // Is the radius negative? Error.
        throw new Error('negative radius: ' + r);
    } else if (!cur) {
        cur = new MoveLC(undefined, Vector.new(x0, y0));
    } else if (!cur.to.close_to(Vector.new(x0, y0), epsilon)) {
        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        cur = cur.line_to(Vector.new(x0, y0));
    }
    let da = cw ? a1 - a0 : a0 - a1;
    // Is this arc empty? We’re done.
    if (!r) {
        return cur;
    } else if (da < 0) {
        da = (da % tau) + tau;
    }
    if (da > tauEpsilon) {
        // Is this a complete circle? PathDraw two arcs to complete the circle.
        return cur.arc_to(r, r, 0, 1, cw, [x - dx, y - dy]).arc_to(r, r, 0, 1, cw, [x0, y0]);
    } else if (da > epsilon) {
        // Is this arc non-empty? PathDraw an arc!
        return cur.arc_to(r, r, 0, da >= PI, cw, [x + r * cos(a1), y + r * sin(a1)]);
    }
    return cur;
}

function arc_tangent_to(cur: BaseLC | undefined, p1: Iterable<number>, p2: Iterable<number>, r: number) {

    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [x0, y0] = cur ? cur.to : [0, 0];
    const x21 = x2 - x1;
    const y21 = y2 - y1;
    const x01 = x0 - x1;
    const y01 = y0 - y1;
    const l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) {
        throw new Error('negative radius: ' + r);
    } else if (!cur) {
        // Is this path empty? Move to (x1,y1).
        cur = BaseLC.move_to(Vector.new(x1, y1));
    } else if (!(l01_2 > epsilon)) {
        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    } else if (!(abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        cur = cur.line_to(Vector.new(x1, y1));
    } else {
        // Otherwise, draw an arc!
        const x20 = x2 - x0,
            y20 = y2 - y0,
            l21_2 = x21 * x21 + y21 * y21,
            l20_2 = x20 * x20 + y20 * y20,
            l21 = sqrt(l21_2),
            l01 = sqrt(l01_2),
            l = r * tan((PI - acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
            t01 = l / l01,
            t21 = l / l21;

        // If the start tangent is not coincident with (x0,y0), line to.
        if (abs(t01 - 1) > epsilon) {
            cur = cur.L(Vector.new(x1 + t01 * x01, y1 + t01 * y01));
        }
        cur = cur.arc_to(r, r, 0, 0, y01 * x20 > x01 * y20 ? 1 : 0, [x1 + t21 * x21, y1 + t21 * y21]);
        // this._ += `A${fmtN(r)},${fmtN(r)},0,0,${y01 * x20 > x01 * y20 ? 1 : 0},${fmtN(
        // 	(this._x1 = x1 + t21 * x21),
        // )},${fmtN((this._y1 = y1 + t21 * y21))}`;
    }
    return cur;
}
