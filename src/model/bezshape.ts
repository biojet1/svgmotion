import { Vector } from "../geom/vector.js";
import { MoveLC } from "../geom/path/command.js";
import { PlainValue, TextValue, VectorValue } from "./value.js";
import { xget, xset } from "./valuesets.js";

type PlainBezVertex = {
    v: PlainValue<any>, i: PlainValue<any>, o: PlainValue<any>
};

type PlainBezShape = {
    c: boolean; p: PlainBezVertex[]
};

class BezVertex {
    v: VectorValue;
    i: VectorValue;
    o: VectorValue;

    constructor(
        v: number[] = [0, 0],
        i: number[] = [0, 0],
        o: number[] = [0, 0],
    ) {
        this.v = new VectorValue(v);
        this.i = new VectorValue(i);
        this.o = new VectorValue(o);
    }

    dump() {
        const v = this.v.dump();
        const i = this.i.dump();
        const o = this.o.dump();
        return { v, i, o };
    }
    static load(d: PlainBezVertex) {
        const self = new BezVertex();
        self.v.load(d.v);
        self.i.load(d.i);
        self.o.load(d.o);
        return self;
    }
}

class BezShape {
    close: boolean;
    points: BezVertex[];

    constructor() {
        this.close = false;
        this.points = [];
    }

    static load(u: PlainBezShape) {
        const self = new BezShape();
        self.points.length = 0;
        self.close = u.c;
        for (const x of u.p || []) {
            self.points.push(BezVertex.load(x));
        }
        return self;
    }

    add_point(
        v: number[] = [0, 0],
        i: number[] = [0, 0],
        o: number[] = [0, 0],
    ): BezVertex {
        const x = new BezVertex(v, i, o);
        this.points.push(x);
        return x;
    }

    dump() {
        return { c: this.close, p: this.points.map(x => x.dump()) };
    }

    get_repr(frame: number) {
        let c = this.close;
        let p: BezVertex | null = null;
        let p_v: Vector | null = null;
        let o = null;

        for (const x of this.points) {
            const v = x.v.get_value(frame);
            if (o) {
                if (!p || !p_v) throw new Error("Previous point is not defined");
                o = o.curve_to(p_v.add(p.o.get_value(frame)), v.add(x.i.get_value(frame)), v);
            } else {
                o = new MoveLC(undefined, v);
            }
            p = x;
            p_v = v;
        }

        if (o && c && p && this.points.length > 1 && p_v) {
            const x = this.points[this.points.length - 1];
            const v = x.v.get_value(frame);
            o = o.curve_to(
                p_v.add(p.o.get_value(frame)), v.add(x.i.get_value(frame)), v
            ).close();
        }

        return o?.describe();
    }
}

class BezPath {
    shapes: BezShape[];

    constructor() {
        this.shapes = [];
    }

    add_shape(close = false) {
        const s = new BezShape();
        s.close = close;
        this.shapes.push(s);
        return s;
    }

    dump() {
        return this.shapes.map(x => x.dump());
    }

    get_repr(frame: number) {
        return this.shapes.filter(x => !!x).map(x => x.get_repr(frame)).join(" ");
    }
}



export class PathValue extends TextValue {
    // load
    override load(x: PlainValue<any>): void {
        super.load(x);
        const { shapes } = (x as PlainValue<any> & { shapes?: PlainBezShape[] })

        if (Object.hasOwn(this, "shapes")) {
            this.shapes.shapes = [];
        }

        if (shapes) {
            for (const x of shapes) {
                this.shapes.shapes.push(BezShape.load(x));
            }
        }
        // console.log("PathValue.load", shapes, this.get_repr(0))
    }
    //
    override dump() {
        const o = super.dump();
        if (Object.hasOwn(this, "shapes")) {
            (o as any).shapes = this.shapes.dump();
        }
        return o;
    }
    //
    get shapes() { return xget(this, "shapes", new BezPath()); }
    set shapes(b: BezPath) { xset(this, "shapes", b); }
    // 
    override get_repr(frame: number): string {
        let s = super.get_repr(frame);
        // console.log("get_repr", Object.hasOwn(this, "shapes"), s)
        if (Object.hasOwn(this, "shapes")) {
            s += this.shapes.get_repr(frame);
        }
        return s;
    }

}
