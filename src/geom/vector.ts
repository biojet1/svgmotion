

export class Vector extends Float64Array {
    add(that: Vector) {
        return new Vector(this.map((v, i) => v + that[i]));
    }
    mul(that: Vector) {
        return new Vector(this.map((v, i) => v * that[i]));
    }
    neg() {
        return new Vector(this.map((v, i) => -v));
    }
    lerp(that: Vector, t: number) {
        const u = 1 - t;
        const a = this.map((v, i) => v * u);
        const b = that.map((v, i) => v * t);
        return new Vector(a.map((v, i) => v + b[i]));
    }
}
