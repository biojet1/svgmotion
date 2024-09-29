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

if (0) {
    for (const [k, v] of Object.entries(all)) {
        const t = [...ptypes(v)];
        if (t.includes("Element")) {
            console.log(`<<<< ${k}`, prop_descs(v));
        }
    }
}
function* enum1(all) {
    for (const [kind, v] of Object.entries(all)) {
        const q = ptypes(v);
        const t = [...q];
        // console.log("X", kind, t)
        if (t.includes("Element")) {
            const { tag } = v;
            // console.log("N", tag, kind)
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
                        if (name.starstWith("fe")) {
                            // /(?<!^)(?=[A-Z])/.sub
                            //     re.sub(r'', '_', name).lower()
                        }
                }
                yield { name, kind, tag };
            }
        }
    }
    yield { name: "element", kind: "Element", tag: "" };
    yield { name: "data", kind: "TextData", tag: "" };
}
if (1) {
    const col = [...enum1(all)];
    col.sort((a, b) => a.name.localeCompare(b.name));
    for (const { name, kind, tag } of col) {
        console.log(`        get_${name}(x: number | string): ${kind};`);
    }
    for (const { name, kind, tag } of col) {
        console.log(`        find_${name}(x: number | string): ${kind} | void;`
        );
    }
    for (const { name, kind, tag } of col) {
        tag && console.log(`        add_${name}(before?: Element): ${kind};`
        );
    }
    for (const { name, kind, tag } of col) {
        console.log(`Container.prototype.get_${name} = function (x: number | string = 0) {\n            return get_node(this, x, ${kind});\n}`);
    }
    for (const { name, kind, tag } of col) {
        console.log(`Container.prototype.find_${name} = function (x: number | string = 0) : ${kind} | void {\n            return find_node(this, x, ${kind});\n}`);
    }
    console.log(`// Container.prototype.add_...`);
    for (const { name, kind, tag } of col) {
        tag && console.log(`Container.prototype.add_${name} = function (before?: Element) {` +
            `const x = new ${kind}();this.insert_before(before ?? this._end, x);return x;}`);
    }
    console.log(``);
    console.log(`// function (parent: Container)...`);
    for (const { name, kind, tag } of col) {
        tag && console.log(`${tag} : function (parent: Container) {` +
            `return parent.add_${name}();},`);
    }

    console.log(`Container.prototype._add_element = function (tag: string) {`);
    console.log(`\tswitch (tag) {`);
    for (const { name, kind, tag } of col) {
        tag && console.log(`\t\tcase "${tag}": return this.add_${name}();`);
        // tag && console.log(`${tag} : function () {` +
        //     `return this.add_${name}();},`);
    }
    console.log(`\t}`);
    console.log(`\tthrow new Error("Unexpected tag: " + tag);`);
    console.log(`}`);
}