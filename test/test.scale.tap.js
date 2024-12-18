"uses strict";
import test from "tap";
import { Matrix, Vector, BoundingBox, Root, Rel, ZoomTo, Pass, Easing, AlignTo } from "svgmotion";
import * as svgmo from "svgmotion";


export function HeartBeat(parent, items, params) {
    let { dur, ...extra } = params ?? {};
    return function (track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        let bb = BoundingBox.not();
        let sx = 0.1;
        let sy = 0.1;
        let rot = 300;
        const speed = track.to_frame(0.2);
        const times = 3;
        dur = 2 * speed * times;
        // let m0 = Matrix.identity();
        // console.warn(`HeartBeat ${speed} ${times}`);
        function beat(node, start, end) {
            const h = node.transform.prefix_hexad();
            let t = start;
            let s = times;
            let bb = node.bounding_box(start);
            const [cx, cy] = bb.center;
            let m0 = h.get_matrix(t);
            let m1 = Matrix.translate(cx, cy).scale(1.3).translate(-cx, -cy).multiply(m0);
            // let m1 = Matrix.scale(1.3).multiply(m0);
            h.set_matrix(t, m0, { start });
            for (; s-- > 0;) {
                // console.warn(`set_matrix t=${t} ${start}-${end}`);
                h.set_matrix(t += speed, m1, { easing: Easing.inoutsine });
                h.set_matrix(t += speed, m0, { easing: Easing.inoutsine });
            }
            if (t !== end) {
                console.warn(`Beat end ${t} ${end}`);
            }
        }

        function supply(that) {
            const { start, end } = supply;
            for (const e of items) {
                if (e instanceof BoundingBox) {
                    //
                } else {
                    beat(e, start, end)
                }
            }
        };
        supply.start = -Infinity;
        supply.end = -Infinity;
        return function (frame, base_frame, hint_dur) {
            if (_dur == undefined) {
                _dur = hint_dur;
            }
            supply.start = frame;
            supply.end = frame + dur;
            return supply
        };
    };
}
test.test("_load_svg the_quick", async (t) => {
    const root = await Root.load_svg("res/the_quick.svg");
    const { view } = root;
    view.width.set_value(384);
    view.height.set_value(216);
    let the = view.get_group("The");
    let dog = view.get_group("dog");
    let fox = view.get_group("fox");
    let quick = view.get_group("quick");
    let jumps = view.get_group("jumps");
    let brown = view.get_group("brown");
    let lazy = view.get_group("lazy");
    let the2 = view.get_group("the");
    let over = view.get_group("over");
    let bb = view.bbox_of(0, dog, the);
    // console.warn(bb.dump_rect());

    const tr = root.at(0);
    // tr.run(Pass(1))
    // tr.run(ZoomTo(view, [lazy, dog]))


    tr.run(svgmo.ScaleOut([dog, fox], { easing: Easing.linear, parent: view }))
    // tr.run(svgmo.Audio(`/mnt/C1/media/Adobe_Sound_Effects-Transitions/Production Element Title Transition Bell Element 06.wav`))
    tr.sub().run(HeartBeat(view, [lazy])).run(svgmo.Pulsate(the, { mode: '' }));
    tr.sub().run(svgmo.StretchOut([quick]));
    tr.sub().run(svgmo.ScaleOut(jumps, { anchor: ['left', 'center'] }));
    tr.sub().run(svgmo.ScaleIn(brown));
    tr.sub().run(svgmo.Bounce(the2, { mode: 'out' }));
    tr.sub().run(svgmo.Bounce(over, { mode: 'in' }));
    tr.sub().run(svgmo.Bounce(the, { mode: '' }));


    // tr.run(ZoomTo(view, [the, dog], { easing: Easing.outexpo }))
    tr.run(Pass(1))
    view.shape_rendering.set_value("geometricPrecision")
    view.color_rendering.set_value("optimizeQuality")
    {
        const trc = tr.clone();
        t.ok(tr.root === root);
        t.ok(trc.root === root);
        t.not(trc === tr);
    }

    root.save_json('/tmp/scale.json')
    root.save_html('/tmp/scale.html');
    t.end();
});
