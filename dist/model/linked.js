export class Node {
    _next;
    _prev;
    _parent;
    get _end() {
        // End node or self
        return this;
    }
    get _start() {
        // End node or self
        return this;
    }
    next_sibling() {
        const node = this._end._next;
        if (node instanceof End) {
            // P -> a b c -> E
            if (node._parent !== this._parent) {
                // console.warn([node.parentNode, this.parentNode]);
                throw new Error("Unexpected following End node");
            }
        }
        else {
            return node;
        }
    }
    previous_sibling() {
        // N a ^a b ^b c ^c  ^N
        const node = this._start._prev;
        if (node instanceof End) {
            // ...<child/></end>
            return node._start;
        }
        else if (this._parent === node) {
            return undefined;
        }
        return node;
    }
    _link_next(node) {
        // [THIS]<->node
        if (node === this) {
            throw new Error(`Same node`);
        }
        else if (node) {
            this._next = node;
            node._prev = this;
        }
        else {
            delete this._next;
        }
    }
    // _linkl(node?: Node) {
    //     // node<->[THIS]
    //     if (node === this) {
    //         throw new Error(`Same node`);
    //     } else if (node) {
    //         this._prev = node;
    //         node._next = this;
    //     } else {
    //         delete this._prev;
    //     }
    // }
    _detach() {
        const { _prev: prev, _end: { _next: next } } = this;
        // [PREV]<->[THIS]<->[NEXT] => [PREV]<->[NEXT]
        prev && next && prev._link_next(next);
        this._prev = undefined; // or this._start._prev = undefined
        this._end._next = undefined;
        this._parent = undefined;
        return this;
    }
    _attach(prev, next, parent) {
        const { _start, _end, _parent } = this;
        if (_parent || _start._prev || _end._next) {
            throw new Error(`Detach first`);
        }
        this._parent = parent;
        prev._link_next(_start);
        _end._link_next(next);
    }
    place_after(...nodes) {
        const { _parent } = this;
        _parent?.insert_before(this.next_sibling() || _parent._end, ...nodes);
    }
    place_before(...nodes) {
        const { _parent } = this;
        _parent?.insert_before(this, ...nodes);
    }
    remove() {
        this._detach();
    }
}
export class Parent extends Node {
    //// Tree
    _tail;
    constructor() {
        super();
        this._tail = this._next = new End(this);
    }
    get _end() {
        // End node or self
        return this._tail;
    }
    first_child() {
        // P -> *C -> E
        for (let { _next, _end } = this; _next && _next !== _end;) {
            if (_next instanceof End) {
                throw new Error("Unexpected following End node");
            }
            return _next;
        }
    }
    last_child() {
        const prev = this._end._prev;
        if (prev && prev != this) {
            return prev._start;
        }
    }
    insert_before(child, ...nodes) {
        for (const node of nodes) {
            if (node !== child) {
                node._detach();
                node._attach(child._prev ?? this, child, this);
            }
        }
    }
    append_child(...nodes) {
        this.insert_before(this._end, ...nodes);
    }
    prepend_child(...nodes) {
        this.insert_before(this.first_child() || this._end, ...nodes);
    }
    remove_child(node) {
        if (node instanceof End) {
            throw new Error("Unexpected End node");
        }
        else if (node._parent !== this) {
            throw new Error('child not parent');
        }
        node.remove();
        return node;
    }
    *children() {
        let cur = this.first_child();
        for (; cur; cur = cur.next_sibling()) {
            yield cur;
        }
    }
}
export class End extends Node {
    _parent;
    constructor(parent) {
        super();
        this._parent = this._prev = parent;
    }
    get _start() {
        return this._parent;
    }
}
function set_adjacent(before, after) {
    before._next = after;
    after._prev = before;
}
;
//# sourceMappingURL=linked.js.map