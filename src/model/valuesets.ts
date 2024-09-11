import { BoundingBox, Matrix, MatrixMut, Vector } from "../geom/index.js";
import { KeyExtra } from "../keyframe/keyframe.js";
import { FontSizeValue, LengthValue } from "./base.js";
import { VectorValue, ScalarValue, PositionValue, RGBValue, TextValue, PercentageValue } from "./value.js";
import { PlainValue, Animatable } from "./value.js";
import { Element } from "./base.js";
import { CalcLength } from "../helper/svg_length.js";
export function xget<T>(that: any, name: string, value: T): T {
    // console.log(`_GETX ${name}`);
    Object.defineProperty(that, name, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    return value;
}

export function xset<T>(that: any, name: string, value: T) {
    // console.log(`_SETX ${name}`);
    Object.defineProperty(that, name, {
        value,
        writable: true,
        enumerable: true,
    });
}

function find_parent<T>(
    that: Animatable<any> | ValueSet,
    K: { new(...args: any[]): T }
): T | void {
    let o = that;
    while (o = o._parent) {
        if (o instanceof K) {
            return o;
        }
    }
}

function get_parent<T>(
    that: Animatable<any> | ValueSet,
    K: { new(...args: any[]): T }
): T {
    const n = find_parent(that, K)
    if (n) {
        return n;
    }
    throw new Error(`not found ${K.name}`);
}

function get_element(that: Animatable<any> | ValueSet): Element {
    return get_parent(that, Element)
}

export class ValueSet {
    _parent?: any;
    protected _new_field<T extends Animatable<any> | ValueSet>(name: string, value: T): T {
        const v = xget(this, name, value);
        v._parent = this;
        return v;
    }

    *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (const sub of Object.values(this)) {
            if (sub instanceof Animatable) {
                yield sub;
            }
        }
    }
    dump() {
        let u: any = {};
        for (let [k, v] of Object.entries(this)) {
            if (v instanceof Animatable) {
                u[k] = v.dump();
            }
        }
        return u;
    }
    load(u: PlainValue<any>) {
        for (let [k, v] of Object.entries(u)) {
            const p = (this as any)[k];
            if (p instanceof Animatable) {
                p.load(v);
            } else {
                throw new Error(`Unexpected property "${k}" (${v})`);
            }
        }
    }
}

export class ViewBox extends ValueSet {
    constructor(position: Iterable<number>, size: Iterable<number>) {
        super();
        if (size) {
            this.size = new PositionValue(size);
        }
        if (position) {
            this.position = new PositionValue(position);
        }
    }
    /// size
    get size() {
        return this._new_field("size", new VectorValue([100, 100]));
    }
    set size(v: VectorValue) {
        this._new_field("size", v);
    }
    /// position
    get position() {
        return this._new_field("position", new PositionValue([0, 0]));
    }
    set position(v: PositionValue) {
        this._new_field("position", v);
    }
    // repr
    get_repr(frame: number): string {
        const s = this.size.get_value(frame);
        const p = this.position.get_value(frame);
        return `${p[0]} ${p[1]} ${s[0]} ${s[1]}`;
    }
    set_repr(value: string) {
        const v = value.split(/[\s,]+/).map(parseFloat);
        this.position.set_value([v[0], v[1]]);
        this.size.set_value([v[2], v[3]]);
    }
    // geom
    bbox(frame: number) {
        if (Object.hasOwn(this, "size")) {
            if (Object.hasOwn(this, "position")) {
                const [w, h] = this.size.get_value(frame);
                const [x, y] = this.position.get_value(frame);
                return BoundingBox.rect(x, y, w, h);
            }
        }
        return BoundingBox.not();
    }
}

export class Stroke extends ValueSet {
    /// width
    get width() {
        return this._new_field("width", new LengthValue(1));
    }
    set width(v: LengthValue) {
        this._new_field("width", v);
    }
    /// opacity
    get opacity() {
        return this._new_field("opacity", new PercentageValue(1));
    }
    set opacity(v: PercentageValue) {
        this._new_field("opacity", v);
    }
    /// color
    get color() {
        return this._new_field("color", new RGBValue([0, 0, 0]));
    }
    set color(v: RGBValue) {
        this._new_field("color", v);
    }
    /// stroke-miterlimit
    get miter_limit() {
        return this._new_field("miter_limit", new LengthValue(4));
    }
    set miter_limit(v: LengthValue) {
        this._new_field("miter_limit", v);
    }
    // stroke-dashoffset
    get dash_offset() {
        return this._new_field("dash_offset", new LengthValue(1));
    }
    set dash_offset(v: LengthValue) {
        this._new_field("dash_offset", v);
    }
    // stroke-dasharray
    get dash_array() {
        return this._new_field("dash_array", new VectorValue([1, 1]));
    }
    set dash_array(v: VectorValue) {
        this._new_field("dash_array", v);
    }
    // stroke-linecap
    get linecap() {
        return this._new_field("linecap", new TextValue('butt'));
    }
    set linecap(v: TextValue) {
        this._new_field("linecap", v);
    }
    // stroke-linejoin
    get linejoin() {
        return this._new_field("linejoin", new TextValue('miter'));
    }
    set linejoin(v: TextValue) {
        this._new_field("linejoin", v);
    }
}

export class Fill extends ValueSet {
    /// fill-opacity
    get opacity() {
        return this._new_field("opacity", new PercentageValue(1));
    }
    set opacity(v: PercentageValue) {
        this._new_field("opacity", v);
    }
    /// fill
    get color() {
        return this._new_field("color", new RGBValue([0, 0, 0]));
    }
    set color(v: RGBValue) {
        this._new_field("color", v);
    }
    // fill-rule
    get rule() {
        return this._new_field("rule", new TextValue("nonzero"));
    }
    set rule(v: TextValue) {
        this._new_field("rule", v);
    }
}
export class Font extends ValueSet {
    /// font-family
    get family() {
        return this._new_field("family", new TextValue("monospace"));
    }
    set family(v: TextValue) {
        this._new_field("family", v);
    }
    /// font-size
    get size() {
        return this._new_field("size", new FontSizeValue(16));
    }
    set size(v: FontSizeValue) {
        this._new_field("size", v);
    }
    /// font-style
    get style() {
        return this._new_field("style", new TextValue("normal"));
    }
    set style(v: TextValue) {
        this._new_field("style", v);
    }
    /// font-weight
    get weight() {
        return this._new_field("weight", new ScalarValue(400));
    }
    set weight(v: ScalarValue) {
        this._new_field("weight", v);
    }
    /// font-variant
    get variant() {
        return this._new_field("variant", new TextValue("normal"));
    }
    set variant(v: TextValue) {
        this._new_field("variant", v);
    }
    /// font-stretch
    get stretch() {
        return this._new_field("stretch", new TextValue("normal"));
    }
    set stretch(v: TextValue) {
        this._new_field("stretch", v);
    }
    /// font-size-adjust
    get size_adjust() {
        return this._new_field("size_adjust", new ScalarValue(1));
    }
    set size_adjust(v: ScalarValue) {
        this._new_field("size_adjust", v);
    }

    //////
    *enum_attibutes(frame: number) {
        for (let [n, _] of Object.entries(this)) {
            switch (n) {
                case "family":
                    yield { name: "font-family", value: this.family.get_repr(frame) }
                    break;
                case "size":
                    yield { name: "font-size", value: this.size.get_repr(frame) }
                    break;
                case "style":
                    yield { name: "font-style", value: this.style.get_repr(frame) }
                    break;
                case "weight":
                    yield { name: "font-weight", value: this.weight.get_repr(frame) }
                    break;
                case "variant":
                    yield { name: "font-variant", value: this.variant.get_repr(frame) }
                    break;
                case "stretch":
                    yield { name: "font-stretch", value: this.stretch.get_repr(frame) }
                    break;
                case "size-adjust":
                    yield { name: "font-size-adjust", value: this.size_adjust.get_repr(frame) }
                    break;
            }
        }

    }
}

export class Transform extends ValueSet {
    clear() {
        const o: any = this;
        if (Object.hasOwn(o, "all")) {
            delete o["all"];
        }
        if (Object.hasOwn(o, "box")) {
            delete o["box"];
        }
        if (Object.hasOwn(o, "origin")) {
            delete o["origin"];
        }
    }
    public set_repr(d: string) {
        this.clear();
        for (const str of d.split(/\)\s*,?\s*/).slice(0, -1)) {
            const kv = str.trim().split("(");
            const name = kv[0].trim();
            const args = kv[1].split(/[\s,]+/).map(function (str) {
                return parseFloat(str);
            });
            switch (name) {
                case "matrix":
                    this.add_hexad(...args);
                    break;
                case "translate":
                    this.add_translate(args[0], args[1]);
                    break;
                case "translateX":
                    this.add_translate(args[0], 0);
                    break;
                case "translateY":
                    this.add_translate(0, args[0]);
                    break;
                case "scale":
                    this.add_scale(args[0], args[1]);
                    break;
                case "rotate":
                    this.add_rotate(...args);
                    break;
                case "skewX":
                    this.add_skewx(args[0]);
                    break;
                case "skewY":
                    this.add_skewy(args[0]);
                    break;
                default:
                    throw new Error(`Unexpected transform '${name}'`);
            }
        }
    }
    get_repr(frame: number) {
        if ('all' in this) {
            return _get_repr(this.all, frame);
        }
        return '';
    }
    *enum_attibutes(frame: number) {
        if ('all' in this) {
            yield { name: "transform", value: _get_repr(this.all, frame) }
        }
    }
    cat_transform(frame: number, n: Matrix) {
        if (Object.hasOwn(this, "all")) {
            return this.all.map((x) => x.cat_transform(frame, n));
        }
    }
    get_transform(frame: number): Matrix {
        const m = MatrixMut.identity();
        if (Object.hasOwn(this, "all")) {
            this.all.map((x) => x.cat_transform(frame, m));
        }
        return m;
    }
    ///
    get all() {
        return xget(this, "all", new Array<MT>());
    }
    set all(v: Array<MT>) {
        xset(this, "all", v);
    }
    ///
    get box() {
        return this._new_field("box", new TextValue('view-box'));
    }
    set box(v: TextValue) {
        this._new_field("box", v);
    }
    ///
    get origin() {
        return this._new_field("origin", new OriginValue([0, 0]));
    }
    set origin(v: OriginValue) {
        this._new_field("origin", v);
    }
    ///
    add_translate(x: number = 0, y: number = 0) {
        const q = new MTranslate([x, y]);
        this.all.push(q);
        return q;
    }
    add_scale(x: number = 1, y: number = 1) {
        const q = new MScale([x, y]);
        this.all.push(q);
        return q;
    }
    add_rotate(deg: number = 0, x?: number, y?: number) {
        if (x != undefined) {
            if (y != undefined) {
                const q = new MRotateAt([deg, x, y]);
                this.all.push(q);
                return q;
            }
        }
        const q = new MRotation(deg);
        this.all.push(q);
        return q;

    }
    add_skewx(deg: number = 0) {
        const q = new MSkewX(deg);
        this.all.push(q);
        return q;
    }
    add_skewy(deg: number = 0) {
        const q = new MSkewY(deg);
        this.all.push(q);
        return q;
    }
    add_hexad(
        a: number = 1,
        b: number = 0,
        c: number = 0,
        d: number = 1,
        e: number = 0,
        f: number = 0
    ) {
        const q = new MHexad([a, b, c, d, e, f]);
        this.all.push(q);
        return q;
    }
    ///
    get_translate(x: number = 0) {
        return get1(this.all, x, MTranslate);
    }
    get_scale(x: number = 0) {
        return get1(this.all, x, MScale);
    }
    get_rotate(x: number = 0) {
        return get1(this.all, x, MRotation);
    }
    get_rotate_at(x: number = 0) {
        return get1(this.all, x, MRotateAt);
    }
    get_skewx(x: number = 0) {
        return get1(this.all, x, MSkewX);
    }
    get_skewy(x: number = 0) {
        return get1(this.all, x, MSkewY);
    }
    get_hexad(x: number = 0) {
        return get1(this.all, x, MHexad);
    }
    //
    override dump() {
        if (Object.hasOwn(this, "box") || Object.hasOwn(this, "origin")) {
            const o: any = {}
            if (Object.hasOwn(this, "box")) {
                o.box = this.box.dump()
            }
            if (Object.hasOwn(this, "origin")) {
                o.origin = this.origin.dump()
            }
            if (Object.hasOwn(this, "all")) {
                o.all = this.all.map((x) => x.dump());
            }
            return o;
        } else {
            if (Object.hasOwn(this, "all")) {
                return this.all.map((x) => x.dump());
            } else {
                return [];
            }
        }
    }
    // load
    override load(u: PlainValue<any>) {
        this.clear();
        const load = (u: Array<any>) => {
            u.forEach((v) => {
                switch (v._) {
                    case "t":
                        this.add_translate().load(v);
                        break;

                    case "s":
                        this.add_scale().load(v);
                        break;

                    case "r":
                        {
                            const q = new MRotation(0);
                            q.load(v);
                            this.all.push(q);
                        }
                        break;

                    case "R":
                        {
                            const q = new MRotateAt([0, 0, 0]);
                            q.load(v);
                            this.all.push(q);
                        }
                        break;

                    case "h":
                        this.add_hexad().load(v);
                        break;

                    case "x":
                        this.add_skewx().load(v);
                        break;

                    case "y":
                        this.add_skewy().load(v);
                        break;

                    default:
                        throw new Error(`Unexpected transform ${v._}`);
                }
            });
        }
        if (Array.isArray(u)) {
            return load(u);
        } else {
            const { all, box, origin } = u as any;
            if (box) {
                this.box.load(box);
            }
            if (origin) {
                this.origin.load(origin);
            }
            if (all) {
                if (Array.isArray(all)) {
                    load(all);
                } else {
                    throw new Error(`Expected array not ${JSON.stringify(u)} ('${this.constructor.name}')`)
                }
            }
            if (Object.hasOwn(this, "box") || Object.hasOwn(this, "origin") || Object.hasOwn(this, "all")) {
                return;
            }
        }
        throw new Error(`Invalid transform object ${JSON.stringify(u)} ('${this.constructor.name}')`)
    }
    ///
    override *enum_values(): Generator<Animatable<any>, void, unknown> {
        if ('all' in this) {
            for (const sub of this.all) {
                yield sub;
            }
        }
    }
    //
    prefix_hexad() {
        const m = this.all[0];
        if (!m) {
            return this.add_hexad();
        } else if (m instanceof MHexad) {
            return m;
        } else {
            const q = new MHexad([1, 0, 0, 1, 0, 0]);
            this.all.unshift(q);
            return q;
        }
    }
    //
    ref_box(frame: number) {
        if (Object.hasOwn(this, "box")) {
            switch (this.box.get_value(frame)) {
                case "view-box":
                    {
                        const [w, h] = get_element(this).get_vp_size(frame);
                        return BoundingBox.rect(0, 0, w, h);

                    }
                case "content-box":
                case "border-box":
                case "fill-box":
                case "stroke-box":
                    {
                        return get_element(this).object_bbox(frame);
                    }

            }

        }
        throw new Error(``);
    }
    // get_origin(frame: number, origin: string) {
    //     // https://drafts.csswg.org/css-transforms/#transform-origin-property
    //     let [x, y = 'center', _z = 0] = origin.split(/[\s,]+/);
    //     const len = new RefBoxLength(this, frame);
    //     return [x, y].map((v, i) => {
    //         switch (v) {
    //             case 'center':
    //                 v = '50%'; break;
    //             case 'left':
    //                 v = '0%'; break;
    //             case 'right':
    //                 v = '100%'; break;
    //             case 'top':
    //                 v = '0%'; break;
    //             case 'bottom':
    //                 v = '100%'; break;
    //         }
    //         return len.parse_len(v, i > 0 ? "y" : "x")
    //     });
    // }
}

export class RefBoxLength extends CalcLength {
    transform: Transform;
    constructor(transform: Transform, frame: number) {
        super();
        this.transform = transform;
        this.frame = frame;
    }
    override  get node() {
        return xget(this, "node", get_element(this.transform));
    }

    get ref_box() {
        const that = this.transform;

        if (Object.hasOwn(that, "box")) {
            const { frame } = this;
            switch (that.box.get_value(frame)) {
                case "view-box":
                    {
                        const [w, h] = this.node.get_vp_size(frame);
                        return xget(this, "ref_box", BoundingBox.rect(0, 0, w, h));
                    }
                case "content-box":
                case "border-box":
                case "fill-box":
                case "stroke-box":
                    {
                        return xget(this, "ref_box", this.node.object_bbox(frame));
                    }
            }
        }
        throw new Error(``);
    }
    override   get relative_length_x(): number {
        return this.ref_box.width;
    }
    override  get relative_length_y(): number {
        return this.ref_box.height;
    }
}

class OriginValue extends VectorValue {
    override parse_value(v: string): Vector {
        let [x, y = 'center', _z = 0] = v.split(/[\s,]+/);
        const len = new RefBoxLength(get_parent(this, Transform), 0);
        return new Vector([x, y].map((v, i) => {
            switch (v) {
                case 'center':
                    v = '50%'; break;
                case 'left':
                    v = '0%'; break;
                case 'right':
                    v = '100%'; break;
                case 'top':
                    v = '0%'; break;
                case 'bottom':
                    v = '100%'; break;
            }
            return len.parse_len(v, i > 0 ? "y" : "x")
        }));
        // return super.parse_value(v);
    }
}

type MT = MTranslate | MScale | MRotateAt | MSkewX | MSkewY;


function _get_repr(that: Array<MT>, frame: number) {
    return that.map((x) => x.get_repr(frame)).join(" ");
}

function get1<T>(
    that: Array<MT>,
    x: number,
    K: { new(...args: any[]): T }
): T {
    const n = find1(that, x, K);
    if (n) {
        return n;
    }
    throw new Error(`not found ${K} '${x}'`);
}

function find1<T>(
    that: Array<MT>,
    x: number = 0,
    K: { new(...args: any[]): T }
): T | void {
    for (const n of that) {
        if (n instanceof K) {
            if (!(x-- > 0)) {
                return n;
            }
        }
    }
}

class MTranslate extends PositionValue {
    override   get_repr(frame: number) {
        const [x, y] = this.get_value(frame);
        return `translate(${x} ${y})`;
    }
    cat_transform(frame: number, m: Matrix) {
        const [x, y] = this.get_value(frame);
        m.cat_self(Matrix.translate(x, y));
    }
    override dump() {
        const o = super.dump();
        o._ = "t";
        return o;
    }
}

class MScale extends VectorValue {
    override  get_repr(frame: number) {
        const [x, y] = this.get_value(frame);
        return `scale(${x} ${y})`;
    }
    cat_transform(frame: number, m: Matrix) {
        const [x, y] = this.get_value(frame);
        m.cat_self(Matrix.scale(x, y));
    }
    override dump() {
        const o = super.dump();
        o._ = "s";
        return o;
    }
}

class MRotateAt extends VectorValue {
    override  get_repr(frame: number) {
        const [a, x, y] = this.get_value(frame);
        if (x || y) {
            return `rotate(${a} ${x} ${y})`;
        }
        return `rotate(${a})`;
    }
    cat_transform(frame: number, m: Matrix) {
        const [a, x, y] = this.get_value(frame);
        m.cat_self(Matrix.rotate(a, x, y));
    }
    override dump() {
        const o = super.dump();
        o._ = "R";
        return o;
    }
}

class MRotation extends ScalarValue {
    override   get_repr(frame: number) {
        const a = this.get_value(frame);
        return `rotate(${a})`;
    }
    cat_transform(frame: number, m: Matrix) {
        const a = this.get_value(frame);
        m.cat_self(Matrix.rotate(a));
    }
    override dump() {
        const o = super.dump();
        o._ = "r";
        return o;
    }
}

class MSkewX extends ScalarValue {
    override  get_repr(frame: number) {
        const a = this.get_value(frame);
        return `skewX(${a})`;
    }
    cat_transform(frame: number, m: Matrix) {
        const a = this.get_value(frame);
        m.cat_self(Matrix.skewX(a));
    }
    override dump() {
        const o = super.dump();
        o._ = "x";
        return o;
    }
}

class MSkewY extends ScalarValue {
    override get_repr(frame: number) {
        const a = this.get_value(frame);
        return `skewY(${a})`;
    }
    cat_transform(frame: number, m: Matrix) {
        const a = this.get_value(frame);
        m.cat_self(Matrix.skewY(a));
    }
    override dump() {
        const o = super.dump();
        o._ = "y";
        return o;
    }
}

export class MHexad extends VectorValue {
    override get_repr(frame: number) {
        const [a, b, c, d, e, f] = this.get_value(frame);
        return `matrix(${a} ${b} ${c} ${d} ${e} ${f})`;
    }
    cat_transform(frame: number, m: Matrix) {
        const [a, b, c, d, e, f] = this.get_value(frame);
        m.cat_self(Matrix.hexad(a, b, c, d, e, f));
    }
    get_matrix(frame: number) {
        const [a, b, c, d, e, f] = this.get_value(frame);
        return Matrix.hexad(a, b, c, d, e, f)
    }
    set_matrix(frame: number, m: Matrix, extra?: KeyExtra) {
        const [a, b, c, d, e, f] = m.dump_hexad();
        // console.log('set_matrix', extra)
        this.key_value(frame, new Vector([a, b, c, d, e, f]), extra)
    }
    override dump() {
        const o = super.dump();
        o._ = "h";
        return o;
    }
}
