export declare class Node {
    _next?: Parent | Node;
    _parent?: Parent;
    detach(): this;
    place_after(node: Node): void;
    place_before(node: Node): void;
    replace_with(child: Node): void;
    next_sibling(): Node | Parent | undefined;
    previous_sibling(): Node | Parent | undefined;
    get _prev(): Node | Parent | undefined;
    ancestors(): Generator<Parent, void, unknown>;
}
export declare class Parent extends Node {
    _first?: Parent | Node;
    last_child(): Node | Parent | undefined;
    first_child(): Node | Parent | undefined;
    prior_child(child: Node): Parent | Node | undefined;
    remove_child(child: Node): Node;
    replace_child(child: Node, old: Node): void;
    insert_after(child: Node, old: Node): void;
    append_child(child: Node): void;
    preppend_child(child: Node): void;
    self_and_ancestors(): Generator<Parent, void, unknown>;
    children(): Generator<Node | Parent, void, unknown>;
}
