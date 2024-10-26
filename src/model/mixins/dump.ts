import { Animatable } from "../value.js";
import { ValueSet } from "../valuesets.js";
import { Chars, Element } from "../base.js";
import { Container } from "../containers.js";
import { Root, PlainRoot, PlainNode, Asset } from "../root.js";

declare module "../valuesets" {
    interface ValueSet {
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

declare module "../root" {
    interface Root {
        dump(): any;
    }
    interface Asset {
        dump(): any;
    }
}

declare module "../containers" {
    interface Container {
        dump(): any;
    }
}


Chars.prototype.dump = function (): any {
    const d = this.content.dump();
    (d as any).tag = "chars";
    return d;
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

Asset.prototype.dump = function (): any {
    return Object.fromEntries(Object.entries(this).filter(([k,]) => /^[A-Za-z]+/.test(k) && k != 'id'));
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

ValueSet.prototype.dump = function () {
    let u: any = {};
    for (let [k, v] of Object.entries(this)) {
        if (v instanceof Animatable) {
            u[k] = v.dump();
        }
    }
    return u;
}
