import { Track } from "../track/index.js";
import { AudioChain } from "../utils/sound.js";
import { xget, xset } from "./valuesets.js";
import { Element } from "./base.js";
import { Container } from "./containers.js";
import { ViewPort } from "./viewport.js";

export class AnimTrack extends Track {
    root!: Root;
}

export interface PlainNode {
    tag: string;
    nodes: PlainNode[];
}

export interface PlainAsset {
    id?: string;
    path?: string;
    blob?: string;
    url?: string;
}

// export interface PlainSound {
//     ref: string;
//     filters?: any[];
// }

export interface PlainRoot {
    version: string;
    view: PlainNode;
    frame_rate: number;
    assets?: { [key: string]: PlainAsset; };
    sounds: { $: string;[key: string]: any; }[][];
}

export class Asset {
    _parent: any;
    id!: string;
    [key: string]: any;
    constructor(id: string) {
        this.id = id;
    }
    dump() {
        return Object.fromEntries(Object.entries(this).filter(([k,]) => /^[A-Za-z]+/.test(k) && k != 'id'));
    }
    static load(x: any) {
        const a = new Asset(``);
        for (const [k, v] of Object.entries(x)) {
            a[k] = v;
        }
        return a;
    }
}

export class FileAsset extends Asset {
    src: string;
    constructor(id: string, src: string) {
        super(id);
        this.src = src;
    }
}

export class Root extends Container {
    frame_rate: number = 60;
    version: string = "0.0.1";
    sounds: AudioChain[] = [];
    assets: { [key: string]: Asset; } = {};
    // view
    get view() {
        for (const c of this.children()) {
            if (c instanceof ViewPort) {
                return c;
            }
        }
        const x = new ViewPort();
        this.append_child(x);
        return x;
    }

    set_view(vp: ViewPort) {
        for (const c of this.children()) {
            if (c instanceof ViewPort) {
                c.remove();
            }
        }
        this.append_child(vp);
    }

    override add_view(): ViewPort {
        for (const c of this.children()) {
            if (c instanceof ViewPort) {
                c.remove();
            }
        }
        return super.add_view();
    }
    // etc
    at(offset: number) {
        return this.track.sub(offset);
    }
    //
    get track() {
        const tr = new AnimTrack();
        tr.frame_rate = this.frame_rate;
        tr.hint_dur = 1 * this.frame_rate;
        tr.root = this;
        return xget(this, "track", tr);
    }
    set track(v: AnimTrack) {
        xset(this, "track", v);
    }
    //
    async add_file_asset(path: string) {
        const id = crypto.randomUUID();
        const a = new FileAsset(id, path);
        a._parent = this;
        return this.assets[id] = a;
    }
    //
    static _load_svg(_src: string): Promise<Root> {
        throw new Error(`Not implemented`)
    }
    static _parse_svg(_src: string): Promise<Root> {
        throw new Error(`Not implemented`)
    }
}