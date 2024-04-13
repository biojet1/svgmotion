"uses strict";
import test from "tap";

import {
    Node,
    Parent
} from "../dist/model/linked.js";

class Item extends Parent {
    constructor(v) {
        super();
        this.value = v;
    }
    toString() {
        return `${this.value}(${[...this.children()].join(' ')})`
    }
}

test.test("Item", (t) => {
    let A = new Item("A");
    let B = new Item("B");
    let C = new Item("C");
    let D = new Item("D");
    let E = new Item("E");
    let F = new Item("F");
    let G = new Item("G");
    let H = new Item("H");
    let I = new Item("I");
    t.same(A.first_child(), undefined);
    t.same(A.last_child(), undefined);
    t.same(A._parent, undefined);
    t.same(A._next, A._end);
    t.same(A._prev, undefined);
    t.same(A._start, A);
    t.same(A._next._prev, A);
    t.same(A._start._next, A._end);
    t.same(A._end._parent, A);
    t.same(A._end._prev, A);
    // t.same(A.last_child(), undefined);   
    t.same(A.toString(), 'A()');
    A.append_child(B);
    // console.log(A._end._prev.constructor.name);
    t.same(A._parent, undefined);
    t.same(A._next, B);
    t.same(A._prev, undefined);
    t.same(A._start, A);
    t.same(A._end._parent, A);
    t.same(A._end._next, undefined);
    t.same(A._end._start, A);
    t.same(A._end._end, A._end);
    t.same(A._end._prev, B._end);
    t.same(A.first_child()?.value, 'B');
    t.same(A.last_child()?.value, 'B');
    t.same(A.toString(), 'A(B())');
    A.prepend_child(C);
    t.same(A.toString(), 'A(C() B())');
    t.same(A.first_child()?.value, 'C');
    t.same(A.last_child()?.value, 'B');
    t.same(C.next_sibling()?.value, 'B');
    t.same(B.next_sibling()?.value, undefined);
    t.same(C.previous_sibling()?.value, undefined);
    t.same(B.previous_sibling()?.value, 'C');
    D.append_child(E);
    t.same(D.toString(), 'D(E())');
    E.place_after(G);
    t.same(D.toString(), 'D(E() G())');
    E.place_after(F);
    t.same(D.toString(), 'D(E() F() G())');
    F.place_after(E);
    t.same(D.toString(), 'D(F() E() G())');
    G.place_after(E);
    t.same(D.toString(), 'D(F() G() E())');
    A.append_child(D);
    t.same(A.toString(), 'A(C() B() D(F() G() E()))');
    E.remove();
    t.same(A.toString(), 'A(C() B() D(F() G()))');
    t.throws(() => A.remove_child(G));
    A.remove_child(B);
    t.same(A.toString(), 'A(C() D(F() G()))');
    t.end();

});