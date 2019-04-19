$(window).load(function () {
    if (email==''){
        $('.emailRow').show();
        $('.PwdDes').hide()
    }else {
        $('.emailRow').hide();
        $('.PwdDes').show()
        $('.email').text(email)
    }
    var main = $(window.parent.document).find("#main");
    var thisheight = $('.emailInfo').height() + 30;
    if (thisheight < 750) {
        main.height(750);
    } else {
        main.height(thisheight);
        $(window.parent.document).find('.containerInfo').height(thisheight);
        $(window.parent.document).find('.container').height(thisheight);
        $(window.parent.document).find('.userNav').height(thisheight);
    }
    if (email == '') {
        $('#email').val('');
    } else {
        $('#email').val(email);
    }
    $('.nextBtn').on('click', function () {
        var email = $('#email').val();
        getJson('post', '/member/member/bindEmail?c=Member&a=bindEmail', {
            'member_id': member_id,
            'email': email,
            'mjmjid': mjmjid,
            'mjmjrandom': mjmjrandom
        }, function (data) {
            if (data.code == 1) {
                layer.msg(data.data, {
                        offset: '150px',
                        anim: 1
                    }
                );
                //跳转到激活邮箱页面
            } else {
                layer.msg(data.message, {
                        offset: '150px',
                        anim: 1
                    }
                );
            }
        })
    })
});
