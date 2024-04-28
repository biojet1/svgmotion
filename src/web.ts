import * as all from "./index.js";

export function animate(root: all.Root, fps: number) {
    const [start, end] = root.calc_time_range();
    if (end >= start) {

        const mspf = 1000 / fps; // miliseconds per frame
        const frames = end - start + 1;
        let frame = start;

        function render(currentTime: DOMHighResTimeStamp) {
            const t = performance.now();
            {
                // console.info(`${frame} t=${t} frames=${frames} ${start}-${end}`);
                // root.update_node(frame);
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
        // root.update_node(0);
        root.update_dom(0);
    }
}

// globalThis.requestAnimationFrame()

(globalThis as unknown as any).svgmotion = {
    root: function () {
        return new all.Root();
    }, animate, ...all,

};

(globalThis as unknown as any).animate = animate;