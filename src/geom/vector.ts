
const { sqrt, abs, cos, sin, atan2, PI } = Math;
const TAU = PI * 2;
export class Vector extends Float64Array {
    // **** Query methods ****
    get radians() {
        const [x, y] = this;
        let r = atan2(y, x);
        return r < 0 ? r + TAU : r;
    }
    get angle() {
        return this.radians;
    }
    get degrees() {
        return (this.radians * 180) / PI;
    }

    get grade() {
        return (this.degrees * 10) / 9;
    }
    abs_quad() {
        return this.map((v, i) => v * v).reduce(((p, c) => p + c), 0)
    }
    abs() {
        return Math.sqrt(this.abs_quad());
    }

    // **** Methods returning new Vec ****
    neg() {
        return new Vector(this.map((v, i) => -v));
    }
    clone() {
        return new Vector(this);
    }

    add(that: Vector) {
        return new Vector(this.map((v, i) => v + that[i]));
    }
    sub(that: Vector) {
        return new Vector(this.map((v, i) => v - that[i]));
    }
    mul(that: Vector | number) {
        if (typeof that === "number") {
            return new Vector(this.map((v, i) => v * that));
        }
        return new Vector(this.map((v, i) => v * that[i]));
    }
    div(factor: number) {
        return new Vector(this.map((v, i) => v / factor));
    }

    post_subtract(that: Array<number> | Vector) {
        return new Vector(this.map((v, i) => that[i] - v));
    }


    post_add(that: Array<number> | Vector) {
        return new Vector(this.map((v, i) => that[i] + v));
    }
    lerp(that: Vector, t: number) {
        const u = 1 - t;
        const a = this.map((v, i) => v * u);
        const b = that.map((v, i) => v * t);
        return new Vector(a.map((v, i) => v + b[i]));
    }

    reflect_at(p: Array<number>) {
        return this.post_subtract(p).post_add(p);
    }
    shift_x(d: number) {
        const [x, ...a] = this;
        return new Vector([x + d, ...a]);
    }

    shift_y(d: number) {
        const [x, y, ...a] = this;
        return new Vector([x, y + d, ...a]);
    }

    shift_z(d: number) {
        const [x, y, z, ...a] = this;
        return new Vector([x, y, z + d, ...a]);
    }

    with_x(x: number) {
        const [_, ...a] = this;
        return new Vector([x, ...a]);
    }

    with_y(y: number) {
        const [x, _, ...a] = this;
        return new Vector([x, y, ...a]);
    }

    with_z(z: number) {
        const [x, y, _, ...a] = this;
        return new Vector([x, y, z, ...a]);
    }

    flip_x() {
        const [x, ...a] = this;
        return new Vector([-x, ...a]);

    }

    flip_y() {
        const [x, y, ...a] = this;
        return new Vector([x, -y, ...a]);

    }

    flip_z() {
        const [x, y, z, ...a] = this;
        return new Vector([x, y, -z, ...a]);
    }

    transform(matrix: any) {

        const [x, y, ...z] = this;
        const { a, b, c, d, e, f } = matrix;
        return new Vector([a * x + c * y + e, b * x + d * y + f, ...z]);
    }
    // **** Methods etc ****
    equals(that: Vector): boolean {
        if (!that) {
            return false;
        } else if (that === this) {
            return true;
        } else {
            const A = this[Symbol.iterator]();
            const B = that[Symbol.iterator]();
            let a = A.next();
            let b = B.next();
            while (1) {
                if (a.done && b.done) {
                    return true;
                } else if (!b.done && a.value == b.value) {
                    a = A.next();
                    b = B.next();
                } else {
                    return false;
                }
            };
            return false;
        }
    }

}
