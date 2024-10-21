
export * from "./model/index.js";
export * from "./model/mixins/add_elements.js";
export * from "./model/mixins/load.js";
import { Stepper } from "./keyframe/stepper.js";
import { Root } from "./model/root.js";
import { updater_dom } from "./model/mixins/dom_stepper.js";

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
        animate(stepper, this.frame_rate);
    }
};
