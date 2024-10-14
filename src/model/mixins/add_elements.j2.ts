declare module "../containers" {
    interface Container {
        /*% for kind, e in elements.items() %*/
        add_/*{ e.name }*/(params?: AddOpt)/*{ ': ' ~ kind }*/;
        /*% endfor %*/
        ////
        _add_element(name: string): Element;
    }
}

// Container.prototype.add_...
/*% for kind, e in elements.items() %*/
Container.prototype.add_/*{ e.name }*/ = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = /*{ kind }*/.new(etc); this.insert_before(before, x); return x; }
/*% endfor %*/

Container.prototype._add_element = function (tag: string, params?: AddOpt) {
    switch (tag) {
        /*% for kind, e in elements.items() %*/
        case "/*{ e.tag }*/": return this.add_/*{ e.name }*/(params);
        /*% endfor %*/
    }
    throw new Error("Unexpected tag: " + tag);
}

