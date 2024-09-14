
import fs from 'fs';
import path from 'path';
import os from 'os';

export class Resource {

    protected _new_field<T>(name: string, value: T): T {
        Object.defineProperty(this, name, {
            value,
            writable: true,
            enumerable: true,
            configurable: true,
        });
        return value;
    }

    protected _get_file(dir: string, k: string, sub?: string): string {
        let file;
        if (sub) {
            file = path.join(dir, sub, k);
        } else {
            file = path.join(dir, k);
        }
        if (file) {
            return file;
        }
        throw new Error(`No file ${k}`);
    }

    get cache_dir() {
        for (const dir of (function* () {
            const { env, cwd } = process;
            yield env[`CACHE_DIR`] ?? '';
            yield path.join(os.homedir(), '.cache');
            yield path.join(os.tmpdir(), 'cache');
        })()) {
            if (dir) {
                fs.mkdirSync(dir, { recursive: true });
                if (fs.existsSync(dir)) {
                    return this._new_field("cache_dir", dir);
                }
            }
        }
        throw new Error(`No cache dir`);
    }

    get build_dir() {
        for (const dir of (function* () {
            const { env, cwd } = process;
            yield env[`BUILD_DIR`] ?? '';
            yield path.join(os.tmpdir(), 'build');
            yield cwd();
        })()) {
            if (dir) {
                fs.mkdirSync(dir, { recursive: true });
                if (fs.existsSync(dir)) {
                    return this._new_field("build_dir", dir);
                }
            }
        }
        throw new Error(`No cache dir`);
    }

    get_cache_file(k: string, sub?: string): string {
        let { cache_dir: dir } = this;
        return this._get_file(dir, k, sub);
    }

    get_build_file(k: string, sub?: string): string {
        let { build_dir: dir } = this;
        return this._get_file(dir, k, sub);
    }
}

export abstract class Sluggable {
    slug_prefix?: string;
    slug_suffix?: string;
    abstract hash_text(text: string): string;
    abstract save(path: string, text?: any): any;

    slug_id(text: string) {
        const { slug_prefix, slug_suffix } = this;
        return [
            slug_prefix ?? '',
            Sluggable.slugify(text)
                .substring(0, 32)
                .replace(/^-+|-+$/g, ''),
            this.hash_text(text).substring(0, 8),
            slug_suffix ?? '',
        ]
            .filter(v => !!v)
            .join('.');
    }

    static slugify(text: string) {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }

    static hash_string(s: string, h = 0) {
        let { length: n } = s;
        while (n-- > 0) {
            h = (h << 5) - h + s.charCodeAt(n);
            h = h & h;
        }
        return h;
    }

    static hash_strings(is: Iterable<string>) {
        let h = 0;
        for (const s of is) {
            let { length: n } = s;
            while (n-- > 0) {
                h = (h << 5) - h + s.charCodeAt(n);
                h = h & h;
            }
        }
        return h;
    }

    protected hash_string_plus(text: string, ...extra: string[]) {
        if (extra) {
            return Sluggable.hash_string(text, Sluggable.hash_strings(extra))
                .toString(36)
                .replace('-', '0');
        } else {
            return Sluggable.hash_string(text).toString(36).replace('-', '0');
        }
    }
}