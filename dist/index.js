import { Root, ViewPort, Rect, Size } from "./model/index.js";
export { Root, ViewPort, Rect };
export function animate(root, fps) {
    const [start, end] = root.calc_time_range();
    if (end >= start) {
        const spf = 1000 / fps;
        let frame = start;
        const frames = end - start + 1;
        function render(currentTime) {
            const t = performance.now();
            {
                // console.info(`${frame} t=${t} frames=${frames} ${start}-${end}`);
                root.update_node(frame);
            }
            frame = (frame + 1) % frames;
            const delta = performance.now() - t;
            if (delta >= spf) {
                requestAnimationFrame(render);
            }
            else {
                setTimeout(function () { requestAnimationFrame(render); }, spf - delta);
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
    }, Size, animate
};
globalThis.animate = animate;
//# sourceMappingURL=index.js.map