"uses strict";
import test from "tap";

import {
    Node,
    Parent
} from "../dist/model/tree.js";

class Item extends Parent {
    constructor(v) {
        super();
        this.value = v;
    }
    toString() {
        return `${this.value}(${[...this.children()].join(', ')})`
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
    let J = new Item("J");
    let K = new Item("K");
    let L = new Item("L");
    let M = new Item("M");
    let N = new Item("N");
    let O = new Item("O");
    let P = new Item("P");
    let Q = new Item("Q");
    let R = new Item("R");
    let S = new Item("S");
    // let T = new Item("T");
    let U = new Item("U");
    let V = new Item("V");
    let W = new Item("W");
    let X = new Item("X");
    let Y = new Item("Y");
    let Z = new Item("Z");

    t.same([B._first, B._next, B._parent, [...B.children()]], [undefined, undefined, undefined, []]);
    t.same(B.toString(), 'B()');
    t.equal(B.previous_sibling(), undefined);
    t.equal(B.next_sibling(), undefined);
    A.append_child(B);
    t.same(A.toString(), 'A(B())');
    t.same([B._first, B._next, B._parent, [...B.children()]], [undefined, undefined, A, []]);
    t.equal(B.previous_sibling(), undefined);
    t.equal(B.next_sibling(), undefined);
    t.same([A.first_child(), A.last_child(), [...A.children()]], [B, B, [B]]);
    t.same(A.toString(), 'A(B())');
    A.append_child(C);
    t.same(A.toString(), 'A(B(), C())');
    t.equal(B.previous_sibling(), undefined);
    t.equal(B.next_sibling(), C);
    t.equal(C.previous_sibling(), B);

    t.equal(C.next_sibling(), undefined);

    t.same([A.first_child(), A.last_child(), [...A.children()]], [B, C, [B, C]]);
    A.preppend_child(Z);
    t.same(A.toString(), 'A(Z(), B(), C())');
    t.equal(A.first_child(), Z);
    t.equal(A.last_child(), C);
    t.same([...A.ancestors()], []);
    t.same([...C.ancestors()], [A]);
    t.same([...A.children()], [Z, B, C]);

    H.preppend_child(K);
    H.preppend_child(J);
    H.preppend_child(I);
    t.same(H.toString(), 'H(I(), J(), K())');
    A.preppend_child(H);
    t.same(A.toString(), 'A(H(I(), J(), K()), Z(), B(), C())');
    t.same([...J.ancestors()], [H, A]);
    t.same([...J.self_and_ancestors()], [J, H, A]);
    A.preppend_child(J);
    t.same(A.toString(), 'A(J(), H(I(), K()), Z(), B(), C())');
    t.equal(H.previous_sibling(), J);


    A.remove_child(C);

    t.same(A.toString(), 'A(J(), H(I(), K()), Z(), B())');
    U.append_child(V);
    U.append_child(W);

    t.same(U.toString(), 'U(V(), W())');
    K.append_child(V);
    t.same(A.toString(), 'A(J(), H(I(), K(V())), Z(), B())');
    t.equal(K.prior_child(V), undefined);
    V.preppend_child(W);
    t.same(A.toString(), 'A(J(), H(I(), K(V(W()))), Z(), B())');
    B.place_before(U);
    t.same(A.toString(), 'A(J(), H(I(), K(V(W()))), Z(), U(), B())');

    t.same([...W.ancestors()].map(v => v.value).join('/'), 'V/K/H/A');
    t.same([...W.self_and_ancestors()].map(v => v.value).join('/'), 'W/V/K/H/A');
    A.remove_child(U);
    t.same(A.toString(), 'A(J(), H(I(), K(V(W()))), Z(), B())');
    t.equal(U.previous_sibling(), undefined);
    t.equal(U.next_sibling(), undefined);
    t.equal(U._parent, undefined);
    t.equal(Z.next_sibling()?.value, 'B');
    t.equal(B.next_sibling()?.value, undefined);
    t.equal(Z.previous_sibling()?.value, 'H');
    J.replace_with(D);
    t.same(A.toString(), 'A(D(), H(I(), K(V(W()))), Z(), B())');
    H.replace_child(B, I);
    t.same(A.toString(), 'A(D(), H(B(), K(V(W()))), Z())');
    H.replace_child(W, K);
    t.same(A.toString(), 'A(D(), H(B(), W()), Z())');
    t.throws(() => A.insert_after(W, B));
    t.throws(() => A.remove_child(X));
    t.throws(() => A.prior_child(X));
    t.throws(() => A.insert_after(A, A));
    H.insert_after(W, B);
    t.equal(H.first_child()?.value, 'B');
    t.same(A.toString(), 'A(D(), H(B(), W()), Z())');
    H.insert_after(B, W);
    t.same(A.toString(), 'A(D(), H(W(), B()), Z())');
    t.same(A.adjacents_of(H), [D, Z]);
    t.same(L.toString(), 'L()');
    t.throws(() => L.append_child(L));
    t.throws(() => L.preppend_child(L));

    t.same(L.toString(), 'L()');
    t.same(H.toString(), 'H(W(), B())');

    t.throws(() => B.append_child(H));
    t.same(H.toString(), 'H(W(), B())');

    t.end();

});