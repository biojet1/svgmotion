import { Animatable } from "../model/value.js";
import { Container, Root, Item, PlainRoot, PlainNode } from "../model/elements.js";
import { ValueSet } from "../model/valuesets.js";
import { TextData, Element } from "../model/base.js";

declare module "../model/elements" {
    interface Container {
        dump(): any;
    }

    interface Root {
        dump(): any;
    }
}

declare module "../model/base" {
    interface TextData {
        dump(): any;
    }
    interface Element {
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

Element.prototype.dump = function (): PlainNode {
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

TextData.prototype.dump = function (): any {
    const d = this.content.dump();
    (d as any).tag = "$";
    return d;
}

