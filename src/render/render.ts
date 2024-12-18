import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Writable } from 'stream';
import { spawn } from 'child_process';
import { Browser, BrowserLaunchArgumentOptions, LaunchOptions, ScreenshotOptions, launch } from "puppeteer";
import { Root } from "../model/root.js";
import { ffcmd2, VideoOutParams } from "./ffmpeg.js";
import { AFilter, AMix } from "../utils/sound.js";

interface RenderParams {
    uri?: string,
    file?: string,
    output: string,
    width?: number,
    height?: number,
    start_sec?: number,
    end_sec?: number,
    par?: string,
    quality?: number,
    alpha?: boolean,
    fps?: number,
    puppeteer_options?: BrowserLaunchArgumentOptions & LaunchOptions,
    browser?: Browser,
    bgcolor?: string,
    video_params?: VideoOutParams,
    sink?: Writable,
}

export async function render_root(root: Root, {
    uri, file: _file, output, width = 0, height, par: _par, quality: _quality,
    puppeteer_options, browser, video_params = {}, sink,
    bgcolor, fps, start_sec, end_sec
}: RenderParams) {
    if (!browser) {
        if (!puppeteer_options) {
            puppeteer_options = {
                args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files", "--disable-web-security", '--enable-local-file-accesses'],
                timeout: 10000,
                //  headless: false,
                userDataDir: '/tmp'
            };
        }
        browser = await launch(puppeteer_options);
    }

    const frame_rate = root.frame_rate;
    let [start, end] = root.calc_time_range();
    let start_frame = start;
    let end_frame = end;
    if (start_sec == undefined) {
        start_sec = start / frame_rate;
    } else {
        start_frame = Math.max(start, round((start_sec ?? 0) * frame_rate));
    }
    if (end_sec == undefined) {
        start_sec = end / frame_rate;
    } else {
        end_frame = Math.min(end, round(end_sec * frame_rate));
    }
    const frames = end - start;
    const duration = frames / frame_rate;
    const view = root.view;
    const W = view.width.get_value(0);
    const H = view.height.get_value(0);

    if (!fps) {
        fps = frame_rate;
    }
    // Size
    if (!width) {
        if (height) {
            width = (height * W) / H;
        } else {
            width = W;
            height = H;
        }
    } else if (!height) {
        if (width) {
            height = (width * H) / W;
        } else {
            width = W;
            height = H;
        }
    }
    width = floor(width);
    height = floor(height);
    root.view.id = 'root';
    root.view.width.value = width;
    root.view.height.value = height;

    if (!uri) {
        uri = pathToFileURL(`${tmpdir()}/anim.html`).toString();
    }

    try {
        const page = await browser.newPage();
        const data = `<!DOCTYPE html><html><head><meta charset="UTF-8">`
            + `<style>*{box-sizing:border-box;margin:0;padding:0}body{background:0 0;overflow:hidden}</style>`
            + `<script>${await fs.readFile(fileURLToPath(import.meta.resolve("../svgmotion.web.js")))}</script>`
            + `</head><body></body>`
            + `<script>`
            + `svgmotion.Root.load(${JSON.stringify(root.dump())}).then(root=>{`
            + `const {svg, stepper} = root.dom_stepper();`
            + `document.body.appendChild(svg);`
            + `globalThis.root = root;`
            + `globalThis.stepper = stepper;`
            + `});`
            // + `svg.setAttribute('shape-rendering',"geometricPrecision");`
            + `</script>`
            + `</html>`;
        if (uri) {
            await fs.writeFile(fileURLToPath(uri), data);
            await page.goto(uri);
        } else {
            await page.setContent(data);
        }
        if (bgcolor) {
            page.evaluate(`svg.style.backgroundColor = '${bgcolor}'`);
        }
        await page.evaluate(`document.body.style.height = "${height}px"`);
        await page.evaluate(`document.body.style.width = "${width}px"`);
        await page.waitForSelector('#root', {
            visible: true,
        });
        const div = await page.mainFrame().$('#root')
        if (!div) {
            console.error(`No #root root.view.id=${root.view.id}`);
            return;
        }

        // SINK ////////////////
        if (!sink) {
            const ff = ffcmd2(fps, [width, height], false, output, { lossless: true, ...video_params });
            if (root.sounds && root.sounds.length > 0) {
                // TOD: fix assets source id, path
                console.warn("RENDER")
                console.dir(root.sounds, { depth: 4 });
                let mix: AFilter | AMix = AMix.new(root.sounds, { duration });
                if (start_frame > start || end_frame < end) {
                    mix = mix.slice(start_sec, end_sec)
                }
                console.warn(`AMix ${mix.get_duration()}`);
                mix.feed_ff(ff);
            }

            const [bin, ...args] = ff.ff_params();
            console.warn(`${bin} `, ...args);
            console.dir(ff, { depth: 10 });
            let ffproc = spawn(bin, args, {
                stdio: ['pipe', 'inherit', 'inherit'],
            });
            sink = ffproc.stdin;
        }
        if (!sink) {
            console.error(`No sink`);
            return;
        }

        // RUN ///////////

        console.warn(`${frameTime(frames, frame_rate)}s ${frames} frames ${frame_rate} fps ${W}x${H} -> ${width}x${height} `);
        const sso: ScreenshotOptions = {
            type: 'png',
            omitBackground: bgcolor ? false : true,
            // clip: { x: 0, y: 0, width, height },
        };
        // DEBUG ///////////
        {
            await page.evaluate(`stepper.step(${start_frame}); `);
            let html = await page.content();
            // console.warn(html);
            await fs.writeFile('/tmp/svgmotion.html', html);
        }
        {
            const eq = fps == frame_rate;
            const S = eq ? start_frame : round(start_frame * fps / frame_rate);
            const E = eq ? end_frame : round(end_frame * fps / frame_rate);
            for (let f = S; f <= E; ++f) {
                let frame = eq ? f : round(f * frame_rate / fps);
                await page.evaluate(`stepper.step(${frame}); `);
                const screenshot = await div.screenshot(sso);
                process.stdout.write(`\r${f} ${screenshot.byteLength} `);
                sink.write(screenshot);
            }
        }
    } finally {
        if (sink) {
            sink.end();
        }
        browser.close();
    }
}

export function frameTime(N: number, fps: number) {
    if (N === Infinity || N === -Infinity) {
        return 'IN:FI:NIT';
    }
    const u = floor((N * 1000) / fps); // miliseconds
    const [h, a] = [floor(u / (3600 * 1000)), u % (3600 * 1000)];
    const [m, b] = [floor(a / (60 * 1000)), a % (60 * 1000)];
    const [s, z] = [floor(b / 1000), b % 1000];
    return (
        `${h > 0 ? `${h > 9 ? '' : '0'}${h}:` : ''}` +
        `${m < 10 ? '0' : ''}${m}:` +
        `${s < 10 ? '0' : ''}${s}` +
        `${z <= 0
            ? ''
            : z < 10
                ? '.00' + z
                : z < 100
                    ? '.0' + z
                    : ('.' + z).replace(/0+$/, '')
        } `
    );
}

const { floor, round } = Math;