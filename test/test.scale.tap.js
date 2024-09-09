"uses strict";
import test from "tap";
import { Matrix, Vector, BoundingBox, Root, Rel, ZoomTo, Pass, Easing, AlignTo } from "svgmotion";

export function ScaleOut(parent, items, params) {
    let { dur, ...extra } = params ?? {};
    return function (track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        let bb = BoundingBox.not();
        let sx = 0.1;
        let sy = 0.1;
        let rot = 300;

        function scale(node, t, start, end) {
            const p = node.transform_under(start, parent);
            const h = node.transform.prefix_hexad();
            const u = h.get_matrix(start)
            h.set_matrix(end, p.inverse().cat(t).cat(p).cat(u), { start, ...extra })
        }

        function supply(that) {
            const { start, end } = supply;
            const [cx, cy] = bb.center;
            let m = Matrix.translate(cx, cy)
            m = m.rotate(rot);
            m = m.scale(sx, sy);
            m = m.translate(-cx, -cy);
            for (const e of items) {
                if (e instanceof BoundingBox) {
                    //
                } else {
                    scale(e, m, start, end)
                }
            }

        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame, base_frame, hint_dur) {
            if (_dur == undefined) {
                _dur = hint_dur;
            }
            bb = BoundingBox.not();
            for (const x of items) {
                if (x instanceof BoundingBox) {
                    bb.merge_self(x);
                } else {
                    x.update_bbox(bb, frame, x.transform_under(frame, parent));
                }
            }

            supply.start = frame;
            supply.end = frame + _dur;
            return supply
        };
    };
}

// function HeartBeat(shape, opt) {
//     const speed = 0.2;
//     return new TweenA(
//         [shape],
//         [
//             {scale: 1, t: 0, fillOpacity: 1, fill: null, ease: 'sine.inOut'},
//             {scale: 1.3, dur: speed, fillOpacity: 0.5, fill: 'red', ease: 'sine.inOut'},
//             {scale: 1, dur: speed, fillOpacity: 1, fill: 'pink', ease: 'sine.inOut'},
//             {scale: 1.3, dur: speed, fillOpacity: 0.5, fill: 'red', ease: 'sine.inOut'},
//             {scale: 1, dur: speed, fillOpacity: 1, fill: null, ease: 'sine.inOut'},
//         ]
//     );
// }

export function HeartBeat(parent, items, params) {
    let { dur, ...extra } = params ?? {};
    return function (track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        let bb = BoundingBox.not();
        let sx = 0.1;
        let sy = 0.1;
        let rot = 300;

        function supply(that) {
            const { start, end } = supply;
            const [cx, cy] = bb.center;
            let m = Matrix.translate(cx, cy)
            m = m.rotate(rot);
            m = m.scale(sx, sy);
            m = m.translate(-cx, -cy);
            for (const e of items) {
                if (e instanceof BoundingBox) {
                    //
                } else {
                    scale(e, m, start, end)
                }
            }


        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame, base_frame, hint_dur) {
            if (_dur == undefined) {
                _dur = hint_dur;
            }
            bb = BoundingBox.not();
            for (const x of items) {
                if (x instanceof BoundingBox) {
                    bb.merge_self(x);
                } else {
                    x.update_bbox(bb, frame, x.transform_under(frame, parent));
                }
            }

            supply.start = frame;
            supply.end = frame + _dur;
            return supply
        };
    };
}
test.test("load_svg the_quick", async (t) => {
    const anim = new Root();
    await anim.load_svg("res/the_quick.svg");
    const { view } = anim;
    view.width.set_value(384);
    view.height.set_value(216);
    let the = view.get_group("The");
    let dog = view.get_group("dog");
    let fox = view.get_group("fox");
    let quick = view.get_group("quick");
    let lazy = view.get_group("lazy");
    let bb = view.bbox_of(0, dog, the);
    // console.log(bb.dump_rect());

    const tr = anim.at(0);
    // tr.run(Pass(1))
    tr.run(ZoomTo(view, [lazy, dog]))
    tr.run(ScaleOut(view, [dog, fox], { easing: Easing.linear }))
    tr.run(ZoomTo(view, [the, dog], { easing: Easing.outexpo }))
    tr.run(Pass(1))

    anim.save_json('/tmp/scale.json')
    anim.save_html('/tmp/scale.html');
    t.end();
});
