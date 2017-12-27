require('./login.css');
var MD5 = require('md5.js');

$('.login form').on('submit', function(e) {
    e.preventDefault();
    let [username, password] = [$('#username').val().trim(), $('#password').val().trim()];
    if(!username || !password) {
        $('#errMsg').text('用户名或者密码不能为空')
        .show()
        .animate({
            display:'none'
        }, 2000, function() {
            $(this).hide();
        });
        return;
    }
    
    password = new MD5().update(password).digest('hex');
    $.ajax({
        url: '/api/user/check',
        type: 'post',
        data: {
            username,
            password
        },
        success: function(data) {
            if(data.success) {
                location.href = '/admin';
            }else {
                $('#errMsg').text(data.message)
                .show()
                .animate({
                    display:'none'
                }, 2000, function() {
                    $(this).hide();
                });
            }
        }
    });
});