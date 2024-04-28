"uses strict";

import * as all from "../dist/index.js";
import { Item, Container } from "../dist/index.js";
// const { Item, Container } = all;

function* ptypes(class_dec) {

    let p = Object.getPrototypeOf(class_dec);
    while (p) {
        yield p.name;
        p = Object.getPrototypeOf(p);
    }
}

function prop_descs(class_dec) {
    let a = {}
    for (let p = class_dec.prototype; p; p = Object.getPrototypeOf(p)) {
        let o = Object.getOwnPropertyDescriptors(p);
        a = { ...o, ...a };

    }
    return a;
}

if (0) {
    for (const [k, v] of Object.entries(all)) {
        const t = [...ptypes(v)];
        if (t.includes('Item') || t.includes('Container')) {
            console.log(`<<<< ${k}`, prop_descs(v));
        }
    }
}
if (1) {
    for (const [k, v] of Object.entries(all)) {
        const q = ptypes(v);
        const t = [...q];
        if (t.includes('Item') || t.includes('Container')) {
            if (v.tag) {
                console.log(`<<<< ${k}`, v.tag);
            }
        }
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