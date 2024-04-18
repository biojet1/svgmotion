export default {
    'entry': './dist/web.js',
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