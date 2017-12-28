console.log('我是add.js');
require('jquery-validation');
require('jquery-validation/dist/localization/messages_zh');

$('#myForm').validate({
    rules: {
        title: {
            required: true,
            maxlength: 16
        },
        body:{
            required: true
        }
    },
    message: {
        title: {
            required: '标题不能为空'
        },
        body: {
            required: '内容不能为空'
        }
    },
    submitHandler: function(form){
        $.ajax({
            url: '/admin/article/save',
            type: 'post',
            data:{
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
});