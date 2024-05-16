import { Convertible } from "../model/keyframes.js";
import { Container, Root, Item, PlainRoot, PlainNode } from "../model/node.js";


declare module "../model/node" {
    interface Container {
        to_json(): any;
    }
    interface Item {
        to_json(): any;
    }
    interface Root {
        to_json(): any;
    }
}

Container.prototype.to_json = function () {
    const o: any = { tag: (<typeof Container>this.constructor).tag };
    for (let [k, v] of Object.entries(this)) {
        if (v instanceof Convertible) {
            o[k] = v.to_json();
        }
    }
    const { id } = this;
    if (id) {
        o.id = id;
    }

    o.nodes = [...this.children<Container | Item>()].map((v) =>
        v.to_json()
    );
    return o;
}

Item.prototype.to_json = function (): PlainNode {
    const o: any = { tag: (<typeof Container>this.constructor).tag };
    for (let [k, v] of Object.entries(this)) {
        if (v instanceof Convertible) {
            o[k] = v.to_json();
        }
    }
    const { id } = this;
    if (id) {
        o.id = id;
    }
    return o;
}

Root.prototype.to_json = function (): PlainRoot {
    const { version, view, defs, frame_rate } = this;
    return {
        version, frame_rate,
        view: view.to_json(),
        defs: Object.fromEntries(
            Object.entries(defs).map(([k, v]) => [k, v.to_json()])
        ),
    };
}