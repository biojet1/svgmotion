
import "./model/index.js";
import { Stepper } from "./keyframe/stepper.js";
import { Root } from "./model/root.js";
import { updater_dom } from "./model/mixins/dom_stepper.js";
import "./model/mixins/add_elements.js";
import "./model/mixins/load.js";
export { Root }
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
        const { stop } = this;
        this.stop = !this.stop;
        if (stop) {
            this.render();
        }
    }
    pace(n: number = 1) {
        const f = this._frame;
        if (n && this.stop) {
            this.step(this._frame = (n > 0 ? (f + 1) % this._frames : Math.max(f - 1, this.start)));
        }
        this.stop = true;
    }
    render(_currentTime: DOMHighResTimeStamp = NaN) {
        if (this.stop) {
            return;
        }
        const t = performance.now();
        if ((this._frame + 1) == this._frames) {
            console.info(`${this._frame} t=${t} frames=${frames} ${this.start}-${this.end}`);
        }
        this.step(this._frame = (this._frame + 1) % this._frames);
        const excess = this._mspf - (performance.now() - t);
        if (excess > 0) {
            setTimeout(() => requestAnimationFrame(this.render.bind(this)), excess);
        } else {
            requestAnimationFrame(this.render.bind(this));
        }
    }
    run() {
        const { start: s, end: e } = this;
        if (s < e) {
            this.render();
        } else {
            this.step(s);
        }
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
