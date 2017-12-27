const express = require('express');
const router = express.Router();

/**
 * 文章列表路由设置
 */
router.get('/', (req, res, next)=>{
    res.render('admin/list');
})

module.exports = router;