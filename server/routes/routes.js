module.exports = app=>{
    app.use('/', require('./main'));
    app.use('/api', require('./api'));
    app.use('/auth', require('./auth'));
}