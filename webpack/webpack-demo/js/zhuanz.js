$('.zhuanzTypeIcon').on('click', function () {
    $('.zhuanzTypeBox ul').show();
});
$('.zhuanzTypeBox ul').hover(function () {

},function () {
    $(this).hide()
});

$('.zhuanzTypeBox ul li').on('click', function () {
    var text = $(this).html();
    var type_id = $(this).attr('type-id');
    $('.zhuanzType').text(text);
    $('.zhuanzType').attr('type-id', type_id);
    $('.zhuanzTypeBox ul').hide();
});

//设置账户余额
var balance = localStorage.getItem('balance');//账户余额
$('#allPrice').val(balance);

//立即转账
$('.zhuanzBtn').on('click', function () {


    var putBalance = $('#allPrice').val();
    var putBankNum = $('#zhuanzBank').val();
    var putUserName = $('#zhuanzName').val();
    var putPriceNum = $('#zhuanzPrice').val();
    var putPwd = $('#zhuanzPwd').val();
    var type = $('.zhuanzType').attr('type-id');
    if (putBalance == '') {
        $.Msg('余额暂不可转账')
    } else if (putBankNum == '') {
        $.Msg('没有转账ID')
    } else if (putUserName == '') {
        $.Msg('没有转账用户名')
    } else if (putPriceNum == '') {
        $.Msg('无效转账金额')
    } else if (putPwd == '') {
        $.Msg('资金密码不能为空')
    } else if (putPriceNum > putBalance) {
        $.Msg('转账金额不能大于可用余额')

    } else {
        // 验证资金密码
        getJson(
            'post',
            '/member/member/fundPwdVerify?c=member&a=fundPwdVerify',
            {
                'member_id': member_id,
                'tradepassword': putPwd,
                'mjmjid': mjmjid,
                'mjmjrandom': mjmjrandom
            },
            function (data) {
            if (data.code == 1) {
                //请求转账接口
                getJson(
                    'post',
                    '/membercash/membercash/memberTransfer?c=membercash&a=memberTransfer',
                    {
                        'member_id': member_id,
                        'type': type,
                        'id': putBankNum,
                        'name': putUserName,
                        'money': putPriceNum,
                        'mjmjid': mjmjid,
                        'mjmjrandom': mjmjrandom
                    },
                    function (data) {
                    if (data.code == 1) {
                        window.location.reload();
                        $.Msg(data.data)

                    } else {
                        $.Msg(data.message)
                    }
                });
            } else {
                $.Msg('资金密码错误')
            }
        });


    }
});
