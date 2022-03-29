const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: { 
        main: "./src/framework/js/vegtex.js" 
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        libraryTarget : 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [ 
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                exclude: /node_modules/,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                exclude: /node_modules/,
                type: 'asset/inline',
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.js']
    }
};
