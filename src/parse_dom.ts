// import { DOMParser } from "domspec";

const NS_SVG = "http://www.w3.org/2000/svg";
export function parse_svg(
    src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL } = {}
) {
    return import("domspec").then((domspec) => {
        console.log("domspec", domspec.DOMParser.loadXML);
        return domspec.DOMParser.loadXML(src, { ...opt, type: "image/svg+xml" })
            .then((doc) => {
                const base = opt.base || src;
                const root = (doc as unknown as XMLDocument).documentElement;
                console.info(`loadrd "${src}" ${root?.localName}`);
                if (root.namespaceURI != NS_SVG) {
                    throw new Error(`not svg namespace ${root.namespaceURI}`);
                } else if (root.localName != "svg") {
                    throw new Error(`not svg tag ${root.localName}`);
                } else {
                    const con = new Doc();
                    console.log(doc.innerHTML);
                    const f = walk(root as unknown as SVGSVGElement, con);
                    return f;
                }
            })
            .catch((err) => {
                console.error(`Failed to load "${src}"`);
                throw err;
            });
    });
}

import { ViewPort, Item, Container, Root } from "./model/node.js";
import { NVector, NumberValue } from "./model/keyframes.js";
import { Parent, Node } from "./model/linked.js";

export const A1: {
    [key: string]: (elem: SVGElement, parent: Container) => Item | Container;
} = {
    svg: function (e: SVGElement, parent: Container) {
        let elem = e as SVGSVGElement;

        let n;
        if (parent instanceof Doc) {
            n = parent.add_root();
        } else {
            n = parent.add_view();
        }

        // let vb = elem.viewBox.baseVal;
        // if (vb) {
        //     const u = n.view_box;
        //     u.position.value = new NVector([vb.x, vb.y]);
        //     u.size.value = new NVector([vb.width, vb.height]);
        // }
        // let w = elem.width.baseVal;
        // if (w != null) {
        //     n.width = new NumberValue(w.value);
        // }
        // let h = elem.height.baseVal;
        // if (h != null) {
        //     n.height = new NumberValue(h.value);
        // }
        //    for(const a of elem.attributes){

        //    }
        // console.info(
        //     `getAttributeNames ${elem?.localName} ${elem.getAttributeNames()}`
        // );

        {
            for (const child of [...e.children]) {
                const { id, namespaceURI, localName } = child;
                if (localName == "defs" && namespaceURI == NS_SVG) {
                    const defs = get_root(n).defs;
                    child.remove();
                    for (const sub of [...child.children]) {
                        const m = walk(sub as SVGElement, n);
                        m.remove();
                        defs[id] = m;
                    }
                }
            }
        }
        // console.info(`svg _read ${elem?.localName} ${vp.constructor.name} ${elem.viewBox.baseVal}`);
        for (const [name, value] of enum_attrs(e)) {
            switch (name) {
                case "height":
                    n.height.value = parseFloat(value);
                    break;
                case "width":
                    n.width.value = parseFloat(value);
                    break;
                // case "y": {
                //     n.y.value = parseFloat(value);
                //     break;
                // }
                // case "x": {
                //     n.y.value = parseFloat(value);
                //     break;
                // }
                case "version":
                    break;
                case "viewBox":
                    {
                        const v = value.split(/[\s,]+/).map(parseFloat);
                        const u = n.view_box;
                        u.position.value = new NVector([v[0], v[1]]);
                        u.size.value = new NVector([v[2], v[3]]);
                    }
                    break;
                case "preserveAspectRatio":
                    {
                        n.fit_view.value = value;
                    }
                    break;
                case "zoomAndPan":
                    {
                        n.zoom_pan.value = value;
                    }
                    break;
                default:
                    set_common_attr(n, name, value, e);
            }
        }

        return n;
    },
    rect: function (e: SVGElement, parent: Container) {
        let n = parent.add_rect();
        for (const [name, value] of enum_attrs(e)) {
            switch (name) {
                case "height":
                    n.height.value = parseFloat(value);
                    break;
                case "width":
                    n.width.value = parseFloat(value);
                    break;
                case "y":
                    n.y.value = parseFloat(value);
                    break;
                case "x":
                    n.x.value = parseFloat(value);
                    break;
                case "ry":
                    n.ry.value = parseFloat(value);
                    break;
                case "rx":
                    n.rx.value = parseFloat(value);
                    break;
                default:
                    set_common_attr(n, name, value, e);
            }
        }

        return n;
    },
    g: function (e: SVGElement, parent: Container) {
        let n = parent.add_group();
        for (const [name, value] of enum_attrs(e)) {
            set_common_attr(n, name, value, e);
        }

        return n;
    },
    path: function (e: SVGElement, parent: Container) {
        let n = parent.add_path();
        console.info(`PATH`, e.getAttributeNames(), e.innerHTML);
        for (const [name, value] of enum_attrs(e)) {
            // console.info(`PATH ATTR _ ${name} ${value}`);
            switch (name) {
                case "d":
                    n.d.value = value;
                    break;
                default:
                    set_common_attr(n, name, value, e);
            }
        }

        return n;
    },
};

class Doc extends ViewPort {
    _root?: Root;
    add_root() {
        const x = new Root();
        return (this._root = x);
    }
}

function get_root(cur: Node) {
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
    console.log(
        `set_common_attr ${name}="${value}" ${elem.localName} ${node.constructor.name} ${style}`
    );
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
                console.log(
                    "transform",
                    Object.keys(node.transform),
                    node.transform,
                    node.transform.position,
                    node.transform.get_matrix(0),
                    node.transform.position.get_value(0)
                );
                console.log(
                    "decompose",
                    node.transform.get_matrix(0).decompose()
                );
            }
            break;

        case "style":
            const asm = elem.attributeStyleMap;
            for (const [sname, value] of asm.entries()) {
                // console.log("STYLE", sname, value, value.constructor.name, style);
                // set_common_attr(node, sname, value.toString(), elem, true);
            }
            break;

        default:
            if (!name.startsWith("aria-")) {
                throw new Error(
                    `Unexpected attribute ${name}="${value}" ${elem.localName} ${node.constructor.name}`
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
    const f = A1[elem.localName];
    if (f) {
        // console.log(`walk--`, parent.constructor.name);
        const x = f(elem, parent);
        // console.log(`walk ${ x.constructor.name }`, elem.localName);
        if (x instanceof Container) {
            for (const child of elem.children) {
                if (child.namespaceURI == "http://www.w3.org/2000/svg") {
                    walk(child as SVGElement, x);
                }
            }
        }
        return x;
    } else {
        throw new Error(`No processor for "${elem.localName}"`);
    }
}
