import * as lib from './lib.js';

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
