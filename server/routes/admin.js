const express = require('express');
const router = express.Router();

let Article = require('../dbModels/Article');

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
 * 文章列表路由设置
 */
router.get('/', (req, res, next)=>{
    res.render('admin/list', {
        user: req.session.user
    });
});

/**
 * 文章添加路由设置
 */
router.get('/add', (req, res, next)=>{
    res.render('admin/add');
});

/**
 * 文章编译路由设置
 */
router.get('/edit/:id', (req, res, next)=>{
    let id = req.params.id;  //解析路径中的id

    Article.findById(id).then(article=>{
        if(article) {
            res.render('admin/edit', {
                article
            });
        }
    })
});

/**
 * 退出登录路由设置
 */
router.get('/logout', (req, res, next)=>{
    req.session.user = null;
    res.redirect('/login');
});

/**
 * 文章删除
 */
router.delete('/article/:id', (req, res, next)=>{
    let id = req.params.id;
    Article.findByIdAndRemove(id).then(article=>{
        if(article) {
            responseMessage.success = true;
            responseMessage.message = '删除成功';
            res.json(responseMessage);
        }
    });
})

/**
 * 文章更新
 */
router.post('/article/update', (req, res, next)=>{
    let params = req.body;
    console.log(params.title, params.body)
    Article.findByIdAndUpdate(params.id, {
        title: params.title,
        body: params.body
    }).then(article=>{
        if(article) {
            responseMessage.success = true;
            responseMessage.message = '修改成功';
            res.json(responseMessage);
        }else {
            responseMessage.message = '修改失败';
            res.json(responseMessage);
        }
        
    });
});

/**
 * 文章查询
 */
router.get('/article/pagenation', (req, res, next)=>{
    Article.find().then(articles=>{
            res.json(articles);
    })
});

/**
 * 文章保存
 */
router.post('/article/save', (req, res)=>{
    let params = req.body;
    new Article({
        title:params.title,
        body: params.body
    }).save().then(article=>{
        responseMessage.success = true;
        responseMessage.message = '发布成功';
        res.json(responseMessage);
    })
});




module.exports = router;