import { Resource, Sluggable } from '../utils/resource.js';
// export const cache = new Resource();

type MarkEntry = [tag: string, start: number, end: number];
export interface AudioEntryTTS {
    marks?: Array<MarkEntry>;
    words?: Array<MarkEntry>;
    transcript?: string;
}

export abstract class Voice extends Sluggable {
    async say(text: string): Promise<{ path: string; }> {
        throw new Error(`Not implemented`);
    }
    override save(path: string, text: string) {
        throw new Error(`Not implemented`);
    }
}