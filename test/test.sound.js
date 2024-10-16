"uses strict";
import test from "tap";
import { Root } from "svgmotion";
import { AMix, AEval } from "../dist/utils/sound.js";
import { FFRun } from "../dist/utils/ffrun.js";
test.test("Sound 1", async (t) => {
    const root = await Root._load_svg("res/the_quick.svg");

    const snd1 = await root.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-fast-air-sweep-transition-168.wav`).then(v => v.as_sound());
    const snd2 = await root.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-quick-jump-arcade-game-239.wav`).then(v => v.as_sound());
    const snd3 = await root.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-typewriter-single-mechanical-hit-1384.wav`).then(v => v.as_sound());
    const snd4 = await root.add_file_asset(`/mnt/META/opt/animations/sfx/mixkit-mechanical-typewriter-hit-1365.wav`).then(v => v.as_sound());

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
        mix.tremolo(40, 1).feed_ff(ff);

        // s.feed_ff(ff);
        console.dir(ff, { depth: 100 });
        ff.output = "/tmp/sound2.mp3";
        // ff.args.push()
        ff.filter_script_path = "/tmp/sound2.txt";
        ff._run();
    }

    {
        let ff = new FFRun();
        let mix = new AMix([snd1.loop(3), (new AEval()).start_at(2), snd2.start_at(1), snd3.start_at(2), snd4.start_at(3)]);
        // mix.tremolo(4, .8).fade_out(1, 'tri').feed_ff(ff);
        // mix.reverse().feed_ff(ff);
        mix.feed_ff(ff);
        // s.feed_ff(ff);
        console.dir(ff, { depth: 100 });
        ff.input[0].args = ["-vn"]
        ff.input[1].args = ["-vn"]
        // ff.input[2].args = ["-vn"]
        // ff.input[3].args = ["-vn"]
        ff.filter_script_path = "/tmp/sound3.txt";
        ff.output = "/tmp/sound3.mp3";
        ff._run();
    }

    {
        let ff = new FFRun();
        snd1.loop(5).feed_ff(ff);
        ff.input[0].args = ["-vn"]
        // ff.filter_script_path = "/tmp/sound4.txt";
        ff.output = "/tmp/sound4.mp3";
        ff._run();
    }
    {
        let ff = new FFRun();
        AEval.new("0.1*sin(2*PI*(360-2.5/2)*t) | 0.1*sin(2*PI*(360+2.5/2)*t)", 5)
            .fade_out(2, 'exp')
            .fade_in(1, 'tri')
            .feed_ff(ff);
        // ff.input[0].args = ["-vn"]
        ff.filter_script_path = "/tmp/sound5.txt";
        ff.output = "/tmp/sound5.mp3";
        ff._run();
    }

    t.end();
});
