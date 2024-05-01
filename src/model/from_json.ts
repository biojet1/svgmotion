import { Value } from "./keyframes.js";
import { Container, Doc, Item, PlainNode, ViewPort } from "./node.js";

const TAGS: {
    [key: string]: (
        parent: Container,
    ) => Item | Container;
} = {
    svg: function (parent: Container) {
        let node = parent.add_view();
        return node;
    },
    g: function (parent: Container) {
        let node = parent.add_group();
        return node;
    },
    rect: function (parent: Container) {
        let node = parent.add_rect();
        return node;
    },
};

export function from_json_walk(obj: PlainNode, parent: Container) {
    const { tag, nodes, ...props } = obj;
    const make_node = TAGS[tag];
    if (make_node) {
        const node = make_node(parent);
        node.props_from_json(props);
        if (node instanceof Container) {
            if (nodes) {
                for (const child of nodes) {
                    from_json_walk(child, node);
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


