import { Circle, Ellipse, Path, Rect, Polygon, Polyline } from "../shapes.js";
import { LengthValue, LengthXValue, LengthYValue, TextValue } from "../value.js";

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
Object.defineProperty(/*{ kind }*/.prototype, "/*{ name }*/", {
    get: function () {
        return this._new_field("/*{ name }*/", new /*{ field.kind }*/(/*{ "%r"|format(field.argv) }*/));
    },
});
/*% endfor %*/
/*% endfor %*/
