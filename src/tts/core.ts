import { Resource } from '../utils/resource.js';
export const cache = new Resource();

type MarkEntry = [tag: string, start: number, end: number];
export interface AudioEntryTTS {
    marks?: Array<MarkEntry>;
    words?: Array<MarkEntry>;
    transcript?: string;
}