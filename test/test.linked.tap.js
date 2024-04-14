"uses strict";
import test from "tap";

import { Node, Parent } from "../dist/model/linked.js";

class Item extends Parent {
    constructor(v) {
        super();
        this.value = v;
    }
    toString() {
        return `${this.value}(${[...this.children()].join(' ')})`
    }
}

function* children1(n) {
    for (let x = n.first_child(); x; x = x.next_sibling()) {
        yield x;
    }
}
function* children2(n) {
    for (let x = n.last_child(); x; x = x.previous_sibling()) {
        yield x;
    }
}

function to_string1(n) {
    return `${n.value}(${[...children1(n)].map((v) => to_string1(v)).join(' ')})`;
}

function to_string2(n) {
    return `${n.value}(${[...children2(n)].reverse().map((v) => to_string2(v)).join(' ')})`;
}

function to_string_check(t, n, s) {
    t.same(to_string1(n), s);
    t.same(to_string2(n), s);
    t.same(n.toString(), s);
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
    to_string_check(t, A, 'A()');
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
    t.same(B._parent, A);

    t.same(A.first_child()?.value, 'B');
    t.same(A.last_child()?.value, 'B');
    to_string_check(t, A, 'A(B())');
    A.prepend_child(C);
    to_string_check(t, A, 'A(C() B())');
    t.same(A.first_child()?.value, 'C');
    t.same(A.last_child()?.value, 'B');
    t.same(C.next_sibling()?.value, 'B');
    t.same(B.next_sibling()?.value, undefined);
    t.same(C.previous_sibling()?.value, undefined);
    t.same(B.previous_sibling()?.value, 'C');
    D.append_child(E);
    to_string_check(t, D, 'D(E())');
    E.place_after(G);
    to_string_check(t, D, 'D(E() G())');
    E.place_after(F);
    to_string_check(t, D, 'D(E() F() G())');
    F.place_after(E);
    to_string_check(t, D, 'D(F() E() G())');
    G.place_after(E);
    to_string_check(t, D, 'D(F() G() E())');
    A.append_child(D);
    to_string_check(t, A, 'A(C() B() D(F() G() E()))');
    E.remove();
    to_string_check(t, A, 'A(C() B() D(F() G()))');
    t.throws(() => A.remove_child(G));
    t.throws(() => A.remove_child(B._end));
    A.remove_child(B);
    to_string_check(t, A, 'A(C() D(F() G()))');
    C.place_before(B);
    to_string_check(t, A, 'A(B() C() D(F() G()))');
    F.place_before(E);
    to_string_check(t, A, 'A(B() C() D(E() F() G()))');
    F.replace_with(H);
    to_string_check(t, A, 'A(B() C() D(E() H() G()))');
    G.replace_with(F);
    to_string_check(t, A, 'A(B() C() D(E() H() F()))');
    E.replace_with(G);
    to_string_check(t, A, 'A(B() C() D(G() H() F()))');
    G.replace_with(H);
    to_string_check(t, A, 'A(B() C() D(H() F()))');
    F.replace_with(H);
    to_string_check(t, A, 'A(B() C() D(H()))');
    A.insert_before(B, D);
    to_string_check(t, A, 'A(D(H()) B() C())');
    t.throws(() => A.insert_before(E, C));
    to_string_check(t, A, 'A(D(H()) B() C())');
    t.ok(A.contains(D));
    t.ok(A.contains(H) && A.contains(B) && A.contains(C));
    t.not(D.contains(A));
    t.not(H.contains(A));
    t.not(I.contains(A));
    t.not(B.contains(A));
    t.not(A.contains(I));
    t.end();
});