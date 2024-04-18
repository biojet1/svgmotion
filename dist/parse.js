import { DOMParser, SVGElement } from 'domspec';
export function parse_svg(src, opt = {}) {
    return DOMParser.loadXML(src, { ...opt, type: 'image/svg+xml' })
        .then(doc => {
        const base = opt.base || src;
        const root = doc.documentElement;
        console.info(`loadrd "${src}" ${root?.localName}`);
        if (root instanceof SVGElement) {
            const p = new parse_help();
            const f = p._start(root);
            return f;
        }
    })
        .catch(err => {
        console.error(`Failed to load "${src}"`);
        throw err;
    });
}
import { ViewPort } from './model/node.js';
import { NVector, NumberValue } from './model/keyframes.js';
class Obj {
    create(elem) {
        throw new Error(`not implemented`);
    }
}
class svg extends Obj {
    _props = {
        size: 7
    };
    create(elem) {
        return new ViewPort();
    }
}
export const A1 = {
    "*": {
        "_read": function (elem) {
            // elem.attributes.
            // elem.attributes
            //    elem.getAttribute()
            console.info(`svg ${elem?.localName}`);
        }
    },
    svg: function (elem) {
        let vp = new ViewPort();
        let vb = elem.viewBox.baseVal;
        if (vb) {
            const u = vp.view_box;
            u.position.value = new NVector([vb.x, vb.y]);
            u.size.value = new NVector([vb.width, vb.height]);
        }
        let w = elem.width.baseVal;
        if (w != null) {
            vp.width = new NumberValue(w.value);
        }
        let h = elem.height.baseVal;
        if (h != null) {
            vp.height = new NumberValue(h.value);
        }
        // console.info(`svg _read ${elem?.localName} ${vp.constructor.name} ${elem.viewBox.baseVal}`);
        return vp;
    },
};
class parse_help {
    // walk(elem: SVGElement) {
    //     // elem.childNodes
    // }
    // svg(elem: SVGSVGElement) {
    //     // elem.attributes.
    //     // elem.attributes
    //     //    elem.getAttribute()
    //     console.info(`svg ${elem?.localName}`);
    // }
    _start(elem) {
        const f = this[elem.localName];
        return A1[elem.localName](elem);
    }
}
// parse_help.prototype['svg'] = function (elem: SVGSVGElement) {
//     // elem.attributes
//     //    elem.getAttribute()
// }
//# sourceMappingURL=parse.js.map