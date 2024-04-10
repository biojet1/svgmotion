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

// UNUSED EXPORTS: Action, Actions, Par, ParA, ParE, Rect, Root, Seq, SeqA, Step, StepA, To, ToA, Track, ViewPort, animate

// NAMESPACE OBJECT: ./dist/model/index.js
var model_namespaceObject = {};
__webpack_require__.r(model_namespaceObject);
__webpack_require__.d(model_namespaceObject, {
  Animatable: () => (Animatable),
  Box: () => (Box),
  Container: () => (Container),
  Fill: () => (Fill),
  Group: () => (Group),
  KeyframeEntry: () => (KeyframeEntry),
  Keyframes: () => (Keyframes),
  NVector: () => (NVector),
  NVectorValue: () => (NVectorValue),
  Node: () => (Node),
  NumberValue: () => (NumberValue),
  OpacityProp: () => (OpacityProp),
  Point: () => (Point),
  PositionValue: () => (PositionValue),
  RGB: () => (RGB),
  RGBValue: () => (RGBValue),
  Rect: () => (Rect),
  RectSizeProp: () => (RectSizeProp),
  Root: () => (Root),
  Shape: () => (Shape),
  Size: () => (Size),
  Stroke: () => (Stroke),
  Transform: () => (Transform),
  UPDATE: () => (UPDATE),
  ValueSet: () => (ValueSet),
  ViewPort: () => (ViewPort)
});

// NAMESPACE OBJECT: ./dist/track/index.js
var dist_track_namespaceObject = {};
__webpack_require__.r(dist_track_namespaceObject);
__webpack_require__.d(dist_track_namespaceObject, {
  Action: () => (Action),
  Actions: () => (Actions),
  Par: () => (Par),
  ParA: () => (ParA),
  ParE: () => (ParE),
  Seq: () => (Seq),
  SeqA: () => (SeqA),
  Step: () => (Step),
  StepA: () => (StepA),
  To: () => (To),
  ToA: () => (ToA),
  Track: () => (Track)
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
    parse_value(x) {
        return x;
    }
    constructor(v) {
        this.value = v;
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
    parse_value(x) {
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
        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
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
        const o = { value: v, writable: true, enumerable: true };
        Object.defineProperty(this, "opacity", o);
        return v;
    }
    get color() {
        const v = new RGBValue([0, 0, 0]);
        const o = { value: v, writable: true, enumerable: true };
        Object.defineProperty(this, "color", o);
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
    }
};
//# sourceMappingURL=properties.js.map
;// CONCATENATED MODULE: ./dist/model/node.js


class Node {
    id;
    // transform?: Transform;
    // opacity?: OpacityProp;
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
    get opacity() {
        const v = new NumberValue(1);
        const o = { value: v, writable: true, enumerable: true };
        console.log("opacity prop_x", o);
        Object.defineProperty(this, "opacity", o);
        return v;
    }
    get fill() {
        const v = new Fill();
        const o = { value: v, writable: true, enumerable: true };
        Object.defineProperty(this, "fill", o);
        return v;
    }
}
class Shape extends Node {
    // strok fill
    get prop_x() {
        const p = { value: { value: 4 } };
        console.log("prop_x", p);
        Object.defineProperty(this, "prop_x", p);
        return p;
    }
}
class Container extends Array {
    id;
    // transform?: Transform;
    opacity;
    // // fill?: Fill;
    // stroke?: Stroke;
    _node;
    update_self(frame, node) {
        update(frame, this, node);
        return true; // should we call update_node to children
    }
    update_node(frame) {
        const node = this._node;
        if (node) {
            if (this.update_self(frame, node)) {
                for (const sub of this) {
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
        for (const sub of this) {
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
        this.push(x);
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
        for (const sub of this) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
    }
}
class ViewPort extends Container {
    view_port = new Box([0, 0], [100, 100]);
    as_svg(doc) {
        const con = this._node = doc.createElementNS(NS_SVG, "svg");
        // e.preserveAspectRatio
        // this.view_port.size
        // e.width.baseVal.value = this.size
        // e.addEventListener
        for (const sub of this) {
            con.appendChild(sub.as_svg(doc));
        }
        return con;
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
//     href: string = "";
//     size: NVectorValue = new NVectorValue([100, 100]);
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
        this._entries = Array.from(entries);
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
                        v = prop.parse_value(value);
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




// export * from "./track/steps.js";

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
    }, animate, ...model_namespaceObject, ...dist_track_namespaceObject,
};
globalThis.animate = animate;
//# sourceMappingURL=index.js.map
/******/ })()
;