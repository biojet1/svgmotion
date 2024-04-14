export declare class Node {
    _next?: Node;
    _prev?: Node;
    _parent?: Parent;
    get _end(): Node;
    get _start(): Node;
    next_sibling(): Node | undefined;
    previous_sibling(): Node | undefined;
    _link_next(node: Node): void;
    _detach(): this;
    _attach(prev: Node, next: Node, parent: Parent): void;
    place_after(...nodes: Array<Node>): void;
    place_before(...nodes: Array<Node>): void;
    replace_with(...nodes: Array<Node>): void;
    remove(): void;
}
export declare abstract class Parent extends Node {
    _tail: End;
    constructor();
    get _end(): Node;
    first_child(): Node | undefined;
    last_child(): Node | undefined;
    insert_before(child: Node, ...nodes: Array<Node>): void;
    append_child(...nodes: Array<Node>): void;
    prepend_child(...nodes: Array<Node>): void;
    remove_child(node: Node): Node;
    contains(node: Node | Parent): boolean;
    children(): Generator<Node, void, unknown>;
}
export declare class End extends Node {
    _parent: Parent;
    constructor(parent: Parent);
    get _start(): Node;
}
