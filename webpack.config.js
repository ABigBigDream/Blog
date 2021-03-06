const webpack = require('webpack');
const path = require('path');
//源码的路径
const srcPath = path.join(__dirname, 'src');

module.exports = {
    entry: {
        'common/main' : [srcPath+'/common/main.js', 'webpack-hot-middleware/client?reload=true'],
        'common/admin-lib':['jquery','bootstrap','BOOTSTRAP_CSS'], //public/common/admin-lib.js public/common/admin-lib.css
        'common/lib': ['jquery', 'APP_CSS']
    },
    output: {
        path : __dirname + '/public',
        filename : '[name].js',
        publicPath: 'http://localhost:3000/public'
    },
    //方便调试断点
    devtool: 'eval-source-map', 
    resolve: {
        modules:[srcPath,'node_modules'],//指定webpack查找文件目录
        //取别名
        alias: {
            SRC: srcPath,
            BOOTSTRAP_CSS:'bootstrap/dist/css/bootstrap.css',
            BOOTSTRAP_TABLE_CSS:'bootstrap-table/dist/bootstrap-table.css',
            APP_CSS:'SRC/common/app.less'
        }
    },
    module: {
        rules:[
            //CSS加载器
            {
                test: /\.(css|less)$/,
                use: [  
                    'style-loader',  //style-loader一定要写在css-loader之前
                    'css-loader?sourceMap',
                    'less-loader' //用来处理less文件
                ]
            },
            //图片加载器
            {
                test: /\.(jpg|jpeg|png|gif|)$/,
                use:'url-loader'
            },
            //文字加载器
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: 'file-loader'
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
        //把jquery当作全局变量提取出来
        new webpack.ProvidePlugin({
            $ : 'jquery',
            jQuery : 'jquery'
        }),

        // HMR热加载
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};