var mjmjid = $('.mjmjid').text();
localStorage.setItem('mjmjid', mjmjid);
var mjmjrandom = $('.mjmjrandom').text();
localStorage.setItem('mjmjrandom', mjmjrandom);


$(function () {
    //设置常用彩种
    $('#setLobby').on('click', function () {
        $('.lobbyCutBox').show();
        getJson(
            'post',
            '/lotterytype/lotterytype/recommendLottery?c=Lotterytype&a=recommendLottery',
            {
                'user_id': member_id,
            },
            function (data) {
                if (data.code == 1) {
                    var lotteryList = data.data[1];
                    var _html = '';
                    $.each(lotteryList, function (i, item) {
                        _html += '<li lottery-uuid="' + item.lottery_uuid + '"  class="' + ((item.recom === 2) ? ('hot') : ('cold')) + '" lottery-id="' + item.pid + '" id="' + item.id + '">' + item.lottery_name + '</li>';
                    });
                    $('.lobbyCutSlide ul').html(_html);//设置菜单左侧
                    $('.lobbyCutSlide ul li').each(function () {//用左侧导航彩种遍历设置界面彩种，如果有就打开开关
                        var id = $(this).attr('id');
                        $('.lobbyCutListInfo ul li .lobbyCutListBox span').each(function () {
                            // $(this).children().remove();
                            var _id = $(this).attr('id');
                            if (_id === id) {//通过id判定
                                $(this).prev().removeClass('close1').addClass('open1')
                                $(this).prev().children('div').addClass('open2')
                            }
                        })
                    });
                }
            });
    });
    $('.closeCutList').on('click', function () {
        $('.lobbyCutBox').hide();
    });

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function leftclick() {//左侧点击事件
        $('.lobbySlide ul li').on('click', function () {//点击切换彩种改变样式
            $('.lobbySlide ul li').removeClass('lobbyNavActive');
            $('.lobbySlide ul li').find('.lineT').addClass('none');
            $(this).addClass('lobbyNavActive');
            $(this).find('.lineT').removeClass('none');
            //判断彩种id,更换iframe彩种页面
            var lottery_id = $('.lobbyNavActive').attr('lottery-id');
            var uuid = $('.lobbyNavActive').attr('lottery-uuid');
            var id = $('.lobbyNavActive').attr('id');
            if (lottery_id == 1) {
                $('#main').attr('src', 'ssc.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            if (lottery_id == 2) {
                $('#main').attr('src', 'k3.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            if (lottery_id == 3) {
                $('#main').attr('src', 'g11x5.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            if (lottery_id == 7) {
                $('#main').attr('src', 'pk10.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
        })
    }

    var lottery_id = getQueryString('lottery-id');

    var uuid = getQueryString('uuid');

    var id = getQueryString('id');

    var way = getQueryString('way');



    $('.closeSlide ').on('click', function () {//左侧菜单栏打开关闭
        $('.lobbySlide').css({
            'left': '-30%',
            'transition': 'all .3s linear'
        })
        $('.bar-show').css({
            'left': '-5px',
            'transition': 'all .3s linear'
        })
    });
    $('.bar-show').on('click', function () {
        $('.lobbySlide').css({
            'left': '6%',
            'transition': 'all .3s linear'
        })
        $('.bar-show').css({
            'left': '-100px',
            'transition': 'all .3s linear'
        })
    })


    if (lottery_id == '' || uuid == '' || id == '') {
        return
    } else {
        if (way == 'all') {
            if (lottery_id == 1) {
                $('#main').attr('src', 'ssc.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            if (lottery_id == 2) {
                $('#main').attr('src', 'k3.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            if (lottery_id == 3) {
                $('#main').attr('src', 'g11x5.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            if (lottery_id == 7) {
                $('#main').attr('src', 'pk10.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }


            getJson(
                'post',
                '/lotterytype/lotterytype/recommendLottery?c=Lotterytype&a=recommendLottery',
                {
                    'user_id': member_id,
                },
                function (data) {
                    if (data.code == 1) {
                        var lotteryList = data.data[0];
                        var html = '';
                        for (var i = 0; i < lotteryList.length; i++) {
                            html += '<li class="relative" lottery-uuid="' + lotteryList[i].lottery_uuid + '" id="' + lotteryList[i].id + '" lottery-id="' + lotteryList[i].pid + '">' +
                                '<span class="lineT absolute none"></span>' + lotteryList[i].lottery_name + '<span class="' + ((lotteryList[i].recom === 2) ? ('tip') : ('notip')) + ' absolute inline"></span>' +
                                '</li>'
                        }
                        $('.lobbySlide ul').append(html);
                        $('.lobbySlide ul li').eq(0).addClass('lobbyNavActive');
                        $('.lobbySlide ul li').each(function () {//设置页面跳转时  左侧导航栏高亮
                            if ($(this).attr('lottery-uuid') == uuid) {
                                $(this).addClass('lobbyNavActive');
                                $(this).siblings().removeClass('lobbyNavActive')
                            }
                        })

                        $('.lobbySlide ul li').on('click', function () {//点击切换彩种改变样式
                            $('.lobbySlide ul li').removeClass('lobbyNavActive');
                            $('.lobbySlide ul li').find('.lineT').addClass('none');
                            $(this).addClass('lobbyNavActive');
                            $(this).find('.lineT').removeClass('none');


                            //判断彩种id,更换iframe彩种页面
                            var lottery_id = $(this).attr('lottery-id');
                            var id = $(this).attr('id');
                            var uuid = $(this).attr('lottery-uuid');
                            if (lottery_id == 1) {
                                $('#main').attr('src', 'ssc.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                            }
                            if (lottery_id == 2) {
                                $('#main').attr('src', 'k3.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                            }
                            if (lottery_id == 3) {
                                $('#main').attr('src', 'g11x5.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                            }
                            if (lottery_id == 7) {
                                $('#main').attr('src', 'pk10.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                            }
                        })
                    }
                });
        } else {
            //数据不为空时执行
            //获取推荐彩种
            getJson(
                'post',
                '/lotterytype/lotterytype/recommendLottery?c=Lotterytype&a=recommendLottery',
                {
                    'user_id': member_id,
                },
                function (data) {
                    if (data.code == 1) {
                        var lotteryList = data.data[0];
                        var html = '';
                        for (var i = 0; i < lotteryList.length; i++) {//这一步设置自己选中的常用彩种
                            html += '<li class="relative" lottery-uuid="' + lotteryList[i].lottery_uuid + '" id="' + lotteryList[i].id + '" lottery-id="' + lotteryList[i].pid + '">' +
                                '<span class="lineT absolute none"></span>' + lotteryList[i].lottery_name + '<span class="' + ((lotteryList[i].recom === 2) ? ('tip') : ('notip')) + ' absolute inline"></span>' +
                                '</li>'
                        }

                        var _html = ''
                        $.each(lotteryList, function (i, item) {
                            _html += '<li lottery-uuid="' + item.lottery_uuid + '"  class="' + ((item.recom === 2) ? ('hot') : ('cold')) + '" lottery-id="' + item.pid + '" id="' + item.id + '">' + item.lottery_name + '</li>';
                        });
                        $('.lobbyCutSlide ul').html(_html);


                        $('.lobbySlide ul').append(html);
                        $('.lobbySlide ul li').eq(0).addClass('lobbyNavActive');
                        $('.lobbySlide ul li').eq(0).find('.lineT').removeClass('none');
                        var lottery_id = $('.lobbyNavActive').attr('lottery-id');
                        var id = $('.lobbyNavActive').attr('id');
                        var uuid = $('.lobbyNavActive').attr('lottery-uuid');
                        if (lottery_id == 1) {
                            $('#main').attr('src', 'ssc.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                        }
                        if (lottery_id == 2) {
                            $('#main').attr('src', 'k3.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                        }
                        if (lottery_id == 3) {
                            $('#main').attr('src', 'g11x5.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                        }
                        if (lottery_id == 7) {
                            $('#main').attr('src', 'pk10.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                        }
                        leftclick()
                        // $('.lobbySlide ul li').on('click', function () {//点击切换彩种改变样式;
                        //     $('.lobbySlide ul li').removeClass('lobbyNavActive');
                        //     $('.lobbySlide ul li').find('.lineT').addClass('none');
                        //     $(this).addClass('lobbyNavActive');
                        //     $(this).find('.lineT').removeClass('none');
                        //     //判断彩种id,更换iframe彩种页面
                        //     var lottery_id = $('.lobbyNavActive').attr('lottery-id');
                        //     var id = $('.lobbyNavActive').attr('id');
                        //     var uuid = $('.lobbyNavActive').attr('lottery-uuid');
                        //
                        //     if (lottery_id == 1) {
                        //         $('#main').attr('src', 'ssc.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid);
                        //     }
                        //     if (lottery_id == 2) {
                        //         $('#main').attr('src', 'k3.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid);
                        //     }
                        //     if (lottery_id == 3) {
                        //         $('#main').attr('src', 'g11x5.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                        //     }
                        //     if (lottery_id == 7) {
                        //         $('#main').attr('src', 'pk10.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                        //     }
                        // });
                    }
                });
        }
        //获取所有彩种类别
        var html3 = '';
        var wayList = JSON.parse(localStorage.getItem('lottery'));
        for (var w = 0; w < wayList.length; w++) {
            html3 += '<li class="clear" id="' + wayList[w].id + '">' +
                '<div class="lobbyCutListName">' + wayList[w].lottery_name + '</div>' +
                '<div class="lobbyCutListBox">'
            for (var m = 0; m < wayList[w].childData.length; m++) {
                html3 += '<div class="lobbyCutListDes">' +
                    '<div class="div1 close1">' +
                    '<div class="div2"></div>' +
                    '</div>' +
                    '<span lottery-uuid="' + wayList[w].childData[m].lottery_uuid + '" order="' + wayList[w].childData[m].order + '" class="' + ((wayList[w].childData[m].recom === 2) ? ('fiery') : ('nofiery')) + ' ' + ((wayList[w].childData[m].recom === 1) ? ('recom') : ('norecom')) + '" lottery-id="' + wayList[w].childData[m].pid + '" id="' + wayList[w].childData[m].id + '">' + wayList[w].childData[m].lottery_name + '</span>' +
                    '</div>'
            }
            html3 += '</div>'
            html3 += '</li>'
        }
        $('.lobbyCutListInfo ul').html(html3);


        //选择常用彩种
        $('.div1').on('click', function () {//这一步添加到设置页面左边
            var ol = $('.open1').length;
            if (ol > 6 && ($(this).hasClass('close1'))) {
                $.Msg('您最多只能选择七个常玩彩种')
            } else {
                if ($(this).hasClass('open1')) {//判断是否被选中
                    $(this).removeClass('open1').addClass('close1')
                    $(this).find('.div2').removeClass('open2');
                    var id = $(this).next().attr('id');
                    $('#' + id).remove();
                    //移除当常玩栏的前彩种
                } else {
                    var html = '';
                    $(this).addClass('open1').removeClass('close1');
                    $(this).find('.div2').addClass('open2');
                    var className = '';
                    if ($(this).next().hasClass('fiery')) {
                        className = 'hot'
                    } else {
                        className = 'cold'
                    }
                    var id = $(this).next().attr('id');
                    var lottery_id = $(this).next().attr('lottery-id');
                    var uuid = $(this).next().attr('lottery-uuid');
                    var lname = $(this).next().text();
                    html += '<li lottery-uuid="' + uuid + '"  class="' + className + '" lottery-id="' + lottery_id + '" id="' + id + '">' + lname + '</li>';
                    $('.lobbyCutSlide ul').append(html);
                }
            }
        });
        $('.okBtn').on('click', function () {//这一步确定之后放到侧边导航
            var html = '';
            var order = '';//
            $('.lobbyCutSlide ul li').each(function () {//遍历选中数据添加到左侧
                order = order + $(this).attr('lottery-uuid') + ',';
                var classname = $(this).prop('className') + 's';
                var lottery_id = $(this).attr('lottery-id');
                var id = $(this).attr('id');
                var uuid = $(this).attr('lottery-uuid');
                var loname = $(this).html();
                html += '<li class="relative ' + classname + '" lottery-uuid="' + uuid + '" id="' + id + '" lottery-id="' + lottery_id + '">' +
                    '<span class="lineT absolute none"></span>' + loname + '<span class="' + ((classname === 'hots') ? ('tip') : ('')) + ' absolute inline"></span>' +
                    '</li>'
            });
            var _order = order.substr(0, order.length - 1);//这是自己设置的常玩彩种（最后一个逗号截取）
            $('.lobbySlide ul').prepend(html);
            $('.lobbyCutBox').hide();//隐藏设置盒子

            _getJson(//更新彩种排序
                'post',
                '/lotterytype/setLottery?from_station=only_port',
                {
                    'user_id': member_id,
                    'order': _order
                },
                function (data) {
                    if (data.code == 1) {
                        getJson(
                            'post',
                            '/lotterytype/lotterytype/recommendLottery?c=Lotterytype&a=recommendLottery',
                            {
                                'user_id': member_id,
                            },
                            function (data) {//更新成功之后修改左侧导航
                                var lotteryList = data.data[0];
                                var html = '';
                                for (var i = 0; i < lotteryList.length; i++) {
                                    html += '<li class="relative" lottery-uuid="' + lotteryList[i].lottery_uuid + '" id="' + lotteryList[i].id + '" lottery-id="' + lotteryList[i].pid + '">' +
                                        '<span class="lineT absolute none"></span>' + lotteryList[i].lottery_name + '<span class="' + ((lotteryList[i].recom === 2) ? ('tip') : ('notip')) + ' absolute inline"></span>' +
                                        '</li>'
                                }
                                $('.lobbySlide ul').html(html);
                                leftclick();
                            }
                        )
                    } else {

                    }
                }
            );

            //左侧元素去重
            var liArr = $('.lobbySlide ul li');
            var _liArr = $.uniq(liArr);
            $('.lobbySlide ul').html(_liArr)


            //元素限制在七个=
            $('.lobbySlide ul li').each(function (index, value) {
                if (index > 6) {
                    $(this).remove()
                }
            });


            $('.lobbySlide ul li').removeClass('lobbyNavActive');
            $('.lobbySlide ul li').find('.lineT').addClass('none');
            $('.lobbySlide ul li').eq(0).addClass('lobbyNavActive');
            $('.lobbySlide ul li').eq(0).find('.lineT').removeClass('none');
            var lottery_id = $('.lobbyNavActive').attr('lottery-id');
            var uuid = $('.lobbyNavActive').attr('lottery-uuid');
            var id = $('.lobbyNavActive').attr('id');
            if (lottery_id == 1) {
                $('#main').attr('src', 'ssc.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            if (lottery_id == 2) {
                $('#main').attr('src', 'k3.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            if (lottery_id == 3) {
                $('#main').attr('src', 'g11x5.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            if (lottery_id == 7) {
                $('#main').attr('src', 'pk10.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
            }
            $('.lobbySlide ul li').on('click', function () {//点击切换彩种改变样式
                $('.lobbySlide ul li').removeClass('lobbyNavActive');
                $('.lobbySlide ul li').find('.lineT').addClass('none');
                $(this).addClass('lobbyNavActive');
                $(this).find('.lineT').removeClass('none');
                //判断彩种id,更换iframe彩种页面
                var lottery_id = $('.lobbyNavActive').attr('lottery-id');
                var uuid = $('.lobbyNavActive').attr('lottery-uuid');
                var id = $('.lobbyNavActive').attr('id');
                if (lottery_id == 1) {
                    $('#main').attr('src', 'ssc.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                }
                if (lottery_id == 2) {
                    $('#main').attr('src', 'k3.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                }
                if (lottery_id == 3) {
                    $('#main').attr('src', 'g11x5.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                }
                if (lottery_id == 7) {
                    $('#main').attr('src', 'pk10.html?lottery-id=' + lottery_id + '&' + 'id=' + id + '&' + 'uuid=' + uuid)
                }
            })
        })

    }

});


