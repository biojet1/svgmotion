import { Animatable } from "../model/value.js";
import { Container, Root, PlainRoot, PlainNode, Asset } from "../model/elements.js";
import { ValueSet } from "../model/valuesets.js";
import { TextData, Element } from "../model/base.js";
import { AudioSource } from "../utils/sound.js";
import { Voice } from "../tts/core.js";

declare module "../model/elements" {
    interface Container {
        dump(): any;
    }

    interface Root {
        dump(): any;
    }
}

declare module "../model/base" {
    interface TextData {
        dump(): any;
    }
    interface Element {
        dump(): any;
    }
}


Container.prototype.dump = function () {
    const o: any = { tag: (<typeof Container>this.constructor).tag };
    for (let [k, v] of Object.entries(this)) {
        if (v instanceof ValueSet || v instanceof Animatable) {
            o[k] = v.dump();
        }
    }
    const { id } = this;
    if (id) {
        o.id = id;
    }

    o.nodes = [...this.children<Element>()].map((v) =>
        v.dump()
    );
    return o;
}

Element.prototype.dump = function (): PlainNode {
    const o: any = { tag: (<typeof Container>this.constructor).tag };
    for (let [k, v] of Object.entries(this)) {
        if (v instanceof ValueSet || v instanceof Animatable) {
            o[k] = v.dump();
        }
    }
    const { id } = this;
    if (id) {
        o.id = id;
    }
    return o;
}

Root.prototype.dump = function (): PlainRoot {
    const { version, view, defs, frame_rate, assets, sounds: sounds } = this;

    return {
        version, frame_rate,
        view: view.dump(),
        sounds: sounds.map(v => v.dump()),
        defs: Object.fromEntries(
            Object.entries(defs).map(([k, v]) => [k, v.dump()])
        ),
        assets: Object.fromEntries(Object.entries(assets).map(([k, a]) => {
            if (!k || a.id !== k) {
                throw new Error(`assert k[${k}] a.id[${a.id}]`);
            }
            return [k, a.dump()];
        }
        ))
    };
}

TextData.prototype.dump = function (): any {
    const d = this.content.dump();
    (d as any).tag = "$";
    return d;
}

declare module "../model/elements" {
    interface Asset {
        as_sound(): Promise<AudioSource>;
    }
}

Asset.prototype.as_sound = async function () {
    let { id, duration, src, _parent } = this;
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
declare module "../model/elements" {
    interface Root {
        voice(voc: Voice): VoiceHelp;
    }

}

Root.prototype.voice = function (voc: Voice) {
    return new VoiceHelp(this, voc);
}

export class VoiceHelp {
    voc: Voice;
    root: Root;
    constructor(root: Root, voc: Voice) {
        // super();
        this.voc = voc;
        this.root = root;
    }
    async say(text: string) {
        const src = await this.voc.say(text);
        const asset = await this.root.add_file_asset(src.path);
        return await asset.as_sound();
    }
}