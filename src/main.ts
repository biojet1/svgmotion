export * from "./model/index.js";
export * from "./track/index.js";
export * from "./model/from_dom.js";
export * from "./helper/parse_color.js";
export * from "./helper/find_node.js";
import * as lib from './index.js';
import { Doc } from "./model/node.js";
declare module "./model/node" {
    interface Doc {
        save_html(file: string): Promise<void>;
    }
}
Doc.prototype.save_html = async function (file: string) {
    const o = this.to_json();
    // console.log("IMP", import.meta);
    // console.log("IMP", import.meta.resolve("./svgmotion.web.js"));
    const fs = await import('fs/promises');
    const { fileURLToPath } = await import('url');
    const h = await fs.open(file, 'w');
    await h.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">`);
    await h.write(`<style>*{box-sizing:border-box;margin:0;padding:0}body{background:0 0;overflow:hidden}</style>`);
    await h.write(`<script>${await fs.readFile(fileURLToPath(import.meta.resolve("./svgmotion.web.js")))}</script>`);
    await h.write(`<script type="module">const doc = new svgmotion.Doc(); doc.from_json(${JSON.stringify(o)}); doc.animate({parent:document.body}); globalThis.doc = doc;</script>`);
    await h.write(`</head><body></body></html>`);
    return h.close();
}


interface AnimMod {
    name: string;
    svg?: string;
    animate: (mod: typeof lib) => lib.Doc;
}
export async function main() {
    const path = await import('path');
    const args = process.argv.slice(2);
    return import("yargs")
        .then((yargs) => {
            let cd = process.cwd();
            return yargs
                .default(args)
                .strict()
                .command(
                    "gen <script>",
                    "generate animation file",
                    (yargs) =>
                        yargs
                            .help()
                            .alias("h", "help").positional("script", {})
                            .options({
                                fps: {
                                    describe: "frames per second",
                                    type: "number",
                                },
                                output: {
                                    alias: 'o',
                                    describe: 'output file',
                                    type: "string",
                                },
                                verbose: {
                                    alias: 'v',
                                    describe: 'verbosity',
                                    count: true,
                                },
                            }),
                    (args) => {
                        console.log("gen", args);
                        const script = args.script as string;
                        (import(cd ? path.resolve(cd, script) : script) as Promise<AnimMod>).then(({ animate }) => {
                            console.log("import gen", animate);
                            return animate(lib);
                        }).then((doc) => {
                            if (args.output) {
                                return doc.save_html(args.output);
                            }
                        });
                    }
                )
                .command("render", "render animation file", {
                    jsinfile: {
                        alias: "u",
                        default: "http://yargs.js.org/",
                    },
                })
                .command("html", "convert animation file to html", {
                    jsinfile: {
                        alias: "u",
                        default: "http://yargs.js.org/",
                    },
                })
                .command("svg", "convert animation file to svg", {
                    jsinfile: {
                        alias: "u",
                        default: "http://yargs.js.org/",
                    },
                })
                .help()
                .version()
                .strictCommands()
                .demandCommand()
                .parse();
        })
        ;
}
