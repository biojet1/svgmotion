import { PlainValue } from "../model/value.js";
import { Animatable } from "../model/value.js";
import { ValueSet } from "../model/valuesets.js";
import {
    Container, Root, Item, PlainRoot, PlainNode,
    ViewPort, Rect, Path, Line, Group,
    Ellipse, Circle, Polyline, Polygon, Image, Symbol,
    Use,
    TSpan, Text
} from "../model/elements.js";

const TAGS: {
    [key: string]: (parent: Container) => Item | Container;
} = {
    circle: function (parent: Container) { return parent.add_circle(); },
    ellipse: function (parent: Container) { return parent.add_ellipse(); },
    g: function (parent: Container) { return parent.add_group(); },
    image: function (parent: Container) { return parent.add_image(); },
    line: function (parent: Container) { return parent.add_line(); },
    path: function (parent: Container) { return parent.add_path(); },
    polygon: function (parent: Container) { return parent.add_polygon(); },
    polyline: function (parent: Container) { return parent.add_polyline(); },
    rect: function (parent: Container) { return parent.add_rect(); },
    symbol: function (parent: Container) { return parent.add_symbol(); },
    use: function (parent: Container) { return parent.add_use(); },
    svg: function (parent: Container) { return parent.add_view(); },
    text: function (parent: Container) { return parent.add_text(); },
    tspan: function (parent: Container) { return parent.add_tspan(); },
};

function load_properties(that: any, props: { [key: string]: PlainValue<any> }) {
    for (let [k, v] of Object.entries(props)) {
        const p = that[k];
        if (p instanceof ValueSet || p instanceof Animatable) {
            p.load(v);
        } else {
            switch (k) {
                case 'id':
                    that[k] = v;
                    break;
                default:
                    throw new Error(`Unexpected property "${k}" (${v})`);
            }
        }
    }
}

function load_container(obj: PlainNode, parent: Container) {
    const { tag, nodes, ...props } = obj;
    const make_node = TAGS[tag];
    if (make_node) {
        const node = make_node(parent);
        load_properties(node, props);
        if (node instanceof Container) {
            if (nodes) {
                for (const child of nodes) {
                    if (typeof child === "string") {
                        if (node instanceof Text) {
                            node.add_chars(child);
                        } else {
                            throw new Error(`"${tag}"`);
                        }
                    } else {
                        load_container(child, node);
                    }
                }
            }
        } else if (node == undefined) {
            throw new Error(`unexpected "${tag}" `);
        } else if (!(node instanceof Item)) {
            throw new Error(`unexpected nodes in "${tag}" ${(node as any).constructor.name}`);
        }
        return node;
    } else {
        throw new Error(`No node factory for "${tag}"`);
    }
}

declare module "../model/elements" {
    interface Root {
        load(src: PlainRoot): void;
        parse_json(src: string): void;
    }

    interface Container {
        add_circle(): Circle;
        add_ellipse(): Ellipse;
        add_group(): Group;
        add_image(): Image;
        add_line(): Line;
        add_path(): Path;
        add_polygon(): Polygon;
        add_polyline(): Polyline;
        add_rect(): Rect;
        add_symbol(): Symbol;
        add_text(): Text;
        add_tspan(): TSpan;
        add_use(): Use;
        add_view(): ViewPort;
    }
}

export function from_json(src: PlainRoot) {
    const root = new Root();
    root.load(src);
    return root;
}

Root.prototype.load = function (src: PlainRoot) {
    const { version, view, defs, frame_rate } = src;
    if (!version) {
        throw new Error("No version {${Object.keys(src)}}");
    } else if (!/^\d+\.\d+\.\d+$/.test(version)) {
        throw new Error("Invalid version");
    } else if (!view) {
        throw new Error("No view");
    } else if (!frame_rate) {
        throw new Error("No frame_rate");
    }
    const vp = load_container(view, this);
    if (!(vp instanceof ViewPort)) {
        throw new Error("ViewPort expected");
    }
    this.version = version;
    this.defs = {};
    this.set_view(vp);
    if (defs) {
        Object.entries(defs).map(([k, v]) => {
            this.defs[k] = load_container(v, this);
        });
    }
}

Root.prototype.parse_json = function (src: string) {
    return this.load(JSON.parse(src))
}

Container.prototype.add_circle = function () { const x = new Circle(); this.append_child(x); return x; }
Container.prototype.add_ellipse = function () { const x = new Ellipse(); this.append_child(x); return x; }
Container.prototype.add_group = function () { const x = new Group(); this.append_child(x); return x; }
Container.prototype.add_image = function () { const x = new Image(); this.append_child(x); return x; }
Container.prototype.add_line = function () { const x = new Line(); this.append_child(x); return x; }
Container.prototype.add_path = function () { const x = new Path(); this.append_child(x); return x; }
Container.prototype.add_polygon = function () { const x = new Polygon(); this.append_child(x); return x; }
Container.prototype.add_polyline = function () { const x = new Polyline(); this.append_child(x); return x; }
Container.prototype.add_rect = function () { const x = new Rect(); this.append_child(x); return x; }
Container.prototype.add_symbol = function () { const x = new Symbol(); this.append_child(x); return x; }
Container.prototype.add_text = function () { const x = new Text(); this.append_child(x); return x; }
Container.prototype.add_tspan = function () { const x = new TSpan(); this.append_child(x); return x; }
Container.prototype.add_use = function () { const x = new Use(); this.append_child(x); return x; }
Container.prototype.add_view = function () { const x = new ViewPort(); this.append_child(x); return x; }
