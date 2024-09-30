
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
            const { env } = process;
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

    get shared_dirs() {
        const dirs = Array.from(
            (function* () {
                const { env, cwd } = process;
                yield env[`SHARE_DIR`] ?? '';
                yield path.join(os.homedir(), '.local', 'share');
                yield cwd();
            })(),
        ).filter((v) => v && fs.existsSync(v))

        return this._new_field("shared_dirs", dirs);
    }
    // get sharedDirs() {
    // 	return (
    // 		this._foundShareDirs ??
    // (this._foundShareDirs = Array.from(
    // 	(function* () {
    // 		const { env, cwd } = process;
    // 		yield env[`${PREFIX}_SHARE_DIR`] ?? '';
    // 		yield env.ANIMATIONS_SHARE_DIR ?? '';
    // 		yield cwd();
    // 		yield path.join(os.homedir(), '.local', 'share', 'animations');
    // 	})(),
    // ).filter((v) => v && fs.existsSync(v)))
    // 	);
    // }
    find_file(src: string) {
        if (path.isAbsolute(src)) {
            return src;
        }
        for (const dir of this.shared_dirs) {
            const f = path.join(dir, src);
            if (fs.existsSync(f)) {
                return f;
            }
        }
    }

    locate_file(src: string) {
        const f = this.find_file(src);
        if (f) {
            return f;
        }
        throw new Error(`Not found ${src} in ${this.shared_dirs.join(',')}`);
    }

    get_cache_file(k: string, sub?: string): string {
        let { cache_dir: dir } = this;
        return this._get_file(dir, k, sub);
    }

    get_build_file(k: string, sub?: string): string {
        let { build_dir: dir } = this;
        return this._get_file(dir, k, sub);
    }

    private static _instance: Resource;

    private constructor() {
    }

    public static get() {
        return this._instance || (this._instance = new this());
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