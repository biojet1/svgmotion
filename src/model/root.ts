import { Track } from "../track/index.js";
import { AudioChain } from "../utils/sound.js";
import { Animatable } from "./value.js";
import { xget, xset } from "./valuesets.js";
import { Element } from "./base.js";
import { Container, ViewPort, Filter } from "./containers.js";

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

export interface PlainSound {
    ref: string;
    filters?: any[];
}

export interface PlainRoot {
    version: string;
    view: PlainNode;
    defs: { [key: string]: PlainNode; };
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
    defs: { [key: string]: Element; } = {};
    all: { [key: string]: Element; } = {};
    frame_rate: number = 60;
    version: string = "0.0.1";
    working_dir?: string;
    sounds: AudioChain[] = [];
    assets: { [key: string]: Asset; } = {};
    // view
    get view() {
        let x = this.first_child();
        if (x instanceof ViewPort) {
            return x;
        } else if (!x) {
            this.remove_children();
            x = this.add_view();
        }
        if (x instanceof ViewPort) {
            return x;
        }
        throw new Error("Unexpected");
    }

    set_view(vp: ViewPort) {
        this.remove_children();
        this.append_child(vp);
    }
    override add_view(): ViewPort {
        this.remove_children();
        return super.add_view();
    }
    // etc
    remember_id(id: string, node: Element) {
        this.all[id] = node;
    }
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

    def_filter() {
        const a = new Filter();
        const id = crypto.randomUUID();
        a.id = id;
        // console.log("add_filter", id);
        return this.defs[id] = a;
    }

    override *enum_values(): Generator<Animatable<any>, void, unknown> {
        yield* super.enum_values();
        for (const elem of Object.values(this.defs)) {
            yield* elem.enum_values();
        }
    }
}