const express = require('express');
const router = express.Router();

/**
 * 前台页面
 */
router.get('/', (req, res, next)=>{
    res.render('index');
});
/**
 * 登录页面
 */
router.get('/login', (req, res, next)=>{
    res.render('login');
})

module.exports = router;