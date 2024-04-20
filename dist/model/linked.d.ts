export declare class Node {
    _next?: Node;
    _prev?: Node;
    _parent?: Parent;
    get _end(): Node;
    get _start(): Node;
    next_sibling<T extends Node = Node>(): T | undefined;
    previous_sibling<T extends Node = Node>(): T | undefined;
    root<T extends Parent = Parent>(): T | undefined;
    _link_next(node?: Node): void;
    _detach(): this;
    _attach(prev: Node, next: Node, parent: Parent): void;
    place_after(...nodes: Array<Node>): void;
    place_before(...nodes: Array<Node>): void;
    replace_with(...nodes: Array<Node>): void;
    remove(): void;
}
export declare class Parent extends Node {
    _tail: End;
    constructor();
    get _end(): Node;
    first_child<T extends Node = Node>(): T | undefined;
    last_child<T extends Node = Node>(): T | undefined;
    insert_before(child: Node, ...nodes: Array<Node>): void;
    append_child(...nodes: Array<Node>): void;
    prepend_child(...nodes: Array<Node>): void;
    remove_child(node: Node): Node;
    contains(node: Node): boolean;
    children<T extends Node = Node>(): Generator<T, void, unknown>;
    [Symbol.iterator](): Generator<Node, void, unknown>;
    root_or_self<T extends this>(): T;
}
export declare class End extends Node {
    _parent: Parent;
    constructor(parent: Parent);
    get _start(): Node;
}
