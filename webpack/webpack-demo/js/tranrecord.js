
$(function () {
    var main = $(window.parent.document).find("#main");
    var thisheight = $('.tranrecordInfo').height() + 30;
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
    var type = '7';//交易类型



    $('.tranType').hover(function () {
        $(this).find('ul').show();
    }, function () {
        $(this).find('ul').hide();
    });
    $('.tranType ul li').on('click', function () {
        var type = $(this).attr('type');
        var val = $(this).html();
        $('#tranType').text(val);
        $('#tranType').attr('type', type);
        $('.tranType ul').hide();
    });

    var tranRt=()=>{
        $('.tranRt').each(function () {
            var type = $(this).html();
            if (type == 1) {
                $(this).html('充值');
            }
            if (type == 2) {
                $(this).html('提现');
            }
            if (type == 3) {
                $(this).html('下注');
            }
            if (type == 4) {
                $(this).html('奖金');
            }
            if (type == 5) {
                $(this).html('返水');
            }
            if (type == 6) {
                $(this).html('已撤单');
            }
            if (type == 7) {
                $(this).html('全部');
            }
        });
    };


    var data;
    if (type=='7'){//判断选中的是不是全部，是全部的话就不传type字段
        data={
            'member_id': member_id,
        }
    }
    getJson(
        'post',
        '/member/member/dealRecord?c=Member&a=dealRecord',
        data,
        function (data) {
            // console.log('流水数据获取+dealRecord?c=M ember&a=dealRecord');
            // console.log(data);
            if (data.code == 1) {
                var tranList = data.data.data;
                if (tranList == '') {
                    $('.tranrecordRow ul').html('')
                } else {
                    var html = '';
                    for (var i = 0; i < tranList.length; i++) {
                        html += '<li>' +
                            '<div>' + tranList[i].create_at + '</div>' +
                            '<div class="tranRt">' + tranList[i].type + '</div>' +
                            '<div>' + tranList[i].before_operate + '</div>' +
                            '<div>' + tranList[i].coin + '</div>' +
                            '<div>' + tranList[i].after_operate + '</div>' +
                            '</li>'
                    }
                    $('.tranrecordRow ul').html(html);
                    // form.render();//刷新表单
                    form.on('select(lotteryTypes)', function (data) {//监听彩种点击事件
                        type = data.value;
                    });
                    tranRt();
                    //分页插件
                    var totalPage = data.last_page;
                    $('.M-box1').pagination({
                        pageCount:data.data.last_page,
                        totalData: totalPage,
                        showData: data.data.per_page,
                        coping: true,
                        callback: function (data) {
                            var page = data.getCurrent();
                            // console.log('页码'+page);
                            $.ajax({
                                url: baseurl+"/member/member/dealRecord?c=Member&a=dealRecord",//请求地址
                                dataType: "json",//数据格式
                                type: "post",//请求方式/member/member/dealRecord?c=Member&a=dealRecord
                                async: false,//是否异步请求
                                data: {
                                    'member_id': member_id,
                                    'type': type,
                                    'page': page,
                                    'pagesize': data.per_page,
                                },
                                success: function (data) {
                                    if (data.code == 1) {
                                        var tranList = data.data.data;
                                        var html = '';
                                        for (var i = 0; i < tranList.length; i++) {
                                            html += '<li>' +
                                                '<div>' + tranList[i].create_at + '</div>' +
                                                '<div class="tranRt">' + tranList[i].type + '</div>' +
                                                '<div>' + tranList[i].before_operate + '</div>' +
                                                '<div>' + tranList[i].coin + '</div>' +
                                                '<div>' + tranList[i].after_operate + '</div>' +
                                                '</li>'
                                        }

                                        $('.tranrecordRow ul').html(html);
                                        $('.tranRt').each(function () {
                                            var type = $(this).html();
                                            if (type == 1) {
                                                $(this).html('充值');
                                            }
                                            if (type == 2) {
                                                $(this).html('提现');
                                            }
                                            if (type == 3) {
                                                $(this).html('下注');
                                            }
                                            if (type == 4) {
                                                $(this).html('奖金');
                                            }
                                            if (type == 5) {
                                                $(this).html('返水');
                                            }
                                            if (type == 6) {
                                                $(this).html('已撤单');
                                            }
                                            if (type == 7) {
                                                $(this).html('全部');
                                            }
                                        })
                                    }else{
                                        $('.tranrecordRow ul ').html(data.message);
                                        $('.tranrecordRow ul ').css({
                                            'text-align': 'center',
                                            'font-size': '18px',
                                            'color': '#0000004d',
                                            'padding': '10px 0 10px 0'
                                        })
                                    }
                                }
                            })
                        }
                    });
                }
            }else{
                $('.tranrecordRow ul ').html(data.message);
                $('.tranrecordRow ul ').css({
                    'text-align': 'center',
                    'font-size': '18px',
                    'color': '#0000004d',
                    'padding': '10px 0 10px 0'
                })
            }
        })
    $('.tranBtn').on('click', function () {
        var _data={};
        sTime = $('#time1').val();
        eTime = $('#time2').val();
        // type = $('#tranType').attr('type');
        if (type=='7    ') {
            _data={
                'member_id': member_id,
                'start_time': sTime,
                'end_time': eTime,
            }
        }else {
            _data={
                'member_id': member_id,
                'start_time': sTime,
                'end_time': eTime,
                'type':type
            }
        }
        {
            getJson(
                'post',
                '/member/member/dealRecord?c=Member&a=dealRecord',
                _data,
                function (data) {
                    // console.log('点击查询+dealRecord?c=Member&a=dealRecord');
                    // console.log(data);
                    if (data.code == 1) {
                        var tranList = data.data.data;
                        var html = '';
                        for (var i = 0; i < tranList.length; i++) {
                            html += '<li>' +
                                '<div>' + tranList[i].create_at + '</div>' +
                                '<div class="tranRt">' + tranList[i].type + '</div>' +
                                '<div>' + tranList[i].before_operate + '</div>' +
                                '<div>' + tranList[i].coin + '</div>' +
                                '<div>' + tranList[i].after_operate + '</div>' +
                                '</li>'
                        }
                        $('.tranrecordRow ul').html(html);
                        $('.tranRt').each(function () {
                            var type = $(this).html();
                            if (type == 1) {
                                $(this).html('充值');
                            }
                            if (type == 2) {
                                $(this).html('提现');
                            }
                            if (type == 3) {
                                $(this).html('下注');
                            }
                            if (type == 4) {
                                $(this).html('奖金');
                            }
                            if (type == 5) {
                                $(this).html('返水');
                            }
                            if (type == 6) {
                                $(this).html('已撤单');
                            }
                            if (type == 7) {
                                $(this).html('全部');
                            }
                        });
                        //分页插件
                        var totalPage = data.last_page;
                        $('.M-box1').pagination({
                            pageCount: data.data.last_page,
                            totalData: totalPage,
                            showData: data.data.per_page,
                            coping: true,
                            callback: function (data) {
                                var page = data.getCurrent();
                                if (type==7) {
                                    _data={
                                        'member_id': member_id,
                                        'start_time': sTime,
                                        'end_time': eTime,
                                    }
                                }else {
                                    _data={
                                        'member_id': member_id,
                                        'start_time': sTime,
                                        'end_time': eTime,
                                        'type':type,
                                        'page': page,
                                    }
                                }
                                $.ajax({
                                    url: baseurl+"/member/member/dealRecord?c=Member&a=dealRecord",//请求地址
                                    dataType: "json",//数据格式
                                    type: "post",//请求方式
                                    async: false,//是否异步请求
                                    data:_data,
                                    success: function (data) {
                                        if (data.code == 1) {
                                            $('.M-box1').show()
                                            var tranList = data.data.data;
                                            var html = '';
                                            for (var i = 0; i < tranList.length; i++) {
                                                html += '<li>' +
                                                    '<div>' + tranList[i].create_at + '</div>' +
                                                    '<div class="tranRt">' + tranList[i].type + '</div>' +
                                                    '<div>' + tranList[i].before_operate + '</div>' +
                                                    '<div>' + tranList[i].coin + '</div>' +
                                                    '<div>' + tranList[i].after_operate + '</div>' +
                                                    '</li>'
                                            }
                                            $('.tranrecordRow ul').html(html);
                                            $('.tranRt').each(function () {
                                                var type = $(this).html();
                                                if (type == 1) {
                                                    $(this).html('充值');
                                                }
                                                if (type == 2) {
                                                    $(this).html('提现');
                                                }
                                                if (type == 3) {
                                                    $(this).html('下注');
                                                }
                                                if (type == 4) {
                                                    $(this).html('奖金');
                                                }
                                                if (type == 5) {
                                                    $(this).html('返水');
                                                }
                                                if (type == 6) {
                                                    $(this).html('已撤单');
                                                }
                                                if (type == 7) {
                                                    $(this).html('全部');
                                                }
                                            })
                                        }else{
                                            $('.M-box1').hide()
                                            $('.tranrecordRow ul ').html(data.message);
                                            $('.tranrecordRow ul ').css({
                                                'text-align': 'center',
                                                'font-size': '18px',
                                                'color': '#0000004d',
                                                'padding': '10px 0 10px 0'
                                            })
                                        }
                                    }
                                })
                            }
                        });
                    }else{
                        $('.M-box1').hide()
                        $('.tranrecordRow ul ').html(data.message);
                        $('.tranrecordRow ul ').css({
                            'text-align': 'center',
                            'font-size': '18px',
                            'color': '#0000004d',
                            'padding': '10px 0 10px 0'
                        })
                    }
                })
        }

    })
});


