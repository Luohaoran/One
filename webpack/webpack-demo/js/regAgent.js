var fds = 5;//返点最小值
var fdb = rebate * 100;//返点最小值
$("#show-rest-slider").slider({ min: 0, max: rebate, step: 0.1, value: 1, });
$("#show-rest-slider").slider().slider("pips").slider('float');
$(window).load(function () {
    var main = $(window.parent.document).find("#main");
    var thisheight = $('.regAgentInfo').outerHeight(true) + 10;
    if (thisheight < 750) {
        main.height(750);
    } else {
        main.height(thisheight);
        $(window.parent.document).find('.containerInfo').height(thisheight);
        $(window.parent.document).find('.container').height(thisheight);
        $(window.parent.document).find('.userNav').height(thisheight);
    }
});


$('.cBtnBox').on('click', function () {
    $('.cBtnBox').find('.cBtnId').hide();
    $('.cBtnBox').removeClass('checked');
    $(this).addClass('checked');
    $(this).find('.cBtnId').show();
})
var level = level;
//注册下级
$('.regBtn').on('click', function () {
    var username = $('#userName').val();//用户名
    var password = $('#pwd').val();//密码
    var rebate = $('.ui-slider-tip').text();//返点
    var type = $('.checked').attr('type');//代理类型
    if (username == '') {
        $("#userName").attr('placeholder', '用户名不能为空');
    } else if (password == '') {
        $("#pwd").attr('placeholder', '密码不能为空');
    } else {
        _getJson(
            'post',
            '/member/registerSub?from_station=only_port',
            {
                'user_id': member_id,
                'username':username,
                'password':password,
                'rebate':rebate,
                'type':type,
            }, function (data) {
            if (data.code == 1) {
                $.Msg(data.data
            );
                $('#userName').val('')
                $('#pwd').val('')
            } else {
                $.Msg(data.message);
            }
        })
    }

})
