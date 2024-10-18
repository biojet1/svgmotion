import { Animatable } from "../value.js";
import { ValueSet } from "../valuesets.js";
import { Chars, Element } from "../base.js";
import { Container } from "../containers.js";
import { Root, PlainRoot, PlainNode } from "../root.js";

declare module "../root" {
    interface Root {
        dump(): any;
    }
}

declare module "../containers" {
    interface Container {
        dump(): any;
    }

}

declare module "../base" {
    interface Chars {
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
    if (Object.hasOwn(this, 'id')) {
        const { id } = this;
        if (id) {
            o.id = id;
        }
    }
    o.nodes = [...this.children<Element>()].map((v) =>
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
    if (Object.hasOwn(this, 'id')) {
        const { id } = this;
        if (id) {
            o.id = id;
        }
    }
    return o;
}

Root.prototype.dump = function (): PlainRoot {
    const { version, view, frame_rate, assets, sounds: sounds } = this;

    return {
        version, frame_rate,
        view: view.dump(),
        sounds: sounds.map(v => v.dump()),
        // defs: Object.fromEntries(
        //     Object.entries(defs).map(([k, v]) => [k, v.dump()])
        // ),
        assets: Object.fromEntries(Object.entries(assets).map(([k, a]) => {
            if (!k || a.id !== k) {
                throw new Error(`assert k[${k}] a.id[${a.id}]`);
            }
            return [k, a.dump()];
        }
        ))
    };
}

Chars.prototype.dump = function (): any {
    const d = this.content.dump();
    (d as any).tag = "chars";
    return d;
}
