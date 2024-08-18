import { Root } from "./model/node.js";

export * from "./model/index.js";
export * from "./helper/update_dom.js";
export * from "./helper/load.js";

export function animate(anim: Root, fps: number) {
    const [start, end] = anim.calc_time_range();
    if (start < end) {

        const mspf = 1000 / fps; // miliseconds per frame
        const frames = end - start + 1;
        let frame = start;

        function render(currentTime: DOMHighResTimeStamp) {
            const t = performance.now();
            {
                if ((frame + 1) == frames) {
                    console.info(`${frame} t=${t} frames=${frames} ${start}-${end}`);
                }
                anim.update_dom(frame);
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
        anim.update_dom(0);
    }
}

export function animate2(root: Root, fps: number) {
    const st = root.stepper();
    if (st.start < st.end) {

        const mspf = 1000 / fps; // miliseconds per frame
        const frames = st.end - st.start + 1;
        let frame = st.start;

        function render(currentTime: DOMHighResTimeStamp) {
            const t = performance.now();
            {
                if ((frame + 1) == frames) {
                    console.info(`${frame} t=${t} frames=${frames} ${st.start}-${st.end}`);
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
        st.step(st.start);
    }
}

declare module "./model/node" {
    interface Root {
        animate(params: {
            fps: number,
            parent: string | Element | null

        }): void;
    }
}

Root.prototype.animate = function ({ fps = 60, parent }) {
    if (typeof parent === 'string') {
        parent = document.getElementById(parent);
    }
    if (parent) {
        let svg = this.to_dom(document);
        parent.appendChild(svg);
    }
    animate(this, fps);
};



