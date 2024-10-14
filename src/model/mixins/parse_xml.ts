
import { Element } from "../base.js";
import { Root } from "../root.js";
import { Text, TSpan } from "../text.js";
import { Container } from "../containers.js";
import "./set_attribute.js";
const NS_SVG = "http://www.w3.org/2000/svg";
declare module "../root" {
    interface Root {
        load_json(src: string): Promise<void>;
        parse_svg(src: string): Promise<void>;
    }
}

declare module "../containers" {
    interface Container {
        load_svg(src: string | URL, opt: { xinclude?: boolean; base?: string | URL }): Promise<void>;
    }
}

Container.prototype.load_svg = async function (src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL }) {
    return sax_load_svg(this, src, opt);
}

Root.prototype.parse_svg = async function (src: string) {
    const dom = await sax_parse_svg(src);
    sax_load_svg_dom(this, dom);
}

Root.prototype.load_json = async function (src: string) {
    const fs = await import('fs/promises');
    const blob = await fs.readFile(src, { encoding: 'utf8' });
    return this.parse_json(blob);
}

class SAXElement {
    uri?: string = '';
    name: string = '';
    nodes: (string | SAXElement)[] = [];
    attrs: SAXAttribute[] = [];

    get id() {
        for (const a of this.attrs) {
            const { name, value } = a;
            if (name == 'id') {
                return value;
            }
        }
    }
}

interface SAXAttribute {
    uri?: string;
    name: string;
    value: string;
}

export async function sax_parse_svg(
    src: string,
    _opt: { xinclude?: boolean; base?: string | URL } = {}
) {
    const { SAXParser } = await import("sax-ts");
    const strict: boolean = true; // change to false for HTML parsing
    const options: {} = { xmlns: true, normalize: true, trim: true }; // refer to "Arguments" section
    const parser = new SAXParser(strict, options);
    let parents: SAXElement[] = [];
    let root = new SAXElement();
    // console.log("src", `[${src}]`);
    parser.onerror = function (e: any) {
        console.error(e);
    };
    parser.ontext = function (t: string) {
        parents.at(-1)?.nodes.push(t);
    };
    parser.oncdata = function (t: string) {
        parents.at(-1)?.nodes.push(t);
    };
    parser.onopentag = function (node: any) {
        // console.log("onopentag", node);
        const { local, uri, attributes } = node as {
            local: string; uri: string;
            attributes: {
                [key: string]: { name: string, value: string, prefix: string, local: string, uri: string }
            }
        };
        const elem = new SAXElement();
        elem.name = local;
        uri && (elem.uri = uri);
        elem.attrs = Array.from(Object.values(attributes)).map(function ({ uri, local, value },) {
            let a: SAXAttribute = { value, name: local };
            uri && (a.uri = uri);
            return a;
        }).filter(v => !!v.name);
        if (parents.length > 0) {
            parents.at(-1)?.nodes.push(elem);
        } else {
            root = elem;
        }
        parents.push(elem);
    };
    // parser.onattribute = function (attr: any) {
    //     console.log('onAttribute: ', attr)
    // };
    parser.onclosetag = function (_node: any) {
        // console.log("onclosetag", node);
        if (parents.length < 1) {
            throw new Error(``);
        }
        // parser stream is done, and ready to have more stuff written to it.
        // console.warn('end of XML');
        parents.pop();
    };
    parser.onend = function () {
        // parser stream is done, and ready to have more stuff written to it.
        // console.warn('end of XML');
        // parents.pop();
    };
    parser.write(src);
    return root;
}

export async function sax_load_svg_src(
    src: string | URL,
    _opt: { xinclude?: boolean; base?: string | URL } = {}
) {
    return import('fs/promises').then((fs) => fs.readFile(src, { encoding: 'utf8' })).then((blob) =>
        sax_parse_svg(blob.trim())
    )
}

export async function sax_load_svg(
    parent: Container,
    src: string | URL,
    opt: { xinclude?: boolean; base?: string | URL } = {}
) {
    return sax_load_svg_src(src, opt).then((top) => sax_load_svg_dom(parent, top));
}

function sax_load_svg_dom(parent: Container, top: SAXElement) {
    if (top.uri != NS_SVG) {
        throw new Error(`not svg namespace ${top.uri}`);
    }
    if (parent instanceof Root) {
        if (top.name != "svg") {
            throw new Error(`not svg tag ${top.name}`);
        }
    }
    sax_walk(top, parent, {});
}

function sax_walk(elem: SAXElement, parent: Container, attrs: { [key: string]: string }) {
    const { name: tag } = elem;
    switch (tag) {
        case "desc":
        case "metadata":
        case "title":
        case "script":
            return;
        // case "defs":
        //     {
        //         // const defs = parent.get_root().defs;
        //         for (const sub of elem.nodes) {
        //             if (sub instanceof SAXElement) {
        //                 const { id } = sub;
        //                 if (id) {
        //                     const m = sax_walk(sub, parent.get_root(), attrs);
        //                     // if (m) {
        //                     //     m.remove();
        //                     //     defs[id] = m;
        //                     // }
        //                     // break;
        //                 }
        //             }
        //         }
        //         return;
        //     }
    }
    const props: { [key: string]: string } = {};
    function* enum_attrs(e: SAXElement) {
        for (const { name, value, uri } of e.attrs) {
            if (!uri || uri == NS_SVG) {
                yield [name, value];
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
                        if (k && v && !k.startsWith("-")) {
                            const m = v.match(/(.+)\s*!\s*(\w+)$/);
                            if (m) {
                                props[k] = m[1].trim();
                                // this._tag[k] = { priority: m[2] };
                            } else {
                                props[k] = v;
                            }
                        }
                    }
                }
            }
        } else if (!(key.startsWith("aria-") || key.startsWith("-inkscape") || key.startsWith("inkscape"))) {
            props[key] = value;
        }
    }
    const node = parent._add_element(tag)
    if (node) {
        node.set_attributes(props);
        if (node instanceof Container) {
            // Non-propagating values
            for (const s of ['id', 'class', 'clip-path', 'viewBox', 'preserveAspectRatio']) {
                delete props[s];
            }
            const merged = { ...attrs, ...props };
            for (const child of elem.nodes) {
                if (child instanceof SAXElement) {
                    if (child.uri == NS_SVG) {
                        sax_walk(child, node, merged);
                    }
                } else {
                    if (child && (node instanceof Text || node instanceof TSpan)) {
                        node.add_chars(child);
                    }
                }
            }
        } else if (!(node instanceof Element)) {
            throw new Error(`tag "${tag}"`);
        }
        return node;
    } else {
        throw new Error(`No processor for "${tag}"`);
    }
}

Root._load_svg = async function (src: string) {
    const fs = await import('fs/promises');
    const blob = await fs.readFile(src, { encoding: 'utf8' });
    return Root._parse_svg(blob);

}


Root._parse_svg = async function (src: string) {
    const root = new Root();
    const dom = await sax_parse_svg(src);
    sax_load_svg_dom(root, dom);
    return root;
}