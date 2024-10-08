import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Writable } from 'stream';
import { spawn } from 'child_process';
import { Browser, BrowserLaunchArgumentOptions, LaunchOptions, ScreenshotOptions, launch } from "puppeteer";
import { Root } from "../model/root.js";
import { ffcmd2, VideoOutParams } from "./ffmpeg.js";
import { AMix } from "../utils/sound.js";

interface RenderParams {
    uri?: string,
    file?: string,
    output: string,
    width?: number,
    height?: number,
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
    bgcolor, fps
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

    const [start, end] = root.calc_time_range();
    const frames = end - start;
    const frame_rate = root.frame_rate;
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
    width = Math.floor(width);
    height = Math.floor(height);
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
            + `</head><body></body></html>`

        if (uri) {
            await fs.writeFile(fileURLToPath(uri), data);
            await page.goto(uri);
        } else {
            await page.setContent(data);
        }

        await page.evaluate(`const root = svgmotion.from_json(${JSON.stringify(root.dump())});`
            + `const svg = root.to_dom(document);`
            + `document.body.appendChild(svg);`
            // + `svg.setAttribute('shape-rendering',"geometricPrecision");`
        );

        if (bgcolor) {
            page.evaluate(`svg.style.backgroundColor = '${bgcolor}'`);
        }
        await page.evaluate(`document.body.style.height = "${height}px"`);
        await page.evaluate(`document.body.style.width = "${width}px"`);


        const div = await page.mainFrame().$('#root')
        if (!div) {
            return;
        }

        // SINK ////////////////
        if (!sink) {
            console.dir(root.sounds, { depth: 4 });
            const ff = ffcmd2(fps, [width, height], false, output, { lossless: true, ...video_params });
            const mix = AMix.new(root.sounds, { duration });
            // console.log(`AMix ${mix.get_duration()}`);
            mix.feed_ff(ff);
            const [bin, ...args] = ff.ff_params();
            console.log(`${bin} `, ...args);
            console.dir(ff, { depth: 10 });
            let ffproc = spawn(bin, args, {
                stdio: ['pipe', 'inherit', 'inherit'],
            });
            sink = ffproc.stdin;
        }
        if (!sink) {
            return;
        }

        // RUN ///////////
        const start_frame = 0;
        const end_frame = frames;
        console.log(`${frameTime(frames, frame_rate)}s ${frames} frames ${frame_rate} fps ${W}x${H} -> ${width}x${height} `);

        const sso: ScreenshotOptions = {
            type: 'png',
            omitBackground: bgcolor ? false : true,
            // clip: { x: 0, y: 0, width, height },
        };
        // DEBUG ///////////
        {
            await page.evaluate(`root.update_dom(${start_frame}); `);
            let html = await page.content();
            // console.log(html);
            await fs.writeFile('/tmp/svgmotion.html', html);
        }
        if (fps == frame_rate) {
            for (let frame = start_frame; frame < end_frame; ++frame) {
                await page.evaluate(`root.update_dom(${frame}); `);
                const screenshot = await div.screenshot(sso);
                process.stdout.write(`\r${frame} ${screenshot.byteLength} `);
                sink.write(screenshot);
            }
        } else {
            const S = Math.round(start_frame * fps / frame_rate);
            const E = Math.round(end_frame * fps / frame_rate);
            for (let f = S; f < E; ++f) {
                let frame = Math.round(f * frame_rate / fps);
                await page.evaluate(`root.update_dom(${frame}); `);
                const screenshot = await div.screenshot(sso);
                process.stdout.write(`\r${f} ${frame} ${screenshot.byteLength} `);
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
const { /*max, round,*/ floor } = Math;