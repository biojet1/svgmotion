"uses strict";

import * as all from "../dist/lib.js";
// const { Item, Container } = all;

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
        if (t.includes("Item") || t.includes("Container")) {
            console.log(`<<<< ${k}`, prop_descs(v));
        }
    }
}
function* enum1(all) {
    for (const [kind, v] of Object.entries(all)) {
        const q = ptypes(v);
        const t = [...q];
        // console.log("X", kind, t)
        if (t.includes("Item") || t.includes("Container") || t.includes("Element")) {
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
        tag && console.log(`        add_${name}(): ${kind};`
        );
    }
    for (const { name, kind, tag } of col) {
        console.log(`Container.prototype.get_${name} = function (x: number | string = 0) {\n            return get_node(this, x, ${kind});\n}`);
    }
    for (const { name, kind, tag } of col) {
        console.log(`Container.prototype.find_${name} = function (x: number | string = 0) : ${kind} | void {\n            return find_node(this, x, ${kind});\n}`);
    }
    for (const { name, kind, tag } of col) {
        tag && console.log(`Container.prototype.add_${name} = function () {` +
            `const x = new ${kind}();this.append_child(x);return x;}`);
    }
    for (const { name, kind, tag } of col) {
        tag && console.log(`${tag} : function (parent: Container) {` +
            `return parent.add_${name}();},`);
    }

}

/*
function tracePrototypeChainOf(object) {

    var proto = object.constructor.prototype;
    var result = '';

    while (proto) {
        result += ' -> ' + proto.constructor.name + '.prototype';
        proto = Object.getPrototypeOf(proto)
    }

    result += ' -> null';
    return result;
}

var trace = tracePrototypeChainOf(document.body)
alert(trace);
*/

// console.log(all);
