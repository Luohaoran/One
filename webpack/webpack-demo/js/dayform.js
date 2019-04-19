$(window).load(function () {
    var main = $(window.parent.document).find("#main");
    var thisheight = $('.dayformInfo').outerHeight(true) + 10;
    if (thisheight < 750) {
        main.height(750);
    } else {
        main.height(thisheight);
        $(window.parent.document).find('.containerInfo').height(thisheight);
        $(window.parent.document).find('.container').height(thisheight);
        $(window.parent.document).find('.userNav').height(thisheight);
    }
});

var sTime = '';//开始时间
var eTime = '';//结束时间
var close_type = -1;//是否结算
var lottery_id = -1;//彩种
var proloss = ''//盈亏



$('.userType').hover(function () {
    $(this).find('ul').show();
}, function () {
    $(this).find('ul').hide();
});
$('.userType').on('click', 'ul li', function () {
    var user_type = $(this).attr('user-type');
    var text = $(this).html();
    $('#lotteryType').text(text);
    $('.userType ul').hide();
})

//获取日度报表
getJson(
    'post',
    '/agent/agent/dailyReport?c=Agent&a=dailyReport',
    {
        'member_id': member_id,
    },
    function (data) {
    if (data.code == 1) {
        var dataList = data.data;
        var html = '';
        $.each(dataList,function (i,item) {
            html += '<li>' +
                '<div style="width:20%">' + item.time + '</div>' +
                '<div style="width:20%">' + item.action_coin + '￥' + '</div>' +
                '<div style="width:20%">' + item.win_amount +'￥' +  '</div>' +
                '<div style="width:20%">' + item.back_water + '</div>' +
                '<div style="width:20%">' + item.profit_loss + '￥' + '</div>' +
                '</li>'
        });
        $('.gameRowInfo ul').html(html);
    } else {
        $('.gameRowInfo ul li').html(data.message);
        $('.gameRowInfo ul li').css('text-align', 'center')
    }
},
    function (err) {
        // console.log(err)
    });

//点击查询按钮查询
$('.tranBtn').on('click', function () {
    sTime=$('#time1').val();
    eTime=$('#time2').val();
    if (sTime=='') {
        layer.msg('请选择开始日期', {
                offset: '150px',
                anim: 1
            }
        );
    } else if (eTime=='') {
        layer.msg('请选择结束日期', {
                offset: '150px',
                anim: 1
            }
        );
    } else {
        getJson(
            'post',
            '/agent/agent/dailyReport?c=Agent&a=dailyReport',
            {
                'member_id': member_id,
                'start_time': sTime,
                'end_time': eTime,
            },
            function (data) {
            if (data.code == 1) {
                var dataList = data.data;
                // console.log(dataList);
                var html = '';
                $.each(dataList,function (i,item) {
                    html += '<li>' +
                        '<div style="width:20%">' + ((i==dataList.length-1)?(item.total):(item.time)) + '</div>' +
                        '<div style="width:20%">' + item.action_coin + '￥' + '</div>' +
                        '<div style="width:20%">' + item.win_amount +'￥' +  '</div>' +
                        '<div style="width:20%">' + item.back_water + '</div>' +
                        '<div style="width:20%">' + item.profit_loss + '￥' + '</div>' +
                        '</li>'
                });
                $('.gameRowInfo ul').html(html);
            } else {
                $('.gameRowInfo ul li').html(data.message);
                $('.gameRowInfo ul li').css('text-align', 'center')
            }
        });
    }
});
