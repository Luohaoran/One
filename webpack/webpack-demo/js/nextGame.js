$(window).load(function () {
    layui.use(['laydate', 'util', 'layer', 'form', 'table'], function () {//layui初始化
        var main = $(window.parent.document).find("#main");
        var thisheight = $('.nextGameInfo').outerHeight(true) + 10
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
        var lottery_uuid = '0';//彩种默认状态
        var lottery_status = '0';//是否结算
        var proloss = '';//盈亏
        var form=layui.form;
        function showNum() {//点击显示号码
            $('.showNum').on('click', function () {
                var num = $(this).text()
                var title = $(this).prev().prev().text();
                layer.alert('' + num + '', {
                    skin: 'layui-layer-molv' //样式类名
                    , closeBtn: 0,
                    title: '' + title + ''
                });
            });
        }
        var caizhongname = (localStorage.getItem('caizhongname'));
        $.each(JSON.parse(caizhongname), function (i, item) {
            $('#lottery').append(new Option(item.name, item.id))//遍历值添加到下拉列表
        });
        form.render();//刷新表单
        form.on('select(lottery)', function (data) {//监听彩种点击事件
            lottery_uuid = data.value;
        });
        form.on('select(lotteryType)', function (data) {//监听开奖状态点击事件
            lottery_status = data.value;
        })

//获取所有的游戏记录
        getJson(
            'post',
            '/agent/agent/gameRecord?c=Agent&a=gameRecord',
            {
                'member_id': member_id,
            },
            function (data) {
                if (data.code == 1) {
                    var dataList = data.data.data;
                    if (dataList.length>0){
                        var html = '';
                        $.each(dataList, function (index, item) {
                            html += '<li>' +
                                '<div style="width:14%">' + item.create_at + '</div>' +
                                '<div style="width:11%">' + item.nickname + '</div>' +
                                '<div style="width:8%">' + item.lottery_name + '</div>' +
                                '<div style="width:20%">' + item.action_data + '</div>' +
                                '<div style="width:12%">' + item.action_no + '</div>' +
                                '<div style="width:13%;cursor: pointer" class="showNum">' + item.code_list + '</div>' +
                                '<div style="width:9%">' + item.action_coin + '</div>' +
                                '<div style="width:5%">' + 1 + '</div>' +
                                '<div style="width:8%">' + ((item.lottery_name_status === 1) ? ('未开奖') : ((item.lottery_name_status === 2)?('已开奖'):('已撤单'))) + '</div>' +
                                '</li>'
                        });
                        $('.gameRowInfo ul').html(html);
                        showNum();
                        var totalPage = data.last_page;
                        $('.M-box1').pagination({
                            pageCount: data.data.last_page,
                            totalData: totalPage,
                            showData: data.data.per_page,
                            coping: true,
                            callback: function (data) {
                                var page = data.getCurrent();
                                $.ajax({
                                    url: baseurl + "/agent/agent/gameRecord?c=Agent&a=gameRecord",//请求地址
                                    dataType: "json",//数据格式
                                    type: "post",//请求方式
                                    async: false,//是否异步请求
                                    data: {
                                        'member_id': member_id,
                                        'page': page,
                                    },
                                    success: function (data) {
                                        if (data.code == 1) {
                                            var dataList = data.data.data;
                                            var html = '';
                                            $.each(dataList, function (index, item) {
                                                html += '<li>' +
                                                    '<div style="width:14%">' + item.create_at + '</div>' +
                                                    '<div style="width:11%">' + item.nickname + '</div>' +
                                                    '<div style="width:8%">' + item.lottery_name + '</div>' +
                                                    '<div style="width:20%">' + item.action_data + '</div>' +
                                                    '<div style="width:12%">' + item.action_no + '</div>' +
                                                    '<div style="width:13%;cursor: pointer" class="showNum">' + item.code_list + '</div>' +
                                                    '<div style="width:9%">' + item.action_coin + '</div>' +
                                                    '<div style="width:5%">' + 1 + '</div>' +
                                                    '<div style="width:8%">' + ((item.status == 1) ? ('未开奖') : ('开奖')) + '</div>' +
                                                    '</li>'
                                            });
                                            $('.gameRowInfo ul').html(html);
                                        } else {
                                            $('.gameRowInfo ul ').html(data.message);
                                            $('.gameRowInfo ul ').css(css)
                                        }
                                    }
                                })
                            }
                        });
                    } else {
                        $('.gameRowInfo ul ').html('暂无数据');
                        $('.gameRowInfo ul ').css(css)
                    }

                } else {
                    $('.M-box1').hide();
                    $('.gameRowInfo ul ').html(data.message);
                    $('.gameRowInfo ul ').css(css)
                }
            })


        $('.tranBtn').on('click', function () {
            sTime = $('#time1').val();
            eTime = $('#time2').val();
            var username = $('#userN').val();//获取用户名

            if (username === '') {
                layer.msg('请输入下级用户名', {
                        offset: '150px',
                        anim: 1
                    }
                );
            } else if (sTime == '') {
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
                getJson(
                    'post',
                    '/agent/agent/gameRecord?c=Agent&a=gameRecord',
                    {
                        'member_id': member_id,
                        'start_time': sTime,
                        'end_time': eTime,
                        'lottery_uuid': lottery_uuid,
                        'status': lottery_status,
                        'username': username,
                    },
                    function (data) {
                        if (data.code == 1) {
                            var dataList = data.data.data;
                            var html = '';
                            $.each(dataList, function (index, item) {
                                html += '<li>' +
                                    '<div style="width:14%">' + item.create_at + '</div>' +
                                    '<div style="width:11%">' + item.nickname + '</div>' +
                                    '<div style="width:8%">' + item.lottery_name + '</div>' +
                                    '<div style="width:20%">' + item.action_data + '</div>' +
                                    '<div style="width:12%">' + item.action_no + '</div>' +
                                    '<div style="width:13%;cursor: pointer" class="showNum">' + item.code_list + '</div>' +
                                    '<div style="width:9%">' + item.action_coin + '</div>' +
                                    '<div style="width:5%">' + 1 + '</div>' +
                                    '<div style="width:8%">' + ((item.status == 1) ? ('未开奖') : ('开奖')) + '</div>' +
                                    '</li>'
                            });
                            $('.gameRowInfo ul').html(html);
                            showNum();
                            var totalPage = data.last_page;
                            $('.M-box1').pagination({
                                pageCount: data.data.last_page,
                                totalData: totalPage,
                                showData: data.data.per_page,
                                coping: true,
                                callback: function (data) {
                                    var page = data.getCurrent();
                                    $.ajax({
                                        url: baseurl + "/agent/agent/gameRecord?c=Agent&a=gameRecord",//请求地址
                                        dataType: "json",//数据格式
                                        type: "post",//请求方式
                                        async: false,//是否异步请求
                                        data: {
                                            'member_id': member_id,
                                            'start_time': sTime,
                                            'end_time': eTime,
                                            'lottery_uuid': lottery_uuid,
                                            'status': lottery_status,
                                            'username': username,
                                            'page': page,
                                        },
                                        success: function (data) {
                                            if (data.code == 1) {
                                                var dataList = data.data.data;
                                                var html = '';
                                                $.each(dataList, function (index, item) {
                                                    html += '<li>' +
                                                        '<div style="width:14%">' + item.create_at + '</div>' +
                                                        '<div style="width:11%">' + item.nickname + '</div>' +
                                                        '<div style="width:8%">' + item.lottery_name + '</div>' +
                                                        '<div style="width:20%">' + item.action_data + '</div>' +
                                                        '<div style="width:12%">' + item.action_no + '</div>' +
                                                        '<div style="width:13%;cursor: pointer" class="showNum">' + item.code_list + '</div>' +
                                                        '<div style="width:9%">' + item.action_coin + '</div>' +
                                                        '<div style="width:5%">' + 1 + '</div>' +
                                                        '<div style="width:8%">' + ((item.status == 1) ? ('未开奖') : ('开奖')) + '</div>' +
                                                        '</li>'
                                                });
                                                $('.gameRowInfo ul').html(html);
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
                    })
            }


        })
    });


});
