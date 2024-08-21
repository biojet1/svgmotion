import { Vector } from "./vector.js";

const { max, min, abs } = Math;
export class BoundingInterval extends Vector {
    constructor(p: Iterable<number>) {
        let [min, max] = p;
        if (max == undefined) {
            max = min;
        }
        if (min > max) {
            super([max, min])
        } else {
            super([min, max])
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

    constructor(x: Iterable<number>, y: Iterable<number>) {
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



    // def resize(self, delta_x: float, delta_y: Optional[float] = None) -> "BoundingBox":
    //     """Enlarges / shrinks a bounding box by a constant value. If only delta_x
    //     is given, each side is moved by the same amount; if delta_y is given,
    //     different deltas are applied to horizontal and vertical intervals.

    //     .. versionadded:: 1.2"""
    //     delta_y = delta_y or delta_x
    //     return BoundingBox(
    //         (self.x.minimum - delta_x, self.x.maximum + delta_x),
    //         (self.y.minimum - delta_y, self.y.maximum + delta_y),
    //     )
}

// export class Box {
//     protected _x: number;
//     protected _y: number;
//     protected _h: number;
//     protected _w: number;
//     protected constructor(x: number = NaN, y: number = NaN, width: number = NaN, height: number = NaN) {
//         this._x = x;
//         this._y = y;
//         this._w = width;
//         this._h = height;
//     }
//     clone() {
//         const { x, y, width, height } = this;

//         return Box.forRect(x, y, width, height);
//     }

//     get x() {
//         return this._x;
//     }
//     get left() {
//         return this._x;
//     }
//     get minX() {
//         return this._x;
//     }
//     get y() {
//         return this._y;
//     }
//     get top() {
//         return this._y;
//     }
//     get minY() {
//         return this._y;
//     }
//     get width() {
//         return this._w;
//     }
//     get height() {
//         return this._h;
//     }
//     get maxX() {
//         const { x, width } = this;
//         return x + width;
//     }
//     get maxY() {
//         const { y, height } = this;
//         return y + height;
//     }
//     get right() {
//         return this.maxX;
//     }
//     get bottom() {
//         return this.maxY;
//     }
//     get centerX() {
//         const { x, width } = this;
//         return x + width / 2;
//     }
//     get centerY() {
//         const { y, height } = this;
//         return y + height / 2;
//     }
//     get center() {
//         const { centerX, centerY } = this;
//         return Vec.pos(centerX, centerY);
//     }

//     withCenter(p: Iterable<number>): Box {
//         const [cx, cy] = p;
//         const { width: W, height: H } = this;
//         return Box.forRect(cx - W / 2, cy - H / 2, W, H);
//     }

//     withSize(p: Iterable<number>): Box {
//         const [w, h] = p;
//         const { x, y } = this;
//         return Box.forRect(x, y, w, h);
//     }

//     withPos(p: Iterable<number>): Box {
//         const [x, y] = p;
//         const { width, height } = this;
//         return Box.forRect(x, y, width, height);
//     }

//     withMinY(n: number): Box {
//         const { x, width, height } = this;
//         return Box.forRect(x, n, width, height);
//     }

//     withMinX(n: number): Box {
//         const { y, width, height } = this;
//         return Box.forRect(n, y, width, height);
//     }

//     // Merge rect box with another, return a new instance
//     merge(box: Box): Box {
//         if (!this.isValid()) {
//             return box;
//         } else if (!box.isValid()) {
//             return this;
//         }

//         // if (!box.isValid()) return Box.new(this);
//         // const { x: x1, y: y1, width: width1, height: height1 } = this;
//         // const { x: x2, y: y2, width: width2, height: height2 } = box;

//         // const x = min(x1, x2);
//         // const y = min(y1, y2);

//         // return Box.forRect(x, y, max(x1 + width1, x2 + width2) - x, max(y1 + height1, y2 + height2) - y);

//         const { minX: xMin1, minY: yMin1, maxX: xMax1, maxY: yMax1 } = this;
//         const { minX: xMin2, minY: yMin2, maxX: xMax2, maxY: yMax2 } = box;
//         return Box.fromExtrema(
//             min(xMin1, xMin2),
//             max(xMax1, xMax2),
//             min(yMin1, yMin2),
//             max(yMax1, yMax2)
//         );
//     }
//     // translated
//     // resized
//     inflated(h: number, v?: number): Box {
//         v = v ?? h;
//         const { x, y, width, height } = this;
//         return Box.forRect(x - h, y - v, h + width + h, v + height + v);
//     }
//     transform(m: any) {
//         let xMin = Infinity;
//         let xMax = -Infinity;
//         let yMin = Infinity;
//         let maxY = -Infinity;
//         // const {a, b, c, d, e, f} = matrix;
//         const { x, y, bottom, right } = this;
//         [Vec.pos(x, y), Vec.pos(right, y), Vec.pos(x, bottom), Vec.pos(right, bottom)].forEach(
//             function (p) {
//                 const { x, y } = p.transform(m);
//                 xMin = min(xMin, x);
//                 xMax = max(xMax, x);
//                 yMin = min(yMin, y);
//                 maxY = max(maxY, y);
//             }
//         );
//         return Box.fromExtrema(xMin, xMax, yMin, maxY);
//     }
//     is_valid() {
//         const { x, y, width, height } = this;
//         return isFinite(x) && isFinite(y) && isFinite(width) && isFinite(height);
//     }
//     is_empty() {
//         const { x, y, width, height } = this;
//         return x == 0 || y == 0 || width == 0 || height == 0;
//     }
//     // public static fromExtrema(x1: number, x2: number, y1: number, y2: number) {
//     // 	if (x1 > x2) [x1, x2] = [x2, x1];
//     // 	if (y1 > y2) [y1, y2] = [y2, y1];
//     // 	return this.forRect(x1, y1, abs(x2 - x1), abs(y2 - y1));
//     // }
//     // public static fromRect({x = 0, y = 0, width = 0, height = 0}) {
//     // 	// https://developer.mozilla.org/en-US/docs/Web/API/DOMRect/fromRect
//     // 	return this.forRect(x, y, width, height);
//     // }

// }