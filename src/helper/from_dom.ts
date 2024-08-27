
import { Item, Container, Root } from "../model/node.js";
import { VectorValue, ScalarValue, PointsValue, RGB, RGBValue, TextValue } from "../model/value.js";
import { Vector } from "../geom/vector.js";
import { Node, Parent } from "../model/linked.js";
import { parse_css_color } from "./parse_color.js";
import { parse_svg_length } from "./svg_length.js";
const BOTH_MATCH =
    /^\s*(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)\s*(in|pt|px|mm|cm|m|km|Q|pc|yd|ft||%|em|ex|ch|rem|vw|vh|vmin|vmax|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)\s*$/i;
const CONVERSIONS: { [k: string]: number } = {
    in: 96.0,
    pt: 1.3333333333333333,
    px: 1.0,
    mm: 3.779527559055118,
    cm: 37.79527559055118,
    m: 3779.527559055118,
    km: 3779527.559055118,
    Q: 0.94488188976378,
    pc: 16.0,
    yd: 3456.0,
    ft: 1152.0,
};
function parse_len(value: string) {
    const m = BOTH_MATCH.exec(value);
    if (m) {
        const num = parseFloat(m[1]);
        const suf = m.pop();

        if (suf) {
            const unit = CONVERSIONS[suf.toLowerCase()];
            if (unit > 1) {
                return num * unit;
            }
            // parse_svg_length(num, )
        } else {
            return num;
        }
    }
    throw new Error(`Unexpected length "${value}"`);
}

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
                        if (m) {
                            m.remove();
                            defs[id] = m;
                        }
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
                    u.position.value = new Vector([v[0], v[1]]);
                    u.size.value = new Vector([v[2], v[3]]);
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
                    node.height.set_parse_length(value, node);
                    break;
                case "width":
                    node.width.set_parse_length(value, node);
                    break;
                case "y":
                    node.y.set_parse_length(value, node);
                    break;
                case "x":
                    node.y.set_parse_length(value, node);
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
                    node.height.set_parse_length(value, parent);
                    break;
                case "width":
                    node.width.set_parse_length(value, parent);
                    break;
                case "y":
                    node.y.set_parse_length(value, parent);
                    break;
                case "x":
                    node.x.set_parse_length(value, parent);
                    break;
                case "ry":
                    node.ry.set_parse_length(value, parent);
                    break;
                case "rx":
                    node.rx.set_parse_length(value, parent);
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
                    node.r.set_parse_length(value, parent);
                    break;
                case "cx":
                    node.cx.set_parse_length(value, parent);
                    break;
                case "cy":
                    node.cy.set_parse_length(value, parent);
                    break;
                default:
                    set_common_attr(node, name, value, e);
            }
        }
        return node;
    },
    ellipse: function (e: SVGElement, parent: Container) {
        let node = parent.add_ellipse();
        // Properties
        // console.info(`PATH`, e.getAttributeNames(), e.innerHTML);
        for (const [name, value] of enum_attrs(e)) {
            // console.info(`PATH ATTR _ ${name} ${value}`);
            switch (name) {
                case "rx":
                    node.rx.set_parse_length(value, parent);
                    break;
                case "ry":
                    node.ry.set_parse_length(value, parent);
                    break;
                case "cx":
                    node.cx.set_parse_length(value, parent);
                    break;
                case "cy":
                    node.cy.set_parse_length(value, parent);
                    break;
                default:
                    set_common_attr(node, name, value, e);
            }
        }
        return node;
    },
    polygon: function (e: SVGElement, parent: Container) {
        let node = parent.add_polygon();
        for (const [name, value] of enum_attrs(e)) {
            switch (name) {
                case "points":
                    node.points.set_parse_points(value, parent);
                    break;
                default:
                    set_common_attr(node, name, value, e);
            }
        }
        return node;
    },
    polyline: function (e: SVGElement, parent: Container) {
        let node = parent.add_polyline();
        for (const [name, value] of enum_attrs(e)) {
            switch (name) {
                case "points":
                    node.points.set_parse_points(value, parent);
                    break;
                default:
                    set_common_attr(node, name, value, e);
            }
        }
        return node;
    }
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
                node.transform.set_parse_transform(value);
            }
            break;
        case "font-weight":
            if (value) {
                node.font.weight.set_parse_text(value, node);
            }
            break;
        case "font-size":
            if (value) {
                node.font.size.set_parse_text(value, node);
            }
            break;
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
                node.stroke.width.set_parse_length(value, node);
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
                node.stroke.dash_offset.set_parse_length(value, node);
            }
            break;
        case "style":
            const asm = elem.attributeStyleMap;
            for (const [sname, value] of asm.entries()) {
                console.log("STYLE", sname, value, value.constructor.name, style);
                set_common_attr(node, sname, value.toString(), elem, true);
            }
            break;
        case "transform-origin":
            if (value) {
                // node.anchor.set_parse_anchor(value);
            }
        case "shape-inside":
        case "paint-order":
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
    const { localName: tag } = elem;
    switch (tag) {
        case "desc":
        case "metadata":
        case "title":

            return;
    }
    const make_node = TAG_DOM[tag];
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
        throw new Error(`No processor for "${tag}"`);
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
                const top = (doc as unknown as XMLDocument).documentElement;
                // console.info(`loadrd "${src}" ${top?.localName}`);
                if (top.namespaceURI != NS_SVG) {
                    throw new Error(`not svg namespace ${top.namespaceURI}`);
                } else if (top.localName != "svg") {
                    throw new Error(`not svg tag ${top.localName}`);
                } else {
                    const doc = new Root();
                    // console.log(doc.innerHTML);
                    const f = walk(top as unknown as SVGSVGElement, doc);
                    return doc;
                }
            })
            .catch((err) => {
                console.error(`Failed to load "${src}"`);
                throw err;
            });
    });
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
        const f = walk(top as unknown as SVGSVGElement, parent);
    } catch (err) {
        console.error(`Failed to load "${src}"`);
        throw err;
    }
}

declare module "../model/node" {
    interface Container {
        load_svg(src: string | URL, opt: { xinclude?: boolean; base?: string | URL }): Promise<void>;
    }
    interface Root {
        load_json(src: string): void;
    }
}

declare module "../model/value" {
    interface ScalarValue {
        set_parse_length(s: string, container: Container | Item): void;
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

ScalarValue.prototype.set_parse_number = function (s: string, parent: Container | Item) {
    this.value = parseFloat(s);
}

ScalarValue.prototype.set_parse_length = function (s: string, parent: Container | Item) {
    this.value = parse_len(s);
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
        this.value = parse_len(s);
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
// VectorValue.prototype.
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