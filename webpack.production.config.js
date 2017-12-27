const webpack = require('webpack');
const path = require('path');
//用来清楚的插件
const CleanWebpackPlugin = require('clean-webpack-plugin');
//用来提取css的插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");

//源码的路径
const srcPath = path.join(__dirname, 'src');

module.exports = {
    entry: {
        'common/main' : [srcPath+'/common/main.js'] 
    },
    output: {
        path : __dirname + '/public',
        filename : '[name].js',
        publicPath: 'http://localhost:8080/public'
    },
    module: {
        rules:[
            //CSS加载器
            {
                test: /\.css$/,
                use: [  
                    'style-loader',  //style-loader一定要写在css-loader之前
                    'css-loader'
                ]
            },
            //图片加载器
            {
                test: /\.(jpg|jpeg|png|gif|)$/,
                use:'url-loader?limit=8192&context=client&name=/img/[name].[ext]'
            },
            //文字加载器
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: 'file-loader?limit=8192&name=/fonts/[name].[ext]'
            },
            //处理js文件
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['env'],
                    plugins: ['transform-runtime', 'syntax-dynamic-import']
                  }
                }
            }
        ]
    },
    plugins:[
        //每次编译前清除已有的文件
        new CleanWebpackPlugin(['public']),
        //将css文件提取出来
        new ExtractTextPlugin({
            filename: function(getPath) {
                return getPath('css/[name].css').replace('css/common', 'css');
            },
            allChunks: true
        }),
        //把jquery当作全局变量提取出来
        new webpack.ProvidePlugin({
            $ : 'jquery',
            jQuery : 'jquery'
        }),
        //混淆压缩
        new webpack.optimize.UglifyJsPlugin()//这个插件不支持混淆es6
    ]
};