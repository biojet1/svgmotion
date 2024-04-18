/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// UNUSED EXPORTS: animate

// NAMESPACE OBJECT: ./dist/index.js
var dist_namespaceObject = {};
__webpack_require__.r(dist_namespaceObject);
__webpack_require__.d(dist_namespaceObject, {
  Action: () => (Action),
  Actions: () => (Actions),
  Animatable: () => (Animatable),
  AnimatableD: () => (AnimatableD),
  Box: () => (Box),
  Container: () => (Container),
  Fill: () => (Fill),
  Group: () => (Group),
  Item: () => (Item),
  KeyframeEntry: () => (KeyframeEntry),
  Keyframes: () => (Keyframes),
  NVector: () => (NVector),
  NVectorValue: () => (NVectorValue),
  NumberValue: () => (NumberValue),
  OpacityProp: () => (OpacityProp),
  Par: () => (Par),
  ParA: () => (ParA),
  ParE: () => (ParE),
  Point: () => (Point),
  PositionValue: () => (PositionValue),
  RGB: () => (RGB),
  RGBValue: () => (RGBValue),
  Rect: () => (Rect),
  RectSizeProp: () => (RectSizeProp),
  Root: () => (Root),
  Seq: () => (Seq),
  SeqA: () => (SeqA),
  Shape: () => (Shape),
  Size: () => (Size),
  Step: () => (Step),
  StepA: () => (StepA),
  Stroke: () => (Stroke),
  TextValue: () => (TextValue),
  To: () => (To),
  ToA: () => (ToA),
  Track: () => (Track),
  Transform: () => (Transform),
  UPDATE: () => (UPDATE),
  ValueSet: () => (ValueSet),
  ViewPort: () => (ViewPort)
});

;// CONCATENATED MODULE: ./dist/model/keyframes.js
class KeyframeEntry {
    time = 0;
    value;
    easing;
}
class Keyframes extends Array {
    set_value(time, value) {
        let last = this[this.length - 1];
        if (last) {
            if (last.time == time) {
                last.value = value;
                return last;
            }
            else if (time < last.time) {
                throw new Error(`keyframe is incremental`);
            }
        }
        const kf = new KeyframeEntry();
        kf.time = time;
        kf.value = value;
        this.push(kf);
        return kf;
    }
}
class Animatable {
    value;
    lerp_value(ratio, a, b) {
        throw Error(`Not implemented`);
    }
    add_value(a, b) {
        throw Error(`Not implemented`);
        // return a + b;
    }
    get_value(frame) {
        const { value } = this;
        if (value instanceof Keyframes) {
            let p = undefined; // previous KeyframeEntry<V>
            for (const k of value) {
                if (frame <= k.time) {
                    if (p) {
                        if (k.easing === true) {
                            return p.value;
                        }
                        let r = (frame - p.time) / (k.time - p.time);
                        if (r == 0) {
                            return p.value;
                        }
                        else if (r == 1) {
                            return k.value;
                        }
                        else if (p.easing && p.easing !== true) {
                            r = p.easing.ratio_at(r);
                        }
                        return this.lerp_value(r, p.value, k.value);
                    }
                    else {
                        return k.value;
                    }
                }
                p = k;
            }
            if (p) {
                return p.value;
            }
            throw new Error(`empty keyframe list`);
        }
        else {
            return value;
        }
    }
    set_value(frame, value, start, easing, add) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                }
                else if (start > last.time) {
                    last.easing = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                }
                else {
                    if (start != last.time) {
                        throw new Error(`unexpected start=${start} last.time=${last.time} time=${frame}`);
                    }
                }
            }
        }
        else {
            const v = kfs;
            kfs = this.value = new Keyframes();
            if (start != undefined) {
                last = kfs.set_value(start, v);
            }
        }
        if (last) {
            if (easing != undefined) {
                last.easing = easing;
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        return kfs.set_value(frame, value);
    }
    check_value(x) {
        return x;
    }
    constructor(v) {
        this.value = v;
    }
}
class AnimatableD extends Animatable {
    get_value(frame) {
        const { value } = this;
        if (value instanceof Keyframes) {
            let p = undefined; // previous KeyframeEntry<V>
            for (const k of value) {
                if (k.time >= frame) {
                    return k.value;
                }
                p = k;
            }
            if (p) {
                return p.value;
            }
            throw new Error(`empty keyframe list`);
        }
        else {
            return value;
        }
    }
    set_value(frame, value, start, easing, add) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                }
                else if (start > last.time) {
                    last.easing = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                }
                else {
                    if (start != last.time) {
                        throw new Error(`unexpected start=${start} last.time=${last.time} time=${frame}`);
                    }
                }
            }
        }
        else {
            const v = kfs;
            kfs = this.value = new Keyframes();
            if (start != undefined) {
                last = kfs.set_value(start, v);
            }
        }
        if (last) {
            if (easing != undefined) {
                throw new Error(`easing not suppported`);
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        return kfs.set_value(frame, value);
    }
}
class NumberValue extends Animatable {
    lerp_value(r, a, b) {
        return a * (1 - r) + b * r;
    }
    add_value(a, b) {
        return a + b;
    }
    constructor(v = 0) {
        super(v);
    }
}
class NVector extends Float64Array {
    add(that) {
        return new NVector(this.map((v, i) => v + that[i]));
    }
    mul(that) {
        return new NVector(this.map((v, i) => v * that[i]));
    }
    lerp(that, t) {
        const u = 1 - t;
        const a = this.map((v, i) => v * u);
        const b = that.map((v, i) => v * t);
        return new NVector(a.map((v, i) => v + b[i]));
    }
}
class NVectorValue extends Animatable {
    lerp_value(r, a, b) {
        return a.lerp(b, r);
    }
    add_value(a, b) {
        return a.add(b);
    }
    check_value(x) {
        if (x instanceof NVector) {
            return x;
        }
        else {
            return new NVector(x);
        }
    }
    constructor(v) {
        super(NVector.from(v));
    }
}
// def Point(x, y):
//     return NVector(x, y)
// def Size(x, y):
//     return NVector(x, y)
class Point extends NVector {
    constructor(x = 0, y = 0) {
        super([x, y]);
    }
}
class Size extends NVector {
    constructor(w = 0, h = 0) {
        super([w, h]);
    }
}
class RGB extends NVector {
    constructor(r = 0, g = 0, b = 0) {
        super([r, g, b]);
    }
}
// def Point3D(x, y, z):
//     return NVector(x, y, z)
class PositionValue extends NVectorValue {
}
class RGBValue extends NVectorValue {
    // constructor(x: number = 0, y: number = 0) {
    //     super([x, y]);
    // }
    static to_css_rgb([r, g, b]) {
        return `rgb(${Math.round((r * 255) % 256)}, ${Math.round((g * 255) % 256)}, ${Math.round((b * 255) % 256)})`;
    }
}
class TextValue extends AnimatableD {
    add_value(a, b) {
        return a + '' + b;
    }
}
//# sourceMappingURL=keyframes.js.map
;// CONCATENATED MODULE: ./dist/model/properties.js

class ValueSet {
    *enum_values() {
        for (const sub of Object.values(this)) {
            if (sub instanceof Animatable) {
                // let { value } = sub;
                // if (value instanceof Keyframes) {
                //     yield value;
                // }
                yield sub;
            }
        }
    }
    update_prop(frame, node) {
        throw new Error(`Not implemented`);
    }
}
class Box extends ValueSet {
    size;
    position;
    constructor(position, size) {
        super();
        this.size = new NVectorValue(size);
        this.position = new NVectorValue(position);
    }
    update_prop(frame, node) {
        const size = this.size.get_value(frame);
        const pos = this.position.get_value(frame);
        node.x.baseVal.value = pos[0];
        node.y.baseVal.value = pos[1];
        node.width.baseVal.value = size[0];
        node.height.baseVal.value = size[1];
    }
}
class Stroke extends ValueSet {
    width;
}
class Fill extends ValueSet {
    get opacity() {
        const v = new NumberValue(1);
        Object.defineProperty(this, "opacity", { value: v, writable: true, enumerable: true });
        return v;
    }
    get color() {
        const v = new RGBValue([0, 0, 0]);
        Object.defineProperty(this, "color", { value: v, writable: true, enumerable: true });
        return v;
    }
}
class Transform extends ValueSet {
    anchor;
    position;
    scale;
    rotation;
    skew;
    skew_axis;
}
class OpacityProp extends NumberValue {
}
class RectSizeProp extends NVectorValue {
}
const UPDATE = {
    opacity: function (frame, node, prop) {
        const v = prop.get_value(frame);
        node.style.opacity = v + '';
    },
    size: function (frame, node, prop) {
        let [x, y] = prop.get_value(frame);
        node.width.baseVal.value = x;
        node.height.baseVal.value = y;
    },
    position: function (frame, node, prop) {
        let x = prop.get_value(frame);
        node.x.baseVal.value = x[0];
        node.y.baseVal.value = x[1];
    },
    transform: function (frame, node, prop) {
        const { anchor, position, scale, rotation } = prop;
        // node.transform.baseVal.
        // let x = prop.get_value(frame);
        // node.width.baseVal.value = x[0];
        // node.height.baseVal.value = x[1];
    },
    fill: function (frame, node, prop) {
        for (let [n, v] of Object.entries(prop)) {
            if (v) {
                switch (n) {
                    case "opacity":
                        node.style.fillOpacity = v.get_value(frame) + '';
                        break;
                    case "color":
                        node.style.fill = RGBValue.to_css_rgb(v.get_value(frame));
                        break;
                }
            }
        }
    },
    x: function (frame, node, prop) {
        node.x.baseVal.value = prop.get_value(frame);
    },
    y: function (frame, node, prop) {
        node.y.baseVal.value = prop.get_value(frame);
    },
    cx: function (frame, node, prop) {
        node.cx.baseVal.value = prop.get_value(frame);
    },
    cy: function (frame, node, prop) {
        node.cy.baseVal.value = prop.get_value(frame);
    },
    r: function (frame, node, prop) {
        node.r.baseVal.value = prop.get_value(frame);
    },
    width: function (frame, node, prop) {
        let q = node.width.baseVal;
        // console.log("/////", q);
        q.convertToSpecifiedUnits(1);
        q.value = prop.get_value(frame);
    },
    height: function (frame, node, prop) {
        let q = node.height.baseVal;
        q.convertToSpecifiedUnits(1);
        q.value = prop.get_value(frame);
    },
    rx: function (frame, node, prop) {
        node.rx.baseVal.value = prop.get_value(frame);
    },
    ry: function (frame, node, prop) {
        node.ry.baseVal.value = prop.get_value(frame);
    },
    view_box: function (frame, node, prop) {
        const s = prop.size.get_value(frame);
        const p = prop.position.get_value(frame);
        node.setAttribute("viewBox", `${p[0]} ${p[1]} ${s[0]} ${s[1]}`);
    },
};
//# sourceMappingURL=properties.js.map
;// CONCATENATED MODULE: ./dist/model/linked.js
class Node {
    _next;
    _prev;
    _parent;
    get _end() {
        return this;
    }
    get _start() {
        return this;
    }
    next_sibling() {
        // *P -> a b c -> *E
        const node = this._end._next;
        if (node instanceof End) {
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
        // a ^a b ^b ...
        // c  b ^b ...       
        // N b ^b ...  ^N
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
    root() {
        let root = this._parent;
        if (root) {
            for (let x; x = root._parent; root = x)
                ;
            return root;
        }
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
    _detach() {
        const { _prev: prev, _end: { _next: next } } = this;
        // [PREV]<->[THIS]<->[NEXT] => [PREV]<->[NEXT]
        prev && prev._link_next(next);
        this._prev = undefined; // or this._start._prev = undefined
        this._end._next = undefined;
        this._parent = undefined;
        return this;
    }
    _attach(prev, next, parent) {
        const { _start, _end, _parent } = this;
        // if (_parent || _start._prev || _end._next) {
        //     throw new Error(`Detach first`);
        // }
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
    replace_with(...nodes) {
        const { _parent } = this;
        if (_parent) {
            const next = this.next_sibling() ?? _parent._end;
            this.remove();
            _parent.insert_before(next, ...nodes);
        }
    }
    remove() {
        this._detach();
    }
}
class Parent extends Node {
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
        // P  c ... ^P
        // P  C ^C ... ^P 
        // P ^P  
        let { _next, _end } = this;
        if (_next !== _end) {
            if (_next instanceof End) {
                throw new Error("Unexpected end node");
            }
            else if (!_next) {
                throw new Error("next expected");
            }
            else if (_next._parent !== this) {
                throw new Error("Unexpected parent");
            }
            return _next;
        }
    }
    last_child() {
        // P  ... c  ^P
        // P  ... C ^C  ^P 
        // P ^P       
        const { _prev } = this._end;
        if (_prev != this) {
            return _prev?._start;
        }
    }
    insert_before(child, ...nodes) {
        if (child._parent !== this) {
            throw new Error('child not found');
        }
        for (const node of nodes) {
            if (node !== child) {
                node._detach()._attach(child._prev ?? this, child, this);
            }
        }
    }
    append_child(...nodes) {
        this.insert_before(this._end, ...nodes);
    }
    prepend_child(...nodes) {
        this.insert_before(this._next || this._end, ...nodes);
    }
    remove_child(node) {
        if (node instanceof End) {
            throw new Error("Unexpected End node");
        }
        else if (node._parent !== this) {
            throw new Error('child not found');
        }
        node.remove();
        return node;
    }
    contains(node) {
        let p = node;
        do
            if (p === this) {
                return true;
            }
        while (p = p._parent);
        return false;
    }
    *children() {
        for (let cur = this.first_child(); cur; cur = cur.next_sibling()) {
            yield cur;
        }
    }
    *[Symbol.iterator]() {
        for (let cur = this.first_child(); cur; cur = cur.next_sibling()) {
            yield cur;
        }
    }
}
class End extends Node {
    _parent;
    constructor(parent) {
        super();
        this._parent = this._prev = parent;
    }
    get _start() {
        return this._parent;
    }
}
//# sourceMappingURL=linked.js.map
;// CONCATENATED MODULE: ./dist/model/svgprops.js


function SVGProps(Base) {
    return class SVGProps extends Base {
        get prop5() {
            return this._getx("prop5", new NumberValue(45));
        }
        set prop5(v) {
            this._setx("prop5", v);
        }
        get fill() {
            return this._getx("fill", new Fill());
        }
        set fill(v) {
            this._setx("fill", v);
        }
        get opacity() {
            return this._getx("opacity", new NumberValue(1));
        }
        set opacity(v) {
            this._setx("opacity", v);
        }
        _getx(name, value) {
            console.log(`_GETX ${name}`);
            Object.defineProperty(this, name, {
                value,
                writable: true,
                enumerable: true,
            });
            return value;
        }
        _setx(name, value) {
            Object.defineProperty(this, name, {
                value,
                writable: true,
                enumerable: true,
            });
        }
    };
}
//# sourceMappingURL=svgprops.js.map
;// CONCATENATED MODULE: ./dist/model/node.js




class Item extends SVGProps(Node) {
    id;
    _node;
    update_self(frame, node) {
        update(frame, this, node);
    }
    update_node(frame) {
        const node = this._node;
        if (node) {
            this.update_self(frame, node);
        }
    }
    *enum_values() {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            }
            else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
    }
}
class Shape extends Item {
}
class Container extends SVGProps(Parent) {
    id;
    _node;
    as_svg(doc) {
        throw new Error(`Not implemented`);
    }
    update_self(frame, node) {
        update(frame, this, node);
        return true; // should we call update_node to children
    }
    update_node(frame) {
        const node = this._node;
        if (node) {
            if (this.update_self(frame, node)) {
                for (const sub of this.children()) {
                    sub.update_node(frame);
                }
            }
        }
    }
    *enum_values() {
        for (let v of Object.values(this)) {
            if (v instanceof Animatable) {
                yield v;
            }
            else if (v instanceof ValueSet) {
                yield* v.enum_values();
            }
        }
        for (const sub of this.children()) {
            yield* sub.enum_values();
        }
    }
    *enum_keyframes() {
        for (let { value } of this.enum_values()) {
            if (value instanceof Keyframes) {
                yield value;
            }
        }
    }
    add_rect(size = [100, 100]) {
        const x = new Rect();
        // x.size = new NVectorValue(size);
        this.append_child(x);
        let y = this.first_child();
        return x;
    }
    calc_time_range() {
        let max = 0;
        let min = 0;
        for (let kfs of this.enum_keyframes()) {
            for (const { time } of kfs) {
                if (time > max) {
                    max = time;
                }
                if (time < min) {
                    min = time;
                }
            }
        }
        return [min, max];
    }
}
function update(frame, target, el) {
    for (let [n, v] of Object.entries(target)) {
        v && UPDATE[n]?.(frame, el, v);
    }
}
class Group extends Container {
    as_svg(doc) {
        const con = this._node = doc.createElementNS(NS_SVG, "group");
        for (const sub of this.children()) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
    }
}
// Container.prototype
class ViewPort extends Container {
    as_svg(doc) {
        const con = this._node = doc.createElementNS(NS_SVG, "svg");
        for (const sub of this.children()) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
    }
    get view_box() {
        return this._getx("view_box", new Box([0, 0], [100, 100]));
    }
    set view_box(v) {
        this._setx("view_box", v);
    }
    get width() {
        return this._getx("width", new NumberValue(100));
    }
    set width(v) {
        this._setx("width", v);
    }
    get height() {
        return this._getx("height", new NumberValue(100));
    }
    set height(v) {
        this._setx("height", v);
    }
}
const NS_SVG = "http://www.w3.org/2000/svg";
class Rect extends Shape {
    size = new RectSizeProp([100, 100]);
    as_svg(doc) {
        const e = this._node = doc.createElementNS(NS_SVG, "rect");
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return e;
    }
}
// export class Ellipse extends Shape {
//     size: NVectorValue = new NVectorValue([100, 100]);
// }
// export class Image extends Node {
//     // href: string = "";
//     // size: NVectorValue = new NVectorValue([100, 100]);
// }
class Root extends ViewPort {
    defs = [];
}
//# sourceMappingURL=node.js.map
;// CONCATENATED MODULE: ./dist/model/index.js



//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./dist/track/track.js
class Track {
    frame = 0;
    frame_rate = 60;
    _hint_dur = 60; // 1s * frame_rate
    _easing;
    sec(n) {
        return this.frame_rate * n;
    }
    to_frame(sec) {
        return Math.round(this.frame_rate * sec);
    }
    feed(cur) {
        const d = feed(this, cur, this.frame, this.frame);
        this.frame += d;
        return this;
    }
    play(...args) {
        let I = this.frame;
        let B = this.frame;
        for (const [i, act] of args.entries()) {
            let D = 0;
            if (Array.isArray(act)) {
                for (const a of act) {
                    let d = feed(this, a, I, B);
                    D = Math.max(d, D);
                }
            }
            else {
                D = feed(this, act, I, B);
            }
            I += D;
        }
        this.frame = I;
    }
}
function feed(track, cur, frame, base_frame) {
    cur.ready(track);
    cur.resolve(frame, base_frame, track._hint_dur);
    const d = cur.get_active_dur();
    if (d >= 0) {
        cur.run();
    }
    else {
        throw new Error(`Unexpected`);
    }
    return d;
}
//# sourceMappingURL=track.js.map
;// CONCATENATED MODULE: ./dist/track/action.js
class Action {
    _start = -Infinity;
    _end = -Infinity;
    _dur;
    ready(parent) {
        throw new Error("Not implemented");
    }
    run() {
        throw new Error("Not implemented");
    }
    resolve(frame, base_frame, hint_dur) {
        const dur = this._dur ?? hint_dur;
        this._start = frame;
        this._end = frame + dur;
    }
    get_active_dur() {
        return this._end - this._start;
    }
}
class Actions extends Array {
    _start = -Infinity;
    _end = -Infinity;
    frame_rate = -Infinity;
    _hint_dur;
    _easing;
    ready(parent) {
        this._easing = this._easing ?? parent._easing;
        this.frame_rate = parent.frame_rate;
        if (this._hint_dur != undefined) {
            this._hint_dur = this.to_frame(this._hint_dur);
        }
    }
    run() {
        for (const act of this) {
            if (act._start < 0 || act._start > act._end) {
                throw new Error(`Unexpected _start=${act._start} _end=${act._end}`);
            }
            act.run();
        }
    }
    get_active_dur() {
        return this._end - this._start;
    }
    to_frame(sec) {
        return Math.round(this.frame_rate * sec);
    }
}
class SeqA extends Actions {
    _delay;
    _stagger;
    ready(parent) {
        super.ready(parent);
        const { _delay, _stagger } = this;
        _delay && (this._delay = parent.to_frame(_delay));
        _stagger && (this._stagger = parent.to_frame(_stagger));
        for (const act of this) {
            act.ready(this);
        }
    }
    resolve(frame, base_frame, hint_dur) {
        const { _delay, _stagger, _hint_dur = hint_dur } = this;
        let e = frame;
        if (_stagger) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, _hint_dur);
                e = act._end;
                s = Math.max(s + _stagger, base_frame); // next start time
            }
        }
        else if (_delay) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, _hint_dur);
                e = act._end;
                s = Math.max(e + _delay, base_frame); // next start time
            }
        }
        else {
            for (const act of this) {
                act.resolve(e, base_frame, _hint_dur);
                e = act._end;
            }
        }
        this._start = frame;
        this._end = e;
    }
    delay(sec) {
        this._delay = sec;
        return this;
    }
    stagger(sec) {
        this._stagger = sec;
        return this;
    }
}
function Seq(...items) {
    const x = new SeqA(...items);
    return x;
}
class ParA extends Actions {
    _tail;
    ready(parent) {
        super.ready(parent);
        for (const act of this) {
            act.ready(this);
        }
    }
    resolve(frame, base_frame, hint_dur_) {
        let { _hint_dur = hint_dur_ } = this;
        let end = frame;
        for (const act of this) {
            act.resolve(frame, base_frame, _hint_dur);
            if (_hint_dur == undefined) {
                _hint_dur = act.get_active_dur();
            }
            else {
                _hint_dur = Math.max(_hint_dur, act.get_active_dur());
            }
            end = Math.max(end, act._end);
        }
        if (this._tail) {
            for (const act of this) {
                if (act._end != end) {
                    act.resolve(end - act.get_active_dur(), base_frame, _hint_dur);
                }
                if (act._end != end) {
                    throw new Error(`Unexpected act._end=${act._end} end=${end}`);
                }
            }
        }
        this._start = frame;
        this._end = end;
    }
}
function Par(...items) {
    const x = new ParA(...items);
    return x;
}
function ParE(...items) {
    const x = new ParA(...items);
    x._tail = true;
    return x;
}
class ToA extends Action {
    _easing;
    constructor(props, value, dur) {
        super();
        this.ready = function (parent) {
            const { _easing } = this;
            this._dur = (dur == undefined) ? undefined : parent.to_frame(dur);
            if (!_easing) {
                this._easing = parent._easing;
            }
        };
        this.run = function () {
            const { _start, _end } = this;
            for (const prop of props) {
                prop.set_value(_end, value, _start);
            }
        };
    }
}
function To(props, value, dur = 1) {
    return new ToA(props, value, dur);
}
//# sourceMappingURL=action.js.map
;// CONCATENATED MODULE: ./dist/track/steps.js

class StepA extends Action {
    _steps;
    _max_dur;
    _easing;
    _bounce;
    _repeat;
    _base_frame;
    _vars;
    _kf_map;
    constructor(steps, vars, { dur, easing, bounce, repeat, max_dur, }) {
        super();
        this._steps = steps;
        this._vars = vars;
        this._base_frame = Infinity;
        this.ready = function (parent) {
            this._dur = (dur == undefined) ? undefined : parent.to_frame(dur);
            this._max_dur = (max_dur == undefined) ? undefined : parent.to_frame(max_dur);
            if (repeat) {
                this._repeat = repeat;
            }
            if (bounce) {
                this._bounce = bounce;
            }
            easing = this._easing ?? easing;
            // collect names, parse inputs
            const names = [];
            this._steps.map((e, i, a) => {
                for (const [k, v] of Object.entries(e)) {
                    switch (k) {
                        case "dur":
                        case "t":
                            e[k] = parent.to_frame(v);
                            continue;
                        case "ease":
                            v == undefined || (e[k] = easing);
                            continue;
                    }
                    names.push(k);
                }
            });
            // drop propertye not present
            for (const [k, _] of Object.entries(this._vars)) {
                if (names.indexOf(k) < 0) {
                    delete vars[k];
                }
            }
        };
    }
    resolve(frame, base_frame, hint_dur) {
        const { _steps: steps, _kf_map, _dur = hint_dur, _max_dur = hint_dur, _vars } = this;
        if (_kf_map != undefined) {
            if (this._start != frame) {
                const d = this._end - this._start;
                this._start = frame;
                this._end = frame + d;
            }
            return;
        }
        let entries = resolve_t(steps, _vars, _dur, _max_dur);
        if (this._bounce) {
            entries = resolve_bounce(entries);
        }
        if (this._repeat) {
            entries = resolve_repeat(entries, this._repeat);
        }
        let t_max = 0;
        for (const e of entries) {
            t_max = Math.max(t_max, e.t);
        }
        // (this as any)._entries = Array.from(entries);
        this._kf_map = map_keyframes(entries);
        this._start = frame;
        this._end = frame + t_max;
        this._base_frame = base_frame;
    }
    run() {
        const { _start, _vars, _kf_map } = this;
        for (const [name, entries] of Object.entries(_kf_map)) {
            for (const prop of enum_props(_vars, name)) {
                let prev_t = 0;
                for (const { t, value, ease } of entries) {
                    const frame = _start + t;
                    let v;
                    if (value == null) {
                        v = prop.get_value(_start);
                    }
                    else {
                        v = prop.check_value(value);
                    }
                    prop.set_value(frame, v, prev_t, ease);
                    prev_t = t;
                }
            }
        }
    }
}
function resolve_t(steps, vars, hint_dur, max_dur) {
    const entries = new Array();
    steps.forEach((e, i, a) => {
        let t_max = undefined;
        if (e.t == undefined) {
            const { dur } = e;
            if (dur == undefined) {
                if (i == 0) {
                    e.t = 0;
                }
                else {
                    const prev = steps[i - 1];
                    if (!(i > 0 && prev.t != undefined)) {
                        throw new Error(`Unexpected`);
                    }
                    else if (hint_dur == undefined) {
                        throw new Error(`for no "t" and no "dur" provide hint duration'`);
                    }
                    e.t = prev.t + hint_dur;
                }
            }
            else if (i > 0) {
                if (!(dur >= 0)) {
                    throw new Error(`Unexpected`);
                }
                e.t = dur + steps[i - 1].t;
            }
            else {
                if (!(i === 0 || dur >= 0)) {
                    throw new Error(`Unexpected`);
                }
                e.t = dur;
            }
        }
        if (e.t < 0) {
            if (t_max == undefined) {
                if (max_dur == undefined) {
                    throw new Error(`for negative "t" provide max duration`);
                }
                t_max = max_dur;
            }
            e.t = t_max + e.t;
        }
        const { t } = e;
        if (t_max != undefined) {
            if (t > t_max) {
                throw new Error(`"t" is > max duration`);
            }
        }
        if (t < 0) {
            throw new Error(`"t" is negative`);
        }
        else if (t > 0) {
            if (i == 0) {
                // first item is not t=0
                const first = { t: 0 };
                for (const [n, _] of Object.entries(vars)) {
                    first[n] = null;
                }
                entries.push(first);
            }
        }
        else {
            if (!(i === 0 && t == 0)) {
                throw new Error(`Unexpected`);
            }
            for (const [k, _] of Object.entries(vars)) {
                if (Object.hasOwn(e, k)) {
                    if (e[k] == null) {
                        throw new Error(`Unexpected`);
                    }
                }
                else {
                    e[k] = null;
                }
            }
        }
        entries.push(e);
    });
    return entries;
}
// def resolve_bounce(steps: list[Entry]):
//     t_max = 0
//     for e in steps:
//         t_max = max(t_max, e["t"])
//     extra = []
//     for e in steps:
//         if e["t"] < t_max:
//             t2 = t_max + (t_max - e["t"])
//             e2 = {**e, "t": t2}
//             if e.get("ease"):
//                 e2["ease"] = e["ease"].reverse()
//             extra.append(e2)
//         else:
//             assert e["t"] == t_max, f't:{e["t"]} t_max:{t_max}'
//     return steps + extra
function resolve_bounce(steps) {
    let t_max = 0;
    for (const e of steps) {
        t_max = Math.max(t_max, e.t);
    }
    let extra = [];
    for (const { t, ease, ...vars } of steps) {
        if (t < t_max) {
            const e = { ...vars, t: t_max + (t_max - t) };
            if (ease != undefined) {
                if (ease && ease !== true) {
                    e.ease = ease.reversed();
                }
                else {
                    e.ease = ease;
                }
            }
            extra.push(e);
        }
        else {
            if (t != t_max) {
                throw new Error(`e.t=${t}, t_max=${t_max}`);
            }
        }
    }
    return steps.concat(extra);
}
// def resolve_repeat(steps, repeat: int):
//     t_max = 0
//     for e in steps:
//         t_max = max(t_max, e["t"])
//     n = repeat
//     t_dur = t_max + 1
//     t = t_dur
//     extra = []
//     while n > 0:
//         n -= 1
//         for i, e in enumerate(steps):
//             e2 = {**e, "t": e["t"] + t}
//             if i == 0:
//                 e2["ease"] = True
//                 pass
//             # else:
//             #     e2["t"] = e["t"] - steps[i - 1]["t"]
//             extra.append(e2)
//         t += t_dur
//     return steps + extra
function resolve_repeat(steps, repeat) {
    let t_max = 0;
    for (const { t } of steps) {
        t_max = Math.max(t_max, t);
    }
    let extra = [];
    let n = repeat;
    const t_dur = t_max + 1;
    let u = t_dur;
    while (n-- > 0) {
        steps.forEach(({ t, ...etc }, i, a) => {
            const e = { ...etc, t: t + u };
            if (i == 0) {
                e.ease = true;
            }
            extra.push(e);
        });
        u += t_dur;
    }
    return steps.concat(extra);
}
function map_keyframes(steps) {
    const entry_map = {};
    for (const e of steps) {
        for (const [k, _] of Object.entries(e)) {
            switch (k) {
                case "dur":
                case "t":
                case "ease":
                    continue;
            }
            if (!k) {
                throw new Error(`Unexpected key ${k} in steps ${steps}`);
            }
            let a = entry_map[k];
            if (!a) {
                a = entry_map[k] = [];
            }
            a.push(e);
        }
    }
    const kf_map = {};
    for (const [name, entries] of Object.entries(entry_map)) {
        const x = entries
            .map((v, i, a) => {
            return { t: v.t, value: v[name], ease: v.ease };
        })
            .sort((a, b) => a.t - b.t);
        if (x[0].t != 0) {
            throw new Error(`No t=0 ${x[0]}`);
        }
        kf_map[name] = x;
    }
    return kf_map;
}
function* enum_props(vars, name) {
    const x = vars[name];
    if (x) {
        if (Array.isArray(x)) {
            yield* x;
        }
        else {
            yield x;
        }
    }
}
function Step(steps, vars, params = {}) {
    return new StepA(steps, vars, params);
}
//# sourceMappingURL=steps.js.map
;// CONCATENATED MODULE: ./dist/track/index.js



//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./dist/index.js


//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./dist/web.js

function animate(root, fps) {
    const [start, end] = root.calc_time_range();
    if (end >= start) {
        const mspf = 1000 / fps; // miliseconds per frame
        const frames = end - start + 1;
        let frame = start;
        function render(currentTime) {
            const t = performance.now();
            {
                // console.info(`${frame} t=${t} frames=${frames} ${start}-${end}`);
                root.update_node(frame);
            }
            frame = (frame + 1) % frames;
            const excess = mspf - (performance.now() - t);
            if (excess > 0) {
                setTimeout(() => requestAnimationFrame(render), excess);
            }
            else {
                requestAnimationFrame(render);
            }
        }
        requestAnimationFrame(render);
    }
    else {
        root.update_node(0);
    }
}
// globalThis.requestAnimationFrame()
globalThis.svgmotion = {
    root: function () {
        return new Root();
    }, animate, ...dist_namespaceObject,
};
globalThis.animate = animate;
//# sourceMappingURL=web.js.map
/******/ })()
;