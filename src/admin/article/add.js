//初始化编译器
var ue = UE.getEditor('body');

//前端校验
require('jquery-validation');
require('jquery-validation/dist/localization/messages_zh');

$('#myForm').validate({
    rules: {
        'title': {
            'required': true,
            'maxlength': 16
        },
        'body':{
            'required': true
        }
    },
    message: {
        'title': {
            'required': '标题不能为空'
        },
        'body': {
            'required': '内容不能为空'
        }
    },
    submitHandler: function(form){
        $.ajax({
            url: '/admin/article/save',
            type: 'post',
            data:{
                title : $('#title').val(),
                body: ue.getContent()
            },
            success: function(res) {
                alert(res.message);
                if(res.success) {
                    location.href = '/admin/';
                }
            }
        })
    }
});