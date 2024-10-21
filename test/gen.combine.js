import { readdir } from 'fs/promises';
import { join, basename } from 'path';

const DIR = '/tmp';
const anims = [];
try {
    const files = await readdir(DIR);
    // Listing all files
    let i = 0;
    files.forEach((file) => {
        if (file.endsWith(".json") && file.startsWith("ts-")) {
            console.log(file);
            anims.push({ path: join(DIR, file), index: i++ })
        }
    });
} catch (err) {
    console.error('Unable to scan directory: ', err);
}

const fs = await import('fs/promises');
const h = await fs.open(`${DIR}/ts-all.html`, 'w');
await h.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">`);
await h.write(`<style>`);
await h.write(`*{box-sizing:border-box;margin:0;padding:0}`);
await h.write(`body{background:0 0;overflow:hidden}`);
await h.write(`body>*>svg{border: red;border-width: 2px;border-style: dashed;}`);
await h.write(`</style>`);
await h.write(`<script>${await fs.readFile("./dist/svgmotion.web.js")}</script>`);
await h.write(`</head><body>`);
for (const x of anims) {
    await h.write(`<span id="A${x.index}">QW</span>`);
}
await h.write(`</body>`);
for (const x of anims) {
    await h.write(`<script>`);
    await h.write(`svgmotion.Root.load(`);
    await h.write(((await fs.readFile(x.path)).toString()));
    await h.write(`).then(root=>{`);
    await h.write(`let { svg, stepper } = root.dom_stepper();`);
    await h.write(`svg.setAttribute("width", "200");`);
    await h.write(`svg.setAttribute("height", "200");`);
    await h.write(`document.all.A${x.index}.appendChild(svg);`);
    await h.write(`svgmotion.animate(stepper, root.frame_rate)`);
    await h.write(`});`);
    await h.write(`</script>`);
}
await h.write(`</html>`);
await h.close();