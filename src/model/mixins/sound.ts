import { Asset } from "../root.js";
import { AudioSource } from "../../utils/sound.js";

declare module "../root" {
    interface Asset {
        as_sound(): Promise<AudioSource>;
    }
}

Asset.prototype.as_sound = async function () {
    let { id, duration, src } = this;
    if (!duration) {
        duration = await media_duration(src);
    }
    return new AudioSource({ id, duration, path: src });
}

function media_duration(path: string) {
    return import('node:child_process').then(cp =>
        cp.spawn('ffprobe', [
            '-v',
            'error',
            '-show_entries',
            'format=duration',
            '-of',
            'default=noprint_wrappers=1:nokey=1',
            path,
        ], { stdio: 'pipe' })
    ).then(async ({ stdout, stderr }) => {
        // console.log("path", path, stdout);
        if (stdout) {
            let data = "";
            for await (const chunk of stdout) {
                data += chunk;
            }
            const parsed = parseFloat(data);
            // assert(!Number.isNaN(parsed));
            // console.log("DUR", parsed);
            return parsed;
        }
        if (stderr) {
            for await (const chunk of stderr) {
                console.log(chunk);
            }
        }
        throw new Error(`cp`);
    })
}