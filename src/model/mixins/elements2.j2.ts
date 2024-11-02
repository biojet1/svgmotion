import { Element, Chars } from "../base.js";
import { Container, Symbol, Group, ClipPath, Marker, Mask, Pattern, Filter } from "../containers.js";
import { ViewPort } from "../viewport.js";
import { Use, Image } from "../elements.js";
import { Text, TSpan } from "../text.js";
import { Circle, Ellipse, Line, Path, Polygon, Polyline, Rect } from "../shapes.js";
import { FEDropShadow, FEGaussianBlur, LinearGradient, MeshPatch, MeshRow, RadialGradient } from "../filters.js";

/*% for kind, element in elements.items() %*/
/*%- if element.tag.startswith("fe") -%*/
export class /*{ kind }*/ extends /*% if element.content -%*/Content
    /*%- elif element.shape -%*/ Shape
    /*%- elif element.container -%*/ Container
    /*%- else -%*/ Element/*% endif %*/ {
    static override tag = "/*{ element.tag }*/";
    /*% for name, field in element.fields.items() %*/
    get /*{ name }*/() { /*# -#*/
        return this._new_field("/*{ name }*/", new /*{ field.kind }*/(
            /*%- for a in field.args -%*/
                /*{ "%r"|format(a) }*/
                /*%- if loop.nextitem -%*/, /*% endif -%*/
            /*%- endfor -%*/
        )); /*# -#*/
    }
    /*% endfor %*/
}
/*% endif %*/
/*% endfor %*/

