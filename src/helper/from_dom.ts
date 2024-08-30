
import { VectorValue, ScalarValue, PointsValue, RGB, RGBValue, TextValue } from "../model/value.js";
import { Node } from "../model/linked.js";
import { Item, Container, Root, Text, TSpan } from "../model/elements.js";
import { parse_css_color } from "./parse_color.js";
import { ComputeLength } from "./svg_length.js";

const NS_SVG = "http://www.w3.org/2000/svg";

const TAG_DOM: {
    [key: string]: (props: Map<string, string>, parent: Container) => Item | Container | false | 0;
} = {
    svg: function (props: Map<string, string>, parent: Container) {
        // Node
        let node = parent.add_view();
        // Properties console.info(`svg _read ${elem?.localName} ${vp.constructor.name} ${elem.viewBox.baseVal}`);
        for (const [name, value] of props.entries()) {
            switch (name) {
                case "version":
                    break;
                case "viewBox": {
                    const v = value.split(/[\s,]+/).map(parseFloat);
                    const u = node.view_box;
                    u.position.set_value([v[0], v[1]]);
                    u.size.set_value([v[2], v[3]]);
                    // console.log("viewBox", e.id, value, v, u.size.dump())
                }
                    break;
                case "preserveAspectRatio":
                    // node.fit_view.constructor.name
                    node.fit_view.set_parse_text(value, node);
                    break;
                case "zoomAndPan":
                    node.zoom_pan.set_parse_text(value, node);
                    break;
                case "height":
                    node.height.set_parse_length(value, node, name, "h");
                    break;
                case "width":
                    node.width.set_parse_length(value, node, name, "w");
                    break;
                case "y":
                    node.y.set_parse_length(value, node, name, "h");
                    break;
                case "x":
                    node.x.set_parse_length(value, node, name, "w");
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }

        return node;
    },
    rect: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_rect();
        for (const [name, value] of props.entries()) {
            switch (name) {
                case "height":
                    node.height.set_parse_length(value, node, name, "h");
                    break;
                case "width":
                    node.width.set_parse_length(value, node, name, "w");
                    break;
                case "y":
                    node.y.set_parse_length(value, node, name, "h");
                    break;
                case "x":
                    node.x.set_parse_length(value, node, name, "w");
                    break;
                case "ry":
                    node.ry.set_parse_length(value, node, name, "h");
                    break;
                case "rx":
                    node.rx.set_parse_length(value, node, name, "w");
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }

        return node;
    },
    g: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_group();
        // Properties
        for (const [name, value] of props.entries()) {
            set_common_attr(node, name, value);
        }
        return node;
    },
    path: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_path();
        for (const [name, value] of props.entries()) {
            switch (name) {
                case "d":
                    node.d.value = value;
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }
        return node;
    },
    circle: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_circle();
        // Properties
        // console.info(`PATH`, e.getAttributeNames(), e.innerHTML);
        for (const [name, value] of props.entries()) {
            // console.info(`PATH ATTR _ ${name} ${value}`);
            switch (name) {
                case "r":
                    node.r.set_parse_length(value, node, name);
                    break;
                case "cx":
                    node.cx.set_parse_length(value, node, name, "w");
                    break;
                case "cy":
                    node.cy.set_parse_length(value, node, name, "h");
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }
        return node;
    },
    ellipse: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_ellipse();
        // Properties
        // console.info(`PATH`, e.getAttributeNames(), e.innerHTML);
        for (const [name, value] of props.entries()) {
            // console.info(`PATH ATTR _ ${name} ${value}`);
            switch (name) {
                case "rx":
                    node.rx.set_parse_length(value, node, name);
                    break;
                case "ry":
                    node.ry.set_parse_length(value, node, name);
                    break;
                case "cx":
                    node.cx.set_parse_length(value, node, name);
                    break;
                case "cy":
                    node.cy.set_parse_length(value, node, name);
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }
        return node;
    },
    polygon: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_polygon();
        for (const [name, value] of props.entries()) {
            switch (name) {
                case "points":
                    node.points.set_parse_points(value, parent);
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }
        return node;
    },
    polyline: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_polyline();
        for (const [name, value] of props.entries()) {
            switch (name) {
                case "points":
                    node.points.set_parse_points(value, parent);
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }
        return node;
    },
    line: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_line();
        for (const [name, value] of props.entries()) {
            switch (name) {
                case "x1":
                    node.x1.set_parse_length(value, node, name,);
                    break;
                case "x2":
                    node.x2.set_parse_length(value, node, name,);
                    break
                case "y1":
                    node.y1.set_parse_length(value, node, name,);
                    break;
                case "y2":
                    node.y2.set_parse_length(value, node, name,);
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }
        return node;
    },
    text: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_text();
        for (const [name, value] of props.entries()) {
            switch (name) {
                case "y":
                    node.y.set_parse_length(value, node, name, "h");
                    break;
                case "x":
                    node.x.set_parse_length(value, node, name, "w");
                    break;
                case "dy":
                    node.dy.set_parse_length(value, node, name, "h");
                    break;
                case "dx":
                    node.dx.set_parse_length(value, node, name, "w");
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }
        return node;
    },
    tspan: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_tspan();
        for (const [name, value] of props.entries()) {
            switch (name) {
                case "y":
                    node.y.set_parse_length(value, node, name, "h");
                    break;
                case "x":
                    node.x.set_parse_length(value, node, name, "w");
                    break;
                case "dy":
                    node.dy.set_parse_length(value, node, name, "h");
                    break;
                case "dx":
                    node.dx.set_parse_length(value, node, name, "w");
                    break;
                default:
                    set_common_attr(node, name, value);
            }
        }
        return node;
    },


    a: (props: Map<string, string>, parent: Container) => false,
    clipPath: (props: Map<string, string>, parent: Container) => false,
    defs: (props: Map<string, string>, parent: Container) => false,
    feBlend: (props: Map<string, string>, parent: Container) => false,
    feColorMatrix: (props: Map<string, string>, parent: Container) => false,
    feComponentTransfer: (props: Map<string, string>, parent: Container) => false,
    feComposite: (props: Map<string, string>, parent: Container) => false,
    feConvolveMatrix: (props: Map<string, string>, parent: Container) => false,
    feDiffuseLighting: (props: Map<string, string>, parent: Container) => false,
    feDisplacementMap: (props: Map<string, string>, parent: Container) => false,
    feDistantLight: (props: Map<string, string>, parent: Container) => false,
    feDropShadow: (props: Map<string, string>, parent: Container) => false,
    feFlood: (props: Map<string, string>, parent: Container) => false,
    feFuncA: (props: Map<string, string>, parent: Container) => false,
    feFuncB: (props: Map<string, string>, parent: Container) => false,
    feFuncG: (props: Map<string, string>, parent: Container) => false,
    feFuncR: (props: Map<string, string>, parent: Container) => false,
    feGaussianBlur: (props: Map<string, string>, parent: Container) => false,
    feImage: (props: Map<string, string>, parent: Container) => false,
    feMerge: (props: Map<string, string>, parent: Container) => false,
    feMergeNode: (props: Map<string, string>, parent: Container) => false,
    feMorphology: (props: Map<string, string>, parent: Container) => false,
    feOffset: (props: Map<string, string>, parent: Container) => false,
    fePointLight: (props: Map<string, string>, parent: Container) => false,
    feSpecularLighting: (props: Map<string, string>, parent: Container) => false,
    feSpotLight: (props: Map<string, string>, parent: Container) => false,
    feTile: (props: Map<string, string>, parent: Container) => false,
    feTurbulence: (props: Map<string, string>, parent: Container) => false,
    filter: (props: Map<string, string>, parent: Container) => false,
    image: (props: Map<string, string>, parent: Container) => false,
    linearGradient: (props: Map<string, string>, parent: Container) => false,
    marker: (props: Map<string, string>, parent: Container) => false,
    mask: (props: Map<string, string>, parent: Container) => false,
    pattern: (props: Map<string, string>, parent: Container) => false,
    radialGradient: (props: Map<string, string>, parent: Container) => false,
    stop: (props: Map<string, string>, parent: Container) => false,
    style: (props: Map<string, string>, parent: Container) => false,
    switch: (props: Map<string, string>, parent: Container) => false,
    symbol: (props: Map<string, string>, parent: Container) => false,

    textPath: (props: Map<string, string>, parent: Container) => false,
    tref: (props: Map<string, string>, parent: Container) => false,

    use: (props: Map<string, string>, parent: Container) => false,
};


function get_root(cur: Container | Item) {
    for (let x: Node | undefined = cur; x; x = x._parent) {
        if (x instanceof Root) {
            return x;
        }
    }
    throw new Error(
        `Unexpected ${cur.constructor.name} ${cur._parent?.constructor.name}`
    );
}

function set_common_attr(
    node: Container | Item,
    name: string,
    value: string,
) {
    // console.log(
    //     `set_common_attr ${name}="${value}" ${elem.localName} ${node.constructor.name} ${style}`
    // );
    switch (name) {
        case "id":
            if (value) {
                // console.log("_set_attr ID", node.constructor.name);
                get_root(node).remember_id((node.id = value), node);
            }
            break;

        case "transform":
            if (value) {
                node.transform.set_parse_transform(value);
            }
            break;
        case "font-size":
            if (value) {
                node.font_size.set_parse_length(value, node, name);
            }
        case "font-weight":
            if (value) {
                node.font.weight.set_parse_text(value, node);
            }
            break;
        // case "font-size":
        //     if (value) {
        //         node.font.size.set_parse_text(value, node);
        //     }
        //     break;
        case "font-family":
            if (value) {
                node.font.family.set_parse_text(value, node);
            }
            break;
        case "line-height":// .text?
            if (value) {
                node.line_height.set_parse_line_height(value, node);
            }
            break;
        case "text-align":// .text?
            if (value) {
                node.text_align.set_parse_text(value, node);
            }
            break;
        case "white-space": // put<>
            if (value) {
                node.white_space.set_parse_text(value, node);
            }
            break;
        case "fill":// 
            if (value) {
                node.fill.color.set_parse_rgb(value, node);
            }
            break;
        case "fill-opacity":// 
            if (value) {
                node.fill.opacity.set_parse_percentage(value, node);
            }
            break;
        case "stroke":// 
            if (value) {
                node.stroke.color.set_parse_rgb(value, node);
            }
            break;
        case "stroke-opacity":// 
            if (value) {
                node.stroke.opacity.set_parse_percentage(value, node);
            }
            break;
        case "stroke-width":// 
            if (value) {
                node.stroke.width.set_parse_length(value, node, name);
            }
            break;
        case "stroke-miterlimit":// 
            if (value) {
                node.stroke.miter_limit.set_parse_number(value, node);
            }
            break;

        case "stroke-dasharray":// 
            if (value) {
                node.stroke.dash_array.set_parse_dashes(value, node);
            }
            break;
        case "stroke-dashoffset":// 
            if (value) {
                node.stroke.dash_offset.set_parse_length(value, node, name);
            }
            break;
        case "transform-origin":
            if (value) {
                // node.anchor.set_parse_anchor(value);
            }
        case "opacity":
            if (value) {
                node.opacity.set_parse_percentage(value, node);
            }

        case "shape-inside":
        case "paint-order":
            break;
        default:
            if (!(name.startsWith("aria-") || name.startsWith("-inkscape"))) {
                throw new Error(
                    `Unexpected attribute [${name}]="${value}" tag="${(node.constructor as any).tag}" node="${node.constructor.name}"`
                );
            }
    }
}



function walk(elem: SVGElement, parent: Container, attrs: Map<string, string>) {
    const { localName: tag } = elem;
    switch (tag) {
        case "desc":
        case "metadata":
        case "title":
        case "script":
            return;
        case "defs":
            {
                const defs = get_root(parent).defs;
                for (const sub of [...elem.children]) {
                    const { id } = sub;
                    const m = walk(sub as SVGElement, parent, attrs);
                    if (m && id) {
                        m.remove();
                        defs[id] = m;
                    }
                }
                return;
            }
    }
    const props = new Map<string, string>();
    function* enum_attrs(e: SVGElement) {
        for (const attr of e.attributes) {
            if (attr != undefined) {
                const { localName, namespaceURI, value } = attr;
                if (!namespaceURI || namespaceURI == NS_SVG) {
                    yield [localName, value];
                }
            }
        }
    }

    for (const [key, value] of enum_attrs(elem)) {
        if (key == "style") {
            for (const s of value.split(/\s*;\s*/)) {
                if (s) {
                    const i = s.indexOf(':');
                    if (i > 0) {
                        const k = s.substring(0, i).trim();
                        const v = s.substring(i + 1).trim();
                        if (k && v) {
                            const m = v.match(/(.+)\s*!\s*(\w+)$/);
                            if (m) {
                                props.set(k, m[1].trim());
                                // this._tag[k] = { priority: m[2] };
                            } else {
                                props.set(k, v);
                            }
                        }
                    }
                }
            }
        } else if (!(key.startsWith("aria-") || key.startsWith("-inkscape"))) {
            props.set(key, value);
        }
    }
    const make_node = TAG_DOM[tag];
    if (make_node) {
        // console.log(`walk-->`, tag, parent.constructor.name);
        const node = make_node(props, parent);
        // console.log(`walk<-- ${node.constructor.name}`, tag);
        if (node instanceof Container) {
            // Non-propagating values
            for (const s of ['id', 'class', 'clip-path', 'viewBox', 'preserveAspectRatio']) {
                props.delete(s);
            }
            let prev: Item | Container | undefined = undefined;

            const merged = new Map([...attrs, ...props])
            for (const child of elem.childNodes) {
                switch (child.nodeType) {
                    case 1: {
                        if ((child as Element).namespaceURI == "http://www.w3.org/2000/svg") {
                            prev = walk(child as SVGElement, node, merged);
                        }
                        break;
                    }
                    case 3:// TEXT_NODE
                    case 4: //CDATA_SECTION_NODE
                        {
                            const { textContent } = child
                            if (textContent && (node instanceof Text || node instanceof TSpan)) {
                                node.add_chars(textContent);
                            }
                            // if (textContent) {
                            //     if (prev) {
                            //         if (prev instanceof Text) {
                            //             prev.tail.set_value(textContent)
                            //         }
                            //     } else {
                            //         if (node instanceof Text) {
                            //             node.text.set_value(textContent)
                            //         }
                            //     }
                            // }
                            // child.previousSibling
                            break;
                        }
                }
            }
        } else if (node === false) {
            console.log(`tag "${tag}" not implemented`);
            return undefined;
        } else if (node instanceof Item) {
            //
        } else {
            throw new Error(`tag "${tag}"`);
        }
        return node;
    } else if (make_node === false) {
        console.log(`tag "${tag}" ignored`);
    } else {
        throw new Error(`No processor for "${tag}"`);
    }
}

export async function parse_svg(
    root: Root,
    src: string,
    opt: { xinclude?: boolean; base?: string | URL } = {}
) {
    try {
        const domspec = await import("domspec");
        const doc = domspec.DOMParser.parseString(src, "image/svg+xml");
        const base = opt.base || src;
        const top = (doc as unknown as XMLDocument).documentElement;
        // console.info(`loadrd "${src}" ${top?.localName}`);
        if (top.namespaceURI != NS_SVG) {
            throw new Error(`not svg namespace ${top.namespaceURI}`);
        } else if (top.localName != "svg") {
            throw new Error(`not svg tag ${top.localName}`);
        } else {
            walk(top as unknown as SVGSVGElement, root, new Map());
        }
    } catch (err) {
        console.error(`Failed to load "${src}"`);
        throw err;
    };
}

function load_svg_dom(parent: Container, doc: Document) {
    const top = (doc as unknown as XMLDocument).documentElement;
    // console.info(`loadrd "${src}" ${top?.localName}`);
    if (top.namespaceURI != NS_SVG) {
        throw new Error(`not svg namespace ${top.namespaceURI}`);
    }
    if (parent instanceof Root) {
        if (top.localName != "svg") {
            throw new Error(`not svg tag ${top.localName}`);
        }
    }
    walk(top as unknown as SVGSVGElement, parent, new Map());
}

async function load_svg(
    parent: Container,
    src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL } = {}
) {
    const domspec = await import("domspec");
    try {
        const doc = await domspec.DOMParser.loadXML(src, { ...opt, type: "image/svg+xml" });
        const base = opt.base || src;
        load_svg_dom(parent, doc as any as Document);
    } catch (err) {
        console.error(`Failed to load "${src}"`);
        throw err;
    }
}

async function _parse_svg(
    parent: Container,
    src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL } = {}
) {
    const domspec = await import("domspec");
    try {
        const doc = await domspec.DOMParser.loadXML(src, { ...opt, type: "image/svg+xml" });
        const base = opt.base || src;
        load_svg_dom(parent, doc as any as Document);
    } catch (err) {
        console.error(`Failed to load "${src}"`);
        throw err;
    }
}

declare module "../model/elements" {
    interface Container {
        load_svg(src: string | URL, opt: { xinclude?: boolean; base?: string | URL }): Promise<void>;
    }
    interface Root {
        load_json(src: string): void;
        parse_svg(src: string): Promise<void>;
    }
}

declare module "../model/value" {
    interface ScalarValue {
        set_parse_length(s: string, container: Container | Item, name: string, mode?: string): void;
        set_parse_number(s: string, container: Container | Item): void;
        set_parse_percentage(s: string, container: Container | Item): void;
        set_parse_line_height(s: string, container: Container | Item): void;
    }
    interface RGBValue {
        set_parse_rgb(s: string, container: Container | Item): void;
    }
    interface TextValue {
        set_parse_text(s: string, container: Container | Item): void;
    }
    interface PointsValue {
        set_parse_points(s: string, container: Container | Item): void;
    }
    interface VectorValue {
        set_parse_dashes(s: string, container: Container | Item): void;
        set_parse_anchor(s: string, container: Container | Item): void;
    }
}

Container.prototype.load_svg = async function (src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL }) {
    return load_svg(this, src, opt);
}

Root.prototype.parse_svg = async function (src: string) {
    return parse_svg(this, src);
}


ScalarValue.prototype.set_parse_number = function (s: string, parent: Container | Item) {
    this.value = parseFloat(s);
}

ScalarValue.prototype.set_parse_length = function (s: string, parent: Container | Item, name: string, mode?: string) {
    // console.log(`set_parse_length ${s} [${(parent.constructor as any).tag}:${parent.id}] [${name}]`)
    const cl = new ComputeLength(parent, 0);
    cl.length_mode = mode;
    this.value = cl.parse_len(s);
    // this.value = parse_len(s);
}

ScalarValue.prototype.set_parse_percentage = function (s: string, parent: Container | Item) {
    if (s.endsWith('%')) {
        this.value = parseFloat(s.replaceAll('%', '')) / 100;
    } else {
        this.value = parseFloat(s);
    }
}

ScalarValue.prototype.set_parse_line_height = function (s: string, parent: Container | Item) {
    if (s.endsWith('%')) {
        this.value = parseFloat(s.replaceAll('%', '')) / 100;
    } else if (s == 'normal') {
        this.value = null;
    } else {
        const cl = new ComputeLength(parent, 0);
        this.value = cl.parse_len(s);
        // this.value = parse_len(s);
    }
}

RGBValue.prototype.set_parse_rgb = function (s: string, parent: Container | Item) {
    if (s == "none") {
        this.value = null;
        return;
    }
    const c = parse_css_color(s);
    if (c == null) {
        throw new Error(`Invalid color "${s}"`);
    }
    this.value = new RGB(c[0] / 255, c[1] / 255, c[2] / 255);
}

TextValue.prototype.set_parse_text = function (s: string, parent: Container | Item) {
    this.value = s;
}

PointsValue.prototype.set_parse_points = function (s: string, parent: Container | Item) {
    const nums = s.split(/[\s,]+/).map(function (str) {
        return parseFloat(str.trim());
    });
    const points: number[][] = [];
    for (let n = nums.length - 1; n-- > 0; n--) {
        points.push([nums.shift()!, nums.shift()!]);
    }
    this.value = points;
}

VectorValue.prototype.set_parse_dashes = function (s: string, parent: Container | Item) {
    this.value = this.load_value(s.split(/[\s,]+/).map(function (str) {
        return parseFloat(str.trim());
    }));
}

VectorValue.prototype.set_parse_anchor = function (s: string, parent: Container | Item) {
    this.value = this.load_value(s.split(/[\s,]+/).map(function (str) {
        return parseFloat(str.trim());
    }));
}

Root.prototype.load_json = function (src: string) {
    return import('fs/promises').then((fs) => fs.readFile(src, { encoding: 'utf8' })).then((blob) =>
        this.parse_json(blob)
    );
}