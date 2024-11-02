import { Track } from "../track/track.js";
import { AudioChain } from "../utils/sound.js";
import { xget, xset } from "./valuesets.js";
import { Container } from "./containers.js";
import { ViewPort } from "./elements.js";

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
    override calc_time_range() {
        let [s, e] = super.calc_time_range();
        if (this.sounds) {
            for (const [_k, v] of Object.entries(this.sounds)) {
                const E = this.track.to_frame(v.end);
                if (E < Infinity && E > e) {
                    e = E;
                }
                const S = this.track.to_frame(v.start);
                if (S < s) {
                    s = S;
                }
            }
        }
        return [s, e]
    }
    //
    async add_file_asset(path: string) {
        const id = crypto.randomUUID();
        const a = new FileAsset(id, path);
        a._parent = this;
        return this.assets[id] = a;
    }
    // load
    static load: (src: PlainRoot) => Promise<Root>;
    static load_svg: (_src: string) => Promise<Root>;
    // dump
    static parse_svg: (_src: string) => Promise<Root>;
    static parse_json: (src: string) => Promise<Root>;
}