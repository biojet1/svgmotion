import * as lib from "./lib.js";
import { render_root } from "./render/render.js";

interface AnimMod {
    name: string;
    svg?: string;
    animate: (mod: typeof lib) => lib.Root;
}
export async function main() {
    const path = await import("path");
    const args = process.argv.slice(2);
    const yargs = await import("yargs");
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
                    .alias("h", "help")
                    .positional("script", {})
                    .options({
                        fps: {
                            describe: "frames per second",
                            type: "number",
                        },
                        output: {
                            alias: "o",
                            describe: "output file",
                            type: "string",
                        },
                        verbose: {
                            alias: "v",
                            describe: "verbosity",
                            count: true,
                        },
                    }),
            (args) => {
                // console.log("gen", args);
                const script = args.script as string;
                (
                    import(
                        cd ? path.resolve(cd, script) : script
                    ) as Promise<AnimMod>
                )
                    .then(({ animate }) => {
                        // console.log("import gen", animate);
                        return animate(lib);
                    })
                    .then((doc) => {
                        const { output } = args;
                        if (!output) {
                            console.error(`No ouput`);
                        } else if (/\.html?$/i.test(output)) {
                            return doc.save_html(output);
                        } else {
                            const blob = JSON.stringify(doc.dump());
                            return import("fs/promises")
                                .then((fs) => {
                                    if (output == '-') {
                                        process.stdout.write(blob, 'utf-8');
                                    } else {
                                        return fs.open(output, "w").then((h) =>
                                            h.write(blob).then(() => h.close())
                                        );
                                    }
                                })
                                ;
                        }
                    });
            }
        )
        .command(
            "render <input> <output>",
            "render animation file",
            (yargs) =>
                yargs
                    .help()
                    .alias("h", "help")
                    .options({
                        width: {
                            describe: "set width",
                            type: "number",
                        },
                        height: {
                            describe: "set height",
                            type: "number",
                        },
                        fps: {
                            describe: "video frame rate",
                            type: "number",
                        },
                        bgcolor: {
                            describe: `set background color`,
                            type: "string",
                        },
                        ffparams: {
                            describe: `set ffmpeg parameters`,
                            type: "string",
                        },
                    }),
            (args) => {
                const inp = args.input as (string | true);

                import("fs")
                    .then((fs) => {
                        if (inp == "-" || inp === true) {
                            return fs.readFileSync(0, { encoding: "utf8" });
                        } else {
                            return fs.readFileSync(inp, { encoding: "utf8" });
                        }
                    })
                    .then((blob) => {
                        const root = new lib.Root();
                        root.parse_json(blob);
                        const { width, height, fps, bgcolor, ffparams } = args;
                        const output = args.output as string;
                        const video_params = ffparams ? parse_loose_json(ffparams) : undefined;
                        render_root(root, {
                            width,
                            height,
                            output, fps, bgcolor, video_params
                        });
                    });
            }
        )
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
}
function parse_loose_json(obj: string) {
    return Function(`"use strict";return (${obj})`)();
}