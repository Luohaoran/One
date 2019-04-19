$(window).load(function () {
    layui.use(['laydate', 'layer', 'form'], function () {//layui初始化
        var form=layui.form;
        var main = $(window.parent.document).find("#main");
        var thisheight = $('.nextGlInfo').outerHeight(true) + 10
        if (thisheight < 750) {
            main.height(750);
        } else {
            main.height(thisheight);
            $(window.parent.document).find('.containerInfo').height(thisheight);
            $(window.parent.document).find('.container').height(thisheight);
            $(window.parent.document).find('.userNav').height(thisheight);
        }
        var sTime = '';//开始时间
        var eTime = '';//结束时间
        var close_type = '0';//开奖状态
        var lottery_id = -1;//彩种zhuanz
        var proloss = '';//盈亏
        var nglId;
        $('.hideThis').on('click', function () {
            $(this).parent().parent().hide();
            $('.re').remove();
        });

        $('.lotteryType').hover(function () {
            $(this).find('ul').show();
        }, function () {
            $(this).find('ul').hide();
        })
        $('.lotteryType ul li').on('click', function () {
            var typeName = $(this).html();
            var close_type = $(this).attr('close-type')
            $('#lotteryType').text(typeName);
            $('#lotteryType').attr('close-type', close_type);
            $('.lotteryType ul').hide();
        })


        $('.zhuanzIcon ').on('click', function () {
            $('.zhuanzTypeBox ul').show()
        })


        $('.zhuanzTypeBox ul').hover(function () {
        }, function () {
            $(this).hide()
        })


        $('.zhuanzTypeBox ul li').on('click', function () {
            var typeName = $(this).html();
            var data_type = $(this).attr('data-type')
            $('.zhuanzType').text(typeName);
            $('.zhuanzType').attr('data-type', data_type);
            $('.zhuanzTypeBox ul').hide()
        })


        form.on('select(lotteryType)', function (data) {//监听查询用户下拉
            close_type = data.value;
        });

        function getFd() {
            getJson(
                'post',
                '/agent/agent/subordinateManage?c=agent&a=subordinateManage',
                {
                    'member_id': member_id,
                    'page': 1,
                    'pagesize': 10,
                },
                function (data) {
                    if (data.code == 1) {
                        var nglList = data.data.data;
                        var html = '';
                        for (var i = 0; i < nglList.length; i++) {
                            html += '<li glUserId="' + nglList[i].member_id + '" has_under="' + nglList[i].has_under + '" fd="' + nglList[i].rebate + '">' +
                                '<div style="width:14%">' + nglList[i].username + '</div>' +
                                '<div class="glType" style="width:14%">' + nglList[i].type + '</div>' +
                                '<div style="width:20%">' + nglList[i].create_at + '</div>' +
                                '<div style="width:10%">' + nglList[i].rebate + '</div>' +
                                '<div style="width:14%">' + nglList[i].balance + '</div>' +
                                '<div style="width:10%">' + nglList[i].prevtime + '</div>' +
                                '<div class="handleBox" style="width:18%"><span class="checkDesBtn">详情</span><span class="fandSet">返点设置</span></div>' +
                                '</li>'
                        }
                        $('.gameRowInfo ul').html(html);
                        // $('.zhuanz').on('click', function () {//转账
                        //     console.log('111111');
                        //     $('.zhuanzBox').show();
                        //     var balance = Number(localStorage.getItem('balance'))//账户余额
                        //     var xiajiname = $(this).parent().parent().children(':first').text()//下级名字
                        //     $('#allPrice').val(balance);//设置目前金额
                        //     $('#xiajiName').val(xiajiname)//设置下级名字
                        //
                        //     $('.zhuanzBtn').on('click', function () {
                        //         var zijinPwd = $('#zijinPwd').val();//资金密码//
                        //         var zhuanjin = $('#zhuanzJine').val()//转账金额//
                        //         var zhuantype = $('.zhuanzType').attr('data-type');//转账类型
                        //         if (zhuanjin == '') {
                        //             alert('请输入转账金额')
                        //         } else if (zhuanjin > balance) {
                        //             alert('转账金额不能大于账户余额')
                        //         } else if (zijinPwd == '') {
                        //             alert('请输入资金密码')
                        //         } else {
                        //             alert('冲冲冲')
                        //             /*清空数据*/
                        //             $('#zhuanzJine').val('');
                        //             $('#zijinPwd').val('')
                        //         }
                        //     })
                        // });
                        $('.glType').each(function () {
                            var type = $(this).html();
                            if (type == 1) {
                                $(this).html('玩家');
                            }
                            if (type == 2) {
                                $(this).html('代理');
                            }
                        });
                        handle();
                        //分页插件
                        var totalPage = data.last_page;
                        $('.M-box1').pagination({
                            pageCount: data.data.last_page,
                            totalData: totalPage,
                            showData: data.data.per_page,
                            coping: true,
                            callback: function (data) {
                                var page = data.getCurrent();
                                $.ajax({
                                    url: baseurl + "/agent/agent/subordinateManage?c=agent&a=subordinateManage",//请求地址
                                    dataType: "json",//数据格式
                                    type: "post",//请求方式
                                    async: false,//是否异步请求
                                    data: {
                                        'member_id': member_id,
                                        'page': page,
                                        'pagesize': 10,
                                    },
                                    success: function (data) {
                                        if (data.code == 1) {
                                            var nglList = data.data.data;
                                            var html = '';
                                            for (var i = 0; i < nglList.length; i++) {
                                                html += '<li glUserId="' + nglList[i].member_id + '" has_under="' + nglList[i].has_under + '" fd="' + nglList[i].rebate + '">' +
                                                    '<div style="width:14%">' + nglList[i].username + '</div>' +
                                                    '<div class="glType" style="width:14%">' + nglList[i].type + '</div>' +
                                                    '<div style="width:20%">' + nglList[i].create_at + '</div>' +
                                                    '<div style="width:10%">' + nglList[i].rebate + '</div>' +
                                                    '<div style="width:14%">' + nglList[i].balance + '</div>' +
                                                    '<div style="width:10%">' + nglList[i].prevtime + '</div>' +
                                                    '<div class="handleBox" style="width:18%"><span class="checkDesBtn">详情</span><span class="fandSet">返点设置</span></div>' +
                                                    '</li>'
                                            }
                                            $('.gameRowInfo ul').html(html);
                                            $('.glType').each(function () {
                                                var type = $(this).html();
                                                if (type == 1) {
                                                    $(this).html('玩家');
                                                }
                                                if (type == 2) {
                                                    $(this).html('代理');
                                                }
                                            });
                                            handle()
                                        } else {
                                            $('.gameRowInfo ul li').html(data.message);
                                            $('.gameRowInfo ul li').css('text-align', 'center')
                                        }
                                    }
                                })
                            }
                        });
                    } else {
                        $('.gameRowInfo ul li').html(data.message);
                        $('.gameRowInfo ul li').css('text-align', 'center')
                    }
                });
        }

        getFd();

        function handle() {
            $('.checkDesBtn').on('click', function () {
                $('.checkDesBox').show();
                nglId = $(this).parent().parent().attr('glUserId');
                //请求接口获取当前用户的详情记录
                getJson('post', '/agent/agent/showSubordinateMess?c=agent&a=showSubordinateMess',
                    {
                        'user_id': nglId,
                    },
                    function (data) {
                        if (data.code == 1) {
                            var desList = data.data;
                            var html = '';
                            html += '<li>' + desList.username + '</li>' +
                                '<li>' + desList.create_at + '</li>' +
                                '<li>' + desList.rebate + '</li>' +
                                '<li>' + desList.balance + '</li>' +
                                '<li>' + desList.prevtime + '</li>' +
                                '<li>' + desList.noAction + '</li>'
                            $('.checkDesBox .rightDes ul').html(html);
                        } else {
                            $.Msg(data.message)
                        }
                    })
            });//查看详情
            $('.fandSet').on('click', function () {
                $('.setFdBox').show();
                nglId = $(this).parent().parent().attr('glUserId');
                var fd = $(this).parent().parent().attr('fd');
                //获取所有彩种
                getJson(
                    'post',
                    '/officialorders/officialorders/getAllLottery?c=Officialorders&a=getAllLottery',
                    {
                        'member_id': member_id,
                    },
                    function (data) {
                        if (data.code == 1) {
                            var lotteryList = data.data;
                            var html = '';
                            for (var i = 0; i < lotteryList.length; i++) {
                                html += '<li>' +
                                    '<div>' + lotteryList[i].lottery_name + '</div>' +
                                    '<div class="bigFd">' + rebate + '%</div>' +
                                    '<div class="dqFd">' + fd + '%</div>' +
                                    '<div class="afterFd">--</div>' +
                                    '</li>'
                            }
                            $('.caizFdInfo ul').html(html);
                        } else {
                            $.Msg(data.message)

                        }
                    });
                //设置返点
                getJson('post',
                    '/agent/agent/showSubordinateMess?c=agent&a=showSubordinateMess',
                    {
                        'user_id': nglId,
                        'mjmjid': mjmjid,
                        'mjmjrandom': mjmjrandom
                    },
                    function (data) {
                        if (data.code == 1) {
                            var desList = data.data;
                            var html = '';
                            html += '<li class="re">' + desList.username + '</li>' +
                                '<li class="lastFd re">' + desList.rebate + '%</li>';
                            $('.re').remove();
                            $('.checkF').before(html);
                            var smallFd = 0;
                            var checkfd = smallFd;
                            var n = 0;
                            var step = 0.1;
                            n = Math.floor((rebate - smallFd) / step);//向下取整
                            var html1 = '';
                            for (var i = 0; i < n; i++) {
                                checkfd = (Math.floor(checkfd * 10 + 1) / 10).toFixed(1);
                                html1 += '<li ckfd="' + checkfd + '">' + checkfd + '%</li>'
                            }
                            $('#fandainNum').text('设置返点');
                            $('.fandianzhi ul').html(html1);
                            $('.fandianzhi').hover(function () {
                                $(this).find('ul').show();
                            }, function () {
                                $(this).find('ul').hide();
                            })
                            $('.fandianzhi ul li').on('click', function () {
                                var fdn = $(this).html();
                                var ckfd = $(this).attr('ckfd');
                                $('#fandainNum').text(fdn);
                                $('#fandainNum').attr('ckfd', ckfd);
                                $('.fandianzhi ul').hide();
                                $('.afterFd').html(fdn)
                                $('.setFdBtn').attr('type', '2');
                                $('.setFdBtn').css('background', '#ff6052')
                            })
                        } else {
                            $.Msg(data.message)
                        }
                    });

            });//返点设置

            $('.setFdBtn').on('click', function () {


                var type = $(this).attr('type');
                var ckfd = $('#fandainNum').attr('ckfd');
                if (type == 1) {
                    // alert('您还未选择调整返点值')
                    $.Msg('您还未选择调整返点值')
                }
                if (type == 2) {
                    //请求确认设置返点接口
                    // loadingFlag= layer.msg('正在读取数据，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:60000 });
                    getJson('post', '/agent/agent/setRebate?c=agent&a=setRebate', {
                        'user_id': member_id,
                        'sub_id': nglId,
                        'rebate': ckfd,
                    }, function (data) {
                        // layer.close(loadingFlag);
                        if (data.code == 1) {
                            $(this).attr('type', '2');
                            $.Msg('修改成功');
                            $('.setFdBox').hide();
                            getFd();
                            $('.setFdBtn').unbind();
                        } else {
                            $.Msg(data.message)
                        }
                    })
                }
            })
        }


//请求下级管理列表接口

//点击查询

        $('.tranBtn').on('click', function () {
            sTime = $('#time1').val();
            eTime = $('#time2').val();
            lottery_uuid = $('#lotteryN').attr('lottery-uuid');
            proloss = $('#proloss').attr('proloss');
            if (sTime == '') {
                layer.msg('请选择开始日期', {
                        offset: '150px',
                        anim: 1
                    }
                );
            } else if (eTime == '') {
                layer.msg('请选择结束日期', {
                        offset: '150px',
                        anim: 1
                    }
                );
            } else {
                getJson('post',
                    '/agent/agent/subordinateManage?c=agent&a=subordinateManage',
                    {
                        'type': close_type,
                        'member_id': member_id,
                        'start_time': sTime,
                        'end_time': eTime,
                        'page': 1,
                        'pagesize': 10,
                    }, function (data) {
                        if (data.code == 1) {
                            var nglList = data.data.data;
                            var html = '';
                            for (var i = 0; i < nglList.length; i++) {
                                html += '<li glUserId="' + nglList[i].member_id + '" has_under="' + nglList[i].has_under + '" fd="' + nglList[i].rebate + '">' +
                                    '<div style="width:14%">' + nglList[i].username + '</div>' +
                                    '<div class="glType" style="width:14%">' + nglList[i].type + '</div>' +
                                    '<div style="width:20%">' + nglList[i].create_at + '</div>' +
                                    '<div style="width:10%">' + nglList[i].rebate + '</div>' +
                                    '<div style="width:14%">' + nglList[i].balance + '</div>' +
                                    '<div style="width:10%">' + nglList[i].prevtime + '</div>' +
                                    '<div class="handleBox" style="width:18%"><span class="checkDesBtn">详情</span><span class="fandSet">返点设置</span></div>' +
                                    '</li>'
                            }
                            $('.gameRowInfo ul').html(html);
                            $('.glType').each(function () {
                                var type = $(this).html();
                                if (type == 1) {
                                    $(this).html('玩家');
                                }
                                if (type == 2) {
                                    $(this).html('代理');
                                }
                            });
                            handle();
                            //分页插件
                            var totalPage = data.last_page;
                            $('.M-box1').pagination({
                                pageCount: data.data.last_page,
                                totalData: totalPage,
                                showData: data.data.per_page,
                                coping: true,
                                callback: function (data) {
                                    var page = data.getCurrent();
                                    $.ajax({
                                        url: baseurl + "/agent/agent/subordinateManage?c=agent&a=subordinateManage",//请求地址
                                        dataType: "json",//数据格式
                                        type: "post",//请求方式
                                        async: false,//是否异步请求
                                        data: {
                                            'type': close_type,
                                            'member_id': member_id,
                                            'page': page,
                                            'pagesize': 10,
                                            'start_time': sTime,
                                            'end_time': eTime,
                                        },
                                        success: function (data) {
                                            if (data.code == 1) {
                                                var nglList = data.data.data;
                                                var html = '';
                                                for (var i = 0; i < nglList.length; i++) {
                                                    html += '<li glUserId="' + nglList[i].member_id + '" has_under="' + nglList[i].has_under + '" fd="' + nglList[i].rebate + '">' +
                                                        '<div style="width:14%">' + nglList[i].username + '</div>' +
                                                        '<div class="glType" style="width:14%">' + nglList[i].type + '</div>' +
                                                        '<div style="width:20%">' + nglList[i].create_at + '</div>' +
                                                        '<div style="width:10%">' + nglList[i].rebate + '</div>' +
                                                        '<div style="width:14%">' + nglList[i].balance + '</div>' +
                                                        '<div style="width:10%">' + nglList[i].prevtime + '</div>' +
                                                        '<div class="handleBox" style="width:18%"><span class="checkDesBtn">详情</span><span class="fandSet">返点设置</span></div>' +
                                                        '</li>'
                                                }
                                                $('.gameRowInfo ul').html(html);
                                                $('.glType').each(function () {
                                                    var type = $(this).html();
                                                    if (type == 1) {
                                                        $(this).html('玩家');
                                                    }
                                                    if (type == 2) {
                                                        $(this).html('代理');
                                                    }
                                                });
                                                handle()
                                            } else {
                                                $('.gameRowInfo ul li').html(data.message);
                                                $('.gameRowInfo ul li').css('text-align', 'center')
                                            }
                                        }
                                    })
                                }
                            });
                        } else {
                            $('.gameRowInfo ul li').html(data.message);
                            $('.gameRowInfo ul li').css('text-align', 'center')
                        }
                    })
            }

        })
    });


});

