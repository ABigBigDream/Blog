console.log('我是main.js，也是入口文件');

let modelPath = $('[data-name]').data('name');

if(modelPath) {
    //异步引入
    console.log('../'+modelPath);
    import('../'+modelPath)
    .then(model=>{
        console.log('加载模块成功');
    }).catch(err=>{
        console.log('模块加载失败');
    })
}

//不是后台也不是登陆界面
if(!location.pathname.startsWith('/login')&&!location.pathname.startsWith('/admin')) {
    require('jquery-pjax');
    $(document).pjax('a.pjax', '#main');
}