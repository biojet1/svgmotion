import { DOMParser } from "domspec";
const NS_SVG = "http://www.w3.org/2000/svg";
export function parse_svg(src, opt = {}) {
    return DOMParser.loadXML(src, { ...opt, type: "image/svg+xml" })
        .then((doc) => {
        const base = opt.base || src;
        const root = doc.documentElement;
        // console.info(`loadrd "${src}" ${root?.localName}`);
        if (root.namespaceURI != NS_SVG) {
            throw new Error(`not svg namespace ${root.namespaceURI}`);
        }
        else if (root.localName != "svg") {
            throw new Error(`not svg tag ${root.localName}`);
        }
        else {
            const con = new Doc();
            console.log(doc.innerHTML);
            const f = walk(root, con);
            return f;
        }
    })
        .catch((err) => {
        console.error(`Failed to load "${src}"`);
        throw err;
    });
}
import { ViewPort, Container, Root } from "./model/node.js";
import { NVector } from "./model/keyframes.js";
class Obj {
    create(elem) {
        throw new Error(`not implemented`);
    }
}
class svg extends Obj {
    _props = {
        size: 7,
    };
    create(elem) {
        return new ViewPort();
    }
}
export const A1 = {
    svg: function (e, parent) {
        let elem = e;
        let n;
        if (parent instanceof Doc) {
            n = parent.add_root();
        }
        else {
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
                        const m = walk(sub, n);
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
                default:
                    set_common_attr(n, name, value, e);
            }
        }
        return n;
    },
    rect: function (e, parent) {
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
                default:
                    set_common_attr(n, name, value, e);
            }
        }
        return n;
    },
    g: function (e, parent) {
        let n = parent.add_group();
        for (const [name, value] of enum_attrs(e)) {
            set_common_attr(n, name, value, e);
        }
        return n;
    },
    path: function (e, parent) {
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
    _root;
    add_root() {
        const x = new Root();
        return (this._root = x);
    }
}
function get_root(cur) {
    for (let x = cur; x; x = x._parent) {
        if (x instanceof Root) {
            return x;
        }
    }
    throw new Error(`Unexpected ${cur.constructor.name} ${cur._parent?.constructor.name}`);
}
function set_common_attr(node, name, value, elem) {
    // console.log(`set_common_attr ${name}="${value}" ${elem.localName} ${node.constructor.name}`);
    switch (name) {
        case "id":
            if (value) {
                // console.log("_set_attr ID", node.constructor.name);
                get_root(node).remember_id((node.id = value), node);
            }
            break;
        case "transform":
            break;
        case "style":
            const asm = elem.attributeStyleMap;
            for (const [sname, value] of asm.entries()) {
                console.log("STYLE", sname, value, value.constructor.name);
                // _set_attr(node, name, value, elem);
            }
            break;
        default:
            if (!name.startsWith("aria-")) {
                throw new Error(`Unexpected attribute ${name}="${value}" ${elem.localName} ${node.constructor.name}`);
            }
    }
}
function* enum_attrs(e) {
    const attrs = e.attributes;
    for (let i = attrs.length; i-- > 0;) {
        const attr = attrs[i];
        // console.log(`enum_attrs`, e.localName, localName, namespaceURI);  
        if (attr != undefined) {
            const { localName, namespaceURI, value } = attr;
            console.log(`enum_attrs`, e.localName, localName, namespaceURI, i);
            if (!namespaceURI || namespaceURI == NS_SVG) {
                yield [localName, value];
            }
        }
    }
}
function walk(elem, parent) {
    const f = A1[elem.localName];
    if (f) {
        // console.log(`walk--`, parent.constructor.name);
        const x = f(elem, parent);
        // console.log(`walk ${ x.constructor.name }`, elem.localName);
        if (x instanceof Container) {
            for (const child of elem.children) {
                if (child.namespaceURI == "http://www.w3.org/2000/svg") {
                    walk(child, x);
                }
            }
        }
        return x;
    }
    else {
        throw new Error(`No processor for "${elem.localName}"`);
    }
}
//# sourceMappingURL=parse.js.map