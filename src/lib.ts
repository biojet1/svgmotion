export * from "./track/index.js";
export * from "./keyframe/index.js";
export * from "./model/index.js";
export * from "./helper/from_dom.js";
export * from "./helper/dump.js";
export * from "./helper/load.js";
export * from "./helper/parse_color.js";
export * from "./helper/find_node.js";
export * from "./helper/update_dom.js";
import { Root } from "./model/node.js";
declare module "./model/node" {
    interface Root {
        save_html(file: string): Promise<void>;
    }
}

Root.prototype.save_html = async function (file: string) {
    const o = this.dump();
    // console.log("IMP", import.meta);
    // console.log("IMP", import.meta.resolve("./svgmotion.web.js"));
    const fs = await import('fs/promises');
    const { fileURLToPath } = await import('url');
    const h = await fs.open(file, 'w');
    await h.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">`);
    await h.write(`<style>*{box-sizing:border-box;margin:0;padding:0}body{background:0 0;overflow:hidden}</style>`);
    await h.write(`<script>${await fs.readFile(fileURLToPath(import.meta.resolve("./svgmotion.web.js")))}</script>`);
    await h.write(`<script type="module">const root = svgmotion.from_json(`);
    await h.write(JSON.stringify(o));
    await h.write(`); root.animate({parent:document.body}); globalThis.root = root;</script>`);
    await h.write(`</head><body></body></html>`);
    return h.close();
}

