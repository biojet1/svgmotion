import { Asset, Root } from "../root.js";
import { AFilter, ALoader, ASource, AudioChain, AudioSource } from "../../utils/sound.js";

declare module "../root" {
    interface Asset {
        as_sound(): Promise<AudioSource>;
    }
}

class AudioAssetSource extends AudioSource {

    // static override load2(d: object, prev: AudioChain, root: Root) {
    //     ///
    // }
}

class Aloader2 extends ALoader {
    root: Root;
    constructor(root: Root) {
        super();
        this.root = root;
    }
    override load(d: { $: string;[key: string]: any; }, prev: AFilter | ASource): AFilter | ASource {
        if (d.$ == 'source') {
            if (d.id) {
                const a = this.root.assets[d.id];
                if (a) {
                    a.as_sound()
                }

            }
        }
        // switch (d.$) {
        //     case "asset": {
        //         return AudioAssetSource.load2(d, prev);
        //     }
        // }
        return super.load(d, prev);
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