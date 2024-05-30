import { Animatable, AnimatableD, Keyframes } from "./keyframes.js";

export class NVectorValue extends Animatable<NVector> {
    override lerp_value(r: number, a: NVector, b: NVector): NVector {
        return a.lerp(b, r);
    }
    override add_value(a: NVector, b: NVector): NVector {
        return a.add(b);
    }
    override check_value(x: any): NVector {
        if (x instanceof NVector) {
            return x;
        } else {
            return new NVector(x);
        }
    }
    override value_to_json(a: NVector): any {
        if (a == null) {
            return null;
        }
        return Array.from(a); // NaN -> null
    }

    override value_from_json(a: any): NVector {
        return new NVector(a);
    }

    constructor(v: NVector | Keyframes<NVector>) {
        super(v);
    }
}

export class PointsValue extends AnimatableD<number[][]> {
    override value_to_json(s: number[][]) {
        return s;
    }
    override value_from_json(a: any): number[][] {
        return a as number[][];
    }
}
export class TextValue extends AnimatableD<string> {
    override add_value(a: string, b: string): string {
        return a + "" + b;
    }
    override value_to_json(s: string) {
        return s;
    }
    override value_from_json(a: any): string {
        return a + "";
    }
}

export class RGBValue extends NVectorValue {
    static to_css_rgb([r, g, b, a]: Iterable<number>) {
        if (a == 0) {
            return "none";
        }
        return `rgb(${Math.round((r * 255) % 256)}, ${Math.round(
            (g * 255) % 256
        )}, ${Math.round((b * 255) % 256)})`;
    }
}

export class PositionValue extends NVectorValue { }

export class NumberValue extends Animatable<number> {
    override lerp_value(r: number, a: number, b: number): number {
        return a * (1 - r) + b * r;
    }
    override add_value(a: number, b: number): number {
        return a + b;
    }
    override value_to_json(v: number): any {
        return v;
    }
    override value_from_json(a: any): number {
        return a as number;
    }
    constructor(v: number | Keyframes<number> = 0) {
        super(v);
    }
}

export class NVector extends Float64Array {
    add(that: NVector) {
        return new NVector(this.map((v, i) => v + that[i]));
    }
    mul(that: NVector) {
        return new NVector(this.map((v, i) => v * that[i]));
    }
    lerp(that: NVector, t: number) {
        const u = 1 - t;
        const a = this.map((v, i) => v * u);
        const b = that.map((v, i) => v * t);
        return new NVector(a.map((v, i) => v + b[i]));
    }
}


export class Point extends NVector {
    constructor(x: number = 0, y: number = 0) {
        super([x, y]);
    }
}

export class Size extends NVector {
    constructor(w: number = 0, h: number = 0) {
        super([w, h]);
    }
}

export class RGB extends NVector {
    constructor(r: number = 0, g: number = 0, b: number = 0) {
        super([r, g, b]);
    }
}
export class RGBNone extends RGB {
    constructor() {
        super(NaN, NaN, NaN);
    }
}

