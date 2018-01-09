const express = require('express');
const router = express.Router();

let Article = require('../dbModels/Article');

let responseMessage;
//引入中间件
router.use((req, res, next)=>{
    responseMessage = {
        success: false,
        message: '',
        data: {
            total: 0,
            rows: []
        }
    };
    next();
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
 * 文章保存
 */
router.post('/article/save', (req, res)=>{
    let params = req.body;

    if(!params.title || !params.body) {
        responseMessage.message = '标题或者内容不能为空';
        res.json(responseMessage);
        return;
    }

    new Article({
        title:params.title,
        body: params.body
    }).save().then(article=>{
        responseMessage.success = true;
        responseMessage.message = '发布成功';
        res.json(responseMessage);
    })
});


/**
 * 文章查询
 */
router.get('/article/pagenation', (req, res, next)=>{
    let offset = Number(req.query.offset);
    let limit = Number(req.query.limit);  //前端传给后端的数据默认都是字符串类型的
    let sort = req.query.sort || '_id';  //按哪个参数进行排序
    let order = req.query.order==='asc'?1:-1;

    Article.count().then(count=>{
        responseMessage.data.total = count;
    })

    Article.find().sort({
        [sort]: order            // 将常量变为变量，可以使用[]运算
    }).skip(offset).limit(limit).then(articles=>{
        responseMessage.success = true;
        responseMessage.data.rows = articles;
        res.json(responseMessage);
    })
});

/**
 * 文章列表路由设置
 */
router.get('/', (req, res, next)=>{
    console.log(req.session.user);
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
 * 文章编译路由设置(路由传参)
 */
router.get('/edit/:zhangsan', (req, res, next)=>{
    let id = req.params.zhangsan;  //解析路径中的id

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

module.exports = router;