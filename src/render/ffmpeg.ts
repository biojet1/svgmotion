import { FFRun } from "../utils/ffrun.js";

export interface VideoOutParams {
    codec?: string;
    suffix?: string;
    pix_fmt?: string;
    alpha?: false;
    acodec?: string;
    preset?: string;
    crf?: number;
    lossless?: boolean;
}

export function ffcmd2(
    fps: number,
    size: [number, number],
    alpha: boolean,
    output_file: string,
    output_params: VideoOutParams
) {
    const ff = new FFRun();
    let input = ff.get_input_path("-");
    input.args = [
        ["f", "image2pipe"],
        ["s", `${size[0]}x${size[1]}`],
        ["vcodec", "png"],
        ["r", `${fps}`],
        "-an",
    ];
    ff.args = ["-hide_banner", "-v", "warning", "-stats", "-y"];
    const o = ff.output_of_path(output_file);
    o.args = Array.from(
        (function* () {
            let { suffix, pix_fmt, codec, acodec, preset, lossless, crf } =
                output_params;

            if (!codec) {
                if (output_file.endsWith(".mov")) {
                    codec = "qtrle";
                } else if (output_file.endsWith(".webm")) {
                    codec = "libvpx-vp9";
                    if (!pix_fmt) {
                        pix_fmt = "yuva420p";
                    }
                }
            }

            if (!codec) {
                if (alpha) {
                    codec = "qtrle";
                } else {
                    codec = "libx264";
                }
            }

            if (!pix_fmt) {
                if (
                    codec == "libx264" &&
                    size[0] % 2 === 0 &&
                    size[1] % 2 === 0
                ) {
                    pix_fmt = "yuv420p";
                } else if (codec == "libvpx-vp9") {
                    pix_fmt = "yuva420p";
                }
            }
            if (suffix) {
            } else if (codec.indexOf("vpx") >= 0) {
                suffix = "webm";
            } else if (codec.indexOf("qtrle") >= 0) {
                suffix = "mov";
            } else {
                suffix = "mp4";
            }

            // if (acodec) {
            //   yield ['acodec', acodec];
            // }

            if (codec) yield ["vcodec", codec];
            if (codec.indexOf("264") >= 0 || codec.indexOf("av1") >= 0) {
                if (lossless) {
                    if (crf == undefined) {
                        crf = 0;
                    }
                    if (preset == undefined) {
                        preset = "ultrafast";
                    }
                }
                if (preset) yield ["preset", preset];
                if (crf != undefined) yield ["crf", crf];
            } else if (codec.indexOf("vpx") >= 0) {
                if (lossless) {
                    yield ["lossless", "1"];
                }
            }

            if (pix_fmt) yield ["pix_fmt", pix_fmt];

            // if (tune) yield ['tune', tune];
            // if (bitrate) yield ['b', bitrate];
            // if (threads) yield ['threads', threads];
            if (acodec) {
                yield ["acodec", acodec];
            }
        })()
    );

    return ff;
}
