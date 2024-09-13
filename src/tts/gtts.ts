import path from 'path';
import fs from 'fs';
import { spawn, spawnSync } from 'child_process';
import { Sluggable } from '../utils/resource.js';
import { AudioEntryTTS, cache } from './core.js';

export class GTTS extends Sluggable {
    slow?: boolean;
    language?: string;
    domain?: string;
    constructor() {
        super();
        this.slug_prefix = 'gtts';
        this.slug_suffix = 'mp3';
    }
    override hash_text(text: string): string {
        const { language, slow } = this;
        return this.hash_string_plus(text, ...[language ?? '', slow ? 'slow' : ''].filter(v => !!v));
    }
    save(path: string, text: string) {
        const { language, domain, slow } = this;
        const args = Array.from(
            (function* () {
                yield '--nocheck';
                yield '-f';
                yield '-';
                if (slow) {
                    yield '-s';
                }
                if (language) {
                    yield '-l';
                    yield language;
                }
                if (domain) {
                    yield '-t';
                    yield domain;
                }
                yield '-o';
                yield path;
            })()
        );
        console.warn(args);
        spawnSync('gtts-cli', args, {
            input: text,
        });
    }
    async say(text: string) {
        // file in cache
        const f = cache.get_cache_file(this.slug_id(text), 'tts');
        const j = `${f}.json`; // metadata json file in cache
        return import('fs/promises').then(fsp => {
            return fsp
                .open(f, 'r')
                .then(fh => {
                    fh.close(); // exists, return its json partner
                    return fsp
                        .readFile(j)
                        .then(data => JSON.parse(data.toString()))
                        .catch(err => {
                            console.error(err);
                        });
                })
                .catch(() =>
                    // not found
                    fsp
                        .mkdir(path.dirname(f), {
                            recursive: true,
                        })
                        .then(() => {
                            const t = f.replace(/(\.[^\.]+)$/, '.tmp$1');
                            console.warn(`${this.constructor.name}: ${f}`);
                            return this.speak(text, t).then(entry =>
                                fsp
                                    .rename(t, f)
                                    .then(() => {
                                        entry.transcript = text;
                                        fsp.writeFile(j, JSON.stringify(entry));
                                    })
                                    .then(() => entry)
                            );
                        })
                )
                .then(entry => {
                    if (entry.words == null) {
                        if (process.env.USE_IBM_SPEECH_TO_TEXT) {
                            console.warn(`${this.constructor.name}: words`, entry);
                            return ibm_stt_transcript(f, entry).then(entry => {
                                fsp.writeFile(j, JSON.stringify(entry));
                                return entry;
                            });
                        }
                    }
                    return entry;
                })
                .then(entry => {
                    entry.path = f;
                    return entry;
                });
        });
    }
    speak(text: string, sink: string) {
        const { language, domain, slow } = this;
        const args = Array.from(
            (function* () {
                yield '--nocheck';
                yield '-f';
                yield '-';
                if (slow) {
                    yield '-s';
                }
                if (language) {
                    yield '-l';
                    yield language;
                }
                if (domain) {
                    yield '-t';
                    yield domain;
                }
                yield '-o';
                yield sink;
            })()
        );
        return new Promise<any>(function (resolve, reject) {
            const proc = spawn('gtts-cli', args);
            proc.on('close', code => {
                if (code == 0) {
                    resolve({});
                } else {
                    resolve(new Error(`gtts-cli error ${code}`));
                }
            });
            proc.on('error', err => {
                reject(err);
            });
            proc.stdin.write(text);
            proc.stdin.end();
        });
    }
}

function ibm_stt_transcript(audio_file: string, data: AudioEntryTTS, opt: any = {}) {
    // const { accept, voice } = this;
    return import('ibm-watson/speech-to-text/v1.js').then(mod => {
        const stt = new mod.default({
            // See: https://github.com/watson-developer-cloud/node-sdk#authentication
        });
        const params = {
            objectMode: true,
            contentType: 'audio/mp3',
            model: 'en-US_BroadbandModel',
            // keywords: [],
            // keywordsThreshold: 0.5,
            maxAlternatives: 3,
            timestamps: true,
            ...opt,
        };
        // Create the stream.
        const recognizeStream = stt.recognizeUsingWebSocket(params);
        // Pipe in the audio.
        fs.createReadStream(audio_file).pipe(recognizeStream);
        // Promise<AudioEntryTTS>
        return new Promise((resolve, reject) => {
            // Listen for events.
            recognizeStream.on(
                'data',
                function (result: {
                    results: Array<{
                        alternatives: Array<{
                            timestamps: AudioEntryTTS['words'];
                        }>;
                    }>;
                }) {
                    const words = result?.results?.[0]?.alternatives?.[0]?.timestamps;
                    // onEvent('Data:', result);
                    if (words) {
                        data.words = words;
                    }
                    // console.warn('words', words);
                }
            );
            recognizeStream.on('error', function (event) {
                // onEvent('Error:', event);
                reject(event);
            });
            recognizeStream.on('close', function (code: number, message: string) {
                // onEvent('Close:', [...arguments]);
                if (code == null) {
                    // pass
                } else if (1000 == code) {
                    resolve(data);
                } else {
                    reject(new Error(`ibm-watson speech-to-text error ${code}: ${message}`));
                }
            });
            // Display events on the console.
            function onEvent(name: string, event: any) {
                console.warn(name, JSON.stringify(event, null, 2));
            }
        });
    });
}


