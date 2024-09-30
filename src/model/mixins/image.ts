import { Image } from "../elements.js";

declare module "../elements" {
    interface Image {
        image_blob(src: string): any;
    }
}

Image.prototype.image_blob = async function (src: string) {
    const fs = await import("fs");
    const data = await fs.promises.readFile(src, { flag: "r" });
    const pis = await import("probe-image-size");
    const opt = await pis.default((await import('stream')).Readable.from(data));
    const uri = `data:image/${opt.type};base64,${data.toString('base64')}`;
    this.href.set_value(uri);
    this.width.set_value(opt.width);
    this.height.set_value(opt.height);
}