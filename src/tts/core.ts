import { Sluggable } from '../utils/resource.js';

type MarkEntry = [tag: string, start: number, end: number];
export interface AudioEntryTTS {
    marks?: Array<MarkEntry>;
    words?: Array<MarkEntry>;
    transcript?: string;
}

export abstract class Voice extends Sluggable {
    async say(_text: string): Promise<{ path: string; }> {
        throw new Error(`Not implemented`);
    }
    override save(_path: string, _text: string) {
        throw new Error(`Not implemented`);
    }
}