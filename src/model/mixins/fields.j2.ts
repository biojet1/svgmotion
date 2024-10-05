declare module "../index" {
    /*% for kind, element in elements.items() %*/
    interface /*{ kind }*/ {
        /*% for name, field in element.fields.items() %*/
        get /*{ name }*/(): /*{ field.kind }*/;
        /*% endfor %*/
    }
    /*% endfor %*/
}

/*% for kind, element in elements.items() %*/
/*% for name, field in element.fields.items() %*/
Object.defineProperty(/*{ kind }*/.prototype, "marker_start", {
    get: function () {
        return this._new_field("marker_start", new /*{ field.kind }*/("none"));
    },
});
/*% endfor %*/
/*% endfor %*/
