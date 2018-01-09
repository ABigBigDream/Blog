const express = require('express');
const router = express.Router();

let Article = require('../dbModels/Article');

/**
 * 判断是ajax请求还是直接刷新请求,这个路由只负责判断，不负责渲染
 */
router.use((req, res, next)=>{
    //(nodejs app) req.header('x-requested-with')==='XMLHttpRequest'
   
    //因为app.locals整个服务器只有独一份，所以此时存放在res.loacls身上
    res.locals.isAjax = req.xhr;  //一个请求对应一个响应
    next();
})


/**
 * 跳转到详情页
 */
router.get('/article/detail/:id', (req, res, next)=>{
    let id = req.params.id;
    Article.findById(id).then(article=>{
            res.render('article-detail', {
                article
            });
    }).catch(error=>{
        res.render('404');
    })
})

/**
 * 登录页面
 */
router.get('/login', (req, res, next)=>{
    res.render('login');
})

/**
 *首页
 */
router.get('/', (req, res, next)=>{
    let page = Number(req.query.page)||1; //第几页
    let limit = 9;  //前端传给后端的数据默认都是字符串类型的
    let offset = (page-1)*limit;

    Article.find().sort({
        _id : -1            // 将常量变为变量，可以使用[]运算
    }).skip(offset).limit(limit).then(articles=>{
        articles.map((item,index)=>{
            //提取封面的图片
            let result = item.body.match(/<img [^>]*src=['"]([^'"]+)([^>]*>)/);
            if(result) {
                item.cover = result[1];
            }else {
                //给没有的提供默认图片
                item.cover = 'http://pic29.photophoto.cn/20131204/0034034499213463_b.jpg';
            }
            //过滤html
            item.body = item.body.replace(/<[^>]+>/g, '').substring(0, 77) + '...';
        })
        res.render('index', {
            articles
        });
    });
})

module.exports = router;