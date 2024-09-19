import { writeFileSync } from "fs";
import { Input, FilterChain, Source, ff_params, Output } from "./ffparams.js";


export class FFRun {
    input: Input[] = [];
    output: Output[] = [];
    graph: FilterChain[] = [];
    bin = 'ffmpeg';
    args = ['-hide_banner', '-y'];
    filter_script_path = `/tmp/fcs.txt`;
    _next_no = 0;

    get_input_id(id: string) {
        for (const x of this.input) {
            if (x.id === id) {
                return x;
            }
        }
        let x = new Source();
        x.id = id;
        x.index = this.input.length;
        this.input.push(x); return x;
    }

    get_input_path(path: string) {
        for (const x of this.input) {
            if (x.path === path) {
                return x;
            }
        }
        let x = new Source();
        x.path = path;
        x.index = this.input.length;
        this.input.push(x);
        return x;
    }

    output_of_path(path: string) {
        for (const x of this.output) {
            if (x.path === path) {
                return x;
            }
        }
        let x = new Source();
        x.path = path;
        x.index = this.output.length;
        this.output.push(x);
        return x;
    }

    // add_filter_chain(path: string) {
    //     for (const x of this.output) {
    //         if (x.path === path) {
    //             return x;
    //         }
    //     }
    //     let x:FilterChain = {};
    //     x.path = path;
    //     x.index = this.output.length;
    //     this.output.push(x);
    //     return x;
    // }

    next_id() {
        // String.fromCharCode()
        return 'S' + (++this._next_no).toString(36);
    }
    ff_params() {
        return ff_params(this);
    }
    filter_complex_script(g: string) {
        const file = this.filter_script_path;
        writeFileSync(file, g);
        return file;
    }
    _run() {
        const cmd = this.ff_params();
        return import('node:child_process').then(cp => {
            let [bin, ...args] = cmd;
            return cp.spawn(bin, args, { stdio: 'inherit' });
        });
    }
}
