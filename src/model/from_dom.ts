
import { ViewPort, Item, Container, Doc } from "./node.js";
import { NVector, NumberValue } from "./keyframes.js";
import { Parent, Node } from "./linked.js";

const NS_SVG = "http://www.w3.org/2000/svg";
const TAG_DOM: {
    [key: string]: (elem: SVGElement, parent: Container) => Item | Container;
} = {
    svg: function (e: SVGElement, parent: Container) {
        let elem = e as SVGSVGElement;
        // Node
        let node = parent.add_view();
        // Defs
        {
            for (const child of [...e.children]) {
                const { id, namespaceURI, localName } = child;
                if (localName == "defs" && namespaceURI == NS_SVG) {
                    const defs = get_root(node).defs;
                    child.remove();
                    for (const sub of [...child.children]) {
                        const m = walk(sub as SVGElement, node);
                        m.remove();
                        defs[id] = m;
                    }
                }
            }
        }
        // Properties console.info(`svg _read ${elem?.localName} ${vp.constructor.name} ${elem.viewBox.baseVal}`);
        for (const [name, value] of enum_attrs(e)) {
            switch (name) {
                case "version":
                    break;
                case "viewBox": {
                    const v = value.split(/[\s,]+/).map(parseFloat);
                    const u = node.view_box;
                    u.position.value = new NVector([v[0], v[1]]);
                    u.size.value = new NVector([v[2], v[3]]);
                }
                    break;
                case "preserveAspectRatio":
                    node.fit_view.parse_value(value);
                    break;
                case "zoomAndPan":
                    node.zoom_pan.parse_value(value);
                    break;
                case "height":
                    node.height.parse_value(value);
                    break;
                case "width":
                    node.width.parse_value(value);
                    break;
                case "y":
                    node.y.parse_value(value);
                    break;
                case "x":
                    node.y.parse_value(value);
                    break;
                default:
                    set_common_attr(node, name, value, e);
            }
        }

        return node;
    },
    rect: function (e: SVGElement, parent: Container) {
        let node = parent.add_rect();
        for (const [name, value] of enum_attrs(e)) {
            switch (name) {
                case "height":
                    node.height.parse_value(value);
                    break;
                case "width":
                    node.width.parse_value(value);
                    break;
                case "y":
                    node.y.parse_value(value);
                    break;
                case "x":
                    node.x.parse_value(value);
                    break;
                case "ry":
                    node.ry.parse_value(value);
                    break;
                case "rx":
                    node.rx.parse_value(value);
                    break;
                default:
                    set_common_attr(node, name, value, e);
            }
        }

        return node;
    },
    g: function (e: SVGElement, parent: Container) {
        let node = parent.add_group();
        // Properties
        for (const [name, value] of enum_attrs(e)) {
            set_common_attr(node, name, value, e);
        }
        return node;
    },
    path: function (e: SVGElement, parent: Container) {
        let node = parent.add_path();
        // Properties
        // console.info(`PATH`, e.getAttributeNames(), e.innerHTML);
        for (const [name, value] of enum_attrs(e)) {
            // console.info(`PATH ATTR _ ${name} ${value}`);
            switch (name) {
                case "d":
                    node.d.value = value;
                    break;
                default:
                    set_common_attr(node, name, value, e);
            }
        }
        return node;
    },
    circle: function (e: SVGElement, parent: Container) {
        let node = parent.add_circle();
        // Properties
        // console.info(`PATH`, e.getAttributeNames(), e.innerHTML);
        for (const [name, value] of enum_attrs(e)) {
            // console.info(`PATH ATTR _ ${name} ${value}`);
            switch (name) {
                case "r":
                    node.r.parse_value(value);
                    break;
                case "cx":
                    node.cx.parse_value(value);
                    break;
                case "cy":
                    node.cy.parse_value(value);
                    break;
                default:
                    set_common_attr(node, name, value, e);
            }
        }
        return node;
    },


};


function get_root(cur: Container | Item) {
    for (let x: Node | undefined = cur; x; x = x._parent) {
        if (x instanceof Doc) {
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
    elem: SVGElement,
    style: boolean = false
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
                node.transform.parse(value);
            }
            break;
        case "font-weight":
            if (value) {
                node.font.weight.parse_value(value);
            }
            break;
        case "font-size":
            if (value) {
                node.font.size.parse_value(value);
            }
            break;
        case "font-family":
            if (value) {
                node.font.family.parse_value(value);
            }
            break;
        case "line-height":// .text?
            if (value) {
                node.line_height.parse_value(value);
            }
            break;
        case "text-align":// .text?
            if (value) {
                node.text_align.parse_value(value);
            }
            break;
        case "white-space":// .text?
            if (value) {
                node.white_space.parse_value(value);
            }
            break;
        case "fill":// 
            if (value) {
                node.fill.color.parse_value(value);
            }
            break;
        case "stroke":// 
            if (value) {
                node.stroke.color.parse_value(value);
            }
            break;
        case "stroke-opacity":// 
            if (value) {
                node.stroke.opacity.parse_value(value);
            }
            break;
        case "stroke-width":// 
            if (value) {
                node.stroke.width.parse_value(value);
            }
            break;
        case "stroke-miterlimit":// 
            if (value) {
                node.stroke.miter_limit.parse_value(value);
            }
            break;

        case "stroke-dasharray":// 
            if (value) {
                node.stroke.dash_array.parse_value(value);
            }
            break;
        case "stroke-dashoffset":// 
            if (value) {
                node.stroke.dash_offset.parse_value(value);
            }
            break;
        case "style":
            const asm = elem.attributeStyleMap;
            for (const [sname, value] of asm.entries()) {
                console.log("STYLE", sname, value, value.constructor.name, style);
                set_common_attr(node, sname, value.toString(), elem, true);
            }
            break;
        case "shape-inside":
            break;


        default:
            if (!(name.startsWith("aria-") || name.startsWith("-inkscape"))) {
                // console.log(
                //     `set_common_attr No ${name}="${value}" ${elem.localName} ${node.constructor.name} ${style}`
                // );
                throw new Error(
                    `Unexpected attribute [${name}]="${value}" tag="${elem.localName}" node="${node.constructor.name}"`
                );
            }
    }
}

function* enum_attrs(e: SVGElement) {
    const attrs = e.attributes;
    for (let i = attrs.length; i-- > 0;) {
        const attr = attrs[i];
        // console.log(`enum_attrs`, e.localName, localName, namespaceURI);
        if (attr != undefined) {
            const { localName, namespaceURI, value } = attr;
            // console.log(`enum_attrs`, e.localName, localName, namespaceURI, i);
            if (!namespaceURI || namespaceURI == NS_SVG) {
                yield [localName, value];
            }
        }
    }
}

function walk(elem: SVGElement, parent: Container) {
    const make_node = TAG_DOM[elem.localName];
    if (make_node) {
        // console.log(`walk--`, parent.constructor.name);
        const node = make_node(elem, parent);
        // console.log(`walk ${ x.constructor.name }`, elem.localName);
        if (node instanceof Container) {
            for (const child of elem.children) {
                if (child.namespaceURI == "http://www.w3.org/2000/svg") {
                    walk(child as SVGElement, node);
                }
            }
        }
        return node;
    } else {
        throw new Error(`No processor for "${elem.localName}"`);
    }
}

export function parse_svg(
    src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL } = {}
) {
    return import("domspec").then((domspec) => {
        // console.log("domspec", domspec.DOMParser.loadXML);
        return domspec.DOMParser.loadXML(src, { ...opt, type: "image/svg+xml" })
            .then((doc) => {
                const base = opt.base || src;
                const root = (doc as unknown as XMLDocument).documentElement;
                // console.info(`loadrd "${src}" ${root?.localName}`);
                if (root.namespaceURI != NS_SVG) {
                    throw new Error(`not svg namespace ${root.namespaceURI}`);
                } else if (root.localName != "svg") {
                    throw new Error(`not svg tag ${root.localName}`);
                } else {
                    const doc = new Doc();
                    // console.log(doc.innerHTML);
                    const f = walk(root as unknown as SVGSVGElement, doc);
                    return doc;
                }
            })
            .catch((err) => {
                console.error(`Failed to load "${src}"`);
                throw err;
            });
    });
}

export function load_svg(
    parent: Container,
    src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL } = {}
) {
    return import("domspec").then((domspec) => {
        // console.log("domspec", domspec.DOMParser.loadXML);
        return domspec.DOMParser.loadXML(src, { ...opt, type: "image/svg+xml" })
            .then((doc) => {
                const base = opt.base || src;
                const root = (doc as unknown as XMLDocument).documentElement;
                // console.info(`loadrd "${src}" ${root?.localName}`);
                if (root.namespaceURI != NS_SVG) {
                    throw new Error(`not svg namespace ${root.namespaceURI}`);
                }
                if (parent instanceof Doc) {
                    if (root.localName != "svg") {
                        throw new Error(`not svg tag ${root.localName}`);
                    }
                }
                const f = walk(root as unknown as SVGSVGElement, parent);
            })
            .catch((err) => {
                console.error(`Failed to load "${src}"`);
                throw err;
            });
    });
}

declare module "./node" {
    interface Container {
        load_svg(src: string | URL, opt: { xinclude?: boolean; base?: string | URL }): void;
    }
}

Container.prototype.load_svg = function (src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL }) {
    return load_svg(this, src, opt);
}

