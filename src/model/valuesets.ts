import {

    NVector,
    NVectorValue,
    NumberValue,
    PositionValue,
    RGBValue,
    TextValue,

} from "../keyframe/value.js";
import {
    Animatable,

    ValueT, AnimBase
} from "../keyframe/keyframes.js";

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

export class ValueSet extends AnimBase {
    // [key: string]: Animatable;
    *enum_values(): Generator<Animatable<any>, void, unknown> {
        for (const sub of Object.values(this)) {
            if (sub instanceof Animatable) {
                yield sub;
            }
        }
    }
    to_json() {
        let u: any = {};
        for (let [k, v] of Object.entries(this)) {
            if (v instanceof Animatable) {
                u[k] = v.to_json();
            }
        }
        return u;
    }
    from_json(u: ValueT<any>) {
        for (let [k, v] of Object.entries(u)) {
            const p = (this as any)[k];
            if (p instanceof Animatable) {
                p.from_json(v);
            } else {
                throw new Error(`Unexpected property "${k}" (${v})`);
            }
        }
    }
}

export class Box extends ValueSet {
    constructor(position: Iterable<number>, size: Iterable<number>) {
        super();
        if (size) {
            this.size = new PositionValue(new NVector(size));
        }
        if (position) {
            this.position = new PositionValue(new NVector(position));
        }
    }
    /// size
    get size() {
        return xget(this, "size", new PositionValue(new NVector([100, 100])));
    }
    set size(v: PositionValue) {
        xset(this, "size", v);
    }
    /// position
    get position() {
        return xget(this, "position", new PositionValue(new NVector([0, 0])));
    }
    set position(v: PositionValue) {
        xset(this, "position", v);
    }
}

export class Stroke extends ValueSet {
    /// width
    get width() {
        return xget(this, "width", new NumberValue(1));
    }
    set width(v: NumberValue) {
        xset(this, "width", v);
    }
    /// opacity
    get opacity() {
        return xget(this, "opacity", new NumberValue(1));
    }
    set opacity(v: NumberValue) {
        xset(this, "opacity", v);
    }
    /// color
    get color() {
        return xget(this, "color", new RGBValue(new NVector([0, 0, 0])));
    }
    set color(v: RGBValue) {
        xset(this, "color", v);
    }
    /// stroke-miterlimit
    get miter_limit() {
        return xget(this, "miter_limit", new NumberValue(4));
    }
    set miter_limit(v: NumberValue) {
        xset(this, "miter_limit", v);
    }
    // stroke-dashoffset
    get dash_offset() {
        return xget(this, "dash_offset", new NumberValue(1));
    }
    set dash_offset(v: NumberValue) {
        xset(this, "dash_offset", v);
    }
    // stroke-array
    get dash_array() {
        return xget(this, "dash_array", new NVectorValue(new NVector([1, 1])));
    }
    set dash_array(v: NVectorValue) {
        xset(this, "dash_array", v);
    }
}

export class Fill extends ValueSet {
    /// opacity
    get opacity() {
        return xget(this, "opacity", new NumberValue(1));
    }
    set opacity(v: NumberValue) {
        xset(this, "opacity", v);
    }
    /// color
    get color() {
        return xget(this, "color", new RGBValue(new NVector([0, 0, 0])));
    }
    set color(v: RGBValue) {
        xset(this, "color", v);
    }
    //
}
export class Font extends ValueSet {
    /// weight
    get weight() {
        return xget(this, "weight", new TextValue("normal"));
    }
    set weight(v: TextValue) {
        xset(this, "weight", v);
    }
    /// size
    get size() {
        return xget(this, "size", new TextValue("normal"));
    }
    set size(v: TextValue) {
        xset(this, "size", v);
    }
    /// font-family
    get family() {
        return xget(this, "family", new TextValue("monospace"));
    }
    set family(v: TextValue) {
        xset(this, "family", v);
    }
}

export class Transform extends ValueSet {
    clear() {
        const o: any = this;
        delete o["all"];
    }
    public set_parse_transform(d: string) {
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
    ///
    get_transform_repr(frame: number) {
        if ('all' in this) {
            return col1(this.all, frame);
        }
        return '';
    }
    ///
    get all() {
        return xget(this, "all", new Array<MT>());
    }
    set all(v: Array<MT>) {
        xset(this, "all", v);
    }
    ///
    add_translate(x: number = 0, y: number = 0) {
        const q = new MTranslate(new NVector([x, y]));
        this.all.push(q);
        return q;
    }
    add_scale(x: number = 1, y: number = 1) {
        const q = new MScale(new NVector([x, y]));
        this.all.push(q);
        return q;
    }
    add_rotate(deg: number = 0, x?: number, y?: number) {
        if (x != undefined) {
            if (y != undefined) {
                const q = new MRotateAt(new NVector([deg, x, y]));
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
        const q = new MHexad(new NVector([a, b, c, d, e, f]));
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
    override to_json() {
        // if ("all" in this) {
        if (Object.hasOwn(this, "all")) {
            return this.all.map((x) => x.to_json());
        } else {
            return [];
        }
    }
    override from_json(u: ValueT<any>) {
        this.clear();
        if (Array.isArray(u)) {
            u.forEach((v) => {
                switch (v._) {
                    case "t":
                        this.add_translate().from_json(v);
                        break;

                    case "s":
                        this.add_scale().from_json(v);
                        break;

                    case "r":
                        {
                            const q = new MRotation(0);
                            q.from_json(v);
                            this.all.push(q);
                        }
                        break;

                    case "R":
                        {
                            const q = new MRotateAt(new NVector([0, 0, 0]));
                            q.from_json(v);
                            this.all.push(q);
                        }
                        break;

                    case "h":
                        this.add_hexad().from_json(v);
                        break;

                    case "x":
                        this.add_skewx().from_json(v);
                        break;

                    case "y":
                        this.add_skewy().from_json(v);
                        break;

                    default:
                        throw new Error(`Unexpected transform ${v._}`);
                }
            });
        } else {
            throw new Error(`Expected array not ${JSON.stringify(u)} ('${this.constructor.name}')`)
        }
    }
    ///
    override *enum_values(): Generator<Animatable<any>, void, unknown> {
        if ('all' in this) {
            for (const sub of this.all) {
                yield sub;
            }
        }
    }
}

type MT = MTranslate | MScale | MRotateAt | MSkewX | MSkewY;


function col1(that: Array<MT>, frame: number) {
    return that.map((x) => x.get_transform_repr(frame)).join(" ");
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

class MTranslate extends NVectorValue {
    get_transform_repr(frame: number) {
        const [x, y] = this.get_value(frame);
        return `translate(${x} ${y})`;
    }
    override to_json() {
        const o = super.to_json();
        o._ = "t";
        return o;
    }
}
class MScale extends NVectorValue {
    get_transform_repr(frame: number) {
        const [x, y] = this.get_value(frame);
        return `scale(${x} ${y})`;
    }
    override to_json() {
        const o = super.to_json();
        o._ = "s";
        return o;
    }
}

class MRotateAt extends NVectorValue {
    get_transform_repr(frame: number) {
        const [a, x, y] = this.get_value(frame);
        if (x || y) {
            return `rotate(${a} ${x} ${y})`;
        }
        return `rotate(${a})`;
    }
    override to_json() {
        const o = super.to_json();
        o._ = "R";
        return o;
    }
}

class MRotation extends NumberValue {
    get_transform_repr(frame: number) {
        const a = this.get_value(frame);
        return `rotate(${a})`;
    }
    override to_json() {
        const o = super.to_json();
        o._ = "r";
        return o;
    }
}

class MSkewX extends NumberValue {
    get_transform_repr(frame: number) {
        const a = this.get_value(frame);
        return `skewX(${a})`;
    }
    override to_json() {
        const o = super.to_json();
        o._ = "x";
        return o;
    }
}

class MSkewY extends NumberValue {
    get_transform_repr(frame: number) {
        const a = this.get_value(frame);
        return `skewY(${a})`;
    }
    override to_json() {
        const o = super.to_json();
        o._ = "y";
        return o;
    }
}

class MHexad extends NVectorValue {
    get_transform_repr(frame: number) {
        const [a, b, c, d, e, f] = this.get_value(frame);
        return `matrix(${a} ${b} ${c} ${d} ${e} ${f})`;
    }
    override to_json() {
        const o = super.to_json();
        o._ = "h";
        return o;
    }
}
