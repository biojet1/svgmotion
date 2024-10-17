"uses strict";
import test from "tap";

import { Node, Parent } from "../dist/tree/linked3.js";

class Unit extends Parent {
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
test.test("Tree Linked3", (t) => {
    let A = new Unit("A");
    let B = new Unit("B");
    let C = new Unit("C");
    let D = new Unit("D");
    let E = new Unit("E");
    let F = new Unit("F");
    let G = new Unit("G");
    let H = new Unit("H");
    let I = new Unit("I");
    t.same(A.first_child(), undefined);
    t.same(A.last_child(), undefined);
    t.same(A.root(), undefined);
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
    // console.warn(A._end._prev.constructor.name);
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
    t.same(A.root(), undefined);
    t.same(B.root(), A);
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
    t.same([...D].map(v => v.value).join(':'), 'F:G:E');
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
    t.same(H.root(), A);
    t.same(H.root_or_self(), A);
    t.same(A.root_or_self(), A);
    t.same([...H.ancestors()].map(v => v.value).join(':'), 'D:A');
    D.remove_children()
    to_string_check(t, A, 'A(D() B() C())');
    A.remove_children()
    to_string_check(t, A, 'A()');
    A.prepend_child(B)
    to_string_check(t, A, 'A(B())');
    t.end();
});