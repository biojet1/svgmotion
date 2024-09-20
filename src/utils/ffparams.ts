type Value = string | number | boolean;

export interface Filter {
	name: any;
	[key: string]: Value;
}

interface Stream {
	path?: string;
	args?: (string | [string, Value] | string[])[] /*| { [key: string]: Value }*/;
	tag?: string;
	index?: number;
	id?: string;
}

export interface Input extends Stream {
	loop?: number;
}

export interface Output extends Stream {
	format?: string;
}

export class Source implements Input {
	path?: string | undefined;
	args?: (string | [string, Value] | string[])[];
	tag?: string | undefined;
	index?: number | undefined;
	id?: string | undefined;
	loop?: number;
}

export class Sink implements Output {
}

export interface FilterChain {
	input?: Array<number | string | String | Stream> | number | string | Stream;
	output?: Iterable<number | string> | number | string;
	filters?: Iterable<Filter>;
}

interface FFCommand {
	bin?: string;
	args?: Iterable<string> | { [key: string]: Value };
	input?: Input | Iterable<Input> | string;
	graph?: Iterable<FilterChain>;
	output?: Output | Iterable<Output> | string;
	filter_complex_script?: (g: string) => string;
}

export function ff_graph(fg: Iterable<FilterChain>, sep = ';') {
	function* link(fc: FilterChain) {
		const { input, output, filters } = fc;
		if (input) {
			if (Array.isArray(input)) {
				for (const s of input) {
					yield `[${s.toString()}]`;
				}
			} else {
				yield `[${input.toString()}]`;
			}
		}
		if (filters) {
			yield Array.from(
				filters,
				(f) =>
					`${f.name}=` +
					Object.entries(f)
						.filter(([key, value]) => key && key != 'name' && value != null)
						.map(([key, value]) => {
							if (Array.isArray(value)) {
								value = value.map((v) => v.toString()).join(' ');
							}
							// escape ":", "'"
							const v = value.toString().replace(/([:'])/, '\\$1');
							return `${key}=${v}`;
						})
						.join(':')
						// escape  "[", "]", ",", ";", "'"
						.replace(/([\[\];',])/, '\\$1'),
			).join(',');
		}
		if (output) {
			if (typeof output === 'object') {
				for (const s of output) {
					yield `[${s.toString()}]`;
				}
			} else {
				yield `[${output.toString()}]`;
			}
		}
	}
	return Array.from(fg, (fc) => Array.from(link(fc)).join('')).join(sep);
}

export function* flatten_args(
	args: Iterable<string | [string, Value] | string[]> | { [key: string]: Value },
) {
	for (const v of Array.isArray(args) ? args : Object.entries(args)) {
		if (Array.isArray(v)) {
			let [key, value] = v;
			if (key || value != null) {
				if (key) {
					if (value === true) {
						yield `${key}`;
						continue;
					} else if (value === false) {
						yield `no${key}`;
						continue;
					}
					// const prefix = key.startsWith('-') ? '' : '-';
					// yield `${prefix}${key}`;
					yield `-${key}`;
				}
				if (value != null) {
					yield value;
				}
			}
		} else {
			yield v;
		}
	}
}

export function ff_params(opt: FFCommand): Array<string> {
	function* enum_inputs<V>(src: V | string | Iterable<V | string>): IterableIterator<V> {
		switch (typeof src) {
			case 'function':
			case 'undefined':
			case 'symbol':
				break;
			case 'object':
				if (Array.isArray(src)) {
					for (const s of src) {
						for (const t of enum_inputs(s)) {
							if (t) yield t;
						}
					}
				} else {
					yield src as V;
				}
				break;
			case 'string':
				yield { path: src.toString() } as any as V;
		}
	} // inputs
	function* collect() {
		const { input, output, graph, bin, args, filter_complex_script } = opt;
		if (bin) {
			yield bin;
		}
		if (args) {
			yield* flatten_args(args);
		}
		if (input) {
			const inputs = Array.from(enum_inputs<Input>(input));
			for (const v of inputs) {
				const { path, loop, args } = v;
				if (args) {
					yield* flatten_args(args);
				}
				if (loop && (loop > 1 || loop < 0)) {
					yield '-stream_loop';
					yield loop;
				}
				if (path) {
					yield '-i';
					yield path;
				}
			}
		}
		GRAPH: if (graph) {
			if (filter_complex_script) {
				const g = ff_graph(graph, ';\n');
				if (g) {
					const path = filter_complex_script.call(opt, g);
					if (path) {
						// yield '-/filter_complex';
						yield '-filter_complex_script';
						yield path;
						break GRAPH;
					}
				}
			}
			const g = ff_graph(graph);
			if (g) {
				yield '-filter_complex';
				yield g;
			}
		}
		if (output) {
			const outputs = Array.from(enum_inputs<Output>(output));
			for (const v of outputs) {
				const { path, args } = v;
				if (args) {
					yield* flatten_args(args);
				}
				if (path) {
					yield path;
				}
			}
		}
	}

	return Array.from(collect(), (v) => v.toString());
}
