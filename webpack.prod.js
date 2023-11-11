const path = require('path');

module.exports = {
    entry: {
        main: './index.js'
    },
    output: {
        path: path.join(__dirname, 'build-prod'),
        publicPath: '/',
        filename: '[name].js',
        clean: true
    },
    mode: 'production',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            }
        ]
    }
};