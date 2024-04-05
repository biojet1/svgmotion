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

// UNUSED EXPORTS: Rect, Root, ViewPort, animate

// NAMESPACE OBJECT: ./dist/model/index.js
var model_namespaceObject = {};
__webpack_require__.r(model_namespaceObject);
__webpack_require__.d(model_namespaceObject, {
  Animatable: () => (Animatable),
  Box: () => (Box),
  Container: () => (Container),
  Fill: () => (Fill),
  Group: () => (Group),
  Handle: () => (Handle),
  KeyframeEntry: () => (KeyframeEntry),
  Keyframes: () => (Keyframes),
  NVector: () => (NVector),
  NVectorValue: () => (NVectorValue),
  Node: () => (Node),
  NumberValue: () => (NumberValue),
  Point: () => (Point),
  PositionValue: () => (PositionValue),
  RGB: () => (RGB),
  RGBValue: () => (RGBValue),
  Rect: () => (Rect),
  Root: () => (Root),
  Shape: () => (Shape),
  Size: () => (Size),
  Stroke: () => (Stroke),
  Transform: () => (Transform),
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

;// CONCATENATED MODULE: ./dist/model/bezier.js
function cubic_bezier_y_of_x(p1, p2, p3, p4) {
    // Return the bezier parameter size"""
    // ((bx0, by0), (bx1, by1), (bx2, by2), (bx3, by3)) = bez
    // # parametric bezier
    const { abs } = Math;
    const [x0, y0] = p1;
    const [bx1, by1] = p2;
    const [bx2, by2] = p3;
    const [bx3, by3] = p4;
    const cx = 3 * (bx1 - x0);
    const bx = 3 * (bx2 - bx1) - cx;
    const ax = bx3 - x0 - cx - bx;
    const cy = 3 * (by1 - y0);
    const by = 3 * (by2 - by1) - cy;
    const ay = by3 - y0 - cy - by;
    function sampleCurveX(t) {
        return ((ax * t + bx) * t + cx) * t;
    }
    function sampleCurveY(t) {
        return ((ay * t + by) * t + cy) * t;
    }
    function sampleCurveDerivativeX(t) {
        return (3.0 * ax * t + 2.0 * bx) * t + cx;
    }
    function solveCurveX(x) {
        let t0;
        let t1;
        let t2;
        let x2;
        let d2;
        let i;
        const epsilon = 1e-5; // Precision
        // First try a few iterations of Newton's method -- normally very fast.
        for (t2 = x, i = 0; i < 32; i += 1) {
            x2 = sampleCurveX(t2) - x;
            if (abs(x2) < epsilon)
                return t2;
            d2 = sampleCurveDerivativeX(t2);
            if (abs(d2) < epsilon)
                break;
            t2 -= x2 / d2;
        }
        // No solution found - use bi-section
        t0 = 0.0;
        t1 = 1.0;
        t2 = x;
        if (t2 < t0)
            return t0;
        if (t2 > t1)
            return t1;
        while (t0 < t1) {
            x2 = sampleCurveX(t2);
            if (abs(x2 - x) < epsilon)
                return t2;
            if (x > x2)
                t0 = t2;
            else
                t1 = t2;
            t2 = (t1 - t0) * 0.5 + t0;
        }
        // Give up
        return t2;
    }
    return function cubicBezierYOfX(t) {
        return sampleCurveY(solveCurveX(t));
    };
}
//# sourceMappingURL=bezier.js.map
;// CONCATENATED MODULE: ./dist/model/keyframes.js

class Handle {
    x = 0;
    y = 0;
}
class KeyframeEntry {
    time = 0;
    in_value = new Handle();
    out_value = new Handle();
    hold = false;
    value;
    calc_ratio(r) {
        const { out_value: ov, in_value: iv } = this;
        return cubic_bezier_y_of_x([0, 0], [ov.x, ov.y], [iv.x, iv.y], [1, 1])(r);
    }
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
    get_value(time) {
        const { value } = this;
        if (value instanceof Keyframes) {
            let p = undefined; // previous KeyframeEntry<V>
            for (const k of value) {
                if (time <= k.time) {
                    if (p) {
                        if (k.hold) {
                            return p.value;
                        }
                        const r = (time - p.time) / (k.time - p.time);
                        if (r == 0) {
                            return p.value;
                        }
                        else if (r == 1) {
                            return k.value;
                        }
                        return this.lerp_value(p.calc_ratio(r), p.value, k.value);
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
    set_value(time, value, start, easing, add) {
        let { value: kfs } = this;
        let last;
        if (kfs instanceof Keyframes) {
            last = kfs[kfs.length - 1];
            if (last) {
                if (start == undefined) {
                    // pass
                }
                else if (start > last.time) {
                    last.hold = true;
                    last = kfs.set_value(start, this.get_value(last.time));
                }
                else {
                    if (start != last.time) {
                        throw new Error(`unexpected start=${start} last.time=${last.time} time=${time}`);
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
            if (easing) {
                easing(last);
            }
            if (add) {
                value = this.add_value(last.value, value);
            }
        }
        return kfs.set_value(time, value);
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
    constructor(v) {
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
        const u = (1 - t);
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
    constructor(v) {
        super(new NVector(v));
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
}
class Box extends ValueSet {
    size;
    position;
    constructor(position, size) {
        super();
        this.size = new NVectorValue(size);
        this.position = new NVectorValue(position);
    }
}
class Stroke extends ValueSet {
    width;
}
class Fill extends ValueSet {
    color;
    opacity;
}
class Transform extends ValueSet {
    anchor;
    position;
    scale;
    rotation;
    skew;
    skew_axis;
}
//# sourceMappingURL=properties.js.map
;// CONCATENATED MODULE: ./dist/model/node.js


function update(frame, target, el) {
    const { opacity } = target;
    if (opacity) {
        const v = opacity.get_value(frame);
        el.style.opacity = v + '';
        // el.style.stroke
    }
}
class Node {
    id;
    transform;
    opacity;
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
class Shape extends Node {
}
class Container extends Array {
    id;
    transform;
    opacity;
    // fill?: Fill;
    stroke;
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
    size = new NVectorValue([100, 100]);
    as_svg(doc) {
        const e = this._node = doc.createElementNS(NS_SVG, "rect");
        // e.width.baseVal.value = this.size
        // e.addEventListener
        return e;
    }
    update_self(frame, node) {
        let x = this.size.get_value(frame);
        let e = node;
        e.width.baseVal.value = x[0];
        e.height.baseVal.value = x[1];
        // console.log(`Rect:update_self ${frame} ${x}`);
        super.update_self(frame, node);
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
    #easing;
    hint_dur = 60; // 1s * frame_rate
    sec(n) {
        return this.frame_rate * n;
    }
    to_frame(sec) {
        return Math.round(this.frame_rate * sec);
    }
    to_easing(x) {
        // if (typeof x === 'string' || x instanceof String) {
        // } else {
        //     return x;
        // }
        return x ?? this.#easing;
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
    cur.resolve(frame, base_frame, track.hint_dur);
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
    ready(track) {
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
    ready(track) {
        throw new Error("Not implemented");
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
}
class SeqA extends Actions {
    _delay;
    _stagger;
    _hint_dur = -Infinity;
    _easing;
    ready(track) {
        const { _delay, _stagger, _hint_dur } = this;
        _delay && (this._delay = track.to_frame(_delay));
        _stagger && (this._stagger = track.to_frame(_stagger));
        _hint_dur && (this._hint_dur = track.to_frame(_hint_dur));
        for (const act of this) {
            act.ready(track);
        }
    }
    resolve(frame, base_frame, hint_dur) {
        const { _delay, _stagger, _hint_dur } = this;
        if (_hint_dur != undefined) {
            hint_dur = _hint_dur;
        }
        let e = frame;
        if (_stagger) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, hint_dur);
                e = act._end;
                s = Math.max(s + _stagger, base_frame); // next start time
            }
        }
        else if (_delay) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame, hint_dur);
                e = act._end;
                s = Math.max(e + _delay, base_frame); // next start time
            }
        }
        else {
            for (const act of this) {
                act.resolve(e, base_frame, hint_dur);
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
    _hint_dur;
    _easing;
    _tail;
    ready(track) {
        const { _hint_dur } = this;
        _hint_dur && (this._hint_dur = track.to_frame(_hint_dur));
        for (const act of this) {
            act.ready(track);
        }
    }
    resolve(frame, base_frame, hint_dur) {
        let end = frame;
        const { _hint_dur } = this;
        if (_hint_dur != undefined) {
            hint_dur = _hint_dur;
        }
        for (const act of this) {
            act.resolve(frame, base_frame, hint_dur);
            if (hint_dur == undefined) {
                hint_dur = act.get_active_dur();
            }
            else {
                hint_dur = Math.max(hint_dur, act.get_active_dur());
            }
            end = Math.max(end, act._end);
        }
        if (this._tail) {
            for (const act of this) {
                if (act._end != end) {
                    act.resolve(end - act.get_active_dur(), base_frame, hint_dur);
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
    constructor(props, value, dur) {
        super();
        this.ready = function (track) {
            if (dur) {
                this._dur = track.to_frame(dur);
            }
        };
        this.run = function () {
            const { _start, _end } = this;
            for (const prop of props) {
                // const
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
        this.ready = function (track) {
            if (dur) {
                this._dur = track.to_frame(dur);
            }
            if (max_dur) {
                this._max_dur = track.to_frame(max_dur);
            }
            if (repeat) {
                this._repeat = repeat;
            }
            if (bounce) {
                this._bounce = bounce;
            }
            if (easing) {
                // this._max_dur = track.to_frame(max_dur);
            }
            // collect names, parse inputs
            const names = [];
            this._steps.map((e, i, a) => {
                for (const [k, v] of Object.entries(e)) {
                    switch (k) {
                        case "dur":
                        case "t":
                            e[k] = track.to_frame(v);
                            continue;
                        case "ease":
                            e[k] = track.to_easing(v);
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
        let { _steps: steps, _kf_map, _dur, _max_dur, _vars } = this;
        if (_kf_map != undefined) {
            if (this._start != frame) {
                const d = this._end - this._start;
                this._start = frame;
                this._end = frame + d;
            }
            return;
        }
        if (_dur != undefined) {
            hint_dur = _dur;
        }
        if (_max_dur == undefined) {
            _max_dur = hint_dur;
        }
        const entries = resolve_t(steps, _vars, hint_dur, _max_dur);
        if (this._bounce) {
            // TODO
        }
        if (this._repeat) {
            // TODO
        }
        let t_max = 0;
        for (const e of entries) {
            t_max = Math.max(t_max, e.t);
        }
        this._kf_map = map_keyframes(entries);
        this._start = frame;
        this._end = frame + t_max;
        this._base_frame = base_frame;
    }
    run() {
        const start = this._start;
        const B = this._base_frame;
        for (const { prop, entries } of separate_keyframes(this._vars, this._kf_map)) {
            let prev_t = 0;
            for (let { t, value, ease } of entries) {
                const frame = start + t;
                if (value == undefined) {
                    value = prop.get_value(start);
                }
                else {
                    // TODO
                }
                prop.set_value(frame, value, prev_t, ease);
                prev_t = t;
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
function* separate_keyframes(vars, kf_map) {
    for (const [name, entries] of Object.entries(kf_map)) {
        for (const prop of enum_props(vars, name)) {
            for (const a of entries) {
                a.value = prop.parse_value(a.value);
            }
            // a._name = name;
            yield { prop, entries };
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
    }, animate, ...model_namespaceObject, ...dist_track_namespaceObject
};
globalThis.animate = animate;
//# sourceMappingURL=index.js.map
/******/ })()
;