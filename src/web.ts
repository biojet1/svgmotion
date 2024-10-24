
export * from "./model/index.js";
export * from "./model/mixins/add_elements.js";
export * from "./model/mixins/load.js";
import { Stepper } from "./keyframe/stepper.js";
import { Root } from "./model/root.js";
import { updater_dom } from "./model/mixins/dom_stepper.js";

class Player extends Stepper {
    stop: boolean;
    private _mspf: number;
    // _step: number;
    private _frame: number;
    private _frames: number;
    constructor(st: Stepper, fps: number, start: number = NaN, end: number = NaN) {
        const s = Number.isNaN(start) ? st.start : start;
        const e = Number.isNaN(end) ? st.end : end;
        super(st.step, s, e);
        this.stop = false;
        this._frame = s;
        this._frames = e - s + 1;
        this._mspf = 1000 / fps; // miliseconds per frame
    }
    toggle() {
        this.stop = !this.stop;
    }
    pace(n: number = 1) {
        const f = this._frame;
        if (n && this.stop) {
            this.step(this._frame = (n > 0 ? (f + 1) % this._frames : Math.max(f - 1, this.start)));
        }
        this.stop = true;
    }
    run() {
        const { start: s, end: e, _mspf: mspf } = this;
        if (s < e) {
            const self = this;
            function render(_currentTime: DOMHighResTimeStamp) {
                const t = performance.now();
                if (!self.stop) {
                    if ((self._frame + 1) == self._frames) {
                        console.info(`${self._frame} t=${t} frames=${frames} ${s}-${e}`);
                    }
                    self.step(self._frame = (self._frame + 1) % self._frames);
                }
                const excess = mspf - (performance.now() - t);
                if (excess > 0) {
                    setTimeout(() => requestAnimationFrame(render), excess);
                }
                else {
                    requestAnimationFrame(render);
                }
            }
            requestAnimationFrame(render);
        } else {
            this.step(s);
        }
    }
}

export function animate(st: Stepper, fps: number, start: number = NaN, end: number = NaN) {
    const s = Number.isNaN(start) ? st.start : start;
    const e = Number.isNaN(end) ? st.end : end;
    if (s < e) {
        const mspf = 1000 / fps; // miliseconds per frame
        const frames = e - s + 1;
        let frame = s;
        function render(_currentTime: DOMHighResTimeStamp) {
            const t = performance.now();
            {
                if ((frame + 1) == frames) {
                    console.info(`${frame} t=${t} frames=${frames} ${s}-${e}`);
                }
                st.step(frame);
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
    } else {
        st.step(s);
    }
}

declare module "./model/root" {
    interface Root {
        animate(params: {
            fps: number,
            parent: string | Element | null

        }): void;
        dom_stepper(): { svg: SVGElement, stepper: Stepper };
    }
}

Root.prototype.dom_stepper = function (): { svg: SVGElement, stepper: Stepper } {
    let { svg, updates } = updater_dom(this, document);
    const [min, max] = this.calc_time_range();
    let stepper = Stepper.create(function up(n: number) {
        for (let u of updates) {
            u(n);
        }
    }, min, max);
    return { svg, stepper }
}

Root.prototype.animate = function ({ parent }) {
    if (typeof parent === 'string') {
        parent = document.getElementById(parent);
    }
    if (parent) {
        let { svg, stepper } = this.dom_stepper();
        parent.appendChild(svg);
        const p = new Player(stepper, this.frame_rate);
        svg.tabIndex = -1;
        svg.addEventListener("keydown", (event) => {
            if (event.key == " ") {
                p.toggle();
            } else if (event.key == ".") {
                p.pace(1);
            } else if (event.key == ",") {
                p.pace(-1);
            }
        });
        svg.focus();
        return p.run();
    }
};
