module.exports = app=>{
    //登录权限校验
    app.use(require('./auth')); 

    app.use('/', require('./main'));
    app.use('/api', require('./api'));
    app.use('/admin', require('./admin'));
}