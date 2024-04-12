export class Node {
    _next; // next sibling
    _parent; // parent
    detach() {
        let { _parent } = this;
        if (_parent) {
            let { _first: cur } = _parent;
            for (let prev; cur; cur = cur._next) {
                if (cur === this) {
                    if (prev) {
                        prev._next = cur._next;
                    }
                    else {
                        _parent._first = cur._next;
                    }
                    break;
                }
                prev = cur;
            }
        }
        delete this._parent;
        delete this._next;
        return this;
    }
    place_after(node) {
        const { _parent, _next } = this;
        if (node !== this) {
            node.detach();
            node._parent = _parent;
            node._next = _next;
            this._next = node;
        }
        else {
            throw new Error(`Same node`);
        }
    }
    place_before(node) {
        node.detach();
        const { _parent } = this;
        if (_parent) {
            node._parent = _parent;
            node._next = this;
            const prev = _parent.prior_child(this);
            if (prev) {
                prev._next = node;
            }
            else {
                _parent._first = node;
            }
        }
    }
    replace_with(child) {
        this._parent?.replace_child(child, this);
    }
    next_sibling() {
        return this._next;
    }
    previous_sibling() {
        return this._parent?.prior_child(this);
    }
    get _prev() {
        return this._parent?.prior_child(this);
    }
    *ancestors() {
        let parent = this._parent;
        while (parent) {
            yield parent;
            parent = parent._parent;
        }
    }
}
export class Parent extends Node {
    _first; // first child
    last_child() {
        let { _first: child } = this;
        if (child) {
            while (child._next) {
                if (child._parent !== this) {
                    throw new Error(`Unexpected parent`);
                }
                child = child._next;
            }
        }
        // for (; child;) {
        //     if (child._parent !== this) {
        //         throw new Error(`Unexpected parent`);
        //     }
        //     const { _next } = child;
        //     if (_next) {
        //         child = _next;
        //     } else {
        //         break;
        //     }
        // }
        return child;
    }
    first_child() {
        return this._first;
    }
    prior_child(child) {
        let { _first: cur } = this;
        for (let prev; cur; cur = cur._next) {
            if (cur === child) {
                return prev;
            }
            prev = cur;
        }
        throw new Error(`child not found`);
    }
    remove_child(child) {
        if (child._parent !== this) {
            throw new Error(`Invalid parent`);
        }
        return child.detach();
    }
    replace_child(child, old) {
        if (child === this || old == this) {
            throw new Error(`Invalid child`);
        }
        else if (old._parent !== this) {
            throw new Error(`Invalid parent`);
        }
        const { _prev, _next } = old;
        old.detach();
        child.detach();
        child._parent = this;
        child._next = _next;
        if (_prev) {
            _prev._next = child;
        }
        else {
            this._first = child;
        }
    }
    insert_after(child, old) {
        if (child === this || old == this) {
            throw new Error(`Invalid child`);
        }
        else if (old._parent !== this) {
            throw new Error(`Invalid parent`);
        }
        child.detach();
        old.place_after(child);
    }
    append_child(child) {
        if (child === this) {
            throw new Error(`Invalid child`);
        }
        child.detach();
        const last = this.last_child();
        child._parent = this;
        if (last) {
            last._next = child;
        }
        else {
            this._first = child;
        }
    }
    preppend_child(child) {
        if (child === this) {
            throw new Error(`Invalid child`);
        }
        child.detach();
        child._next = this._first;
        child._parent = this;
        this._first = child;
    }
    *self_and_ancestors() {
        let parent = this;
        while (parent) {
            yield parent;
            parent = parent._parent;
        }
    }
    *children() {
        for (let { _first: child } = this; child; child = child._next) {
            yield child;
        }
    }
}
//# sourceMappingURL=tree.js.map