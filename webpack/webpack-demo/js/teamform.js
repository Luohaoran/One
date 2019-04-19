$(function () {
    var main = $(window.parent.document).find("#main");
    var thisheight = $('.teamformInfo').outerHeight(true) + 10;
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
    var close_type = -1;//是否结算
    var lottery_id = -1;//彩种
    var proloss = '';//盈亏
//获取团队列表
    getJson(
        'post',
        '/agent/agent/teamReport?c=Agent&a=teamReport',
        {
            'member_id': member_id,
            'page': '',
            'pageSize': '',
        },
        function (data) {
            if (data.code == 1) {
                var dataList = data.data.data;
                var html = '';
                for (var i = 0; i < dataList.length; i++) {
                    html += '<li type="' + dataList[i].type + '">' +
                        '<div style="width:24%">' + dataList[i].username + '</div>' +
                        '<div style="width:19%">' + dataList[i].action_coin + '￥' + '</div>' +
                        '<div style="width:19%">' + dataList[i].win_amount + '￥' + '</div>' +
                        '<div style="width:19%">' + dataList[i].back_water + '</div>' +
                        '<div style="width:19%">' + ((i === dataList.length - 1) ? (dataList[i].profit) : (dataList[i].profit_loss)) + '￥' + '</div>' +
                        // '<div class="checkRecord" style="width:20%" id="' + dataList[i].member_id + '">游戏记录</div>' +
                        '</li>'
                }
                $('.gameRowInfo ul').html(html);
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
                            url: baseurl + "/agent/agent/teamReport?c=Agent&a=teamReport",//请求地址
                            dataType: "json",//数据格式
                            type: "post",//请求方式
                            async: false,//是否异步请求
                            data: {
                                'member_id': member_id,
                                'page': page,
                                'pagesize': 10,
                                'mjmjid': mjmjid,
                                'mjmjrandom': mjmjrandom
                            },
                            success: function (data) {
                                if (data.code == 1) {
                                    var dataList = data.data.data;
                                    var html = '';
                                    for (var i = 0; i < dataList.length; i++) {
                                        html += '<li type="' + dataList[i].type + '">' +
                                            '<div style="width:24%">' + dataList[i].username + '</div>' +
                                            '<div style="width:19%">' + dataList[i].action_coin + '￥' + '</div>' +
                                            '<div style="width:19%">' + dataList[i].win_amount + '￥' + '</div>' +
                                            '<div style="width:19%">' + dataList[i].back_water + '</div>' +
                                            '<div style="width:19%">' + ((i === dataList.length - 1) ? (dataList[i].profit) : (dataList[i].profit_loss)) + '￥' + '</div>' +
                                            // '<div class="checkRecord" style="width:20%" id="' + dataList[i].member_id + '">游戏记录</div>' +
                                            '</li>'
                                    }
                                    $('.gameRowInfo ul').html(html);
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
                $('.gameRowInfo ul li').css(css)
            }
        }, function (err) {
        }
    );

//点击查询按钮查询
    $('.tranBtn').on('click', function () {
            var username = $('#userN').val();
            sTime = $('#time1').val();
            eTime = $('#time2').val();
            if (sTime == '') {
                $.Msg('请选择开始日期', {}
                );
            } else if (eTime == '') {
                $.Msg('请选择结束日期', {}
                );
            } else if (username == '') {
                $.Msg('请输入用户名')
            } else {
                getJson(
                    'post',
                    '/agent/agent/teamReport?c=Agent&a=teamReport',
                    {
                        'member_id': member_id,
                        'start_time': sTime,
                        'end_time': eTime,
                        'username': username
                    },
                    function (data) {
                        if (data.code == 1) {
                            var dataList = data.data.data;
                            var html = '';
                            for (var i = 0; i < dataList.length; i++) {
                                html += '<li type="' + dataList[i].type + '">' +
                                    '<div style="width:24%">' + dataList[i].username + '</div>' +
                                    '<div style="width:19%">' + dataList[i].action_coin + '￥' + '</div>' +
                                    '<div style="width:19%">' + dataList[i].win_amount + '￥' + '</div>' +
                                    '<div style="width:19%">' + dataList[i].back_water + '</div>' +
                                    '<div style="width:19%">' + ((i === dataList.length - 1) ? (dataList[i].profit) : (dataList[i].profit_loss)) + '￥' + '</div>' +
                                    // '<div class="checkRecord" style="width:20%" id="' + dataList[i].member_id + '">游戏记录</div>' +
                                    '</li>'
                            }
                            $('.gameRowInfo ul').html(html);
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
                                        url: baseurl + "/agent/agent/teamReport?c=Agent&a=teamReport",//请求地址
                                        dataType: "json",//数据格式
                                        type: "post",//请求方式
                                        async: false,//是否异步请求
                                        data: {
                                            'member_id': member_id,
                                            'page': page,
                                            'start_time': sTime,
                                            'end_time': eTime,
                                            'username': username
                                        },
                                        success: function (data) {
                                            if (data.code == 1) {
                                                var dataList = data.data.data;
                                                var html = '';
                                                for (var i = 0; i < dataList.length; i++) {
                                                    html += '<li type="' + dataList[i].type + '">' +
                                                        '<div style="width:24%">' + dataList[i].username + '</div>' +
                                                        '<div style="width:19%">' + dataList[i].action_coin + '￥' + '</div>' +
                                                        '<div style="width:19%">' + dataList[i].win_amount + '￥' + '</div>' +
                                                        '<div style="width:19%">' + dataList[i].back_water + '</div>' +
                                                        '<div style="width:19%">' + ((i === dataList.length - 1) ? (dataList[i].profit) : (dataList[i].profit_loss)) + '￥' + '</div>' +
                                                        // '<div class="checkRecord" style="width:20%" id="' + dataList[i].member_id + '">游戏记录</div>' +
                                                        '</li>'
                                                }
                                                $('.gameRowInfo ul').html(html);
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
                            $('.gameRowInfo ul li').css(css)
                        }
                    })
            }
        }
    );


    $('.hideThis').on('click', function () {
        $('.gameRecordBox').hide();
    });

//查看当前用户的游戏记录
    function checkGameR() {
        $('.checkRecord').on('click', function () {
            $('.gameRecordBox').show();
            var id = $(this).attr('id')//当前点击的用户id
            //请求接口获取当前用户的游戏记录
        });
    }


});

