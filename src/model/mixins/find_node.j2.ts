declare module "../containers" {
    interface Container {
        /*% for kind, e in elements.items() %*/
        get_/*{ e.name }*/(x: number | string)/*{ ': ' ~ kind }*/;
        /*% endfor %*/
        /*% for kind, e in elements.items() %*/
        find_/*{ e.name }*/(x: number | string): /*{ kind }*/ | void;
        /*% endfor %*/
    }
}

/*% for kind, e in elements.items() %*/
Container.prototype.get_/*{ e.name }*/ = function (x: number | string = 0) {
    /*{ 'return this.get_node(x, ' ~ kind ~ ');' }*/
}
Container.prototype.find_/*{ e.name }*/ = function (x: number | string = 0): /*{ e.kind }*/ | void {
    /*{ 'return this.find_node(x, ' ~ kind ~ ');' }*/
}
/*% endfor %*/
