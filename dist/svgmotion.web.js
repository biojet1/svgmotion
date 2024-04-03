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
var track_namespaceObject = {};
__webpack_require__.r(track_namespaceObject);
__webpack_require__.d(track_namespaceObject, {
  Action: () => (Action),
  Actions: () => (Actions),
  Seq: () => (Seq),
  SeqA: () => (SeqA),
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
                        throw new Error(`unexpected`);
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
;// CONCATENATED MODULE: ./dist/track/index.js
// import { Animatable } from "../model/index.js"
class Action {
    _start = -Infinity;
    _end = -Infinity;
    _dur = -Infinity;
    ready(track) {
        throw new Error("Not implemented");
    }
    run() {
        throw new Error("Not implemented");
    }
    resolve(frame, base_frame) {
        const dur = this._dur;
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
    _dur = -Infinity;
    _easing;
    ready(track) {
        const { _delay, _stagger, _dur } = this;
        _delay && (this._delay = track.to_frame(_delay));
        _stagger && (this._stagger = track.to_frame(_stagger));
        _dur && (this._dur = track.to_frame(_dur));
        for (const act of this) {
            act.ready(track);
        }
    }
    resolve(frame, base_frame) {
        const { _delay, _stagger } = this;
        let e = frame;
        if (_stagger) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame);
                e = act._end;
                s = Math.max(s + _stagger, base_frame); // next start time
            }
        }
        else if (_delay) {
            let s = frame; // starting time
            for (const act of this) {
                act.resolve(s, base_frame);
                e = act._end;
                s = Math.max(e + _delay, base_frame); // next start time
            }
        }
        else {
            for (const act of this) {
                act.resolve(e, base_frame);
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
// self._dur = track.to_frame(dur)
// self._stagger = track.to_frame(stagger)
// self._delay = track.to_frame(delay)
// self._easing = parse_easing(easing)
class ToA extends Action {
    constructor(props, value, dur = 1) {
        super();
        this.ready = function (track) {
            this._dur = track.to_frame(dur);
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
class Track {
    frame = 0;
    frame_rate = 60;
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
    cur.resolve(frame, base_frame);
    const d = cur.get_active_dur();
    if (d >= 0) {
        cur.run();
    }
    else {
        throw new Error(`Unexpected`);
    }
    return d;
}
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
    }, animate, ...model_namespaceObject, ...track_namespaceObject
};
globalThis.animate = animate;
//# sourceMappingURL=index.js.map
/******/ })()
;