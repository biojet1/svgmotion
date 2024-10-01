import { PlainValue, TextValue } from "../value.js";
import { Animatable } from "../value.js";
import { ValueSet } from "../valuesets.js";
import { Element } from "../base.js";
import { Image, Use } from "../elements.js";
import { Root, PlainRoot, PlainNode, Asset } from "../root.js";
import { TSpan, Text } from "../text.js";
import { Container, Group, Symbol, Filter, Marker, Mask, Pattern, ClipPath } from "../containers.js";
import { ViewPort } from "../viewport.js";
import { Ellipse, Circle, Polyline, Polygon, Rect, Path, Line, } from "../shapes.js";
import { AFilter, ASource, AudioChain } from "../../utils/sound.js";
import { FEDropShadow, FEGaussianBlur } from "../filters.js";

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

export interface AddOpt {
    [key: string]: any;
    before?: Element;
}
declare module "../containers" {
    interface Container {
        add_circle(params?: AddOpt): Circle;
        add_clipPath(params?: AddOpt): ClipPath;
        add_ellipse(params?: AddOpt): Ellipse;
        add_feDropShadow(params?: AddOpt): FEDropShadow;
        add_feGaussianBlur(params?: AddOpt): FEGaussianBlur;
        add_filter(params?: AddOpt): Filter;
        add_group(params?: AddOpt): Group;
        add_image(params?: AddOpt): Image;
        add_line(params?: AddOpt): Line;
        add_marker(params?: AddOpt): Marker;
        add_mask(params?: AddOpt): Mask;
        add_path(params?: AddOpt): Path;
        add_pattern(params?: AddOpt): Pattern;
        add_polygon(params?: AddOpt): Polygon;
        add_polyline(params?: AddOpt): Polyline;
        add_rect(params?: AddOpt): Rect;
        add_symbol(params?: AddOpt): Symbol;
        add_text(params?: AddOpt): Text;
        add_tspan(params?: AddOpt): TSpan;
        add_use(params?: AddOpt): Use;
        add_view(params?: AddOpt): ViewPort;
        ////
        _add_element(name: string): Element;
    }
}
// Container.prototype.add_...
Container.prototype.add_circle = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Circle.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_clipPath = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = ClipPath.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_ellipse = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Ellipse.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_feDropShadow = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEDropShadow.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_feGaussianBlur = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = FEGaussianBlur.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_filter = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Filter.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_group = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Group.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_image = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Image.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_line = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Line.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_marker = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Marker.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_mask = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Mask.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_path = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Path.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_pattern = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Pattern.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_polygon = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Polygon.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_polyline = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Polyline.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_rect = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Rect.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_symbol = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Symbol.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_text = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Text.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_tspan = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = TSpan.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_use = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = Use.new(etc); this.insert_before(before ?? this._end, x); return x; }
Container.prototype.add_view = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = ViewPort.new(etc); this.insert_before(before ?? this._end, x); return x; }

Container.prototype._add_element = function (tag: string) {
    switch (tag) {
        case "circle": return this.add_circle();
        case "clipPath": return this.add_clipPath();
        case "ellipse": return this.add_ellipse();
        case "feDropShadow": return this.add_feDropShadow();
        case "feGaussianBlur": return this.add_feGaussianBlur();
        case "filter": return this.add_filter();
        case "g": return this.add_group();
        case "image": return this.add_image();
        case "line": return this.add_line();
        case "marker": return this.add_marker();
        case "mask": return this.add_mask();
        case "path": return this.add_path();
        case "pattern": return this.add_pattern();
        case "polygon": return this.add_polygon();
        case "polyline": return this.add_polyline();
        case "rect": return this.add_rect();
        case "symbol": return this.add_symbol();
        case "text": return this.add_text();
        case "tspan": return this.add_tspan();
        case "use": return this.add_use();
        case "svg": return this.add_view();
    }
    throw new Error("Unexpected tag: " + tag);
}