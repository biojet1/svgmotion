import { Image } from "../model/elements.js";

declare module "../model/elements" {
    interface Image {
        image_blob(src: string): any;
    }
}


Image.prototype.image_blob = async function (src: string) {
    const fs = await import("fs");
    const data = await fs.promises.readFile(src, { flag: "r" });
    const pis = await import("probe-image-size");
    const opt = await pis.default((await import('stream')).Readable.from(data));
    // const src = `/mnt/C1/media/Tabby_cat_with_blue_eyes-3336579.jpg`;
    // const strm = (await import('fs')).createReadStream(src);
    // await im.image_blob(strm)


    // const pis = await import("probe-image-size");
    // const opt = await pis.default(src);
    // const fs = await import("fs");
    // const data = await fs.promises.readFile(src, { flag: "r" });

    const uri = `data:image/${opt.type};base64,${data.toString('base64')}`;
    this.href.set_value(uri);
    this.width.set_value(opt.width);
    this.height.set_value(opt.height);
}