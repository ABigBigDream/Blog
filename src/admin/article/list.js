console.log('文章列表');
require('bootstrap-table');
require('bootstrap-table/dist/locale/bootstrap-table-zh-CN');
require('BOOTSTRAP_TABLE_CSS');

//格式化时间
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

$('#table').bootstrapTable({
    url: '/admin/article/pagenation',
    columns:[{
            field: '_id',
            title: 'ID',
            width: 100,
            align: 'center'
        },{
            field: 'title',
            title: '文章标题',
            align: 'left'
        },{
            field: 'body',
            title: '文章内容'
        },{
            field: 'time',
            title: '发布时间',
            align: 'center',
            formatter: function(value) {
                return new Date(value).format('yyyy-MM-dd hh:mm:ss');
            }
        },{
            field: 'operate',
            title: '操作',
            align:'center',
            formatter: function(value) {
                return `<div class="btn-group">
                <button type="button" data-action="edit" class="btn btn-primary">编辑</button>
                <button type="button" data-action="delete" class="btn btn-danger">删除</button>
              </div>`
            },
            events: {
                'click [data-action="edit"]' : function(e, value, row, index) {
                    location.href = '/admin/edit/'+row['_id'];
                },
                'click [data-action="delete"]' : function(e, value, row, index) {
                    let isSure = window.confirm('您确认删除文章【'+ row['title'] + '】吗？');
                    if(isSure) {
                        $.ajax({
                            url: '/admin/article/' + row['_id'],
                            method:'delete',
                            success: function(res) {
                                $('#table').bootstrapTable('remove', {
                                    field: '_id', 
                                    values: [row['_id']]
                                });
                            }  
                        })
                    }
                }
            }
        }
    ],
    // sidePagination: 'server',
    pagination: true,
    // classes: 'table table-hover table-no-border', //默认覆盖样式
    showRefresh: true,
    showColumns: true,
    paginationPreText: '上一页',
    paginationNextText: '下一页',
    search: true,
});