$(function () {


    var sTime = '';//开始时间
    var eTime = '';//结束时间
    var proloss = '';//盈亏

    var lottery_uuid = '0';//彩种默认状态
    var lottery_status = '0';//是否结算


    //暂无数据格式

    $('.lotteryL').hover(function () {
        $(this).find('ul').show();
    }, function () {
        $(this).find('ul').hide();
    })

    $('.lotteryType').hover(function () {
        $(this).find('ul').show();
    }, function () {
        $(this).find('ul').hide();
    })
    $('.lotteryType ul li').on('click', function () {
        var close_type = $(this).attr('close-type');
        var val = $(this).html();
        $('#lotteryType').text(val);
        $('#lotteryType').attr('close-type', close_type);
        $('.lotteryType ul').hide();
    });
    $('.lotteryPrploss').hover(function () {
        $(this).find('ul').show();
    }, function () {
        $(this).find('ul').hide();
    })
    $('.lotteryPrploss ul li').on('click', function () {
        var proloss = $(this).attr('proloss');
        var val = $(this).html();
        $('#proloss').text(val);
        $('#proloss').attr('proloss', proloss);
        $('.lotteryPrploss ul').hide();
    });

    function showNum() {//点击显示号码
        $('.showNum').on('click', function () {
            var num = $(this).text().split('@');
            layer.alert('' + num[1] + '', {
                skin: 'layui-layer-molv' //样式类名
                , closeBtn: 0,
                title: '' + num[0] + ''
            });
        });
    }

    var jiesuan = () => {//类型判断
        $('.jiesuan').each(function () {
            var type = $(this).html();
            if (type == 1) {
                $(this).html('未开奖');
            }
            if (type == 2) {
                $(this).html('已开奖');
            }
            if (type == 3) {
                $(this).html('已撤单');
            }
            if (type == 0) {
                $(this).html('全部');
            }
        });
    };


//获取所有彩种信息
    getJson(
        'post',
        '/officialorders/officialorders/getAllLottery?c=Officialorders&a=getAllLottery',
        {
            'member_id': member_id,
        },
        function (data) {
            if (data.code == 1) {
                // console.log(data);
                var lotteryList = data.data;
                $.each(lotteryList, function (i, item) {
                    $('#lottery').append(new Option(item.lottery_name, item.lottery_uuid))//遍历值添加到下拉列表
                });
                form.render();//刷新表单
                form.on('select(lottery)', function (data) {//监听彩种点击事件
                    lottery_uuid = data.value;
                });
                form.on('select(lotteryType)', function (data) {//监听开奖状态点击事件
                    lottery_status = data.value;
                });
            } else {
                // alert(data.message)
                $.Msg(data.message)
            }
        });
//获取游戏记录信息
    getJson(
        'post',
        '/officialorders/officialorders/getOrderRecord?c=Officialorders&a=getOrderRecord',
        {
            'member_id': member_id,
        },
        function (data) {
            if (data.code == 1) {
                var orderList = data.data.data;
                var html = '';
                for (var i = 0; i < orderList.length; i++) {
                    html += '<li>' +
                        // '<div style="width:20%">' + orderList[i].indent_id + '</div>' +
                        '<div style="width:20%">' + orderList[i].action_time + '</div>' +
                        '<div style="width:12%">' + orderList[i].lottery_name + '</div>' +
                        '<div style="width:26%;cursor: pointer" class="showNum">' + orderList[i].action_data + '@' + orderList[i].code_list + '</div>' +
                        '<div style="width:10%">' + orderList[i].action_coin + '</div>' +
                        '<div style="width:12%">' + orderList[i].action_no + '</div>' +
                        '<div style="width:10%">' + orderList[i].bonus + '</div>' +
                        '<div style="width:10%" class="jiesuan">' + orderList[i].lottery_status + '</div>' +
                        '</li>'
                }
                $('.gameRowInfo ul').html(html);
                showNum();
                jiesuan();
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
                            url: baseurl + "/officialorders/officialorders/getOrderRecord?c=Officialorders&a=getOrderRecord",//请求地址
                            dataType: "json",//数据格式
                            type: "post",//请求方式
                            async: false,//是否异步请求
                            data: {
                                'member_id': member_id,
                                'page': page, //这里默认是page
                                'pagesize': data.per_page,
                                'mjmjid': mjmjid,
                                'mjmjrandom': mjmjrandom
                            },
                            success: function (data) {
                                if (data.code == 1) {
                                    var tranList = data.data.data;
                                    var html = '';
                                    for (var i = 0; i < tranList.length; i++) {
                                        html += '<li>' +
                                            // '<div style="width:20%">' + orderList[i].indent_id + '</div>' +
                                            '<div style="width:20%">' + tranList[i].action_time + '</div>' +
                                            '<div style="width:12%">' + tranList[i].lottery_name + '</div>' +
                                            '<div style="width:26%;cursor: pointer" class="showNum">' + tranList[i].action_data + '@' + tranList[i].code_list + '</div>' +
                                            '<div style="width:10%">' + tranList[i].action_coin + '</div>' +
                                            '<div style="width:12%">' + tranList[i].action_no + '</div>' +
                                            '<div style="width:10%">' + tranList[i].bonus + '</div>' +
                                            '<div style="width:10%" class="jiesuan">' + tranList[i].lottery_status + '</div>' +
                                            '</li>'
                                    }
                                    $('.gameRowInfo ul').html(html);
                                    showNum();

                                    jiesuan();
                                } else {
                                    $('.gameRowInfo ul').html(data.message);
                                    $('.gameRowInfo ul ').css(css)
                                }
                            }
                        })
                    }
                });

            } else {
                $('.gameRowInfo ul').html('暂无数据');
                $('.gameRowInfo ul ').css(css)
            }
        });
    $('.tranBtn').on('click', function () {
        sTime = $('#time1').val();
        eTime = $('#time2').val();
        var _data = {
            'member_id': member_id,
            'start_time': sTime,
            'end_time': eTime,
        };
        if (lottery_uuid != '0') {//
            _data.lottery_uuid = lottery_uuid
        }
        if (lottery_status != '0') {
            _data.lottery_status = lottery_status
        }
        if (sTime == '') {
            $.Msg('请选择开始日期', {
                    offset: '150px',
                    anim: 1
                }
            );
        } else if (eTime == '') {
            $.Msg('请选择结束日期', {
                    offset: '150px',
                    anim: 1
                }
            );
        } else {
            getJson(
                'post',
                '/officialorders/officialorders/getOrderRecord?c=Officialorders&a=getOrderRecord',
                _data,
                function (data) {
                    // console.log('查询投注记录+getOrderRecord?c=Officialorders&a=getOrderRecord');
                    // console.log(data.data);
                    if (data.code == 1) {
                        var orderList = data.data.data;
                        var html = '';
                        for (var i = 0; i < orderList.length; i++) {
                            html += '<li>' +
                                // '<div style="width:20%">' + orderList[i].indent_id + '</div>' +
                                '<div style="width:20%">' + orderList[i].action_time + '</div>' +
                                '<div style="width:12%">' + orderList[i].lottery_name + '</div>' +
                                '<div style="width:26%;cursor: pointer" class="showNum">' + orderList[i].action_data + '@' + orderList[i].code_list + '</div>' +
                                '<div style="width:10%">' + orderList[i].action_coin + '</div>' +
                                '<div style="width:12%">' + orderList[i].action_no + '</div>' +
                                '<div style="width:10%">' + orderList[i].bonus + '</div>' +
                                '<div style="width:10%" class="jiesuan">' + orderList[i].lottery_status + '</div>' +
                                '</li>'
                        }
                        $('.gameRowInfo ul').html(html);
                        showNum();
                        jiesuan();

                        //分页插件
                        var totalPage = data.last_page;
                        $('.M-box1').pagination({
                            pageCount: data.data.last_page,
                            totalData: totalPage,
                            showData: data.data.per_page,
                            coping: true,
                            callback: function (data) {
                                _data.page = data.getCurrent();
                                $.ajax({
                                    url: baseurl + "/officialorders/officialorders/getOrderRecord?c=Officialorders&a=getOrderRecord",//请求地址
                                    dataType: "json",//数据格式
                                    type: "post",//请求方式
                                    async: false,//是否异步请求
                                    data: _data,
                                    success: function (data) {
                                        // console.log('查询之后点击分页+getOrderRecord?c=Officialorders&a=getOrderRecord');
                                        // console.log(data);
                                        if (data.code == 1) {
                                            var tranList = data.data.data;
                                            var html = '';
                                            for (var i = 0; i < tranList.length; i++) {
                                                html += '<li>' +
                                                    // '<div style="width:20%">' + orderList[i].indent_id + '</div>' +
                                                    '<div style="width:20%">' + tranList[i].action_time + '</div>' +
                                                    '<div style="width:12%">' + tranList[i].lottery_name + '</div>' +
                                                    '<div style="width:26%;cursor: pointer" class="showNum">' + tranList[i].action_data + '@' + tranList[i].code_list + '</div>' +
                                                    '<div style="width:10%">' + tranList[i].action_coin + '</div>' +
                                                    '<div style="width:12%">' + tranList[i].action_no + '</div>' +
                                                    '<div style="width:10%">' + tranList[i].bonus + '</div>' +
                                                    '<div style="width:10%" class="jiesuan">' + tranList[i].lottery_status + '</div>' +
                                                    '</li>'
                                            }
                                            $('.gameRowInfo ul').html(html);
                                            showNum();
                                            jiesuan();
                                        } else {
                                            $('.gameRowInfo ul ').html(data.message);
                                            $('.gameRowInfo ul ').css(css)
                                        }
                                    }
                                })
                            }
                        });
                    } else {
                        $('.M-box1').hide();
                        $('.gameRowInfo ul ').html(data.message);
                        $('.gameRowInfo ul ').css(css)
                    }
                });
        }
    });
});

