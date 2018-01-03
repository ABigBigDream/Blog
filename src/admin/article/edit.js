console.log('我是编辑页面');
require('jquery-validation');
require('jquery-validation/dist/localization/messages_zh');

$('#myForm').validate({
    rules:{
        'title':{
            'required':true,
            'maxlength': 16
        },
        'content':{
            'required': true
        },
    },
    message: {
        'title': {
            'required': '标题不能为空'
        }
    },
    submitHandler: function(form) {
        $.ajax({
            url: '/admin/article/update',
            type: 'post',
            data:{
                id: $('#id').val(),
                title : $('#title').val(),
                body: $('#body').val()
            },
            success: function(res) {
                if(res.success) {
                    alert(res.message);
                    location.href = '/admin/';
                }
            }
        })
    }
})