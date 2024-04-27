import { Value } from "./keyframes.js";
import { Container, Item, Root, ViewPort } from "./node.js";

class Doc extends ViewPort {
    _root?: Root;
    add_root() {
        return (this._root = new Root());
    }
}
const TAGS: {
    [key: string]: (
        parent: Container,
        props: { [key: string]: Value<any> }
    ) => Item | Container;
} = {
    svg: function (parent: Container, props) {
        let node;
        if (parent instanceof Doc) {
            node = parent.add_root();
        } else {
            node = parent.add_view();
        }
        return node;
    },
    g: function (parent: Container, props) {
        let node = parent.add_group();
        return node;
    },
    rect: function (parent: Container, props) {
        let node = parent.add_rect();
        return node;
    },
};

interface Object {
    tag: string;
    nodes: Object[];
    opacity: Value<any>;
}

function walk(obj: Object, parent: Container) {
    const { tag, nodes, ...props } = obj;
    const make_node = TAGS[tag];
    if (make_node) {
        const node = make_node(parent, props);
        node.props_from_json(props);
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

export function from_json(src: Object) {
    const con = new Doc();
    return walk(src, con);
}
