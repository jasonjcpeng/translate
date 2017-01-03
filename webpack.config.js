var path = require('path');
var webpack = require('webpack');

module.exports = {
    //不打包的基本库，可以做CDN加速
    /*externals: {
        'react': 'window.React',
        'react-dom': 'window.ReactDOM',
        'redux':'window.Redux',
        'react-redux':'window.ReactRedux'
    },*/
    devServer: {
        lazy: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        inline: true,
        contentBase: './dist',
        port: 3003
    },
    devtool: 'cheap-module-eval-source-map',
    entry: './dev/js/index.js',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test:/\.(ttf|jpg|gif|png)$/,
                loader:'file-loader?name=src/[name].[ext]'
            }
        ]
    },
    output: {
        path: 'dist',
        filename: 'js/bundle.min.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.ProvidePlugin({
            React: 'react'
        }),//解决不用CDN的全打包状态下丢失全局变量window.React问题
    ]
};
