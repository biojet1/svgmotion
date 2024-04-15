import { DOMParser, SVGSVGElement, SVGElement } from 'domspec';

export function parse_svg(src: string | URL, opt: { xinclude?: boolean; base?: string | URL } = {}) {
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
    svg(elem: SVGSVGElement) {
        // elem.attributes
        //    elem.getAttribute()
    }
    walk(elem: SVGElement) {
        // elem.childNodes

    }

}
