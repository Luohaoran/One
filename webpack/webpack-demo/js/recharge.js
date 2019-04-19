$(function () {
    layui.use(['layer'], function () {//layui初始化
        layer = layui.layer;//弹出层模块


        var main = $(window.parent.document).find("#main");
        var thisheight = $('.rechargeInfo').height() + 30;
        if (thisheight < 750) {
            main.height(750);
        } else {
            main.height(thisheight);
            $(window.parent.document).find('.containerInfo').height(thisheight);
            $(window.parent.document).find('.container').height(thisheight);
            $(window.parent.document).find('.userNav').height(thisheight);
        }


        var mini='';
        var max='';
        $('.bank').on('click', function () {
            $(this).siblings().removeClass('rechargeBankA');
            $(this).addClass('rechargeBankA');
        });
        (function getbank() {
            _getJson(
                'post',
                '/member/getRechargeType?from_station=only_port',
                {
                    'member_id': member_id,
                },
                function (data) {
                    if (data.code == 1) {
                        var dataList = data.data;
                        var html = '';//这是支付方式
                        var html2 = '';//这是二维码
                        var html3 = '';//这是银行转账
                        let a = 0;
                        $.each(dataList, function (i, item) {
                            html += ' <li  class="'+((item.status===0)?('layui-btn layui-btn-disabled button'):(''))+' pay mini-max" type="' + ((i === '银行卡转账') ? (4) : ((i==='在线支付')?(5):(a+1))) + '" state="' + item.status + '" mini="'+item.mini+'" max="'+item.max+'">' + i + '</li>';//设置银行转账和在线支付type
                            if (i === '扫码转账') {//设置扫码转账二维码选项
                                $.each(item, function (i) {
                                    if (i!='mini'&&i!='max'&&i!='status'){
                                        html2 += ' <li type="' + (a += 1) + '">' + i + '</li>';
                                    }
                                })
                            }
                            if (i === '银行卡转账') {//设置银行卡转账input框文本
                                $.each(item, function (i, item) {
                                    if (i!='mini'&&i!='max'&&i!= 'status'){
                                        html3 += ' <div>' +
                                            '<span>' + i + ':</span><input type="text" value="' + item + '" name="' + i + '"   readonly="readonly">\n' +
                                            '</div>'
                                    }

                                })
                            }
                            if (i === '在线支付') {//设置在线支付（现在还没有）


                            }
                        });


                        $('.rechargeBox ul').html(html);//支付方式
                        $('.rechargeBox ul li').eq(0).addClass('wayA')

                        $('.payStyle ul').html(html2);//二维码选择
                        $('.payStyle ul li').eq(0).addClass('payStyleA');

                        $('.form form').html(html3);//在线支付




                        $('.mini').text($('.mini-max').attr('mini'));//设置最小值
                        $('.max').text($('.mini-max').attr('max'));//设置最大值









                        var state='';//支付状态是否可用
                        $('.pay').on('click', function () {//支付方式切换
                            state=$(this).attr('state');
                            type=$(this).text();
                            if (type==='银行卡转账'){//银行卡转账位置偏移

                                $('.rechargeBox1').addClass('_rechargeBox1')
                            }else if (type==='扫码转账') {
                                $('.rechargeBox1').removeClass('_rechargeBox1')
                            }


                            if (state==='1'){//等于一才可用
                                mini=$(this).attr('mini');
                                max=$(this).attr('max');
                                $('.mini').text(mini);
                                $('.max').text(max);
                            }

                            if ($(this).attr('state') == '1') {//判断该方法是否可用
                                $(this).siblings().removeClass('wayA');
                                $(this).addClass('wayA');
                                $('.way' + ($(this).index() + 1) + '').removeClass('none');//下面界面的跳转
                                $('.way' + ($(this).index() + 1) + '').siblings().not($('.rechargeWay,.rechargePrice')).addClass('none');
                                $('.payStyleF').removeClass('none');
                                $('#priceNum').val('');//切换页面清空输入框的值

                            } else {
                                $.Msg('该充值方式现在不可用');
                            }
                        });
                        $('.payStyle ul li').on('click', function () {//二维码选择切换
                            $(this).siblings().removeClass('payStyleA');
                            $(this).addClass('payStyleA')
                        })
                    } else {
                        $.Msg(data.mssage);
                    }
                }
            )
        })();


        $('.rechargeBtn').on('click', function () {//点击充值
            var amount = Number($('#priceNum').val());
            if (amount < Number($('.mini').text()) || amount >  (Number($('.max').text()))) {
                $.Msg('最低'+$('.mini').text()+'元，最高'+$('.max').text()+'元');

            } else {
                if ($('.wayA').text() === '银行卡转账') {
                    var type = $('.wayA').attr('type')
                } else {
                    var type = $('.payStyleA').attr('type');
                }
                $.Load();
                _getJson(
                    'post',
                    '/member/recharge?from_station=only_port',
                    {
                        'user_id': member_id,
                        'amount': amount,
                        'type': type,
                    },
                    function (data) {
                        $.Load('end');
                        var type=data.data;
                        if (data.code === 1) {
                            if (type==='1'||type==='2'||type==='3'){//二维码充值界面
                                var imgUrl = imgurl + '/uploads/images/20190401/1b41ce2f599ef491f94596bdfa325e74.jpg';
                                $.getImageWidth(imgUrl,function(w,h){
                                    layui.use('layer',function () {
                                        parent.layer.open({
                                            type: 1,
                                            title: false,
                                            shadeClose: true,
                                            offset: 'auto',
                                            skin: 'layui-layer-rim', //加上边框
                                            area: [w/2+'px',h/2+'px'],
                                            content:
                                                '<img src="' + imgurl + '/uploads/images/20190401/1b41ce2f599ef491f94596bdfa325e74.jpg' + '" alt="" class="codeimg">'
                                        });
                                    })
                                });
                                $('#priceNum').val('')
                            }
                            if (type==='4'){//银行卡充值界面
                                layer.msg('这是银行卡充值', {
                                        offset: '150px',
                                        anim: 1
                                    }
                                );
                                $('#priceNum').val('')
                            }
                        } else {
                            layer.msg(data.mssage, {
                                    offset: '150px',
                                    anim: 1
                                }
                            );
                        }
                    }
                );
            }

        })




    });

});
