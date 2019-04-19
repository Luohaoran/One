//站内信
$(window).load(function () {
    var main = $(window.parent.document).find("#main");
    var thisheight = $('.noticeInfo').height() + 30;
    if (thisheight < 750) {
        main.height(750);
    } else {
        main.height(thisheight);
        $(window.parent.document).find('.containerInfo').height(thisheight);
        $(window.parent.document).find('.container').height(thisheight);
        $(window.parent.document).find('.userNav').height(thisheight);
    }
});

getJson(
    'post',
    '/member/member/getSms?c=Member&a=getSms',
    { 'member_id': member_id,
        'page': '',
        'pagesize': 10,
        'mjmjid': mjmjid,
        'mjmjrandom': mjmjrandom
    },
    function (data) {
        // console.log('站内信获取+getSms?c=Member&a=getSms');
        // console.log(data.data.data);
    if (data.code == 1) {
        var noticeList = data.data.data;
        // console.log(noticeList[0].info)
        var html = '';
        if (true) {
            $('.noticeRow').hide();
            $('.noR').show();
        } else {
            $('.noticeRow').show();
            $('.noR').hide();
            for (var i = 0; i < noticeList.length; i++) {
                html += '<li class="relative" type="' + noticeList[i].id + '" data-d="' + noticeList[i].status + '">' +
                    '<div class="relative noticeIconBox"><span class="noticeIcon inline absolute"></span></div>' +
                    '<div>' +
                    '<span class="noticeDt">' + noticeList[i].title + '</span>' +
                    '<span class="noticeDinfo none">' + noticeList[i].info + '</span>' +
                    '</div>' +
                    '</li>'
            }
            $('.noticeRow ul').html(html);
            $('.noticeRow ul li').each(function () {
                var data_d = $(this).attr('data-d');
                if (data_d == 2) {
                    $(this).find('.noticeIcon').addClass('yidu');//已读-图标隐藏
                }
                if (data_d == 1) {
                    $(this).find('.noticeIcon').removeClass('yidu');//未读-图标显示
                }

            });

            $('.noticeRow ul li').on('click', function () {
                $(this).find('.noticeIcon').addClass('yidu');
                var status = $(this).attr('data-d');
                $('.noticeLayer').show();
                var type = $(this).attr('type');//消息ID
                if (status == 1) {
                    return
                } else {
                    getJson(
                        'post',
                        '/member/member/getDetailsSms?c=Member&a=getDetailsSms',
                        {
                            'member_id': member_id,
                            'id': type,
                            'mjmjid': mjmjid,
                            'mjmjrandom': mjmjrandom
                        },
                        function (data) {
                        if (data.code == 1) {
                            $('.noticeDtitle').text(data.data.title);
                            $('.noticeId span').text(data.data.info);
                        } else {
                            // alert(data.message)
                            $.Msg(data.message)
                        }
                    })//上传已读
                }

            });

            //分页插件
            var totalPage = data.last_page;
            $('.M-box1').pagination({
                pageCount:data.data.last_page,
                totalData: totalPage,
                showData: data.data.per_page,
                coping: true,
                callback: function (data) {
                    var page = data.getCurrent();
                    $.ajax({
                        url: baseurl+"/member/member/getSms?c=Member&a=getSms",//请求地址
                        dataType: "json",//数据格式
                        type: "post",//请求方式
                        async: false,//是否异步请求
                        data: {
                            'member_id': member_id,
                            // 'start_time': sTime,
                            // 'end_time': eTime,
                            'page': page,
                            'pagesize': 10,
                            'mjmjid': mjmjid,
                            'mjmjrandom': mjmjrandom
                        },
                        success: function (data) {
                            // console.log('点击分页+getSms?c=Member&a=getSms');
                            // console.log(data.data.data);
                            if (data.code == 1) {
                                var noticeList = data.data.data;
                                var html1 = '';
                                if (noticeList == '') {
                                    $('.noticeRow').hide();
                                    $('.noR').show();
                                } else {
                                    $('.noticeRow').show();
                                    $('.noR').hide();
                                    for (var i = 0; i < noticeList.length; i++) {
                                        html1 += '<li class="relative" type="' + noticeList[i].id + '" data-d="' + noticeList[i].status + '">' +
                                            '<div class="relative noticeIconBox"><span class="noticeIcon inline absolute"></span></div>' +
                                            '<div>' +
                                            '<span class="noticeDt">' + noticeList[i].title + '</span>' +
                                            '<span class="noticeDinfo none">' + noticeList[i].info + '</span>' +
                                            '</div>' +
                                            '</li>'
                                    }
                                    $('.noticeRow ul').html(html1);
                                    $('.noticeRow ul li').each(function () {
                                        var data_d = $(this).attr('data-d');
                                        if (data_d == 2) {
                                            $(this).find('.noticeIcon').addClass('yidu');//已读图标隐藏
                                        } else {
                                            $(this).find('.noticeIcon').removeClass('yidu');//未读图标显示
                                        }
                                    });
                                    $('.noticeRow ul li').on('click', function () {
                                        $(this).find('.noticeIcon').addClass('yidu');
                                        var status = $(this).attr('data-d');
                                        $('.noticeLayer').show();
                                        var title = $(this).find('.noticeDt').text();
                                        var des = $(this).find('.noticeDinfo').text();
                                        var type = $(this).attr('type');
                                        $('.noticeDtitle').text(title);
                                        $('.noticeId span').text(des);

                                        if (status == 2) {
                                            return
                                        } else {
                                            getJson(
                                                'post',
                                                '/member/member/getDetailsSms?c=Member&a=getDetailsSms',
                                                {
                                                    'member_id': member_id,
                                                    'id': type,
                                                    'mjmjid': mjmjid,
                                                    'mjmjrandom': mjmjrandom
                                                },
                                                function (data) {
                                                    if (data.code == 1) {
                                                        $('.noticeDtitle').text(data.data.title);
                                                        $('.noticeId span').text(data.data.info);
                                                    } else {
                                                        $.Msg(data.message)

                                                    }
                                            })//上传已读
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            });

            $('.hideLayer').on('click', function () {
                $('.noticeLayer').hide();
            })
        }
    } else {
        $('.noticeRow').hide();
        $('.noR').show();
    }
});
