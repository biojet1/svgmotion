"uses strict";

import * as all from "../dist/lib.js";

function* ptypes(class_dec) {
    let p = Object.getPrototypeOf(class_dec);
    while (p) {
        yield p.name;
        p = Object.getPrototypeOf(p);
    }
}

function prop_descs(class_dec) {
    let a = {};
    for (let p = class_dec.prototype; p; p = Object.getPrototypeOf(p)) {
        let o = Object.getOwnPropertyDescriptors(p);
        a = { ...o, ...a };
    }
    return a;
}

function* enum1(all) {
    for (const [kind, v] of Object.entries(all)) {
        const q = ptypes(v);
        const t = [...q];
        // console.log("X", kind, t)
        if (t.includes("AudioChain")) {

            yield { kind, tag: v.tag };

        }
    }

}
if (1) {
    const col = [...enum1(all)];
    for (const { kind, tag } of col) {
        if (tag) { console.log(`case "${tag}": return ${kind}._load(d, prev);`); }
    }




}

