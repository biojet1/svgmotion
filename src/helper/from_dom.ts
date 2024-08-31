
import { Element } from "../model/base.js";
import { Item, Container, Root, Text, TSpan } from "../model/elements.js";
import "./set_attribute.js";

const NS_SVG = "http://www.w3.org/2000/svg";

const TAG_DOM: {
    [key: string]: (props: Map<string, string>, parent: Container) => Item | Container | false | 0;
} = {
    svg: function (props: Map<string, string>, parent: Container) {
        // Node
        let node = parent.add_view();
        // Properties console.info(`svg _read ${elem?.localName} ${vp.constructor.name} ${elem.viewBox.baseVal}`);
        for (const [name, value] of props.entries()) {
            node.set_attribute(name, value);
        }

        return node;
    },
    rect: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_rect();
        for (const [name, value] of props.entries()) {
            node.set_attribute(name, value);
        }
        return node;
    },
    g: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_group();
        // Properties
        for (const [name, value] of props.entries()) {
            node.set_attribute(name, value);
        }
        return node;
    },
    path: function (props: Map<string, string>, parent: Container) {
        let node = parent.add_path();
        for (const [name, value] of props.entries()) {
            node.set_attribute(name, value);
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
                    node.set_attribute(name, value);
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
                    node.set_attribute(name, value);

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
                    node.set_attribute(name, value);

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
                    node.set_attribute(name, value);

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
                    node.set_attribute(name, value);

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
                    node.set_attribute(name, value);
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
                    node.set_attribute(name, value);
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
                const defs = parent.get_root().defs;
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
                        if ((child as any)?.namespaceURI == "http://www.w3.org/2000/svg") {
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

declare module "../model/elements" {
    interface Container {
        load_svg(src: string | URL, opt: { xinclude?: boolean; base?: string | URL }): Promise<void>;
    }
    interface Root {
        load_json(src: string): void;
        parse_svg(src: string): Promise<void>;
    }
}

Container.prototype.load_svg = async function (src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL }) {
    return load_svg(this, src, opt);
}

Root.prototype.parse_svg = async function (src: string) {
    return parse_svg(this, src);
}

Root.prototype.load_json = function (src: string) {
    return import('fs/promises').then((fs) => fs.readFile(src, { encoding: 'utf8' })).then((blob) =>
        this.parse_json(blob)
    );
}