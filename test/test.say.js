"uses strict";
import test from "tap";
import { Matrix, Vector, BoundingBox, Root, Rel, ZoomTo, Pass, Easing, Par } from "svgmotion";
import * as svgmo from "svgmotion";
import { AMix } from "../dist/utils/sound.js";
import { FFRun } from "../dist/utils/ffrun.js";
import { writeFileSync } from 'fs';
test.test("Say the_quick", async (t) => {
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
    // console.log(bb.dump_rect());

    const tr = anim.at(0);
    const voc = anim.voice(new svgmo.GTTS());
    // const voc = new svgmo.GTTS();
    tr.run(svgmo.Bounce(dog));
    tr.run(svgmo.Play(await voc.say(`Hello`)));

    tr.run(Par([svgmo.Bounce(brown), svgmo.Play(await voc.say(`Goodbye`))]));

    tr.run(svgmo.Bounce(the));
    {
        const snd1 = await anim.add_file_asset(`/mnt/META/opt/animations/music/Follow_Me.mp3`);
        const snd2 = await anim.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-hard-pop-click-2364.wav`);
        let s = await snd1.as_sound();
        let t = await snd2.as_sound();
        console.log("duration", s.get_duration(), s.start, s.end);
        s = s.slice(10, 16)
        console.log("duration", s.get_duration(), s.start, s.end);
        // s = s.start_at(4)
        console.log("duration", s.get_duration(), s.start, s.end);
        s = s.fade_out(2, 'tri')
        console.log("duration", s.get_duration(), s.start, s.end);
        // s = s.pad_start(1)
        console.dir(s, { depth: 100 });
        // s = s.(2, 'tri')
        t = t.start_at(3);
        console.dir([s.dump(), t.dump()], { depth: 100 });
        console.dir(t, { depth: 100 });

        {
            let ff = new FFRun();

            let mix = new AMix([s, t]);
            mix.feed_ff(ff);

            // s.feed_ff(ff);
            console.dir(ff, { depth: 100 });
            ff.output = "/tmp/test.mp3";
            const cmd = ff.ff_params();
            console.dir(cmd);
            console.dir(cmd.join(' '));
            // writeFileSync(`/tmp/cmd.txt`, g);
            await import('node:child_process').then(cp => {
                let [bin, ...args] = cmd;
                return cp.spawn(bin, args, { stdio: 'inherit' });
            })
        }

        anim.sounds.push(s);

        // {
        //     let [bin, ...args] = ff;
        //     console.log(`${bin} `, ...args);
        //     return spawn(bin, args, {
        //         stdio: ['pipe', 'inherit', 'inherit'],
        //     });
        // }
        //    tr.run(svgmo.Audio(snd1.slice(4).anchor(2).fade_in()));
    }


    anim.save_json('/tmp/say.json')
    anim.save_html('/tmp/say.html');
    t.end();
});
