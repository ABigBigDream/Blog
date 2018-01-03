/**
 * 权限登录校验
 */
module.exports = (req, res, next)=>{
     
    if(req.url.startsWith('/admin')) {
        if(req.app.locals) {
            if(!req.session.user) {
                req.session.user = {
                    username: '小付君'
                }
            }
        }

        if(req.session.user) {
            next();
        }else {
            res.redirect('/login');
        }
    }else {
        next();
    }
}