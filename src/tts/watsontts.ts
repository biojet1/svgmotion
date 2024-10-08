import path from 'path';
import fs from 'fs';
import { AudioEntryTTS, Voice } from './core.js';
import { Resource } from '../utils/resource.js';

export class WatsonTTS extends Voice {

    accept: string;
    voice: string;

    constructor(voice: string) {
        super();
        this.slug_prefix = 'wat';
        this.slug_suffix = 'ogg';
        // https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-voices
        this.voice = voice ?? 'en-US_LisaV3Voice';
        // accept = "audio/flac"
        // accept = "audio/wav"
        this.accept = 'audio/ogg;codecs=opus';
    }

    override hash_text(text: string): string {
        const { accept, voice } = this;
        return this.hash_string_plus(text, ...[accept, voice].filter((v) => !!v));
    }

    override async say(text: string) {
        // file in cache
        const f = Resource.get().get_cache_file(this.slug_id(text), 'tts');
        const j = `${f}.json`; // metadata file in cache
        return import('fs/promises')
            .then((fsp) => {
                return fsp
                    .open(f, 'r')
                    .then((fh) =>
                    // exists, return its parner json
                    {
                        fh.close();
                        return fsp
                            .readFile(j)
                            .then((data) => JSON.parse(data.toString()))
                            .catch((/*err*/) => ({}));
                    },
                    )
                    .catch(() =>
                        // not found
                        fsp.mkdir(path.dirname(f), { recursive: true }).then(() => {
                            const t = f.replace(/(\.[^\.]+)$/, '.tmp$1');
                            console.warn(`${this.constructor.name}: ${f}`);
                            return this.speak(text, t).then((entry) =>
                                fsp
                                    .rename(t, f)
                                    .then(() => {
                                        entry.transcript = text;
                                        fsp.writeFile(j, JSON.stringify(entry));
                                    })
                                    .then(() => entry),
                            );
                        }),
                    );
            })
            .then((entry) => {
                entry.path = f;
                return entry;
            });
    }

    speak(text: string, sink: string | NodeJS.WritableStream | undefined): Promise<AudioEntryTTS> {
        const { accept, voice } = this;
        return import('ibm-watson/text-to-speech/v1.js').then((mod) => {
            const tts = new mod.default({
                // See: https://github.com/watson-developer-cloud/node-sdk#authentication
            });
            // specify the text to synthesize
            const params = {
                text: text,
                accept: accept,
                voice: voice,
                timings: ['words', 'marks'],
            };
            // synthesizeUsingWebSocket returns a Readable Stream that can be piped or listened to
            const sock = tts.synthesizeUsingWebSocket(params);
            const words: Array<[string, number, number]> = [];
            const marks: Array<[string, number, number]> = [];
            if (sink) {
                // the output of the stream can be piped to any writable stream, like an audio file
                if (typeof sink === 'string') {
                    sock.pipe(fs.createWriteStream(sink));
                } else {
                    sock.pipe(sink);
                }
            } else {
                // !!!!! IMPORTANT !!!!!
                // if the stream is not being piped anywhere and is only being listened to, the stream needs
                //   to be explicitly set to flowing mode by uncommenting the following line:
                sock.resume();
            }
            sock.on('words', (_message, data: { words: Array<[string, number, number]> }) => {
                words.push(...data.words);
            });
            sock.on('marks', (_message, data: { marks: Array<[string, number, number]> }) => {
                marks.push(...data.marks);
            });
            return new Promise<AudioEntryTTS>((resolve, reject) => {
                // the 'error' event is emitted if there is an error during the connection
                // 'err' is the Error object describing the error
                sock.on('error', (err) => {
                    reject(err);
                });
                // the 'close' event is emitted once, when the connection is terminated by the service
                // the 'code' parameter is the status code. 1000 is the code for a normal termination
                // the 'reason' parameter provides a string description of how the connection closed
                sock.on('close', (code: number, reason: string) => {
                    if (1000 == code) {
                        resolve({ words, marks });
                    } else {
                        reject(new Error(`ibm-watson text-to-speech error ${code}: ${reason}`));
                    }
                });
            });
        });
    }
}
