import { Asset, Root } from "../root.js";
import { AFilter, ALoader, ASource, AudioChain, AudioSource } from "../../utils/sound.js";

declare module "../root" {
    interface Asset {
        as_sound(): Promise<AudioSource>;
    }
}

class AudioAssetSource extends AudioSource {
    dump() {
        const d = super.dump();
        delete d.path;
        return d;
    }
}

Asset.prototype.as_sound = async function () {
    let { id, duration, src } = this;
    if (!duration) {
        duration = await media_duration(src);
    }
    return new AudioAssetSource({ id, duration, path: src });
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
        // console.warn("path", path, stdout);
        if (stdout) {
            let data = "";
            for await (const chunk of stdout) {
                data += chunk;
            }
            const parsed = parseFloat(data);
            // assert(!Number.isNaN(parsed));
            // console.warn("DUR", parsed);
            return parsed;
        }
        if (stderr) {
            for await (const chunk of stderr) {
                console.warn(chunk);
            }
        }
        throw new Error(`cp`);
    })
}