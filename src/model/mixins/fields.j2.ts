import { ViewBox } from "../valuesets.js";
import { LengthValue, LengthXValue, LengthYValue, TextValue } from "../value.js";
import { Circle, Ellipse, Path, Rect, Polygon, Polyline, Line } from "../shapes.js";
import { Symbol, Marker } from "../containers.js";
import { Use } from "../elements.js";


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
        return this._new_field("/*{ name }*/", new /*{ field.kind }*/(
            /*%- for a in field.args -%*/
            /*{ "%r"|format(a) }*/
            /*%- if loop.nextitem -%*/, /*% endif -%*/
            /*%- endfor -%*/  
        ));
    },
});
/*% endfor %*/
/*% endfor %*/
