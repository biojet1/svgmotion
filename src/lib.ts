export * from "./geom/index.js";
export * from "./track/index.js";
export * from "./keyframe/index.js";
export * from "./model/index.js";
export * from "./model/mixins/elements.js";
export * from "./model/mixins/parse_xml.js";
export * from "./model/mixins/dump.js";
export * from "./model/mixins/geom.js";
export * from "./model/mixins/load.js";
export * from "./model/mixins/add_elements.js";
export * from "./model/mixins/dom_stepper.js";
export * from "./model/mixins/find_node.js";
export * from "./model/mixins/image.js";
export * from "./model/mixins/sound.js";
export * from "./model/mixins/voice.js";
export * from './model/actions/audio.js';
export * from "./helper/parse_color.js";
export * from "./tts/watsontts.js";
export * from "./tts/gtts.js";
export * from './utils/sound.js';

import { Root } from "./model/root.js";
declare module "./model/root" {
    interface Root {
        save_html(file: string): Promise<void>;
        save_json(file: string): Promise<void>;
    }
}

Root.prototype.save_html = async function (file: string) {
    const o = this.dump();
    const fs = await import('fs/promises');
    const { fileURLToPath } = await import('url');
    const h = await fs.open(file, 'w');
    const c = fs.readFile(fileURLToPath(import.meta.resolve("./svgmotion.web.js")));
    await h.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">`);
    await h.write(`<style>*{box-sizing:border-box;margin:0;padding:0}body{background:0 0;overflow:hidden}</style>`);
    await h.write(`<script>${await c}</script>`);
    await h.write(`<script type="module">const root = await svgmotion.Root.load(`);
    await h.write(JSON.stringify(o));
    await h.write(`); root.animate({parent:document.body}); globalThis.root = root;</script>`);
    await h.write(`</head><body></body></html>`);
    return h.close();
}

Root.prototype.save_json = async function (file: string) {
    const o = this.dump();
    const fs = await import('fs/promises');
    const h = await fs.open(file, 'w');
    await h.write(JSON.stringify(o));
    return h.close();
}