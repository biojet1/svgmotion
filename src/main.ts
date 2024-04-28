// import { render_svg } from './index.js';
export function main() {
    const args = process.argv.slice(2);
    return import('yargs')
        .then((yargs) => yargs.default(args)).then((yinst) => {
            return yinst
                .usage('$0 <svg> <output>', 'convert svg file to png, webp, jpeg ')
                .strict()
                .help()
                .version()
                .demand(1)
                .options({
                    width: {
                        describe: 'set width',
                        type: 'number',
                    },
                    height: {
                        describe: 'set height',
                        type: 'number',
                    },
                    par: {
                        describe: 'set preserveAspectRatio',
                        type: 'string',
                    },
                    quality: {
                        describe: 'Quality of the image, between 0-100. Not applicable to png images',
                        type: 'number',
                    },
                    type: {
                        describe: `image type if piping to stdout`,
                        choices: ['png', 'jpeg', 'webp']
                    },
                    bgcolor: {
                        describe: `set backgroung color`,
                        type: 'string',
                    },
                }).argv;
        }).then((opt) => {
            // const { bgcolor, svg, quality, type, width, height } = opt;
            // let src = svg as string;
            // // console.log(opt);
            // let uri = undefined;
            // let path = undefined;
            // let output = opt.output as string;
            // if (src.indexOf('://') < 0) {
            //     path = src;
            // } else {
            //     uri = src;
            // }
            // function tp(x: string) {
            //     if (x.startsWith('p')) {
            //         return 'png';
            //     } else if (x.startsWith('j')) {
            //         return 'jpeg';
            //     } else if (x.startsWith('w')) {
            //         return 'webp';
            //     }
            //     return undefined;
            // }
            // if (!output) {
            //     throw new Error(`No output`);
            // }
            // render_svg({
            //     uri, path,
            //     output, width, height,
            //     quality, bgcolor,
            //     type: type ? tp(type) : undefined,
            // }).then((blob) => {
            //     if (blob && output == '-') {
            //         process.stdout.write(blob);
            //     }
            // });
        })
        ;
}