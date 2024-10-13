declare module "../containers" {
    interface Container {
        /*% for e in elements %*/
        add_/*{ e.name }*/(params?: AddOpt)/*{ ': ' ~ e.kind }*/;
        /*% endfor %*/
        ////
        _add_element(name: string): Element;
    }
}

// Container.prototype.add_...
/*% for e in elements %*/
Container.prototype.add_/*{ e.name }*/ = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = /*{ e.kind }*/.new(etc); this.insert_before(before, x); return x; }
/*% endfor %*/

Container.prototype._add_element = function (tag: string) {
    switch (tag) {
        /*% for e in elements %*/
        case "/*{ e.tag }*/": return this.add_/*{ e.name }*/();
        /*% endfor %*/
    }
    throw new Error("Unexpected tag: " + tag);
}

