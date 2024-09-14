import { audio_graph, AudioMix } from "../utils/audio.js";
import { ff_params, Output, Input, FilterChain } from "../utils/ffparams.js";


export interface VideoOutParams {
    codec?: string,
    suffix?: string,
    pix_fmt?: string,
    alpha?: false,
    acodec?: string,
    preset?: string,
    crf?: number,
    lossless?: boolean,
}

export async function ffcmd(
    fps: number,
    size: [number, number],
    duration: number,
    alpha: boolean,
    audio_mix: AudioMix | null,
    output_file: string,
    output_params: VideoOutParams,
    input_params: any = {},
) {
    let graph = new Array<FilterChain>();
    let input: Input[] = [{
        args: [
            ['f', 'image2pipe'],
            ['s', `${size[0]}x${size[1]}`],
            ['vcodec', 'png'],
            ['r', `${fps}`],
            '-an',
        ],
        path: '-'
    }]
    {
        // verbosity > 0 && console.dir({ input, graph, audioMix }, { depth: 7 });
        if (audio_mix && audio_mix.streams && audio_mix.streams.length > 0) {
            audio_graph(audio_mix, duration, input, graph);
            if (output_params.acodec) {
                output_params.acodec = 'aac';
            }
        }
    }
    let output: Output = {
        args: Array.from(
            (function* () {
                let { suffix, pix_fmt, codec, acodec, preset, lossless, crf } = output_params;

                if (!codec) {
                    if (output_file.endsWith(".mov")) {
                        codec = 'qtrle';
                    } else if (output_file.endsWith(".webm")) {
                        codec = 'libvpx-vp9';
                    }
                }

                if (!codec) {
                    if (alpha) {
                        codec = 'qtrle';
                    } else {
                        codec = 'libx264';
                    }
                }

                if (!pix_fmt) {
                    if (codec == 'libx264' && size[0] % 2 === 0 && size[1] % 2 === 0) {
                        pix_fmt = 'yuv420p';
                    }
                }
                if (suffix) {

                } else if (codec.indexOf('vpx') >= 0) {
                    suffix = 'webm';
                } else if (codec.indexOf('qtrle') >= 0) {
                    suffix = 'mov';
                } else {
                    suffix = 'mp4';
                }


                // if (acodec) {
                //   yield ['acodec', acodec];
                // }

                if (codec) yield ['vcodec', codec];
                if (codec.indexOf('264') >= 0 || codec.indexOf('av1') >= 0) {
                    if (lossless) {
                        if (crf == undefined) {
                            crf = 0;
                        }
                        if (preset == undefined) {
                            preset = 'ultrafast';
                        }
                    }
                    if (preset) yield ['preset', preset];
                    if (crf != undefined) yield ['crf', crf];

                } else if (codec.indexOf('vpx') >= 0) {
                    if (lossless) {
                        yield ['lossless', '1'];
                    }
                }

                if (pix_fmt) yield ['pix_fmt', pix_fmt];

                // if (tune) yield ['tune', tune];
                // if (bitrate) yield ['b', bitrate];
                // if (threads) yield ['threads', threads];
                if (acodec) {
                    yield ['acodec', acodec];
                }
            })()
        ),
        path: output_file

    }


    return ff_params({
        bin: 'ffmpeg',
        args: ['-hide_banner',
            '-v', 'warning',
            '-stats',
            '-y'],
        output, input
    });
}