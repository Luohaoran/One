//获取提现银行卡信息
$(function () {


    var putBankNum = '',//银行卡号
        putUserName = ''//收款人姓名


    getJson(
        'post',
        '/member/member/getBankInfo?c=Member&a=getBankInfo',
        {
            'member_id': member_id,
        },
        function (data) {
            if (data.code == 1) {
                var bankMList = data.data;
                if (bankMList == '') {
                    $('#putBank').val('请先绑定银行卡');
                    $('#putName').val('')
                } else {
                    $("input[name='yue']").val(balance);
                    $.each(bankMList, function (i, item) {//遍历银行添加到下拉中
                        if (i < 1) {
                            $("input[name='name']").val(item.username);
                            card_id = item.id;
                        }
                        $('#bank').append(new Option(((item.bank_type) + '' + (item.card_number)), ((item.username) + '.' + (item.card_number) + '.' + (item.id))))
                    });
                    form.render();//刷新表单
                    form.on('select(aihao)', function (data) {//监听下拉点击事件
                        var _data = ((data.value).split('.'));//字符串截取
                        $("input[name='name']").val(_data[0]);//input框名字复制
                        putUserName = _data[0];//收款人姓名赋值
                        card_id = _data[2];//银行卡id
                    });
                }
            }
        });

    $('#allPrice').val(balance);
    $('#putPrice').val('提现金额不能大于可用余额');
    $('#putPwd').val('请输入提现秘密');
    $('#putPrice').focus(function () {
        $(this).val('')
    })
    $('#putPwd').focus(function () {
        $(this).val('')
    })
//立即提现
    var main = $(window.parent.document).find("#main");
    $('.putBtn').on('click', function () {
        var putBalance = balance;//账户余额
        var putPriceNum = $("input[name='jine']").val();//提现金额
        var putPwd = $("input[name='password']").val();//资金密码
        if (putPriceNum == '') {
            layer.msg('提现金额不能为空', {
                    offset: '150px',
                    anim: 1
                }
            );
        } else if (putPwd == '') {
            layer.msg('资金密码不能为空', {
                    offset: '150px',
                    anim: 1
                }
            );
        } else if (putPriceNum>putBalance) {
            $.Msg('提现金额不能大于余额')
        }else {
            // 验证资金密码
            getJson('post',
                '/member/member/checkTradePwd?c=Member&a=checkTradePwd', {
                    'member_id': member_id,
                    'tradepassword': putPwd,
                }, function (data) {
                    if (data.code == 1) {
                        //请求提现接口
                        getJson(
                            'post',
                            '/member/member/memberDeposit?c=Member&a=memberDeposit',
                            {
                                'member_id': member_id,
                                'amount': putPriceNum,
                                'card_id': card_id,
                            },
                            function (data) {
                                if (data.code == 1) {
                                    layer.msg(data.data, {
                                            offset: '150px',
                                            anim: 1
                                        }
                                    );
                                    $("input[name='jine']").val('');//清空输入框
                                    $("input[name='password']").val('');//清空输入框
                                    $._getBalane();
                                } else {
                                    layer.msg(data.message, {
                                            offset: '150px',
                                            anim: 1
                                        }
                                    );
                                }
                            });
                    } else {
                        layer.msg(data.message, {
                                offset: '150px',
                                anim: 1
                            }
                        );
                    }
                });
        }
    });

});

