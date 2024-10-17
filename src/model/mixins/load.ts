import { PlainValue, TextValue, UnknownValue } from "../value.js";
import { Animatable } from "../value.js";
import { ValueSet } from "../valuesets.js";
import { Element } from "../base.js";
import { Root, PlainRoot, PlainNode, Asset } from "../root.js";
import { Text } from "../text.js";
import { Container } from "../containers.js";
import { ViewPort } from "../viewport.js";
import { AFilter, ALoader, ASource, AudioChain } from "../../utils/sound.js";

function load_properties(that: Element, props: { [key: string]: PlainValue<any> }) {
    for (let [k, v] of Object.entries(props)) {
        const p = (that as any)[k];
        if (p instanceof ValueSet || p instanceof Animatable) {
            p.load(v);
        } else {
            switch (k) {
                case 'id':
                    if (typeof v === "string") {
                        that.id = v;
                    } else {
                        throw new Error(``);
                    }
                    break;
                default:
                    if (k.startsWith("data-")) {
                        const p = ((that as any)[k] = new TextValue());
                        p.load(v);
                    } else if ((v as any).$ == '?') {
                        const p = ((that as any)[k] = new UnknownValue(""));
                        p.load(v);
                    } else {
                        throw new Error(`Unexpected property "${k}" (${v})`);
                    }
            }
        }
    }
}

function load_node(obj: PlainNode, parent: Container) {
    const { tag, nodes, ...props } = obj;
    const node = parent._add_element(tag)
    if (node) {
        load_properties(node, props);
        if (node instanceof Container) {
            if (nodes) {
                for (const child of nodes) {
                    if (child.tag === "$") {
                        if (node instanceof Text) {
                            node.add_content().content.load(child as any as PlainValue<string>);
                        } else {
                            throw new Error(`"${tag}"`);
                        }
                    } else {
                        load_node(child, node);
                    }
                }
            }
        } else if (!(node instanceof Element)) {
            throw new Error(`unexpected nodes in "${tag}" ${(node as any).constructor.name}`);
        }
        return node;
    }
    throw new Error(`No node factory for "${tag}"`);
}

declare module "../root" {
    interface Root {
        load(src: PlainRoot): void;
        parse_json(src: string): void;
    }
}

export function from_json(src: PlainRoot) {
    const root = new Root();
    root.load(src);
    return root;
}

Root.load = async function (src: PlainRoot) {
    const root = new Root();

    return root;
}

Root.parse_json = function (src: string) {
    return this.load(JSON.parse(src))
}

Root.prototype.load = function (src: PlainRoot) {
    const { version, view, frame_rate, assets, sounds } = src;
    if (!version) {
        throw new Error("No version {${Object.keys(src)}}");
    } else if (!/^\d+\.\d+\.\d+$/.test(version)) {
        throw new Error("Invalid version");
    } else if (!view) {
        throw new Error("No view");
    } else if (!frame_rate) {
        throw new Error("No frame_rate");
    }
    {
        this.assets = {};
        if (assets) {
            for (const [k, v] of Object.entries(assets)) {
                v.id = k;
                this.assets[k] = Asset.load(v);
            }
        }
    }
    this.version = version;
    this.sounds = [];
    if (sounds) {
        const ldr = new ALoader()
        for (const v of sounds) {
            let next: ASource | AFilter | undefined = undefined;
            for (const u of v) {
                if (next) {
                    next = ldr.load(u, next);
                } else {

                    next = ldr.load(u, next as unknown as ASource);
                }
            }
            if (next) {
                this.sounds.push(next);
            }
        }
    }
    // 
    {
        const vp = load_node(view, this);
        if (!(vp instanceof ViewPort)) {
            throw new Error("ViewPort expected");
        }
        this.set_view(vp);
    }
}

Root.prototype.parse_json = function (src: string) {
    return this.load(JSON.parse(src))
}
////////////
