const express = require('express');
const router = express.Router();

//引入User数据库
let User = require('../dbModels/User');

let responseMessage;
//引入中间件
router.use((req, res, next)=>{
    responseMessage = {
        success: false,
        message: ''
    };
    console.log('进入中间件');
    next();
});

/**
 * 查询此人是否存在在数据库中
 */
router.post('/user/check', (req, res, next)=>{
    let params = req.body;
    if(!params.username || !params.password) {
        responseMessage.message = '用户名或者密码不能为空';
        res.json(responseMessage);
        return;
    }
    User.findOne({
        username: params.username,
        password: params.password
    }).then(user=>{
        if(user) {
            responseMessage.success = true;
            responseMessage.message = '登录成功';
            req.session.user = user;
            res.json(responseMessage);
        }else {
            responseMessage.message = '用户名或者密码不正确';
            res.json(responseMessage);
        }
    });
});

module.exports = router;