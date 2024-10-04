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
        // console.log("X", kind, t)
        if (t.includes("Element")) {
            const { tag } = v;
            console.log("N", tag, kind, Object.getOwnPropertyDescriptors(v))
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
    yield { name: "element", kind: "Element", tag: "" };
    yield { name: "data", kind: "TextData", tag: "" };
}
if (1) {
    const col = [...enum1(all)];
    col.sort((a, b) => a.name.localeCompare(b.name));


    fs.open("/tmp/elements.json", "w").then(async w => {
        w.write(JSON.stringify({ elements: col }))


    });



    // for (const { name, kind, tag } of col) {
    //     console.log(`        get_${name}(x: number | string): ${kind};`);
    // }
    // for (const { name, kind, tag } of col) {
    //     console.log(`        find_${name}(x: number | string): ${kind} | void;`
    //     );
    // }
    // for (const { name, kind, tag } of col) {
    //     tag && console.log(`        add_${name}(params?: AddOpt): ${kind};`
    //     );
    // }


    for (const { name, kind, tag } of col) {
        console.log(`Container.prototype.get_${name} = function (x: number | string = 0) {\n            return get_node(this, x, ${kind});\n}`);
    }
    for (const { name, kind, tag } of col) {
        console.log(`Container.prototype.find_${name} = function (x: number | string = 0) : ${kind} | void {\n            return find_node(this, x, ${kind});\n}`);
    }

    // fs.open("/tmp/Container.add.js", "w").then(async w => {
    //     await w.write(`// Container.prototype.add_...\n`);
    //     for (const { name, kind, tag } of col) {
    //         tag && await w.write(`Container.prototype.add_${name} = function (params?: AddOpt) {` +
    //             `const { before, ...etc } = params ?? {}; const x = ${kind}.new(etc);this.insert_before(before ?? this._end, x); return x;}\n`);
    //     }
    // });

    console.log(`// function (parent: Container)...`);
    for (const { name, kind, tag } of col) {
        tag && console.log(`${tag} : function (parent: Container) {` +
            `return parent.add_${name}();},`);
    }
    fs.open("/tmp/Container.add.ts", "w").then(async w => {

        await w.write(`export interface AddOpt {
            [key: string]: any;
            before?: Element;
        }\n
declare module "../containers" {
    interface Container {\n`);

        for (const { name, kind, tag } of col) {
            tag && await w.write(`        add_${name}(params?: AddOpt): ${kind};\n`
            );
        }

        await w.write(`////
        _add_element(name: string): Element;
    }
}\n\n`);


        await w.write(`// Container.prototype.add_...\n`);
        for (const { name, kind, tag } of col) {
            tag && await w.write(`Container.prototype.add_${name} = function (params?: AddOpt) {` +
                `const { before, ...etc } = params ?? {}; const x = ${kind}.new(etc);this.insert_before(before ?? this._end, x); return x;}\n`);
        }
        await w.write(`\n`);
        await w.write(`Container.prototype._add_element = function (tag: string) {\n`);
        await w.write(`\tswitch (tag) {\n`);
        for (const { name, kind, tag } of col) {
            tag && w.write(`\t\tcase "${tag}": return this.add_${name}();\n`);
        }
        await w.write(`\t}\n`);
        await w.write(`\tthrow new Error("Unexpected tag: " + tag);\n`);
        await w.write(`}\n`);
    });

}

console.log(Object.getOwnPropertyDescriptors(all.Element.prototype))
