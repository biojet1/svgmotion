import { Animatable, Value } from "../model/keyframes.js";
import {
    Container,
    Root,
    Item,
    PlainRoot,
    PlainNode,
    ViewPort,
    Rect,
    Path,
    Line,
    Group,
    Ellipse,
    Circle,
} from "../model/node.js";
import { ValueSet } from "../model/valuesets.js";

const TAGS: {
    [key: string]: (parent: Container) => Item | Container;
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
    path: function (parent: Container) {
        let node = parent.add_path();
        return node;
    },
    circle: function (parent: Container) {
        let node = parent.add_circle();
        return node;
    },
};

function props_from_json(that: any, props: { [key: string]: Value<any> }) {
    for (let [k, v] of Object.entries(props)) {
        const p = that[k];
        if (p instanceof Animatable || p instanceof ValueSet) {
            p.from_json(v);
        } else {
            throw new Error(`Unexpected property "${k}" (${v})`);
        }
    }
}

function from_json_walk(obj: PlainNode, parent: Container) {
    const { tag, nodes, ...props } = obj;
    const make_node = TAGS[tag];
    if (make_node) {
        const node = make_node(parent);
        props_from_json(node, props);
        if (node instanceof Container) {
            if (nodes) {
                for (const child of nodes) {
                    from_json_walk(child, node);
                }
            }
        } else if (nodes != undefined) {
            throw new Error(`unexpected nodes in "${tag}"`);
        }
        return node;
    } else {
        throw new Error(`No node factory for "${tag}"`);
    }
}

declare module "../model/node" {
    interface Root {
        from_json(src: PlainRoot): void;
    }
    interface Container {
        add_circle(): Circle;
        add_ellipse(): Ellipse;
        add_group(): Group;
        add_line(): Line;
        add_path(): Path;
        add_rect(): Rect;
        add_view(): ViewPort;
    }
}

Root.prototype.from_json = function (src: PlainRoot) {
    const { version, view, defs, frame_rate } = src;
    if (!version) {
        throw new Error("No version {${Object.keys(src)}}");
    } else if (!/^\d+\.\d+\.\d+$/.test(version)) {
        throw new Error("Invalid version");
    } else if (!view) {
        throw new Error("No view");
    } else if (!frame_rate) {
        throw new Error("No frame_rate");
    }
    const vp = from_json_walk(view, this);
    if (!(vp instanceof ViewPort)) {
        throw new Error("ViewPort expected");
    }
    this.version = version;
    this.defs = {};
    this.set_view(vp);
    if (defs) {
        Object.entries(defs).map(([k, v]) => {
            this.defs[k] = from_json_walk(v, this);
        });
    }
};
Container.prototype.add_circle = function () {
    const x = new Circle();
    this.append_child(x);
    return x;
};
Container.prototype.add_ellipse = function () {
    const x = new Ellipse();
    this.append_child(x);
    return x;
};
Container.prototype.add_group = function () {
    const x = new Group();
    this.append_child(x);
    return x;
};
Container.prototype.add_line = function () {
    const x = new Line();
    this.append_child(x);
    return x;
};
Container.prototype.add_path = function () {
    const x = new Path();
    this.append_child(x);
    return x;
};
Container.prototype.add_rect = function () {
    const x = new Rect();
    this.append_child(x);
    return x;
};
Container.prototype.add_view = function () {
    const x = new ViewPort();
    this.append_child(x);
    return x;
};
