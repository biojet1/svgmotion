"uses strict";
import test from "tap";
import { Matrix, Vector, BoundingBox, Root, Rel, ZoomTo, Pass, Easing, Par } from "svgmotion";
import * as svgmo from "svgmotion";
import { FFRun, AMix } from "../dist/utils/sound.js";
import { writeFileSync } from 'fs';
test.test("Sound 1", async (t) => {
    const anim = new Root();
    await anim.load_svg("res/the_quick.svg");






    const snd1 = anim.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-fast-air-sweep-transition-168.wav`).as_sound();
    const snd2 = anim.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-quick-jump-arcade-game-239.wav`).as_sound();
    const snd3 = anim.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-typewriter-single-mechanical-hit-1384.wav`).as_sound();
    const snd4 = anim.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-mechanical-typewriter-hit-1365.wav`).as_sound();

    // let s = snd1.as_sound();
    // let t = snd2.as_sound();
    // console.log("duration", s.get_duration(), s.start, s.end);
    // s = s.slice(10, 16)
    // console.log("duration", s.get_duration(), s.start, s.end);
    // // s = s.start_at(4)
    // console.log("duration", s.get_duration(), s.start, s.end);
    // s = s.fade_out(2, 'tri')
    // console.log("duration", s.get_duration(), s.start, s.end);
    // // s = s.pad_start(1)
    // console.dir(s, { depth: 100 });
    // // s = s.(2, 'tri')
    // t = t.start_at(3);
    // console.dir([s.dump(), t.dump()], { depth: 100 });
    // console.dir(t, { depth: 100 });

    {
        let ff = new FFRun();
        let mix = new AMix([snd1, snd2, snd3, snd4]);
        mix.feed_ff(ff);
        // s.feed_ff(ff);
        console.dir(ff, { depth: 100 });
        ff.output = "/tmp/sound1.mp3";
        ff.filter_script_path = "/tmp/sound1.txt";
        ff._run();
    }
    {
        let ff = new FFRun();
        let mix = new AMix([snd1, snd2.start_at(1), snd3.start_at(2), snd4.start_at(3)]);
        mix.feed_ff(ff);

        // s.feed_ff(ff);
        console.dir(ff, { depth: 100 });
        ff.output = "/tmp/sound2.mp3";
        ff.filter_script_path = "/tmp/sound2.txt";
        ff._run();
    }

    {
        let ff = new FFRun();
        let mix = new AMix([snd1, snd2.start_at(1), snd3.start_at(2), snd4.start_at(3)]);
        mix.fade_in(3, 'tri').feed_ff(ff);
        // s.feed_ff(ff);
        console.dir(ff, { depth: 100 });
        ff.filter_script_path = "/tmp/sound3.txt";
        ff.output = "/tmp/sound3.mp3";
        ff._run();
    }


    t.end();
});
