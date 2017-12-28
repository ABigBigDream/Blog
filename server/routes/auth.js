/**
 * 权限登录校验
 */
module.exports = (req, res, next)=>{
    if(req.app.locals) {
        req.session.user = {
           username: '小夫君'
        }
    }

    if(req.url.startsWith('/admin')) {
        if(req.session.user) {
            next();
        }else {
            res.redirect('/login');
        }
    }else {
        next();
    }
}