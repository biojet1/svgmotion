import { Vector } from "./vector.js";

const { max, min, abs } = Math;
export class BoundingInterval extends Vector {
    constructor(p?: Iterable<number>) {
        if (p) {
            let [min, max] = p;
            if (max == undefined) {
                max = min;
            }
            if (min > max) {
                super([max, min])
            } else {
                super([min, max])
            }
        } else {
            super([Infinity, -Infinity])
        }

    }
    get center() {
        const { size, minimum } = this;
        return minimum + (size / 2)
    }
    get size() {
        const { maximum, minimum } = this;
        return maximum - minimum
    }
    get minimum() {
        const [min, max] = this;
        return min
    }
    get maximum() {
        const [min, max] = this;
        return max
    }
    add(that: BoundingInterval) {
        const [a1, b1] = this;
        const [a2, b2] = that;
        return new BoundingInterval([Math.min(a1, a2), Math.max(b1, b2)]);
    }
    mul(n: BoundingInterval) {
        switch (typeof n) {
            case 'number':
                const [a, b] = this;
                return new BoundingInterval([a * n, b * n]);
        }
        const [a, b] = this;
        return new BoundingInterval([a * n[0], b * n[1]]);
    }
    neg() {
        const [a, b] = this;
        return new BoundingInterval([-a, -b]);
    }
}

export class BoundingBox {
    x: BoundingInterval;
    y: BoundingInterval;

    constructor(x?: Iterable<number>, y?: Iterable<number>) {
        this.x = new BoundingInterval(x);
        this.y = new BoundingInterval(y);
    }
    *[Symbol.iterator](): Iterator<BoundingInterval> {
        const { x, y } = this;
        yield x;
        yield y;
    }
    get width() {
        return this.x.size
    }
    get height() {
        return this.y.size
    }
    get top() {
        return this.y.minimum
    }
    get left() {
        return this.x.minimum
    }

    get bottom() {
        return this.y.maximum
    }

    get right() {
        return this.x.maximum
    }

    get center_x() {
        return this.x.center
    }

    get center_y() {
        return this.y.center
    }
    get diagonal_length() {
        const { width, height } = this;
        return (width * width + height * height) ** (0.5)
    }

    add(that: BoundingBox) {
        const [x1, y1] = this;
        const [x2, y2] = that;
        return new BoundingBox(x1.add(x2), y1.add(y2));
    }
    neg() {
        const [x, y] = this;
        return new BoundingBox(x.neg(), y.neg());
    }
    center() {
        const [x, y] = this;
        return new Vector([x.center, y.center]);
    }
    size() {
        const [x, y] = this;
        return new Vector([x.size, y.size]);
    }
    resize(delta_x: number, delta_y: number | undefined = undefined) {
        const [x, y] = this;
        const dy = delta_y ?? delta_x;
        return new BoundingBox(
            [x.minimum - delta_x, x.maximum + delta_x],
            [y.minimum - dy, y.maximum + dy]
        );
    }
    add_self(that: BoundingBox) {
        const [x1, y1] = this;
        const [x2, y2] = that;
        this.x = x1.add(x2)
        this.y = y1.add(y2)
        return this;
    }
    equals(that: BoundingBox): boolean {
        if (!that) {
            return false;
        } else if (that === this) {
            return true;
        } else {
            return this.x.equals(that.x) && this.y.equals(that.y)
        }
    }
    //// 
    static not() {
        return new BoundingBox();
    }

}
