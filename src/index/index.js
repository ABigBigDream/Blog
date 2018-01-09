function reset () {
//获取卡片父级
let $content = $('#content.post-index');
//获取所有卡片
let $articles = $content.find('article');
let _margin = 6*2;  //每个卡片的margin

//获取卡片原先的宽度
let article_width_old = 249+_margin;
//获取父级的宽度
let content_width = $content.width();

//获取父级元素的高度
let content_height = $content.height();
$content.css('height', content_height);

//一行可以放几个卡片
let max_column = parseInt(content_width/article_width_old);
console.log('一行最多放几个:', max_column);

//每个卡片占多少宽度
let article_width_new = content_width/max_column;  //新的宽度，包含margin
$articles.css('width', content_width/max_column - _margin);

//卡片设置样式
$articles.css({
    position: 'absolute',
    left: 0,
    top: 0
});

let all_height=[];
$articles.each(function(index, item){
    all_height.push($(item).height()+_margin);
    let column = index % max_column;
    let row = parseInt(index/max_column);
    let left = column * article_width_new;
    let top = 0;
    while(row>0) {
        --row;
        top += all_height[row * max_column + column];
    }
    // $(item).css('left', left);   //left位移会引起浏览器页面的重绘
    $(item).css({
        'transform': 'translate('+left+'px,'+top+'px )'
    })
})
}

reset();
window.onresize=function() {
    reset();
}