const express = require('express');
const path = require('path');
const swig = require('swig');
const mongoose = require('mongoose');
const app = express();
//源码目录
const srcPath = path.join(__dirname, 'src');

//swig模板配置
app.engine('html', swig.renderFile);
app.set('views', './server/views');
app.set('view engine', 'html');

//第三方中间件的加载
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const session = require('express-session');
app.use(session({
    secret: 'alibaba',
    resave: false,
    saveUninitialized: true
}));

const ueditor = require('ueditor');
//将public/ueditor目录下的资源静态化
app.use('/ueditor', express.static(__dirname+'/public/ueditor'));
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    //客户端上传文件设置
    var imgDir = '/ueditor/upload/img'
     var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/ueditor/upload/file'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/ueditor/upload/video'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

//取出设置的环境变量的值
console.log('取出的变量值', process.env.NODE_ENV);
//是否是开发模式
const isDev = process.env.NODE_ENV === 'dev';
console.log('是否是开发模式', isDev);
app.locals = isDev;
if(isDev) {

    swig.setDefaults({
        cache: false  
    }); 

    //前台的文件编译放到后台
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config');
    const compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo:true,
        stats:{
            colors:true 
        },
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(require('webpack-hot-middleware')(compiler));

    //路由加载
    require('./server/routes/routes')(app);

    //代理服务器
    const browserSync = require('browser-sync').create();
    //后台文件修改后浏览器自动刷新
    const reload = require('reload');
    const http = require('http');
    const server = http.createServer(app);
    reload(app);
    server.listen(8080, ()=>{

        browserSync.init({
                ui: false,
                open: false,
                online: false, //离线工作模式，可以大大提高启动速度
                notify: false, //不显示在浏览器中的任何通知
                proxy: 'localhost:8080', //要代理的服务器地址
                files: './server/views/**', //监听被修改的代码
                port: 3000 //服务器启动的端口
            }, () => console.log('开发模式，代理服务器启动成功'));
    });
}else {
        //静态资源的加载
    app.use('/public', express.static(__dirname+'/public'));
        //路由加载
    require('./server/routes/routes')(app);

    app.listen(8080, ()=>{
        console.log('web应用启动成功');
    });
}

mongoose.connect('mongodb://localhost:27017/Blog', { useMongoClient: true })
.on('open', (db)=>{
    console.log('数据库启动成功');
})
.on('error', (error)=>{
    console.log('数据库启动失败');
});