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
/*% if e.tag == "?" %*/
/*% else %*/
Container.prototype.add_/*{ e.name }*/ = function (params?: AddOpt) { const { before, ...etc } = params ?? {}; const x = /*{ kind }*/.new(etc); this.insert_before(before, x); return x; }
/*% endif %*/
/*% endfor %*/

Container.prototype._add_element = function (tag: string, params?: AddOpt) {
    switch (tag) {
        /*% for kind, e in elements.items() %*/
        /*% if e.tag == "?" %*/
        /*% else %*/
        case "/*{ e.tag }*/": return this.add_/*{ e.name }*/(params);
        /*% endif %*/
        /*% endfor %*/
    }
    throw new Error("Unexpected tag: " + tag);
}

