export default {
    'entry': './dist/webpack.js',
    'output': {
        filename: 'svgmotion.web.js',
        path: import.meta.dirname
    },
    // .... other webpack, like output, etc.
    optimization: {
        minimize: true
    },
    // experiments: {
    //     outputModule: true,
    // },
};