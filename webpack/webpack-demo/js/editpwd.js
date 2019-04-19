
var on = $(window.parent.document).find('.accountNav');
var main = $(window.parent.document).find("#main");
$('.setf').on('click', function () {
    var oldpwd = $('#oldP').val();
    var newpwd = $('#newP').val();
    var newP1 = $('#newP1').val();
    if (oldpwd == '') {
        $.Msg('请输入旧的登录密码')
    } else if (newpwd == '') {
        $.Msg('请输入新的登录密码')
    } else if (newP1 == '') {
        $.Msg('请确认新的登录密码')
    } else {
        getJson('post', '/member/member/editPassword?c=Member&a=editPassword', { 'member_id': member_id, 'currentpassword': oldpwd, 'newpassword': newpwd, 'repnewpassword': newP1, 'mjmjid': mjmjid, 'mjmjrandom': mjmjrandom }, function (data) {
            if (data.code == 1) {
                $.Msg(data.data)
                on.find('ul li').removeClass('ownNav');
                on.find('.ownmsg').addClass('ownNav');
                main.attr('src', 'memberinfo.html');
            } else {
                $.Msg(data.message)
            }
        })
    }
});
