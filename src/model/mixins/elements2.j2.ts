/*% for kind, element in elements.items() %*/
/*%- if element.tag.startswith("fe") or element.tag.startswith("mesh")  or element.tag in (
'filter' , 'stop', 'radialGradient', 'linearGradient', 'use', 'image',
 'text', 'style', 'tspan', 'g', 'defs', 'symbol', 'marker', 'pattern', 'clipPath',
 'mask', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'svg'
 )  -%*/
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

