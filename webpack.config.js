var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
    //不打包的基本库，可以做CDN加速
   /* externals: {
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
        contentBase: './dev',
        port: 3003
    },
    devtool: 'cheap-module-eval-source-map',
    entry: {app:'./dev/js/app.js',
        index:'./dev/js/index.js',
        logout:'./dev/js/logout.js'
       /* ,vendor: ['react', 'react-dom', 'react-router','redux','react-redux','classnames']*/
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!postcss-loader!sass-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader!sass-loader'
            },
            {
                test:/\.(ttf|jpg|gif|png)$/,
                loader:'file-loader?name=src/[name].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
    output: {
        path: 'docs/',
        filename: 'js/[chunkHash:32].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '综艺嘉登陆',
            template: 'dev/index.html',
            filename: 'index.html',
            inject: 'body',
            chunks:['index','app']
        }),
        new HtmlWebpackPlugin({
            title: '综艺嘉',
            template: 'dev/app.html',
            filename: 'app.html',
            inject: 'body',
            chunks:['logout','app']
        }),
        /* 压缩*/
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),*/
        /* 生成公共文件
         new webpack.optimize.CommonsChunkPlugin({
         name:'index', // 上面入口定义的节点组
         filename:'./js/bundle.login.js' //最后生成的文件名
         }),*/
        new webpack.ProvidePlugin({
            React: 'react'
        })//解决不用CDN的全打包状态下丢失全局变量window.React问题
    ]
};
