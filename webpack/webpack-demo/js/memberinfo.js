$(window).load(function () {
    var main = $(window.parent.document).find("#main");
    var thisheight = $('.userInfo').height() + 30;
    if (thisheight < 750) {
        main.height(750);
    } else {
        main.height(thisheight);
        $(window.parent.document).find('.containerInfo').height(thisheight);
        $(window.parent.document).find('.container').height(thisheight);
        $(window.parent.document).find('.userNav').height(thisheight);
    }
});

//个人信息赋值
$('.nickName').text(username);
$('#nickName').val(username);
$('.bankUserName').text(nickname);
$('.bankUserId').text(member_id);
if (bankusername == '') {
    $('#forPName').text('请前往银行卡管理绑定真实姓名');
} else {
    $('#forPName').text(bankusername);
}
if (tradepassword == '') {
    $('.zjpBox .msgType').text('未设置');
    $('.zjpBox .setBtn').css('background-image', 'url(/assets/img/info/setBtn1.png)')
} else {
    $('.zjpBox .msgType').text('已设置');
    $('.zjpBox .setBtn').css('background-image', 'url(/assets/img/info/setBtn.png)')
}
if (email == '') {
    $('.yxBox .msgType').text('未设置');
    $('.yxBtn').text('立即绑定');
    $('.yxBox .setBtn').css('background-image', 'url(/assets/img/info/setBtn1.png)')
} else {
    $('.yxBox .msgType').text('已设置');
    $('.yxBtn').text('修改 绑定');
    $('.yxBox .setBtn').css('background-image', 'url(/assets/img/info/setBtn.png)')
}
if (password == '') {
    $('.dlpBox .msgType').text('未设置');
    $('.dlpBox .setBtn').css('background-image', 'url(/assets/img/info/setBtn1.png)')
} else {
    $('.dlpBox .msgType').text('已设置');
    $('.dlpBox .setBtn').css('background-image', 'url(/assets/img/info/setBtn.png)')
}
if (secretname == '') {
    $('.mbBox .msgType').text('未设置');
    $('.mbBox .setBtn').css('background-image', 'url(/assets/img/info/setBtn1.png)')
} else {
    $('.mbBox .msgType').text('已设置');
    $('.mbBox .setBtn').css('background-image', 'url(/assets/img/info/setBtn.png)')
}
//个人信息赋值
var on = $(window.parent.document).find('.accountNav');
var main = $(window.parent.document).find("#main");
$('.yxp').on('click', function () {
    on.find('ul li').removeClass('ownNav');
    on.find('.ownEmail').addClass('ownNav');
    main.attr('src', 'email.html');
});//立即绑定邮箱
$('.yxBtn').on('click', function () {
    on.find('ul li').removeClass('ownNav');
    on.find('.ownEmail').addClass('ownNav');
    main.attr('src', 'email.html');
});//立即绑定邮箱
$('.zjp').on('click', function () {
    on.find('ul li').removeClass('ownNav');
    on.find('.ownZJPwd').addClass('ownNav');
    main.attr('src', 'edittrad.html');
});//立即设置资金密码
$('.dlp ').on('click', function () {
    on.find('ul li').removeClass('ownNav');
    on.find('.ownPwd').addClass('ownNav');
    main.attr('src', 'editPwd.html');
});//修改登录密码
$('.mbBox').on('click', function () {
    on.find('ul li').removeClass('ownNav');
    on.find('.ownPwdQ').addClass('ownNav');
    main.attr('src', 'secretpwd.html');
});//立即设置资金密码


$('.setNick').on('click', function () {
    $('.onnickNb').show();
    $('.nickNb').hide();
    $('.userdes').hide();
    $('.userNBox label').show();
});

$('.onnickNb .saveNick').on('click', function () {
    var onicl = $("#nickName").val();
    getJson('post', '/member/member/editNickname?c=Member&a=editNickname', { 'member_id': member_id, 'nickname': onicl,'mjmjid': mjmjid, 'mjmjrandom': mjmjrandom }, function (data) {
        if (data.code == 1) {
            $('.nickName').text(onicl);
            $('.onnickNb').hide();
            $('.nickNb').show();
            $('.userdes').show();
            $('.bankUserName').text(onicl);
            $('.userNBox label').hide();
        }else{
            // alert(data.message)
            $.Msg(data.message)
        }
    });
});
