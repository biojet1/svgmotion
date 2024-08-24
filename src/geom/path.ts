import { BoundingBox } from "./bbox.js";
import { Vector } from "./vector.js";

export class Command {
    at: Vector;
    constructor(to: Iterable<number>) {
        this.at = new Vector(to);
    }
    _get_length(prev: Command) {
        return this.at.sub(prev.at).abs();
    }
    _point_at(prev: Command, t: number) {
        const { at: from } = prev;
        return this.at.sub(prev.at).mul(t_check(t)).post_add(from);
    }
    _slope_at(prev: Command, _: number) {
        const { at: from } = prev;
        const vec = this.at.sub(from);
        return vec.div(vec.abs());
    }
    _update_bbox(prev: Command, bbox: BoundingBox) {
        const { at: [x2, y2] } = this;
        const { at: [x1, y1] } = prev;
        const [xmin, xmax] = [Math.min(x1, x2), Math.max(x1, x2)];
        const [ymin, ymax] = [Math.min(y1, y2), Math.max(y1, y2)];
        bbox.add_self(new BoundingBox([xmin, xmax], [ymin, ymax]))
    }
}

export function t_check(t: number) {
    if (t > 1) {
        return 1;
    } else if (t < 0) {
        return 0;
    }
    return t;
}

export class Line extends Command {

    _split_at(prev: Command, t: number): Command[] {
        const c = this._point_at(prev, t);
        return [new Line(c), new Move(c)];
    }

    // _transform(prev: Command, M: any) {
    //     const { at: from } = prev;
    //     const { at: to } = this;
    //     return new LineLS(_prev?.transform(M), to.transform(M));
    // }

}

export class Move extends Line {
    override  _split_at(prev: Command, t: number) {
        const c = this._point_at(prev, t);
        return [new Move(c), new Move(c)];
    }
}

export class Quad extends Command {
    readonly p: Vector;
    constructor(p: Iterable<number>, to: Iterable<number>) {
        super(to);
        this.p = new Vector(p);
    }
}

export class Cubic extends Command {
    readonly c1: Vector;
    readonly c2: Vector;
    constructor(c1: Iterable<number>, c2: Iterable<number>, to: Iterable<number>) {
        super(to);
        this.c1 = new Vector(c1);
        this.c2 = new Vector(c2);
    }
}
// export class Arc extends Command {
//     readonly rx: number;
//     readonly ry: number;
//     readonly phi: number;
//     readonly bigArc: boolean;
//     readonly sweep: boolean;
//     //
//     readonly cosφ: number;
//     readonly sinφ: number;
//     readonly rtheta: number;
//     readonly rdelta: number;
//     readonly cx: number;
//     readonly cy: number;
//     constructor(
//         rx: number,
//         ry: number,
//         φ: number,
//         bigArc: boolean | number,
//         sweep: boolean | number,
//         to: Iterable<number>
//     ) {
//         if (!(isFinite(φ) && isFinite(rx) && isFinite(ry))) throw Error(`${JSON.stringify(arguments)}`);
//         super(to);
//         // const { x: x1, y: y1 } = this.from;
//         // const { x: x2, y: y2 } = this.to;
//         // [this.phi, this.rx, this.ry, this.sinφ, this.cosφ, this.cx, this.cy, this.rtheta, this.rdelta] = arcParams(
//         // 	x1,
//         // 	y1,
//         // 	rx,
//         // 	ry,
//         // 	φ,
//         // 	(this.bigArc = !!bigArc),
//         // 	(this.sweep = !!sweep),
//         // 	x2,
//         // 	y2
//         // );
//     }
// }
// export class Path extends Array<Command> {

//     line_to(p: Iterable<number>) {
//         const c = new Line(p);
//         this.push(c);
//         return this;
//     }
//     move_to(p: Iterable<number>) {
//         const c = new Move(p);
//         this.push(c);
//         return this;
//     }
//     static move_to(p: Iterable<number>) {
//         const x = new Path();
//         return x.move_to(p);
//     }


//     update_bbox(bbox: BoundingBox) {
//         let prev: Command | null = null;
//         for (const c of this) {
//             if (prev) {
//                 c._update_bbox(prev, bbox)
//             } else {
//                 if (!(c instanceof Move)) {
//                     throw new Error(`Unexpected command ${c}`)
//                 }
//             }
//             prev = c;
//         }
//     }
//     transform(M: any) {
//         // TODO:

//     }

// }
