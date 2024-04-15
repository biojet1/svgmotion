import { DOMParser } from 'domspec';
export function parse_svg(src, opt = {}) {
    return DOMParser.loadXML(src, { ...opt, type: 'image/svg+xml' })
        .then(doc => {
        const base = opt.base || src;
        const root = doc.documentElement;
        if (root) {
            // const f = parse_help[root.localName];
            // root.namespaceURI
        }
        console.info(`loadrd "${src}" ${root?.localName}`);
    })
        .catch(err => {
        console.error(`Failed to load "${src}"`);
        throw err;
    });
}
class parse_help {
    svg(elem) {
        // elem.attributes
        //    elem.getAttribute()
    }
    walk(elem) {
        // elem.childNodes
    }
}
//# sourceMappingURL=parse.js.map