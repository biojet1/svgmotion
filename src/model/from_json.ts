import { Container, Item, Root, ViewPort } from "./node.js";

class Doc extends ViewPort {
    _root?: Root;
    add_root() {
        const x = new Root();
        return (this._root = x);
    }
}
const TAGS: {
    [key: string]: (
        parent: Container,
        props: { [key: string]: Prop }
    ) => Item | Container;
} = {
    svg: function (parent: Container, props) {
        let node;
        if (parent instanceof Doc) {
            node = parent.add_root();
        } else {
            node = parent.add_view();
        }
        // Properties
        for (let [k, v] of Object.entries(props)) {
            // node[k];
            switch (k) {
                case "view_box": {
                    node.view_box.from_json(v);
                    break;
                }
                case "fit_view": {
                    node.fit_view.from_json(v);
                    break;
                }
                case "zoom_pan": {
                    node.zoom_pan.from_json(v);
                }
                default:
            }
        }
        return node;
    },
    g: function (parent: Container, props) {
        let node = parent.add_group();
        return node;
    },
};

export const TAGS3 = [];
class Property { }

class base {
    opacity = new Property();
    [key: string]: Property;

    create_node(parent: Container): Container | Item {
        throw new Error(`Not implemented`);
    }

    feed_json(node: Object, parent: Container) {
        const { tag, nodes, ...props } = node;
        const x = this.create_node(parent);
        {
            for (let [k, v] of Object.entries(props)) {
                const p: any = this[k];
                if (p instanceof Property) {
                    // p
                }
            }
        }

        if (x instanceof Container) {
            if (nodes) {
                for (const child of nodes) {
                    walk(child, x);
                }
            }
        } else if (nodes != undefined) {
            throw new Error(`unexpectde nodes in "${tag}"`);
        }
        return x;
    }

    walk_json(node: Object, parent: Container) { }
    set_prop(node: Container | Item, name: string) { }
}

class container extends base { }

class svg extends container {
    view_box = new Property();
    override create_node(parent: Container): Container | Item {
        if (parent instanceof Doc) {
            return parent.add_root();
        } else {
            return parent.add_view();
        }
    }
    override set_prop(node: Root, name: string) {
        switch (name) {
            case "zoomAndPan":
                {
                    // n.zoom_pan.value = value;
                }
                break;
            default:
            // super.set_prop()
        }
    }
}

class g extends container {
    override create_node(parent: Container): Container | Item {
        return parent.add_group();
    }
}

export const TAGS2: { [key: string]: typeof base } = {
    // "*": {},
    svg: svg,
    g: g,
};

const props = {
    svg: {
        view_box: {},
    },
};

interface Prop {
    k?: {
        t: number;
        h: boolean;
        o: Iterable<number>;
        i: Iterable<number>;
        v: any;
    }[];
    v: any;
}

interface Object {
    tag: string;
    nodes: Object[];
    opacity: Prop;
}

function walk(obj: Object, parent: Container) {
    const { tag, nodes, ...props } = obj;
    const make_node = TAGS[tag];
    if (make_node) {
        const node = make_node(parent, props);
        if (node instanceof Container) {
            if (nodes) {
                for (const child of nodes) {
                    walk(child, node);
                }
            }
        } else if (nodes != undefined) {
            throw new Error(`unexpectde nodes in "${tag}"`);
        }
        return node;
    } else {
        throw new Error(`No processor for "${tag}"`);
    }
}

export function from_json(
    src: Object,
) {
    const con = new Doc();
    return walk(src, con);
}
