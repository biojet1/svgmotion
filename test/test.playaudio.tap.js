"uses strict";
import test from "tap";
import { Matrix, Vector, BoundingBox, Root, Play, Rel, ZoomTo, Pass, Easing, AlignTo } from "svgmotion";
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
        // console.log(`HeartBeat ${speed} ${times}`);
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
                // console.log(`set_matrix t=${t} ${start}-${end}`);
                h.set_matrix(t += speed, m1, { easing: Easing.inoutsine });
                h.set_matrix(t += speed, m0, { easing: Easing.inoutsine });
            }
            if (t !== end) {
                console.log(`Beat end ${t} ${end}`);
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
    let jumps = view.get_group("jumps");
    let brown = view.get_group("brown");
    let lazy = view.get_group("lazy");
    let the2 = view.get_group("the");
    let over = view.get_group("over");
    let bb = view.bbox_of(0, dog, the);

    const tr = anim.at(0);

    const snd2 = await anim.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-quick-jump-arcade-game-239.wav`).then(v => v.as_sound());




    tr.run(svgmo.ScaleOut([dog, fox], { easing: Easing.linear, parent: view }))
    tr.sub().run(Play(svgmo.AEval.new("sin(10*2*PI*t)*sin(880*2*PI*t)")));

    tr.run(HeartBeat(view, [lazy])).run(svgmo.Pulsate(the, { mode: '' }));
    tr.sub().run(Play(svgmo.AEval.new("sin(100*2*PI*t)*sin(80*2*PI*t)")));
    tr.run(svgmo.StretchOut([quick]));
    tr.sub().run(Play(svgmo.AEval.new("sin(10*2*PI*t)*sin(10*2*PI*t)")));
    tr.run(svgmo.ScaleOut(jumps, { anchor: ['left', 'center'] }));
    tr.sub().run(Play(snd2));
    tr.run(svgmo.ScaleIn(brown));
    tr.run(svgmo.Bounce(the2, { mode: 'out' }));
    tr.run(svgmo.Bounce(over, { mode: 'in' }));
    tr.run(svgmo.Bounce(the, { mode: '' }));



    anim.save_json('/tmp/sound.json')
    anim.save_html('/tmp/sound.html');
    t.end();
});
