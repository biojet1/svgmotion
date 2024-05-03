import * as all from "./index.js";

export function animate(root: all.Doc, fps: number) {
    const [start, end] = root.calc_time_range();
    if (end >= start) {

        const mspf = 1000 / fps; // miliseconds per frame
        const frames = end - start + 1;
        let frame = start;

        function render(currentTime: DOMHighResTimeStamp) {
            const t = performance.now();
            {
                // console.info(`${frame} t=${t} frames=${frames} ${start}-${end}`);
                root.update_dom(frame);
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
        root.update_dom(0);
    }
}

declare module "./model/node" {
    interface Doc {
        animate(params: {
            fps: number,
            parent: string | Element | null

        }): void;
    }
}

all.Doc.prototype.animate = function ({ fps = 60, parent }) {
    if (typeof parent === 'string') {
        parent = document.getElementById(parent);
    }
    if (parent) {
        let svg = this.to_dom(document);
        parent.appendChild(svg);
    }
    animate(this, fps);
};

(globalThis as unknown as any).svgmotion = all;

