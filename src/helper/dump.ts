import { Animatable } from "../model/value.js";
import { Container, Root, Item, PlainRoot, PlainNode } from "../model/node.js";
import { ValueSet } from "../model/valuesets.js";


declare module "../model/node" {
    interface Container {
        dump(): any;
    }
    interface Item {
        dump(): any;
    }
    interface Root {
        dump(): any;
    }
}

Container.prototype.dump = function () {
    const o: any = { tag: (<typeof Container>this.constructor).tag };
    for (let [k, v] of Object.entries(this)) {
        if (v instanceof ValueSet || v instanceof Animatable) {
            o[k] = v.dump();
        }
    }
    const { id } = this;
    if (id) {
        o.id = id;
    }

    o.nodes = [...this.children<Container | Item>()].map((v) =>
        v.dump()
    );
    return o;
}

Item.prototype.dump = function (): PlainNode {
    const o: any = { tag: (<typeof Container>this.constructor).tag };
    for (let [k, v] of Object.entries(this)) {
        if (v instanceof ValueSet || v instanceof Animatable) {
            o[k] = v.dump();
        }
    }
    const { id } = this;
    if (id) {
        o.id = id;
    }
    return o;
}

Root.prototype.dump = function (): PlainRoot {
    const { version, view, defs, frame_rate } = this;
    return {
        version, frame_rate,
        view: view.dump(),
        defs: Object.fromEntries(
            Object.entries(defs).map(([k, v]) => [k, v.dump()])
        ),
    };
}