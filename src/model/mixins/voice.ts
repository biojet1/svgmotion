import { Root } from "../root.js";
import { Voice } from "../../tts/core.js";

declare module "../root" {
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
