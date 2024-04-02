import { Root, ViewPort, Rect, Size, NumberValue } from "./model/index.js";
import * as all from "./model/index.js";
import * as track from "./track/index.js";
export { Root, ViewPort, Rect };

export function animate(root: Root, fps: number) {
  const [start, end] = root.calc_time_range();
  if (end >= start) {

    const mspf = 1000 / fps; // miliseconds per frame
    const frames = end - start + 1;
    let frame = start;

    function render(currentTime: DOMHighResTimeStamp) {
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
  } else {
    root.update_node(0);
  }
}

// globalThis.requestAnimationFrame()

(globalThis as unknown as any).svgmotion = {
  root: function () {
    return new Root();
  }, animate, ...all, ...track

};

(globalThis as unknown as any).animate = animate;
