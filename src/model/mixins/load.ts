import { PlainValue, TextValue, UnknownValue } from "../value.js";
import { Animatable } from "../value.js";
import { ValueSet } from "../valuesets.js";
import { Element } from "../base.js";
import { Root, PlainRoot, PlainNode, Asset } from "../root.js";
import { Content } from "../containers.js";
import { Container } from "../containers.js";
import { ViewPort } from "../viewport.js";
import { AFilter, ALoader, ASource } from "../../utils/sound.js";

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
                        throw new Error(`Unexpected property "${k}" (${that.constructor.name})`);
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
                    if (child.tag === "chars") {
                        if (node instanceof Content) {
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

Root.load = async function (src: PlainRoot) {
    const root = new Root();
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
        root.assets = {};
        if (assets) {
            for (const [k, v] of Object.entries(assets)) {
                v.id = k;
                root.assets[k] = Asset.load(v);
            }
        }
    }
    root.version = version;
    root.sounds = [];
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
                root.sounds.push(next);
            }
        }
    }
    // 
    {
        const vp = load_node(view, root);
        if (!(vp instanceof ViewPort)) {
            throw new Error("ViewPort expected");
        }
        root.set_view(vp);
    }
    return root;
}

Root.parse_json = function (src: string) {
    return this.load(JSON.parse(src))
}


////////////
