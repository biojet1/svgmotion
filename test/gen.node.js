"uses strict";
import * as all from "../dist/lib.js";
import fs from "fs/promises";

function* enum_prototypes(class_dec) {
    let p = Object.getPrototypeOf(class_dec);
    while (p) {
        yield p;
        p = Object.getPrototypeOf(p);
    }
}

function* enum_prototype_names(class_dec) {
    let p = Object.getPrototypeOf(class_dec);
    while (p) {
        yield p.name;
        p = Object.getPrototypeOf(p);
    }
}

const camelToSnakeCase = str => str.replace(/[A-Z][a-z0-1]/g, letter => `_${letter.toLowerCase()}`);

function* enum1(all) {
    for (const [kind, v] of Object.entries(all)) {
        const q = enum_prototype_names(v);
        const t = [...q];
        // console.warn("X", kind, t)
        if (t.includes("Element")) {
            const { tag } = v;
            // console.warn("N", tag, kind, Object.getOwnPropertyDescriptors(v))
            if (tag && /^[a-zA-Z]/.test(tag)) {
                let name = v.tag;
                switch (name) {
                    case "g":
                        name = "group";
                        break;
                    case "svg":
                        name = "view";
                        break;
                    default:

                        name = camelToSnakeCase(name)
                        if (name.startsWith("fe_")) {
                            name = name.substring(3);
                        }
                }
                yield { name, kind, tag };
            }
        }
    }
}

if (1) {
    const col = [...enum1(all)];
    col.sort((a, b) => a.name.localeCompare(b.name));
    fs.open("/tmp/elements.json", "w").then(async w => {
        w.write(JSON.stringify({ elements: col }))


    });
}
// console.warn(Object.getOwnPropertyDescriptors(all.Element.prototype))
