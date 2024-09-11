"uses strict";
import test from "tap";
import { SVGDocument, XMLSerializer } from "domspec";
import { Vector, RGB, Root, Rel } from "svgmotion";
import { Matrix, BoundingBox, ZoomTo, Pass, Easing, AlignTo } from "svgmotion";
import * as svgm from "svgmotion";

export function StretchOut(parent, items, params) {
    let { dur, ...extra } = params ?? {};
    return function (track) {
        let _dur = dur == undefined ? undefined : track.to_frame(dur);
        let bb = BoundingBox.not();
        let sx = 0.1;
        let sy = 0.1;
        let rot = 300;
        const speed = track.to_frame(0.5);
        const times = 3;
        dur = 2 * speed * times;
        // let m0 = Matrix.identity();
        // console.log(`HeartBeat ${speed} ${times}`);
        function beat(node, start, end) {
            const h = node.transform.prefix_hexad();
            let t = start;
            let s = times;
            let bb = node.bounding_box(start);
            let op = node.opacity
            const { center_x: cx, bottom: cy, height: H, width: W } = bb;
            let m0 = h.get_matrix(t);
            // let m1 = Matrix.translate(cx, cy).scale(1, 2).translate(-cx, -cy).multiply(m0);
            // let m2 = Matrix.translate(0, -H * .8).translate(cx, cy).scale(1, 2).translate(-cx, -cy).multiply(m0);
            // let m3 = Matrix.translate(0, -H * 1.6).translate(cx, cy).scale(1, 1).translate(-cx, -cy).multiply(m0);

            let m2 = Matrix.translate(W, 0).translate(cx, cy).skew(45, 0).translate(-cx, -cy).multiply(m0);
            let m3 = Matrix.translate(W * 2, 0).translate(cx, cy).skew(0, 0).translate(-cx, -cy).multiply(m0);


            h.set_matrix(t, m0, { start });
            op.key_value(t, 1, { start });
            // for (; s-- > 0;) {
            // console.log(`set_matrix t=${t} ${start}-${end}`);
            // h.set_matrix(t += speed, m1, { easing: Easing.inexpo });


            h.set_matrix(t += speed, m2, { easing: Easing.inexpo });
            h.set_matrix(t += speed, m3, { easing: Easing.outexpo });
            op.key_value(t, 0, { easing: Easing.inoutexpo });

            // }
            // if (t !== end) {
            //     console.log(`Beat end ${t} ${end}`);
            // }
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


test.test("parse_svg", async (t) => {
    const anim = new Root();
    await anim.parse_svg(`<?xml version="1.0" standalone="no"?>
<svg width="200" height="200" viewBox="0 0 600 600"     xmlns="http://www.w3.org/2000/svg" version="1.1">
<svg  id="imvp" x="0" width="200" height="200"  viewBox="100 0 200 200" >
  <image href="file:///mnt/C1/media/Tabby_cat_with_blue_eyes-3336579.jpg"/>
    <rect width="464" fill="none" stroke="red" height="558"/>
</svg>
  <image opacity=".3" transform="skewX(45)" href="file:///mnt/C1/media/Tabby_cat_with_blue_eyes-3336579.jpg"/>

 <rect id="r1" fill="none" stroke="blue" data-rect="12"/>
</svg>

        `);

    const tr = anim.track;
    const imvp = anim.get_view("imvp");
    const p = imvp.view_box.position;
    const g = imvp.g_wrap();
    // g.transform.add_skewx(50)

    {
        const bb = imvp.bounding_box(0);
        const r1 = anim.get_rect("r1");
        r1.x.set_value(bb.left);
        r1.y.set_value(bb.top);
        r1.width.set_value(bb.width);
        r1.height.set_value(bb.height);

    }

    tr.run(Rel(0).by(p, [0, 0])
        .at(1).by(p, [100, 0])
        .at(2).by(p, [100, 100])
        .at(3).by(p, [0, 100])
    );

    tr.run(StretchOut(anim.view, [g]))

    tr.run(Pass(0.4));
    tr.run(svgm.FadeIn([g]))
    tr.run(Rel(1).by(p, [200, 200]));
    tr.run(svgm.FadeOut([g]));
    tr.run(Pass(0.4));
    anim.save_json('/tmp/image.json')
    anim.save_html('/tmp/image.html');
    t.end();
});
