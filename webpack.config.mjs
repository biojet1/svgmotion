export default {
    'entry': './dist/index.js',
    'output': {
        filename: 'svgmotion.web.js',
        path: import.meta.dirname
    },
    // .... other webpack, like output, etc.
    optimization: {
        minimize: false
    },
    // experiments: {
    //     outputModule: true,
    // },
};