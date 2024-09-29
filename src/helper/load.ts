import { PlainValue, TextValue } from "../model/value.js";
import { Animatable } from "../model/value.js";
import { ValueSet } from "../model/valuesets.js";
import { Element } from "../model/base.js";
import {
    Container, Root, PlainRoot, PlainNode,
    ViewPort, Rect, Path, Line, Group,
    Ellipse, Circle, Polyline, Polygon, Image, Symbol,
    Use,
    TSpan, Text,
    Asset,
    FEGaussianBlur,
    Filter
} from "../model/elements.js";
import { AFilter, ASource, AudioChain, AudioSource } from "../utils/sound.js";

function load_properties(that: Element, props: { [key: string]: PlainValue<any> }) {
    for (let [k, v] of Object.entries(props)) {
        const p = (that as any)[k];
        if (p instanceof ValueSet || p instanceof Animatable) {
            p.load(v);
        } else {
            switch (k) {
                case 'id':
                    (that as any)[k] = v;
                    break;
                default:
                    if (k.startsWith("data-")) {
                        (that as any)[k] = new TextValue(v as any as string);
                        return;
                    }
                    throw new Error(`Unexpected property "${k}" (${v})`);
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

declare module "../model/elements" {
    interface Root {
        load(src: PlainRoot): void;
        parse_json(src: string): void;
    }

    interface Container {
        add_circle(before?: Element): Circle;
        add_ellipse(before?: Element): Ellipse;
        add_feGaussianBlur(before?: Element): FEGaussianBlur;
        add_filter(before?: Element): Filter;
        add_group(before?: Element): Group;
        add_image(before?: Element): Image;
        add_line(before?: Element): Line;
        add_path(before?: Element): Path;
        add_polygon(before?: Element): Polygon;
        add_polyline(before?: Element): Polyline;
        add_rect(before?: Element): Rect;
        add_symbol(before?: Element): Symbol;
        add_text(before?: Element): Text;
        add_tspan(before?: Element): TSpan;
        add_use(before?: Element): Use;
        add_view(before?: Element): ViewPort;

        ////
        _add_element(name: string): Element;
    }
}


export function from_json(src: PlainRoot) {
    const root = new Root();
    root.load(src);
    return root;
}

Root.prototype.load = function (src: PlainRoot) {
    const { version, view, defs, frame_rate, assets, sounds } = src;
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
    {
        this.defs = {};
        if (defs) {
            // console.log("defs:", defs);
            Object.entries(defs).map(([k, v]) => {
                // console.dir(v);
                const node = load_node(v, this);
                if (node.id !== k) {
                    throw new Error(``);
                }
                node._detach();
                this.defs[k] = node;
            });
        }
        // console.log("DEFS:", this.defs);
    }
    this.version = version;
    this.sounds = [];
    if (sounds) {
        for (const v of sounds) {
            let next: ASource | AFilter | undefined = undefined;
            for (const u of v) {
                if (next) {
                    next = AudioChain.load(u, next);
                } else {
                    next = AudioChain.load(u, next as unknown as ASource);
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
// Container.prototype.add_...
Container.prototype.add_circle = function (before?: Element) { const x = new Circle(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_ellipse = function (before?: Element) { const x = new Ellipse(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_feGaussianBlur = function (before?: Element) { const x = new FEGaussianBlur(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_filter = function (before?: Element) { const x = new Filter(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_group = function (before?: Element) { const x = new Group(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_image = function (before?: Element) { const x = new Image(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_line = function (before?: Element) { const x = new Line(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_path = function (before?: Element) { const x = new Path(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_polygon = function (before?: Element) { const x = new Polygon(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_polyline = function (before?: Element) { const x = new Polyline(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_rect = function (before?: Element) { const x = new Rect(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_symbol = function (before?: Element) { const x = new Symbol(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_text = function (before?: Element) { const x = new Text(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_tspan = function (before?: Element) { const x = new TSpan(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_use = function (before?: Element) { const x = new Use(); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_view = function (before?: Element) { const x = new ViewPort(); this.insert_before(before ?? this._end, x); return x; }

Container.prototype._add_element = function (tag: string) {
    switch (tag) {
        case "circle": return this.add_circle();
        case "ellipse": return this.add_ellipse();
        case "feGaussianBlur": return this.add_feGaussianBlur();
        case "filter": return this.add_filter();
        case "g": return this.add_group();
        case "image": return this.add_image();
        case "line": return this.add_line();
        case "path": return this.add_path();
        case "polygon": return this.add_polygon();
        case "polyline": return this.add_polyline();
        case "rect": return this.add_rect();
        case "symbol": return this.add_symbol();
        case "text": return this.add_text();
        case "tspan": return this.add_tspan();
        case "use": return this.add_use();
        case "svg": return this.add_view();
    }

    throw new Error("Unexpected tag: " + name);
}


