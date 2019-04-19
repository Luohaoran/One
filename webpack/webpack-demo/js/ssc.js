$(window).load(function () {
    var caizhongname = JSON.parse(localStorage.getItem("caizhongname"));//获取所有彩种信息
    var fdSmall = 0,//返点最小值
        fdBig = 0,//返点最大值
        jjinSmall = 0,//奖金最小值——对应返点最小值
        jjinBig = 0,//奖金最大值——对应返点最大值
        lastJjin = 0;//变化后的奖金

    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            addTouzhu();
            $('#playInfoNumIn').val('');
        }
    }


    function roll(t) {
        var ul1 = document.getElementById("ul1");
        var ul2 = document.getElementById("ul2");
        var box = document.getElementById("box");
        ul2.innerHTML = ul1.innerHTML;
        box.scrollTop = 0;
        var timer = setInterval(rollStart, t);
    }
    function rollStart() {
        if (box.scrollTop >= ul1.scrollHeight) {
            box.scrollTop = 0;
        } else {
            box.scrollTop++;
        }
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var lottery_id = getQueryString('lottery-id');
    var uuid = getQueryString('uuid');
    var id = getQueryString('id');
    $.getHistory(member_id, uuid);
    // var logo = $('#lotteryLogo');//玩法logo设置
    var waiId = $('.playInfoTypeInfoA').attr('id');
    $('#lotteryLogo').attr('lt', '' + uuid + '');
    // logo.attr('src', '/assets/img/' + uuid + '.png');
    if (lottery_id == '' || uuid == '' || id == '') {
        return;
    } else {
        //获取页面高度
        function getH() {
            $('#touzhuBs').val(1);//投注倍数默认是1位
            var main = $(window.parent.document).find("#main");
            var thisheight = $('.lotteryInfo').outerHeight(true) + 10;
            //var thisheight = $('.lotteryInfo').height();
            if (thisheight < 750) {
                main.height(750);
            } else {
                main.height(thisheight);
                $(window.parent.document).find('.containerInfo').height(thisheight);
                $(window.parent.document).find('.container').height(thisheight);
                $(window.parent.document).find('.userNav').height(thisheight);
            }
        };

        //获取这次开奖和下注日期
        var nowTime, nextTime, caizName, countTime, kaijNum;//倒计时
        kaijiang();


        $('.coldHotBtn').on('click', function () {//遗漏冷热设置
            if ($(this).hasClass('showMCH')) {
                $(this).removeClass('showMCH');
                $('.lengre').hide()
            } else {
                $(this).addClass('showMCH');
                $('.lengre').show()
            }
        });
        $('.missBtn').on('click', function () {//遗漏冷热设置
            if ($(this).hasClass('showMCH')) {
                $(this).removeClass('showMCH');
                $('.yilou').hide()
            } else {
                $(this).addClass('showMCH');
                $('.yilou').show()
            }
        });

        $('.coldHotBox').hide();

        var newOpen = function () {//获取右侧历史开奖号码
            getJson(
                'post',
                '/openaward/openaward/newOpenaward?c=Openaward&a=newOpenAward',
                {
                    'member_id': member_id,
                    "lottery_uuid": uuid,
                },
                function (data) {
                    if (data.code == 1) {
                        var dataList = data.data;
                        var html = '';
                        for (var i = 0; i < dataList.length; i++) {
                            html += '<li>'
                            html += '<span class="rankDate inline" style="width:40%;">' + dataList[i].expect + '</span>'
                            html += '<span class="rankNum inline" style="width:60%;">'
                            for (var j = 0; j < dataList[i].open_code.length; j++) {
                                html += '<e>' + dataList[i].open_code[j] + '</e>'
                            }
                            html += '</span>'
                            // html += '<span class="longhu inline" style="width:20%;">' + '龙' + '</span>'
                            html += '</li>'
                        }
                        $('.moreLotteryRankInfoBox ul').html(html);
                    }
                });
        };
        newOpen();

        function interval(func, wait){
            var interv = function(){
                func.call(null);
                setTimeout(interv, wait);
            };
            setTimeout(interv, wait);
        }
        interval(function(){
            kaijiang();
        },5000);
        function kaijiang() {
            getJson(
                    'post',
                    '/getlotterytime/getlotterytime/getTime?c=Getlotterytime&a=getTime',
                    {
                        "lottery_uuid": uuid,
                        'member_id': member_id,
                    },
                    function (data) {
                        if (data.code == 1) {
                            var kaijList = data.data;
                            nowTime = kaijList.currExpect;//开奖期数
                            nextTime = kaijList.lastExpect;//投注期数
                            caizName = kaijList.lottery_naem;
                            kaijNum = kaijList.opencode;//开奖号码
                            time = kaijList.remainTime;//倒计时
                            $('.lotteryQishu span').text(nextTime);
                            $('.lotteryNumQishu span').text(nowTime);
                            var lw = $('.lotteryNumInfo2 ul li').width();
                            var ll = $('.lotteryNumInfo2 ul li').length;
                            $('.lotteryNumInfo2').width(ll * (lw + 10));
                            if (kaijNum == '' || kaijNum == null) {
                                $('.lotteryNumInfo ul li').html('')
                                $('.lotteryNumInfo ul li').addClass('num_gif')
                            } else {
                                var html = '';
                                for (var i = 0; i < kaijNum.length; i++) {
                                    html += '<li>' + kaijNum[i] + '</li>'
                                }
                                $('.lotteryNumInfo2 ul').html(html);
                                lw = $('.lotteryNumInfo2 ul li').width();
                                ll = $('.lotteryNumInfo2 ul li').length;
                                $('.lotteryNumInfo2').width(ll * (lw + 10))
                            }
                        } else {
                            $.Msg(data.message, {})
                        }
                    })
        }
            $.formatSeconds(Number(time),//倒计时函数
                function (val) {
                    $('.bettingEndTime').html(val);
                    $('.endTime').html(val);
                },
                function () {

                    $('.bettingEndTime').html('00:00:00');
                    $('.touzhuOkBtn .bettingEndTime').find('span').text('00:00:00');
                    $(window.parent.document).find('.kjTipsBox').show();
                    //倒计时结束清空已选择数据
                    $('.playInfoNum').removeClass('pickNum');
                    $('.playInfoNum span').removeClass('xztzA');
                    $('.playInfoNum p').removeClass('xztzA');
                    $('.playInfoRight span').removeClass('fastBtnA');
                    $('.totalZs').text('0');
                    $('.totalPrice').text('0');
                    $('.proless').text('0');
                    playNum = [];
                    beishu = 1;
                    kaijiang();
                    let html = '\t\t' +
                        '<div class="qihaoBox relative">' +
                        '<span class="caizName">' + ($.getname(caizhongname, uuid)) + '</span>' +
                        '<p>第<span class="qihao">' + nextTime + '</span>期投注已结束，<p>' +
                        '马上进入下一期' +
                        '</div>\n';
                    $(window.parent.document).find('.kjTipsBox').html(html);
                    setTimeout(function () {
                        $(window.parent.document).find('.kjTipsBox').hide();
                        newOpen();
                    }, 2500)
                });//倒计时结束进行的操作
            //获取近期开奖号码
        getJson(
            'post',
            '/lotteryitem/lotteryitem/getListTitle?c=Lotteryitem&a=getListTitle',
            {
                'member_id': member_id,
                "lottery_id": lottery_id,
                'lottery_uuid': uuid,
            },
            function (data) {
                if (data.code == 1) {
                    var playWayList = data.data.list;
                    if (playWayList == '') {
                        return
                    } else {
                        var html1 = '';
                        for (var i = 0; i < playWayList.length; i++) {
                            html1 += '<span class="inline" wid="' + playWayList[i].id + '" data-index="' + i + '">' + playWayList[i].title_name + '</span>'
                        }//玩法导航
                        $('.playType').html(html1);
                        $('.playType').children().eq(0).attr('class', 'inline playTypeActive');
                        creatHtml(data);
                        $('.playType').on('click', 'span', function () {
                            $('.coldHotBtn,.missBtn ').removeClass('showMCh');
                            $('.playType span').removeClass('playTypeActive');
                            $(this).addClass('playTypeActive');
                            activeIndex = $(this).attr('data-index');
                            creatHtml(data);
                            var wayName = $('.wA').html() + '—' + $('.playInfoTypeInfoA').text();
                            $('.playWayName').text(wayName);
                            $('.totalZs').text(0);
                            $('#touzhuBs').val('1');
                            $('.totalPrice').text(0);
                            getH();
                            let waiId = $('.playInfoTypeInfoA').attr('id');
                            // if (waiId == 4 || waiId == 6 || waiId == 7 || waiId == 8 || waiId == 9 || waiId == 10 || waiId == 11 || waiId == 15 || waiId == 17 || waiId == 18 || waiId == 19 || waiId == 20 || waiId == 24 || waiId == 28 || waiId == 29 || waiId == 32 || waiId == 36 || waiId == 40 || waiId == 41 || waiId == 44 || waiId == 48 || waiId == 52 || waiId == 53 || waiId == 56 || waiId == 60 || waiId == 64 || waiId == 67 || waiId == 71 || waiId == 75 || waiId == 78 || waiId == 81 || waiId == 86 || waiId == 87 || waiId == 88 || waiId == 89 || waiId == 90 || waiId == 91 || waiId == 92 || waiId == 93 || waiId == 94 || waiId == 95 || waiId == 96 || waiId == 97 || waiId == 164 || waiId == 167 || waiId == 173 || waiId == 176 || waiId == 177 || waiId == 183 || waiId == 185 || waiId == 186 || waiId == 187 || waiId == 188) {
                            //     $('.coldHotBox').show()
                            // } else {
                            //     $('.coldHotBox').hide()
                            // }
                            $('.proless').text(0);

                        })
                        getH();
                        countZhushu();
                        var wayName = $('.wA').html() + '—' + $('.playInfoTypeInfoA').text();
                        $('.playWayName').text(wayName);
                        $('.proless').text(0);
                    }
                }
            })

        //获取当前彩种的玩法

        activeIndex = 0;

        function creatHtml(data) {
            html2 = '';
            var dataList = data.data.list[activeIndex].childData;
            for (var j = 0; j < dataList.length; j++) {
                var ysid = dataList[j].id;
                html2 += '<div class="playInfoTypeBox" ysid="' + dataList[j].id + '">' +
                    '<div class="playInfoTypeT">' + dataList[j].title_name + '</div>'
                html2 += '<div class="playInfoTypeInfo">'
                for (var k = 0; k < dataList[j].childData.length; k++) {
                    html2 += '<span id="' + dataList[j].childData[k].id + '" uid="' + dataList[j].childData[k].title_uuid + '" pid="' + dataList[j].childData[k].pid + '">' + dataList[j].childData[k].title_name + '</span>'
                }
                html2 += '</div>'
                html2 += '</div>'
            }
            $('.playInfoType').html(html2);
            $('.playInfoTypeInfo').eq(0).children().eq(0).addClass('playInfoTypeInfoA');
            $('.playInfoTypeT').eq(0).addClass('wA')
            checkPW();
            wayHtml();
        }

        function checkPW() {
            $('.playInfoTypeInfo').on('click', 'span', function () {
                $('.missBtn').removeClass('showMCH');
                $('.coldHotBtn').removeClass('showMCH');
                $('.playInfoTypeInfo span').removeClass('playInfoTypeInfoA');
                $('.playInfoTypeT').removeClass('wA');
                $(this).addClass('playInfoTypeInfoA');
                $(this).parent().prev().addClass('wA');
                wayHtml();
                var wayName = $('.wA').html() + '—' + $('.playInfoTypeInfoA').text();
                $('.playWayName').text(wayName);


                //设置遗漏冷热
                let waiId = $('.playInfoTypeInfoA').attr('id');
                // if (waiId == 4 || waiId == 6 || waiId == 7 || waiId == 8 || waiId == 9 || waiId == 10 || waiId == 11 || waiId == 15 || waiId == 17 || waiId == 18 || waiId == 19 || waiId == 20 || waiId == 24 || waiId == 28 || waiId == 29 || waiId == 32 || waiId == 36 || waiId == 40 || waiId == 41 || waiId == 44 || waiId == 48 || waiId == 52 || waiId == 53 || waiId == 56 || waiId == 60 || waiId == 64 || waiId == 67 || waiId == 71 || waiId == 75 || waiId == 78 || waiId == 81 || waiId == 86 || waiId == 87 || waiId == 88 || waiId == 89 || waiId == 90 || waiId == 91 || waiId == 92 || waiId == 93 || waiId == 94 || waiId == 95 || waiId == 96 || waiId == 97 || waiId == 164 || waiId == 167 || waiId == 173 || waiId == 176 || waiId == 177 || waiId == 183 || waiId == 185 || waiId == 186 || waiId == 187 || waiId == 188) {
                //     $('.coldHotBox').show()
                //     // let content='<div class="missBox"><span class="missBtn showMCH">✔</span><span>遗漏</span></div>\n' +
                //     //     '<div class="coldHotBox"><span class="coldHotBtn">✔</span><span>冷热</span><span class="playWayBtn1 inline">?</span></div>'
                //     // $('.coldHotBox').html(content)
                // } else {
                //     $('.coldHotBox').hide()
                //     // let content='';
                //     // $('.coldHotBox').html(content);
                // }
                getH();
                countZhushu();

            })
        }

        //创建投注选择HTML
        var type;

        function wayHtml() {
            var waiId = $('.playInfoTypeInfoA').attr('id');
            html3 = '';
            $('.playInfoNumBox').removeClass('dxds');
            $('.playInfoNumBox').removeClass('zonghe');
            $('.playInfoNumBox').removeClass('niuniu');
            // (4-五星直选复式,6-五星组选120,7-五星组选60)

            if (waiId == 4) {
                type = 1;
                addHtml(waydata.ssc_wxzx_fs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 5) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 16) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 25) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 30) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 37) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 42) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 49) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 54) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 65) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 61) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 72) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 76) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 165) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 168) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 174) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 178) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 184) {
                type == 3

                addHtmlds();
                $('.playWarTitle').text('手动输入一个五位数号码，组合成一注。录入的号码与开奖号码一致且顺序相同，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 6) {
                type = 1
                addHtml(waydata.ssc_wxzx_zx120)
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 7) {
                type = 1
                addHtml(waydata.ssc_wxzx_zx60)
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 8) {
                type = 1
                addHtml(waydata.ssc_wxzx_zx30)
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 9) {
                type = 1;
                addHtml(waydata.ssc_wxzx_zx20)
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 10) {
                addHtml(waydata.ssc_wxzx_zx10)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 11) {
                addHtml(waydata.ssc_wxzx_zx5)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 15) {
                addHtml(waydata.ssc_sxzx_fs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 17) {
                addHtml(waydata.ssc_sxzx_zx24)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 18) {
                addHtml(waydata.ssc_sxzx_zx12)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 19) {
                addHtml(waydata.ssc_sxzx_zx6)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 20) {
                addHtml(waydata.ssc_sxzx_zx4)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 24) {
                addHtml(waydata.ssc_qszx_fs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 26) {
                addHtml1(waydata.ssc_qszx_hz)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 38) {
                addHtml1(waydata.ssc_zszx_hz)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 48) {
                addHtml(waydata.ssc_hszx_fs);
                xz();
                type = 1;
                getfandjin(type, waiId)

            }
            if (waiId == 50) {
                addHtml1(waydata.ssc_hszx_hz)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 51) {
                addHtml(waydata.ssc_hszx_kd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 52) {
                addHtml(waydata.ssc_hszx_zs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 53) {
                addHtml(waydata.ssc_hszx_zl)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 55) {
                addHtml1(waydata.ssc_hszx_hz1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 56) {
                addHtml1(waydata.ssc_hszx_bd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 27) {
                addHtml(waydata.ssc_zszx_kd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 39) {
                addHtml(waydata.ssc_qszx_kd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 28) {
                addHtml(waydata.ssc_qszx_zs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 40) {
                addHtml(waydata.ssc_zszx_zs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 29) {
                addHtml(waydata.ssc_qszx_zl)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 41) {
                addHtml(waydata.ssc_zszx_zl)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 31) {
                addHtml1(waydata.ssc_qszx_hz1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 43) {
                addHtml1(waydata.ssc_zszx_hz1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 32) {
                addHtml1(waydata.ssc_qszx_bd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 44) {
                addHtml1(waydata.ssc_zszx_bd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 36) {
                addHtml(waydata.ssc_zszx_fs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }

            if (waiId == 60) {
                addHtml(waydata.ssc_qezx_fs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 62) {
                addHtml1(waydata.ssc_qezx_hz)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 63) {
                addHtml(waydata.ssc_qezx_kd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 64) {
                addHtml(waydata.ssc_qezx_fs1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 66) {
                addHtml1(waydata.ssc_qezx_hz1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 67) {
                addHtml1(waydata.ssc_qezx_bd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 71) {
                addHtml(waydata.ssc_hezx_fs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 73) {
                addHtml1(waydata.ssc_hezx_hz)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 74) {
                addHtml(waydata.ssc_hezx_kd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 75) {
                addHtml(waydata.ssc_hezx_fs1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 77) {
                addHtml1(waydata.ssc_hezx_hz1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 78) {
                addHtml1(waydata.ssc_hezx_bd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 81) {
                addHtml(waydata.ssc_dwd)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 86) {
                addHtml(waydata.ssc_bdd_qsym)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 87) {
                addHtml(waydata.ssc_bdd_qsem)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 88) {
                addHtml(waydata.ssc_bdd_zsym)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 89) {
                addHtml(waydata.ssc_bdd_zsem)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 90) {
                addHtml(waydata.ssc_bdd_hsym)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 91) {
                addHtml(waydata.ssc_bdd_hsem)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 92) {
                addHtml(waydata.ssc_bdd_sxym)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 93) {
                addHtml(waydata.ssc_bdd_sxem)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 94) {
                addHtml(waydata.ssc_bdd_sxsm)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 95) {
                addHtml(waydata.ssc_bdd_wxym)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 96) {
                addHtml(waydata.ssc_bdd_wxem)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 97) {
                addHtml(waydata.ssc_bdd_wxsm)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 164) {
                addHtml(waydata.ssc_rxezx_fs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 166) {
                addHtml2(waydata.ssc_rxezx_hz)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 167) {
                addHtml3(waydata.ssc_rxezx_fs1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 169) {
                addHtml2(waydata.ssc_rxezx_hz1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 173) {
                addHtml(waydata.ssc_rxszx_fs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 175) {
                addHtml2(waydata.ssc_rxszx_hz)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 176) {
                addHtml3(waydata.ssc_rxszx_zs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 177) {
                addHtml3(waydata.ssc_rxszx_zl)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 179) {
                addHtml2(waydata.ssc_rxszx_hz1)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 183) {
                addHtml(waydata.ssc_rxsizx_fs)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 185) {
                addHtml3(waydata.ssc_rxsizx_zx24)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 186) {
                addHtml3(waydata.ssc_rxsizx_zx12)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 187) {
                addHtml3(waydata.ssc_rxsizx_zx6)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 188) {
                addHtml3(waydata.ssc_rxsizx_zx4)
                xz();
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 102) {
                $('.playInfoNumBox').addClass('dxds');
                addHtml4(waydata.ssc_dxds_hedxds);
                type = 1;
                xz()
                getfandjin(type, waiId)
            }
            if (waiId == 103) {
                $('.playInfoNumBox').addClass('dxds');
                addHtml4(waydata.ssc_dxds_qedxds);
                type = 1;
                xz()
                getfandjin(type, waiId)
            }
            if (waiId == 104) {
                $('.playInfoNumBox').addClass('dxds');
                addHtml4(waydata.ssc_dxds_hsdxds);
                xz()
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 105) {
                $('.playInfoNumBox').addClass('dxds');
                addHtml4(waydata.ssc_dxds_qsdxds);
                xz()
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 106) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对5个号码中大号与小号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 107) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对千、百、十、个4个号码中大号与小号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                type = 2;
                getfandjin(type, waiId)
                xz()
            }
            if (waiId == 108) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对万、千、百3个号码中大号与小号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 109) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对千、百、十3个号码中大号与小号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 110) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对百、十、个3个号码中大号与小号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 111) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对5个号码中单号与双号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 112) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对千、百、十、个4个号码中单号与双号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 113) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对万、千、百3个号码中单号与双号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 114) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对千、百、十3个号码中单号与双号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 115) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对百、十、个3个号码中单号与双号的个数进行选择，每个选项为1注。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 118) {
                $('.playInfoNumBox').addClass('zonghe');
                $('.playWarTitle').text('对五个号码和值的大小单双形态进行选择。注：0-22为小，23-45为大。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 119) {
                $('.playInfoNumBox').addClass('zonghe');
                $('.playWarTitle').text('对万、千、百位号码和值的大小单双形态进行选择。注：0-13为小，14-27为大。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 120) {
                $('.playInfoNumBox').addClass('zonghe');
                $('.playWarTitle').text('对千、百、十位号码和值的大小单双形态进行选择。注：0-13为小，14-27为大。');
                addHtml0(type, waiId);
                xz();
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 121) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对百、十、个位号码和值的大小单双形态进行选择。注：0-13为小，14-27为大。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 127) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的万位、千位数字比较大小，万位大于千位为龙；千位大于万位为虎；开奖结果与投注项相符，即为中奖。若万位等于千位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 128) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的万位、百位数字比较大小，万位大于百位为龙；百位大于万位为虎；开奖结果与投注项相符，即为中奖。若万位等于千位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 129) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的万位、十位数字比较大小，万位大于十位为龙；十位大于万位为虎；开奖结果与投注项相符，即为中奖。若万位等于十位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 130) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的万位、个位数字比较大小，万位大于个位为龙；个位大于万位为虎；开奖结果与投注项相符，即为中奖。若万位等于个位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 131) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的千位、百位数字比较大小，千位大于百位为龙；百位大于千位为虎；开奖结果与投注项相符，即为中奖。若千位等于百位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 132) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的千位、十位数字比较大小，千位大于十位为龙；十位大于千位为虎；开奖结果与投注项相符，即为中奖。若千位等于十位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 133) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的千位、个位数字比较大小，千位大于个位为龙；个位大于千位为虎；开奖结果与投注项相符，即为中奖。若千位等于个位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 134) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的百位、十位数字比较大小，百位大于十位为龙；十位大于百位为虎；开奖结果与投注项相符，即为中奖。若百位等于十位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 135) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的百位、个位数字比较大小，百位大于个位为龙；个位大于百位为虎；开奖结果与投注项相符，即为中奖。若百位等于个位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 136) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('在龙、虎两种形态中选择一种。用开奖号码的十位、个位数字比较大小，十位大于个位为龙；个位大于十位为虎；开奖结果与投注项相符，即为中奖。若十位等于个位，则为和，开和退还投注本金。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 137) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('万位大于千位为龙；千位大于万位为虎；万位等于千位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 138) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('万位大于百位为龙；百位大于万位为虎；万位等于百位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 139) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('万位大于十位为龙；十位大于万位为虎；万位等于十位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 140) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('万位大于个位为龙；个位大于万位为虎；万位等于个位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 141) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('千位大于百位为龙；百位大于千位为虎；千位等于百位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 142) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('千位大于十位为龙；十位大于千位为虎；千位等于十位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 143) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('千位大于个位为龙；个位大于千位为虎；千位等于个位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 144) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('百位大于十位为龙；十位大于百位为虎；百位等于十位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 145) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('百位大于个位为龙；个位大于百位为虎；百位等于个位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 146) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('百十位大于个位为龙；个位大于十位为虎；十位等于个位为和。开奖结果与投注项相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 147) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('下注万位、千位、百位三个位置上的开奖号码所组成的形态（顺序不限），每个形态为一注。所选形态与开奖号码相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 148) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('下注千位、百位、十位三个位置上的开奖号码所组成的形态（顺序不限），每个形态为一注。所选形态与开奖号码相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 149) {
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('下注百位、十位、个位三个位置上的开奖号码所组成的形态（顺序不限），每个形态为一注。所选形态与开奖号码相符，即为中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 150) {
                addHtml(waydata.ssc_longhu_yffs)
                xz()
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 151) {
                addHtml(waydata.ssc_longhu_hscs)
                xz()
                type = 1;
                getfandjin(type, waiId)
            }
            if (waiId == 154) {
                $('.playInfoNumBox').addClass('niuniu');
                $('.playWarTitle').text('根据开奖第一球~第五球开出的球号数字为基础，任意组合三个号码成0或10的倍数，取剩余两个号码之和为点数（大于10时减去10后的数字作为兑奖基数，注：当五个号码相同时，只有00000视为牛牛，其它11111,66666等皆为无牛）。大小：牛大（牛6、牛7、牛8、牛9、牛牛），牛小（牛1、牛2、牛3、牛4、牛5），若开出斗牛结果为无牛，则投注牛大牛小皆为不中奖。单双：牛单（牛1、牛3、牛5、牛7、牛9），牛双（牛2、牛4、牛6、牛8、牛牛），若开出斗牛结果为无牛，则投注牛单牛双皆为不中奖。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 157) {
                $('.playInfoNumBox').addClass('niuniu');
                $('.playWarTitle').text('下注开奖号码所组成的形态（顺序不限），每个选项为1注。所选形态与开奖号码相符，即为中奖。四条：开奖号码中有1个数字出现四次，另1个数字出现一次。如：11113, 22022。葫芦：开奖号码中有1个数字出现三次，另1个数字出现两次，如：11122, 32323。顺子：开奖号码的5个数字不同且相连，如：01234, 67890, 89012（9与0相连，0与1相连）。三条：开奖号码中有1个数字出现三次，其余2个数字各出现一次，例如：21113, 22256, 90899。两对：开奖号码中有2个数字各出现两次，另1个数字出现一次：例如：11255, 56569。一对：开奖号码中有1个数字出现两次，其余3个数字各出现一次：例如：11256, 46689。单牌：开奖号码的5个数字各不相同，且不为顺子。例如：12348,24680。');
                addHtml0(type, waiId);
                xz()
                type = 2;
                getfandjin(type, waiId)
            }
            if (waiId == 160) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('(万位+千位)的和值，取其个位数为庄；(十位+个位)的和值，取其个位数为闲。庄大于闲，即押"庄"赢；庄小于闲，即押"闲"赢；庄=闲，即押"和"赢；若万位与千位号码相同，即押"庄对"赢；若十位与个位号码相同，即押"闲对"赢；若庄为6，闲小于6，即押"Super6"赢。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
        }

        //从后台获取赔率和返点值
        function addHtml0(type, waiId) {
            var title = $('.playInfoTypeInfoA').text();
            getJson(
                'post',
                '/lotteryitem/lotteryitem/getMethod?c=Lotteryitem&a=getMethod',
                {
                    'id': waiId,
                    'mjmjid': mjmjid,
                    'mjmjrandom': mjmjrandom
                },
                function (data) {
                    // console.log('获取赔率和返点值');
                    // console.log(data.data);
                    if (data.code == 1) {
                        var playList = data.data;
                        var html = '';
                        html += '<div class="playInfoNumRow">' +
                            '<div class="tips">' + title + '</div>'
                        html += '<div class="playInfoRight">' +
                            '<span class="allBtn">全</span>' +
                            '<span class="deletBtn">清</span>' +
                            '</div>'
                        html += '<div class="playInfoNum">'
                        for (var i = 0; i < playList.length; i++) {
                            html += '<p class="inline"id="' + playList[i].id + '" data-id="' + playList[i].name + '" bjianj="' + playList[i].highest_bonus + '" sjianj="' + playList[i].lowest_bonus + '" fandian="' + playList[i].highest_feed + '">' +
                                '<label>' + playList[i].name + '</label>' +
                                '<label>1中' + playList[i].highest_bonus + '</label>' +
                                '</p>'
                        }
                        html += '</div>';
                        html += '</div>';
                        $('.playInfoNumBox').html(html);
                        xz();
                        getH();
                        getfandjin(2, waiId)
                    } else {
                        $.Msg(data.mssage, {}
                        );
                        $('.playInfoNumBox').html('');
                    }

                })
        }


        //创建没有位置选择的单式
        function addHtmlds() {
            html3 += '<div class="playInfoNumInBox">' +
                '<textarea id="playInfoNumIn" class="zd_textarea" placeholder="请输入投注号码，按回车键确认选号" onkeydown="if(event.keyCode==13){return false;}""   ></textarea>' +
                '</div>' +
                '<div class="handelNumBox">' +
                '<span class="deleteNum inline"">删除重复号</span>' +
                '<span class="deleteAll inline">清空</span>' +
                '</div>'
            $('.playInfoNumBox').html(html3);



            $('#playInfoNumIn').bind('keyup', function () {//单式输入框文字规则
                var ds = $('#playInfoNumIn').val();
                $('#playInfoNumIn').val($(this).val().replace(/[^\r\n0-9]/g, ''));
                if (ds.length == 5) {
                    $('.totalZs').text(1);
                    $('.totalPrice').text($('.totalZs').text() * 2)
                }
                if (ds.length >= 6) {
                    var _ds = ds.substring(6, 1)
                    $('#playInfoNumIn').val(_ds)
                }
            })
            $('.deleteNum').on('click', function () {
                var val = $('#playInfoNumIn').val()
                var _val = ''
                for (let i = 0; i < val.length; i++) {
                    if (_val.indexOf((val[i])) == -1) {
                        _val += val[i]
                    }
                }
                $('#playInfoNumIn').val(_val);
            })
            $('.deleteAll').on('click', function () {
                // console.log('清空');
                $('#playInfoNumIn').val('')
            })
        }
//0-9数字样式（有右边快捷选择按钮）
        function addHtml(dataName) {
            $('.playWarTitle').text(dataName.data.titleN);
            var wayList = dataName.data.des
            for (var w = 0; w < wayList.length; w++) {
                html3 += '<div class="playInfoNumRow">' +
                    '<div class="tips">' + wayList[w].title + '</div>'
                html3 += '<div class="playInfoRight">' +
                    '<span class="allBtn">全</span>' +
                    '<span class="bigBtn">大</span>' +
                    '<span class="samllBtn">小</span>' +
                    '<span class="jiBtn">单</span>' +
                    '<span class="ouBtn">双</span>' +
                    '<span class="deletBtn">清</span>' +
                    '</div>'
                html3 += '<div class="playInfoNum">'
                for (var m = 0; m < wayList[w].num.length; m++) {
                    html3 += '<span class="inline" data-id="' + wayList[w].num[m] + '">' + wayList[w].num[m] + '</span>'
                }
                html3 += '</div>'
                html3 += '</div>' +
                    '<div class="yilou" style="display: none">' +
                    '<dl>' +
                    '<dt>遗漏</dt>' +
                    '<dd></dd>' +
                    '</dl>' +
                    '</div>' +
                    '<div class="lengre" style="display: none">' +
                    '<dl>' +
                    '<dt>冷热</dt>' +
                    '<dd></dd>' +
                    '</dl>' +
                    '</div>'
            }
            var yilou = '';//遗漏冷热设置
            for (let i = 0; i < 10; i++) {
                yilou += '<em>' + i + '</em>';
            }
            var lengre = '';//遗漏冷热设置
            for (let i = 0; i < 10; i++) {
                lengre += '<em>' + i + '</em>'
            }
            $('.playInfoNumBox').html(html3);
            $('.yilou dl dd').html(yilou);
            $('.lengre dl dd').html(lengre);
            var qiuqiu = $('.playInfoNum').children('span')//点击号码球变大变小动画
            qiuqiu.on('click', function () {
                $(this).css({
                    'transform': 'scale(0)',
                    'transition': 'all .1s linear'
                });
                setTimeout(() => {
                    $(this).css({
                        'transform': 'scale(1)',
                        'transition': 'all .1s linear'
                    })
                }, 100);
            })


        }

        //没有右边快捷选择按钮
        function addHtml1(dataName) {
            $('.playWarTitle').text(dataName.data.titleN);
            var wayList = dataName.data.des;
            for (var w = 0; w < wayList.length; w++) {
                html3 += '<div class="playInfoNumRow">' +
                    '<div class="tips">' + wayList[w].title + '</div>'
                html3 += '<div class="playInfoNum">'
                for (var m = 0; m < wayList[w].num.length; m++) {
                    html3 += '<span class="inline" data-id="' + wayList[w].num[m] + '">' + wayList[w].num[m] + '</span>'
                }
                html3 += '</div>'
                html3 += '</div>' +
                    '<div class="yilou" style="display: none">' +
                    '<dl>' +
                    '<dt>遗漏</dt>' +
                    '<dd>' +
                    '</dd>' +
                    '</dl>' +
                    '</div>' +
                    '<div class="lengre" style="display: none">' +
                    '<dl>' +
                    '<dt>冷热</dt>' +
                    '<dd>' +
                    '</dd>' +
                    '</dl>' +
                    '</div>'
            }
            var yilou = '';//遗漏冷热设置
            for (let i = 0; i < 10; i++) {
                yilou += '<em>' + i + '</em>'
            }
            var lengre = '';//遗漏冷热设置
            for (let i = 0; i < 10; i++) {
                lengre += '<em>' + i + '</em>'
            }

            $('.playInfoNumBox').html(html3);
            $('.yilou dl dd').html(yilou);
            $('.lengre dl dd').html(lengre);
        }

        //任选
        function addHtml2(dataName) {
            $('.playWarTitle').text(dataName.data.titleN);
            var wayList = dataName.data.des
            html3 += '<div class="playInfoNumBtnBox">' +
                '<div class="playInfoNumBtnT">选择位置</div>' +
                '<div class="playInfoNumBtnRow wanw">' +
                '<span class="playInfoNumBtn wanwBtn playInfoNumBtnA" data-id="5">✔</span>' +
                '<span class="playInfoNumBtnDes">万</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow qianw">' +
                '<span class="playInfoNumBtn qianwBtn" data-id="4">✔</span>' +
                '<span class="playInfoNumBtnDes">千</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow baiw">' +
                '<span class="playInfoNumBtn baiwBtn" data-id="3">✔</span>' +
                '<span class="playInfoNumBtnDes">百</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow shiw" data-id="2">' +
                '<span class="playInfoNumBtn shiwBtn">✔</span>' +
                '<span class="playInfoNumBtnDes">十</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow gew">' +
                '<span class="playInfoNumBtn gewBtn" data-id="1">✔</span>' +
                '<span class="playInfoNumBtnDes">个</span>' +
                '</div>' +
                '<span style="font-size:14px;color:#666;padding:0 0 0 40px;">注意：此处默认选择一个位置，请您自行调整</span>' +
                '</div>'
            for (var w = 0; w < wayList.length; w++) {
                html3 += '<div class="playInfoNumRow">' +
                    '<div class="tips">' + wayList[w].title + '</div>'
                html3 += '<div class="playInfoNum">'
                for (var m = 0; m < wayList[w].num.length; m++) {
                    html3 += '<span class="inline" data-id="' + wayList[w].num[m] + '">' + wayList[w].num[m] + '</span>'
                }
                html3 += '</div>'
                html3 += '</div>' +
                    '<div class="yilou" style="display: none">' +
                    '<dl>' +
                    '<dt>遗漏</dt>' +
                    '<dd>' +
                    '</dd>' +
                    '</dl>' +
                    '</div>' +
                    '<div class="lengre" style="display: none">' +
                    '<dl>' +
                    '<dt>冷热</dt>' +
                    '<dd>' +
                    '</dd>' +
                    '</dl>' +
                    '</div>'
            }
            var yilou = '';//遗漏冷热设置
            for (let i = 0; i < 10; i++) {
                yilou += '<em>' + i + '</em>'
            }
            var lengre = '';//遗漏冷热设置
            for (let i = 0; i < 10; i++) {
                lengre += '<em>' + i + '</em>'
            }
            $('.playInfoNumBox').html(html3);
            $('.yilou dl dd').html(yilou);
            $('.lengre dl dd').html(lengre);
        }

        function addHtml3(dataName) {
            $('.playWarTitle').text(dataName.data.titleN);
            var wayList = dataName.data.des
            html3 += '<div class="playInfoNumBtnBox">' +
                '<div class="playInfoNumBtnT">选择位置</div>' +
                '<div class="playInfoNumBtnRow wanw">' +
                '<span class="playInfoNumBtn wanwBtn playInfoNumBtnA" data-id="5">✔</span>' +
                '<span class="playInfoNumBtnDes">万</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow qianw">' +
                '<span class="playInfoNumBtn qianwBtn" data-id="4">✔</span>' +
                '<span class="playInfoNumBtnDes">千</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow baiw">' +
                '<span class="playInfoNumBtn baiwBtn" data-id="3">✔</span>' +
                '<span class="playInfoNumBtnDes">百</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow shiw" data-id="2">' +
                '<span class="playInfoNumBtn shiwBtn">✔</span>' +
                '<span class="playInfoNumBtnDes">十</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow gew">' +
                '<span class="playInfoNumBtn gewBtn" data-id="1">✔</span>' +
                '<span class="playInfoNumBtnDes">个</span>' +
                '</div>' +
                '<span style="font-size:14px;color:#666;padding:0 0 0 40px;">注意：此处默认选择一个位置，请您自行调整</span>' +
                '</div>'
            for (var w = 0; w < wayList.length; w++) {
                html3 += '<div class="playInfoNumRow">' +
                    '<div class="tips">' + wayList[w].title + '</div>'
                html3 += '<div class="playInfoRight">' +
                    '<span class="allBtn">全</span>' +
                    '<span class="bigBtn">大</span>' +
                    '<span class="samllBtn">小</span>' +
                    '<span class="jiBtn">单</span>' +
                    '<span class="ouBtn">双</span>' +
                    '<span class="deletBtn">清</span>' +
                    '</div>'
                html3 += '<div class="playInfoNum">'
                for (var m = 0; m < wayList[w].num.length; m++) {
                    html3 += '<span class="inline" data-id="' + wayList[w].num[m] + '">' + wayList[w].num[m] + '</span>'
                }
                html3 += '</div>'
                html3 += '</div>' +
                    '<div class="yilou" style="display: none">' +
                    '<dl>' +
                    '<dt>遗漏</dt>' +
                    '<dd>' +
                    '</dd>' +
                    '</dl>' +
                    '</div>' +
                    '<div class="lengre" style="display: none">' +
                    '<dl>' +
                    '<dt>冷热</dt>' +
                    '<dd>' +
                    '</dd>' +
                    '</dl>' +
                    '</div>'
            }
            var yilou = '';//遗漏冷热设置
            for (let i = 0; i < 10; i++) {
                yilou += '<em>' + i + '</em>'
            }
            var lengre = '';//遗漏冷热设置
            for (let i = 0; i < 10; i++) {
                lengre += '<em>' + i + '</em>'
            }
            $('.playInfoNumBox').html(html3);
            $('.yilou dl dd').html(yilou);
            $('.lengre dl dd').html(lengre);
        }

        //大小单双
        function addHtml4(dataName) {
            $('.playWarTitle').text(dataName.data.titleN);
            var wayList = dataName.data.des
            for (var w = 0; w < wayList.length; w++) {
                html3 += '<div class="playInfoNumRow">' +
                    '<div class="tips">' + wayList[w].title + '</div>'
                html3 += '<div class="playInfoRight">' +
                    '<span class="allBtn">全</span>' +
                    '<span class="deletBtn">清</span>' +
                    '</div>'
                html3 += '<div class="playInfoNum">'
                for (var m = 0; m < wayList[w].numdes.length; m++) {
                    html3 += '<p class="inline" data-id="' + wayList[w].numdes[m].name + '">' +
                        '<label>' + wayList[w].numdes[m].name + '</label>' +
                        '<label>' + wayList[w].numdes[m].pl + '</label>' +
                        '</p>'
                }
                html3 += '</div>'
                html3 += '</div>'
            }
            $('.playInfoNumBox').html(html3);
        }

        //右侧快捷节点创建
        function xz() {
            var waiId = $('.playInfoTypeInfoA').attr('id');
            //右边快捷选择按钮
            $('.playInfoRight').on('click', 'span', function () {
                $('.playInfoRight span').removeClass('fastBtnA');
                // $(this).addClass('fastBtnA');
            })
            //选择投注数据
            $('.playInfoNum').on('click', 'span', function () {
                $(this).css({
                    'transform': 'scale(0)',
                    'transition': 'all .1s linear'
                });
                setTimeout(() => {
                    $(this).css({
                        'transform': 'scale(1)',
                        'transition': 'all .1s linear'
                    })
                }, 100);
                $('.playInfoRight').removeClass('fastBtnA');
                if (waiId == 32 || waiId == 44 || waiId == 56 || waiId == 67 || waiId == 78) {
                    $('.playInfoNum span').removeClass('xztzA');
                    $(this).addClass('xztzA');
                    $(this).parent().addClass('pickNum');
                } else {
                    if ($(this).hasClass('xztzA')) {
                        $(this).removeClass('xztzA');
                    } else {
                        $(this).addClass('xztzA');
                        $(this).parent().addClass('pickNum');
                    }
                }
                countZhushu()
            })
            $('.playInfoNum').on('click', 'p', function () {
                $(this).css({
                    'transform': 'scale(0)',
                    'transition': 'all .1s linear'
                });
                setTimeout(() => {
                    $(this).css({
                        'transform': 'scale(1)',
                        'transition': 'all .1s linear'
                    })
                }, 100);
                $('.playInfoRight').removeClass('fastBtnA');
                // if (waiId == 32 || waiId == 67) {
                //     $('.playInfoNum span').removeClass('xztzA');
                //     $(this).addClass('xztzA');
                //     $(this).parent().addClass('pickNum');
                // } else {

                if ($(this).hasClass('xztzA')) {
                    $(this).removeClass('xztzA');
                } else {
                    $(this).addClass('xztzA');
                    $(this).parent().addClass('pickNum');
                }
                // }
                countZhushu()
            })
            //选择位置
            $('.playInfoNumBtn').on('click', function () {
                if ($(this).hasClass('playInfoNumBtnA')) {
                    $(this).removeClass('playInfoNumBtnA');
                } else {
                    $(this).addClass('playInfoNumBtnA');
                    $(this).addClass('playInfoNumBtnA');
                }
                countZhushu()
            })
            $('.deletBtn').on('click', function () {//清除已选择的
                $(this).parent().parent().find('.playInfoNum span').removeClass('xztzA');
                $(this).parent().parent().find('.playInfoNum p').removeClass('xztzA');
                $(this).parent().parent().find('.playInfoNum').removeClass('pickNum');
                countZhushu()
            });
            $('.allBtn').on('click', function () {//全部选择
                $(this).parent().parent().find('.playInfoNum span').addClass('xztzA');
                $(this).parent().parent().find('.playInfoNum p').addClass('xztzA');
                $(this).parent().parent().find('.playInfoNum').addClass('pickNum');
                countZhushu()
            })
            $('.bigBtn').on('click', function () {//大数选择
                $(this).parent().parent().find('.playInfoNum span').removeClass('xztzA');
                $(this).parent().parent().find('.playInfoNum span').each(function () {
                    var data_id = $(this).attr('data-id');
                    if (data_id == 5 || data_id == 6 || data_id == 7 || data_id == 8 || data_id == 9) {
                        $(this).addClass('xztzA');
                    }
                });
                $(this).parent().parent().find('.playInfoNum').addClass('pickNum');
                countZhushu()
            })
            $('.samllBtn').on('click', function () {//小数选择
                $(this).parent().parent().find('.playInfoNum span').removeClass('xztzA');
                $(this).parent().parent().find('.playInfoNum span').each(function () {
                    var data_id = $(this).attr('data-id');
                    if (data_id == 0 || data_id == 1 || data_id == 2 || data_id == 3 || data_id == 4) {
                        $(this).addClass('xztzA');
                    }
                });
                $(this).parent().parent().find('.playInfoNum').addClass('pickNum');
                countZhushu()
            })
            $('.jiBtn').on('click', function () {//奇数选择
                $(this).parent().parent().find('.playInfoNum span').removeClass('xztzA');
                $(this).parent().parent().find('.playInfoNum span').each(function () {
                    var data_id = $(this).attr('data-id');
                    if (data_id == 1 || data_id == 3 || data_id == 5 || data_id == 7 || data_id == 9) {
                        $(this).addClass('xztzA');
                    }
                });
                $(this).parent().parent().find('.playInfoNum').addClass('pickNum');
                countZhushu()
            })
            $('.ouBtn').on('click', function () {//偶数选择
                $(this).parent().parent().find('.playInfoNum span').removeClass('xztzA');
                $(this).parent().parent().find('.playInfoNum span').each(function () {
                    var data_id = $(this).attr('data-id');
                    if (data_id == 0 || data_id == 2 || data_id == 4 || data_id == 6 || data_id == 8) {
                        $(this).addClass('xztzA');
                    }
                });
                $(this).parent().parent().find('.playInfoNum').addClass('pickNum');
                countZhushu();
            })
        }

        $('.playWayBtn1').on('mouseover', function () {
            layer.tips("<span>遗漏</span>" +
                "<br>" +
                "<span>表示该号码从上次开出至今，有多少期未出现</span>" +
                "<br>" +
                "<span>冷热</span>" +
                "<br>" +
                "<span>表示在最近的100期开奖中，该号码在对应的位置上出现的次数</span>",
                '.playWayBtn1', {
                    tips: [3, '#091309'],
                    maxWidth: 300,//宽度设置
                    time: 1500,//持续时间
                })
        });


        //创建投注页面结束


        //获取每个玩法的返点奖金值
        function getfandjin(type, waiId) {
            getJson(
                'post',
                '/lotteryitem/lotteryitem/getMethod?c=Lotteryitem&a=getMethod',
                {
                    'id': waiId,
                },
                function (data) {
                    if (data.code == 1) {
                        var wayList = data.data;
                        if (type == 1) {//直接获取需要的值
                            fdBig = wayList[0].highest_feed * 100;
                            jjinSmall = wayList[0].highest_bonus * 2;
                            jjinBig = wayList[0].lowest_bonus * 2;
                            $('.playInfoTypeInfoA').attr('play-id', wayList[0].id)
                            $('.range-bar').remove();
                            initSlide()
                        }
                        if (type == 2) {//从p节点上拿取需要的值
                            $('.thisWayPrice').text(0);//未选中时时0
                            $('.totalZs').text(0);
                            jjinBig = 0;
                            jjinSmall = 0;
                            fdBig = 0;
                            lastJjin = 0
                            $('.fandianNum').attr('title', jjinSmall);
                            $('.range-bar').remove();//初始化没有值
                            $('.fandianNum').text('0');
                            $('.proless').text('0');
                            var fd, smj, bgj
                            $('.playInfoNum').on('click', 'p', function () {
                                var al = $('.xztzA').length;
                                if (al < 1) {
                                    $('.thisWayPrice').text(0);//未选中时时0
                                    $('.totalZs').text(0);
                                    jjinBig = 0;
                                    jjinSmall = 0;
                                    fdBig = 0;
                                    lastJjin = 0
                                    $('.fandianNum').attr('title', jjinSmall);
                                    $('.proless').text('0');
                                    $('.fandianNum').text('0')
                                } else {
                                    jjinBig = 0;
                                    jjinSmall = 0;
                                    fdBig = 0;
                                    lastJjin = 0
                                    $('.pickNum .xztzA').each(function () {
                                        var _this = this;
                                        fdBig = $(_this).attr('fandian') * 100;
                                        smj = $(_this).attr('bjianj') * 2;
                                        bgj = $(_this).attr('sjianj') * 2;
                                        if (fdBig == null) {
                                            fdBig = 0;
                                            $('.fandianNum').text('0')
                                        } else {
                                            fdBig += Number(fdBig);
                                            jjinSmall += Number(smj);
                                            jjinBig += Number(bgj);
                                            $('.range-bar').remove();
                                            initSlide();
                                            $('.fandianNum').attr('title', jjinSmall);
                                            var lasjn = 0;
                                            var touzj = $('.totalPrice').text();
                                            var bifen = $('.moshiBoxActive').attr('data-id');
                                            if (bifen == 1) {
                                                lasjn = jjinSmall / 1
                                            }
                                            if (bifen == 10) {
                                                lasjn = jjinSmall / 10
                                            }
                                            if (bifen == 100) {
                                                lasjn = jjinSmall / 100
                                            }
                                            if (bifen == 1000) {
                                                lasjn = jjinSmall / 1000
                                            }
                                            $('.thisWayPrice').text(lasjn.toFixed(3));
                                            $('.proless').text((lasjn - touzj).toFixed(3));
                                        }
                                    })
                                }
                            })
                        }

                    }
                })
        }

        //初始化返点滑块插件
        function initSlide() {
            var n = 0,//拖动次数
                x = 0,//奖金每次变化值
                y = 0.1//返点每次变化值
            var elem = document.querySelector('.js-callback');//选择input元素
            var init = new Powerange(elem, {
                hideRange: true,
                decimal: true,
                callback: displayValue,
                min: fdSmall,
                max: rebate,
                start: fdSmall,
                step: y
            });//实例化powerange类并且初始化参数
            $('.proless').text(0);

            // $('.thisWayPrice').text(0);
            function displayValue() {
                $('.fandianNum').text(elem.value);
                n = (rebate - fdSmall) / y;

                x = (jjinBig - jjinSmall) / n;

                var fandN = $('.fandianNum').text();

                var n1 = (fandN - fdSmall) / y;

                lastJjin = jjinSmall + n1 * x;

                var totalJJ = lastJjin;

                var bifen = $('.moshiBoxActive').attr('data-id');

                if (bifen == 1) {
                    totalJJ = lastJjin / 1
                }
                if (bifen == 10) {
                    totalJJ = lastJjin / 10
                }
                if (bifen == 100) {
                    totalJJ = lastJjin / 100
                }
                if (bifen == 1000) {
                    totalJJ = lastJjin / 1000
                }
                $('.thisWayPrice').text(totalJJ.toFixed(3));
                $('.fandianNum').attr('title', lastJjin.toFixed(3));
                var touzp = $('.totalPrice').text();
                if (touzp > 0) {
                    $('.proless').text((totalJJ.toFixed(3) - touzp).toFixed(3));
                }

            }
        }


        var unitPrice = 2;//每一注单倍投注金额初始值（元）
        var utp = unitPrice;
        var beishu = 1;//倍数

        $('.moshiBox').on('click', 'span', function () {
            $(this).css({
                'transform': 'scale(0)',
                'transition': 'all .1s linear'
            });
            setTimeout(() => {
                $(this).css({
                    'transform': 'scale(1)',
                    'transition': 'all .1s linear'
                })
            }, 100);
            $('.moshiBox span').removeClass('moshiBoxActive');
            $(this).addClass('moshiBoxActive');
            var bifen = $('.moshiBoxActive').attr('data-id');
            var jiangjP = $('.fandianNum').attr('title');//当前玩法奖金值
            var lastJj = jiangjP;
            if (bifen == 1) {
                utp = unitPrice / 1;
                lastJj = jiangjP / 1
            }
            if (bifen == 10) {
                utp = unitPrice / 10;
                lastJj = jiangjP / 10
            }
            if (bifen == 100) {
                utp = unitPrice / 100;
                lastJj = jiangjP / 100
            }
            if (bifen == 1000) {
                utp = unitPrice / 1000;
                lastJj = jiangjP / 1000
            }
            var beishu = $('#touzhuBs').val();
            var totalZs = $('.totalZs').text();
            $('.totalPrice').text((utp * totalZs * beishu).toFixed(3));
            $('.thisWayPrice').text(lastJj.toFixed(3))
            $('.proless').text((lastJj.toFixed(3) - (utp * totalZs * beishu).toFixed(3)).toFixed(3))
        });
        $('#touzhuBs').blur(function () {
            var bs = $('#touzhuBs').val();
            if (bs < 1) {
                beishu = 1
            } else {
                beishu = bs
            }
            var totalZs = $('.totalZs').text();
            var jj = $('.thisWayPrice').text();
            $('.totalPrice').text(utp * totalZs * beishu);
            $('.proless').text(jj - utp * totalZs * beishu);
        });


        //添加购彩到购彩蓝---一键投注
        var playId;//小玩法的id
        var playName;//玩法名字
        var tzjine;//总投注金额
        var playNum = [];//投注数据
        var totalNum


        function addTouzhu() {
            var dhpick = $('.playInfoNum').eq(1).find('.xztzA').length;
            var echpick = $('.playInfoNum').eq(0).find('.xztzA').length;
            var pickLen = $('.pickNum').length;
            var pickws = $('.playInfoNumBtnA').length;//选择的位置
            var pickNumA = 0;
            $('.playInfoNum').each(function () {
                pickNumA = $(this).find('.xztzA').length;
            })
            playId = $('.playInfoTypeInfoA').attr('id');//小玩法的id（例：五星直选复选的id=4）
            playName = $('.playWayName').text();//玩法名字
            tzjine = $('.totalPrice').text();//金额
            totalNum = $('.totalZs').text();//总注数
            var aNum = '';
            if (tzjine == 0) {//通过金额判断是否下注
                $.Msg('无效投注请重新下注', {}
                );
            } else {
                if (playId == 4 || playId == 5 || playId == 10 || playId == 11 || playId == 15 || playId == 20 || playId == 24 || playId == 31 || playId == 32 || playId == 36 || playId == 43 || playId == 44 || playId == 48 || playId == 50 || playId == 55 || playId == 56 || playId == 60 || playId == 62 || playId == 66 || playId == 67 || playId == 71 || playId == 73 || playId == 77 || playId == 78 || playId == 81 || playId == 86 || playId == 88 || playId == 90 || playId == 92 || playId == 95 || playId == 102 || playId == 103 || playId == 104 || playId == 105 || playId == 106 || playId == 118 || playId == 119 || playId == 120 || playId == 121 || playId == 107 || playId == 108 || playId == 109 || playId == 110 || playId == 111 || playId == 112 || playId == 113 || playId == 114 || playId == 115 || playId == 127 || playId == 128 || playId == 129 || playId == 130 || playId == 131 || playId == 132 || playId == 133 || playId == 134 || playId == 135 || playId == 136 || playId == 150 || playId == 151 || playId == 137 || playId == 138 || playId == 139 || playId == 140 || playId == 141 || playId == 142 || playId == 143 || playId == 144 || playId == 145 || playId == 146 || playId == 147 || playId == 148 || playId == 149 || playId == 154 || playId == 157 || playId == 160 || playId == 16 || playId == 25 || playId == 30 || playId == 37 || playId == 42 || playId == 49 || playId == 54 || playId == 61 || playId == 65 || playId == 72 || playId == 76 || playId == 165 || playId == 168 || playId == 174 || playId == 178 || playId == 184) {
                    //五星直选复式
                    if (pickLen < $('.playInfoNum').length) {
                        $.Msg('无效投注，请重新选择', {}
                        );
                    } else {
                        if (type == 1) {
                            if (playId == 5 || playId == 16 || playId == 25 || playId == 30 || playId == 37 || playId == 42 || playId == 49 || playId == 54 || playId == 61 || playId == 65 || playId == 72 || playId == 76 || playId == 165 || playId == 168 || playId == 174 || playId == 178 || playId == 184) {//单式,复式
                                var ds = $('#playInfoNumIn').val(),
                                    _ds = '',
                                    shu = '|';
                                if (ds.length < 5) {
                                    $.Msg('无效投注，请重新输入', {}
                                    );
                                } else {
                                    for (let i = 0; i < ds.length; i++) {
                                        _ds += shu.concat(ds[i])
                                    }
                                    _ds = _ds.substr(1, _ds.length);
                                    playNum.push(_ds);
                                    // creatTouzhuHtml();
                                }
                            } else {
                                $('.playInfoNum').each(function () {
                                    var fnum = '';
                                    $(this).find('.xztzA').each(function () {
                                        var num = $(this).attr('data-id');
                                        fnum += num + ','
                                    });
                                    var fnum1 = fnum.toString();
                                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                                    // aNum.push(fnum+',');
                                    aNum += fnum2 + '|'
                                });
                                var aNum1 = aNum.toString();
                                var aNum2 = aNum1.substring(0, aNum1.length - 1);
                                playNum.push(aNum2);
                                // 创建购彩蓝里的节点

                            }
                            creatTouzhuHtml();
                        }
                    }
                    if (type == 2) {
                        var html0 = ''
                        var totp = $('.totalPrice').text();
                        var pcL = $('.pickNum .xztzA').length;
                        var bonus = 0;
                        var n = 0,//拖动次数
                            x = 0,//奖金每次变化值
                            y = 0.1//返点每次变化值
                        $('.pickNum .xztzA').each(function () {
                            var playNum = $(this).find('label').eq(0).text();
                            var wfid = $(this).attr('id');
                            //每遍历一次获取一次奖金值
                            var sjj = $(this).attr('sjianj');
                            var bjj = $(this).attr('bjianj');
                            var fdz = $(this).attr('fandianNum');//返点值
                            var fdz = rebate
                            if (fdz > 0) {
                                n = (fdz - fdSmall) / y;
                                x = (bjj - sjj) / n;
                                var fandN = $('.fandianNum').text();
                                var n1 = (fandN - fdSmall) / y
                                lastJjin = Number(sjj) + Number(n1 * x);
                                var totalJJ = lastJjin;

                                var bifen = $('.moshiBoxActive').attr('data-id');
                                if (bifen == 1) {
                                    totalJJ = lastJjin / 1
                                }
                                if (bifen == 10) {
                                    totalJJ = lastJjin / 10
                                }
                                if (bifen == 100) {
                                    totalJJ = lastJjin / 100
                                }
                                if (bifen == 1000) {
                                    totalJJ = lastJjin / 1000
                                }

                                bonus = totalJJ.toFixed(3);
                            } else {
                                bonus = Number(bjj);
                            }
                            var fanshui = $('.fandianNum').text() / 100;
                            var mode = $('.moshiBoxActive').attr('mode');
                            html0 += '<li class="relative" mode="' + mode + '" beishu="' + beishu + '" touzs="1" totaljine="' + totp / pcL + '" fanshui="' + fanshui + '" jianj="' + bonus + '" title="' + playName + '" play-id="' + wfid + '" playNum="' + playNum + '">' +
                                '<span style="width:25%" title="' + playName + '" wfid="' + wfid + '">' + playName + '</span>' +
                                '<span style="width:25%" title="' + playNum + '">' + playNum + '</span>' +
                                '<span style="width:15%">1</span>' +
                                '<span style="width:15%">' + beishu + '</span>' +
                                '<span style="width:20%">' + totp / pcL + '</span>' +
                                '<e class="deleteThisMsg absolute inline">×</e>' +
                                '</li>'
                        })
                        var lil = $('.touzhulanD ul li').length
                        if (lil < 1) {
                            $('.touzhulanD ul').html(html0);
                        } else {
                            $('.touzhulanD ul').append(html0);
                        }
                        $('.deleteThisMsg').on('click', function () {
                            $(this).parent().remove();
                        });
                        //节点创建完成清空已选择数据
                        $('.playInfoNum').removeClass('pickNum');
                        $('.playInfoNum span').removeClass('xztzA');
                        $('.playInfoNum p').removeClass('xztzA');
                        $('.playInfoRight span').removeClass('fastBtnA');
                        $('.totalZs').text('0');
                        $('.totalPrice').text('0');
                        $('.proless').text('0');
                        beishu = 1;
                    }
                }
            }
            if (playId == 6) {
                var numL = $('.playInfoNum').find('.xztzA').length;
                if (numL < 5) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    $('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        aNum += num + ','
                    });
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    // creatTouzhuHtml();
                }
            }
            if (playId == 7) {
                if (pickLen < $('.playInfoNum').length || dhpick < 3) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    $('.playInfoNum').each(function () {
                        var fnum = '';
                        $(this).find('.xztzA').each(function () {
                            var num = $(this).attr('data-id');
                            fnum += num + ','
                        });
                        var fnum1 = fnum.toString()
                        var fnum2 = fnum1.substring(0, fnum1.length - 1);
                        aNum += fnum2 + '|'
                    });
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);//购彩蓝中展示
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml();
                }
            }
            if (playId == 8 || playId == 9 || playId == 18) {
                if (pickLen < $('.playInfoNum').length || dhpick < 2) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    $('.playInfoNum').each(function () {
                        var fnum = '';
                        $(this).find('.xztzA').each(function () {
                            var num = $(this).attr('data-id');
                            fnum += num + ','
                        });
                        var fnum1 = fnum.toString()
                        var fnum2 = fnum1.substring(0, fnum1.length - 1);
                        aNum += fnum2 + '|'
                    });
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);//购彩蓝中展示
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml();
                }
            }
            if (playId == 17) {
                var numL = $('.playInfoNum').find('.xztzA').length;
                if (pickLen < $('.playInfoNum').length || numL < 4) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    $('.playInfoNum').each(function () {
                        var fnum = '';
                        $(this).find('.xztzA').each(function () {
                            var num = $(this).attr('data-id');
                            fnum += num + ','
                        });
                        var fnum1 = fnum.toString()
                        var fnum2 = fnum1.substring(0, fnum1.length - 1);
                        // aNum.push(fnum+',');
                        aNum += fnum2 + '|'
                    });
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml();
                }
            }
            if (playId == 19 || playId == 28 || playId == 40 || playId == 52 || playId == 64 || playId == 75 || playId == 87 || playId == 89 || playId == 91 || playId == 93 || playId == 96) {
                if (pickLen < $('.playInfoNum').length || echpick < 2) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml();
                }
            }
            if (playId == 26 || playId == 27 || playId == 38 || playId == 39 || playId == 50 || playId == 51 || playId == 63 || playId == 74) {
                if (pickLen < $('.playInfoNum').length || echpick < 1) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml();
                }
            }
            if (playId == 29 || playId == 41 || playId == 53 || playId == 94 || playId == 97) {
                if (pickLen < $('.playInfoNum').length || echpick < 3) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml();
                }
            }
            if (playId == 164) {
                if (pickLen < 2) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    $('.pickNum').each(function () {
                        var fnum = '';
                        $(this).find('.xztzA').each(function () {
                            var num = $(this).attr('data-id');
                            fnum += num + ','
                        });
                        var fnum1 = fnum.toString()
                        var fnum2 = fnum1.substring(0, fnum1.length - 1);
                        // aNum.push(fnum+',');
                        aNum += fnum2 + '|'
                    });
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml();
                }
            }
            if (playId == 173) {
                if (pickLen < 3) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    $('.pickNum').each(function () {
                        var fnum = '';
                        $(this).find('.xztzA').each(function () {
                            var num = $(this).attr('data-id');
                            fnum += num + ','
                        });
                        var fnum1 = fnum.toString()
                        var fnum2 = fnum1.substring(0, fnum1.length - 1);
                        // aNum.push(fnum+',');
                        aNum += fnum2 + '|'
                    });
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml();
                }
            }
            if (playId == 183) {
                if (pickLen < 4) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    $('.pickNum').each(function () {
                        var fnum = '';
                        $(this).find('.xztzA').each(function () {
                            var num = $(this).attr('data-id');
                            fnum += num + ','
                        });
                        var fnum1 = fnum.toString()
                        var fnum2 = fnum1.substring(0, fnum1.length - 1);
                        // aNum.push(fnum+',');
                        aNum += fnum2 + '|'
                    });
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml();
                }
            }
            if (playId == 166 || playId == 169) {
                if (echpick < 1 || pickws < 2) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml1();
                }
            }
            if (playId == 167) {
                if (echpick < 2 || pickws < 2) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml1();
                }
            }
            if (playId == 175 || playId == 176 || playId == 179) {
                if (echpick < 1 || pickws < 3) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml1();
                }
            }
            if (playId == 177) {
                if (echpick < 3 || pickws < 3) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml1();
                }
            }
            if (playId == 185) {
                if (echpick < 4 || pickws < 4) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml1();
                }
            }
            if (playId == 186) {
                if (echpick < 1 || pickws < 4 || dhpick < 2) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml1();
                }
            }
            if (playId == 187) {
                if (echpick < 2 || pickws < 4) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml1();
                }
            }
            if (playId == 188) {
                if (echpick < 1 || pickws < 4 || dhpick < 1) {
                    $.Msg('无效投注，请重新选择', {}
                    );
                } else {
                    var fnum = '';
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    })
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    aNum += fnum2 + '|'
                    var aNum1 = aNum.toString();
                    var aNum2 = aNum1.substring(0, aNum1.length - 1);
                    playNum.push(aNum2);
                    // 创建购彩蓝里的节点
                    creatTouzhuHtml1();
                }
            }
        }
    }

    $('.addTouzhuLsit').on('click', function () {
        if (type == 2) {
            var tzje = $('.totalPrice').text();//总投注金额
            var tzs = $('.totalZs').text();//总投注注数
            tzjine = (tzje / tzs).toFixed(3)
        }
        addTouzhu();
        $('#playInfoNumIn').val('');
    })//添加购彩蓝
    $('.fastTouzhuBtn').on('click', function () {
        var action_no = $('.lotteryQishu span').text();//下单期数
        var zs = $('.totalZs').text();
        let playId = $('.playInfoTypeInfoA').attr('id');
        if (zs < 1) {
            $.Msg('无效注单，请重新下注');
        } else {
            // console.log(action_no);
            // console.log(zs);
            var tzmsg = [];//此单投注信息
            var tzcommon = [];//公用投注信息;
            var alltzmsg;
            tzcommon = {
                'member_id': member_id,
                'action_no': action_no,
                'lottery_uuid': uuid,
                'lottery_pid': lottery_id
            }
            var mode = $('.moshiBoxActive').attr('mode');//下注模式（元角分厘）
            if (type == 1) {
                var play_id = $('.playInfoTypeInfoA').attr('play-id');//玩法id
                var action_coin = $('.totalPrice').text();//下注金额
                var bonus = $('.thisWayPrice').text();//奖金
                var mulriple = $('#touzhuBs').val();//倍数
                var rebate = $('.fandianNum').text() / 100;
                var aNum = '';
                var wezhi = '';
                var code_list = '';
                $('.playInfoNumBtnA').each(function () {
                    var wezhia = $(this).next().text();
                    wezhi += wezhia + ','
                });
                var wezhi1 = wezhi.toString();
                var wezhi2 = wezhi1.substring(0, wezhi1.length - 1);
                var an = '';
                $('.playInfoNum').each(function () {
                    var fnum = '';
                    $(this).find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        fnum += num + ','
                    });
                    var fnum1 = fnum.toString()
                    var fnum2 = fnum1.substring(0, fnum1.length - 1);
                    // aNum.push(fnum+',');
                    an += fnum2 + '|'
                });
                var aNum1 = an.toString();
                aNum = aNum1.substring(0, aNum1.length - 1);
                if (wezhi2 == '') {
                    code_list = aNum

                } else {
                    code_list = aNum + '|' + wezhi2
                }
                tzmsg.push({
                    'play_id': play_id,
                    'action_coin': action_coin,
                    'bonus': bonus,
                    'mode': mode,
                    'bets_num': zs,
                    'mulriple': mulriple,
                    'rebate': rebate,
                    'code_list': code_list
                })
                if ($('.touzhulanD ul li').length > 0) {
                    $('.touzhulanD ul li').each(function () {
                        var beishu = $(this).attr('beishu');//倍数
                        var touzs = $(this).attr('touzs');//投注数
                        var totaljine = $(this).attr('totaljine');//投注金额
                        var fanshui = $(this).attr('fanshui') / 100;//反水
                        var jianj = $(this).attr('jianj');//奖金
                        var play_id = $(this).attr('play-id');//玩法id
                        var playnum = $(this).attr('playnum');//玩法号码
                        var mode = $(this).attr('mode');//下注模式
                        tzmsg.push({
                            'play_id': play_id,
                            'action_coin': totaljine,
                            'bonus': jianj,
                            'mode': mode,
                            'bets_num': touzs,
                            'mulriple': beishu,
                            'rebate': fanshui,
                            'code_list': playnum
                        });
                        // console.log('2340');
                    });
                }
                // console.log(playId);
                if (playId == 5 || playId == 16 || playId == 25 || playId == 30 || playId == 37 || playId == 42 || playId == 49 || playId == 54 || playId == 61 || playId == 65 || playId == 72 || playId == 76 || playId == 165 || playId == 168 || playId == 174 || playId == 178 || playId == 184) {//单式,复式
                    // console.log(playId);
                    var ds = $('#playInfoNumIn').val(),
                        _ds = '',
                        shu = '|';
                    for (let i = 0; i < ds.length; i++) {
                        _ds += shu.concat(ds[i])
                    }
                    _ds = _ds.substr(1, _ds.length);
                    tzmsg[0].code_list = _ds;
                }
                $('#playInfoNumIn').val('');


                alltzmsg = {'common': tzcommon, 'betBean': tzmsg, 'mjmjid': mjmjid, 'mjmjrandom': mjmjrandom}
                //请求下单接口
                getJson('post', '/officialorders/officialorders/makeOrder?c=Officialorders&a=makeOrder', alltzmsg, function (data) {
                    if (data.code == 1) {
                        $.Msg(data.data);
                        $('.touzhulanD ul').html('');
                        //下单成功清空已选择数据
                        $('.playInfoNum').removeClass('pickNum');
                        $('.playInfoNum span').removeClass('xztzA');
                        $('.playInfoNum p').removeClass('xztzA');
                        $('.playInfoRight span').removeClass('fastBtnA');
                        $('.totalZs').text('0');
                        $('.totalPrice').text('0');
                        $('.proless').text('0');
                        $('#playInfoNumIn').val('');
                        playNum = [];
                        beishu = 1;
                        $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面
                        $._getBalane();

                    } else {
                        $.Msg(data.message);
                        addTouzhu();//添加投注订单
                    }
                })
            }
            if (type == 2) {
                var beishu = $('#touzhuBs').val();//倍数
                var mode = $('.moshiBoxActive').attr('mode');//下注模式
                var tzje = $('.totalPrice').text();//总投注金额
                var tzs = $('.totalZs').text();//总投注注数
                var ptzje = (tzje / tzs).toFixed(3);//每一单投注金额
                var mulriple = $('#touzhuBs').val();//倍数
                var rebate = $('.fandianNum').text() / 100;
                var bonus = 0;
                var n = 0,//拖动次数
                    x = 0,//奖金每次变化值
                    y = 0.1//返点每次变化值
                $('.xztzA').each(function () {
                    var aNum = '';
                    var play_id = $(this).attr('id');
                    //每遍历一次获取一次奖金值
                    var sjj = $(this).attr('sjianj');
                    var bjj = $(this).attr('bjianj');
                    var fdz = $(this).attr('fandianNum');//返点值
                    var wayN = $(this).attr('data-id');
                    // var fdz =6.5
                    if (fdz > 0) {

                        n = (fdz - fdSmall) / y;
                        x = (bjj - sjj) / n;
                        var fandN = $('.fandianNum').text();
                        // var fandN=3.5;
                        var n1 = (fandN - fdSmall) / y
                        lastJjin = sjj + n1 * x;
                        var totalJJ = lastJjin;
                        var bifen = $('.moshiBoxActive').attr('data-id');
                        if (bifen == 1) {
                            totalJJ = lastJjin / 1
                        }
                        if (bifen == 10) {
                            totalJJ = lastJjin / 10
                        }
                        if (bifen == 100) {
                            totalJJ = lastJjin / 100
                        }
                        if (bifen == 1000) {
                            totalJJ = lastJjin / 1000
                        }

                        bonus = totalJJ.toFixed(3);
                    } else {
                        bonus = Number(bjj);
                    }
                    aNum = wayN
                    tzmsg.push({
                        'play_id': play_id,
                        'action_coin': ptzje,
                        'bonus': bonus,
                        'mode': mode,
                        'bets_num': zs,
                        'mulriple': mulriple,
                        'rebate': rebate,
                        'code_list': aNum
                    })
                    // console.log('2===========' + tzmsg)
                })
                if ($('.touzhulanD ul li').length > 0) {
                    $('.touzhulanD ul li').each(function () {
                        var beishu = $(this).attr('beishu');//倍数
                        var touzs = $(this).attr('touzs');//投注数
                        var totaljine = $(this).attr('totaljine');//投注金额
                        var fanshui = $(this).attr('fanshui') / 100;//反水
                        var jianj = $(this).attr('jianj');//奖金
                        var play_id = $(this).attr('play-id');//玩法id
                        var playnum = $(this).attr('playnum');//玩法号码
                        var mode = $(this).attr('mode');//下注模式
                        tzmsg.push({
                            'play_id': play_id,
                            'action_coin': totaljine,
                            'bonus': jianj,
                            'mode': mode,
                            'bets_num': touzs,
                            'mulriple': beishu,
                            'rebate': fanshui,
                            'code_list': playnum
                        });
                    });
                }
                alltzmsg = {'common': tzcommon, 'betBean': tzmsg}
                // console.log(alltzmsg)
                //请求下单接口
                getJson('post', '/officialorders/officialorders/makeOrder?c=Officialorders&a=makeOrder', alltzmsg, function (data) {
                    if (data.code == 1) {
                        $.Msg(data.data);
                        $('.touzhulanD ul').html('');
                        //下单成功清空已选择数据
                        $('.playInfoNum').removeClass('pickNum');
                        $('.playInfoNum span').removeClass('xztzA');
                        $('.playInfoNum p').removeClass('xztzA');
                        $('.playInfoRight span').removeClass('fastBtnA');
                        $('.totalZs').text('0');
                        $('.totalPrice').text('0');
                        $('.proless').text('0');
                        $('#playInfoNumIn').val('');
                        playNum = [];
                        beishu = 1;
                        $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面
                        $._getBalane();
                    } else {
                        $.Msg(data.message);
                        addTouzhu();//添加投注订单

                    }
                })
            }
        }
    })//一键投注

    $('.touzhuOkBtn').on('click', function () {
        var action_no = $('.lotteryQishu span').text();//下单期数
        var tzmsg = [];//此单投注信息
        var tzcommon = [];//公用投注信息;
        var alltzmsg;
        tzcommon = {'member_id': member_id, 'action_no': action_no, 'lottery_uuid': uuid, 'lottery_pid': lottery_id}
        if ($('.touzhulanD ul li').length > 0) {

            $('.touzhulanD ul li').each(function () {
                var beishu = $(this).attr('beishu');//倍数
                var touzs = $(this).attr('touzs');//投注数
                var totaljine = $(this).attr('totaljine');//投注金额
                var fanshui = $(this).attr('fanshui') / 100;//反水
                var jianj = $(this).attr('jianj');//奖金
                var play_id = $(this).attr('play-id');//玩法id
                var playnum = $(this).attr('playnum');//玩法号码
                var mode = $(this).attr('mode');//下注模式
                tzmsg.push({
                    'play_id': play_id,
                    'action_coin': totaljine,
                    'bonus': jianj,
                    'mode': mode,
                    'bets_num': touzs,
                    'mulriple': beishu,
                    'rebate': fanshui,
                    'code_list': playnum
                });
                alltzmsg = {'common': tzcommon, 'betBean': tzmsg};
                getJson(
                    'post',
                    '/officialorders/officialorders/makeOrder?c=Officialorders&a=makeOrder',
                    alltzmsg,
                    function (data) {
                        if (data.code == 1) {
                            $.Msg(data.data, {}
                            );
                            $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面
                            $('.touzhulanD ul').html('');
                            $._getBalane();
                        } else {
                            $.Msg(data.message, {}
                            );
                        }
                    })
            });
        } else {
            $.Msg('购菜篮还没有可下单的注单', {}
            );
        }
    });//确认投注（购彩篮里面的注单）


    //清空已选号码
    $('.qingkongBtn').on('click', function () {
        $('.touzhulanD ul').html('');
    });
    //我要追号
    $('.zhuihaoBtn').on('click', function () {
        $('.touzhulanD ul').html('');
    });
    ;
    //添加投注数据htmll

    //没有所在位置选择
    function creatTouzhuHtml() {
        var wfid = $('.playInfoTypeInfoA').attr('id');
        var play_id = $('.playInfoTypeInfoA').attr('play-id');
        var jianj = $('.thisWayPrice').text();
        var fanshui = $('.fandianNum').text();
        var mode = $('.moshiBoxActive').attr('mode');
        var html = '<li class="relative" play-id="' + play_id + '" mode="' + mode + '" beishu="' + beishu + '" touzs="' + totalNum + '" totaljine="' + tzjine + '" fanshui="' + fanshui + '" jianj="' + jianj + '" title="' + playName + '" wfid="' + wfid + '" playNum="' + playNum + '">' +
            '<span style="width:25%">' + playName + '</span>' +
            '<span style="width:25%">' + playNum + '</span>' +
            '<span style="width:15%">' + totalNum + '</span>' +
            '<span style="width:15%">' + beishu + '</span>' +
            '<span style="width:20%">' + tzjine + '</span>' +
            '<e class="deleteThisMsg absolute inline">×</e>' +
            '</li>'

        var lil = $('.touzhulanD ul li').length
        if (lil < 1) {
            $('.touzhulanD ul').html(html);
        } else {
            $('.touzhulanD ul').append(html);
        }

        $('.deleteThisMsg').on('click', function () {
            $(this).parent().remove();
        });
        //节点创建完成清空已选择数据
        $('.playInfoNum').removeClass('pickNum');
        $('.playInfoNum span').removeClass('xztzA');
        $('.playInfoNum p').removeClass('xztzA');
        $('.playInfoRight span').removeClass('fastBtnA');
        $('.totalZs').text('0');
        $('.totalPrice').text('0');
        $('.proless').text('0');
        $('#playInfoNumIn').val('');
        playNum = [];
        beishu = 1;

    }

    //有所在位置选择
    function creatTouzhuHtml1() {
        var wfid = $('.playInfoTypeInfoA').attr('id');
        var play_id = $('.playInfoTypeInfoA').attr('play-id');
        var jianj = $('.thisWayPrice').text();
        var fanshui = $('.fandianNum').text();
        var mode = $('.moshiBoxActive').attr('mode');
        var wzd = '';
        $('.playInfoNumBtnA').each(function () {
            var des = $(this).next().text();
            wzd += des + ','
        });
        var html = '<li class="relative" play-id="' + play_id + '" mode="' + mode + '" beishu="' + beishu + '" touzs="' + totalNum + '" totaljine="' + tzjine + '" fanshui="' + fanshui + '" jianj="' + jianj + '" title="' + playName + '" wfid="' + wfid + '" playNum="' + playNum + '">' +
            '<span style="width:25%">' + playName + '</span>' +
            '<span style="width:25%">' + wzd + '' + playNum + '</span>' +
            '<span style="width:15%">' + totalNum + '</span>' +
            '<span style="width:15%">' + beishu + '</span>' +
            '<span style="width:20%">' + tzjine + '</span>' +
            '<e class="deleteThisMsg absolute inline">×</e>' +
            '</li>'

        var lil = $('.touzhulanD ul li').length
        if (lil < 1) {
            $('.touzhulanD ul').html(html);
        } else {
            $('.touzhulanD ul').append(html);
        }

        $('.deleteThisMsg').on('click', function () {
            $(this).parent().remove();
        })
        //节点创建完成清空已选择数据
        $('.playInfoNum').removeClass('pickNum');
        $('.playInfoNum span').removeClass('xztzA');
        $('.playInfoNum p').removeClass('xztzA');
        $('.playInfoRight span').removeClass('fastBtnA');
        $('.totalZs').text('0');
        $('.totalPrice').text('0');
        $('.proless').text('0');
        $('#playInfoNumIn').val();
        playNum = [];
        beishu = 1;

    }

    // 计算选号注数
    function countZhushu() {
        var playId = $('.playInfoTypeInfoA').attr('id');//小玩法的id（例：五星直选复选的id=4）
        var wsn = 0;//组成几位数（id=6就是一个数组组合成5位数）
        var fristPrice = 0;//投注金额（）
        var totalZhushuNum = 0;//总注数
        var zhushu = [];
        var pickL = $('.pickNum').length;
        var allPN = $('.playInfoNum').length;
        var pickWs = $('.playInfoNumBtnA').length;//选择的位数
        var dhpick = $('.playInfoNum').eq(1).find('.xztzA').length;
        var echpick = $('.playInfoNum').eq(0).find('.xztzA').length;
        var pickNumA = 0;
        $('.pickNum').each(function () {
            pickNumA = $(this).find('.xztzA').length;
        })
        if (playId == 4 || playId == 15) {
            if (pickL < allPN) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                $('.playInfoNum').each(function () {
                    var numL = $(this).find('.xztzA').length;
                    zhushu.push(numL);
                    sscWxZxFs();
                })
            }
        }
        if (playId == 6) {
            wsn = 5;
            var numL = $('.playInfoNum').find('.xztzA').length;
            var allNum = [];
            if (numL < 5) {
                $('.proless').text(0);
                totalZhushuNum = 0;
            } else {
                $('.xztzA').each(function () {
                    var tnum = $(this).attr('data-id');
                    allNum.push(tnum);
                });
                chooseZs(wsn)
            }
        }
        if (playId == 7) {
            wsn = 3
            if (pickL < allPN || dhpick < 3) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var list1 = [];
                var list2 = [];
                $('.playInfoNum').eq(0).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list1.push(num);
                });
                $('.playInfoNum').eq(1).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list2.push(num);
                });
                qpqc(list1, list2, wsn)
            }
        }
        if (playId == 8) {
            wsn = 2
            if (pickL < allPN || echpick < 2) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var list1 = [];
                var list2 = [];
                $('.playInfoNum').eq(1).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list1.push(num);
                });
                $('.playInfoNum').eq(0).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list2.push(num);
                });
                qpqc(list1, list2, wsn)
            }
        }
        if (playId == 9 || playId == 18) {
            wsn = 2
            if (pickL < allPN || dhpick < 2 || echpick < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var list1 = [];
                var list2 = [];
                $('.playInfoNum').eq(0).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list1.push(num);
                });
                $('.playInfoNum').eq(1).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list2.push(num);
                });
                qpqc(list1, list2, wsn)
            }
        }
        if (playId == 10) {
            if (pickL < allPN || dhpick < 2 || echpick < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var allList = [];

                $('.playInfoNum').each(function () {
                    var list = [];
                    $(this).find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        list.push(num);
                    });
                    allList.push(list);
                })
                qpbupxt(allList)
            }
        }
        if (playId == 11 || playId == 20) {
            if (pickL < allPN || echpick < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var allList = [];
                $('.playInfoNum').each(function () {
                    var list = [];
                    $(this).find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        list.push(num);
                    });
                    allList.push(list);
                })
                qpbupxt(allList)
            }
        }
        if (playId == 17) {
            wsn = 4;
            var numL = $('.playInfoNum').find('.xztzA').length;
            var allNum = [];
            if (numL < 4) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                $('.xztzA').each(function () {
                    var tnum = $(this).attr('data-id');
                    allNum.push(tnum);
                });
                chooseZs(wsn)
            }
        }
        if (playId == 19) {
            wsn = 2;
            var numL = $('.playInfoNum').find('.xztzA').length;
            var allNum = [];
            if (numL < 2) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                $('.xztzA').each(function () {
                    var tnum = $(this).attr('data-id');
                    allNum.push(tnum);
                });
                chooseZs(wsn)
            }
        }
        if (playId == 24 || playId == 36 || playId == 48 || playId == 60 || playId == 71 || playId == 102 || playId == 103 || playId == 104 || playId == 105 || playId == 106 || playId == 107 || playId == 108 || playId == 109 || playId == 110 || playId == 118 || playId == 119 || playId == 120 || playId == 121 || playId == 111 || playId == 112 || playId == 113 || playId == 114 || playId == 115 || playId == 127 || playId == 128 || playId == 129 || playId == 130 || playId == 131 || playId == 132 || playId == 133 || playId == 134 || playId == 135 || playId == 136 || playId == 150 || playId == 151 || playId == 137 || playId == 138 || playId == 139 || playId == 140 || playId == 141 || playId == 142 || playId == 143 || playId == 144 || playId == 145 || playId == 146 || playId == 147 || playId == 148 || playId == 149 || playId == 154 || playId == 157 || playId == 160) {
            if (pickL < allPN) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var total = [];
                $('.playInfoNum').each(function () {
                    var numl = $(this).find('.xztzA').length;
                    total.push(numl)
                });
                qsfs(total);
            }
        }
        if (playId == 26 || playId == 38 || playId == 50) {
            wsn = 3
            if (pickL < allPN) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var hz = [];
                var arr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]];
                $('.playInfoNum').find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    hz.push(num)
                });
                hezhi(arr, hz, wsn);
            }
        }
        if (playId == 27 || playId == 39 || playId == 51) {
            wsn = 3
            if (pickL < allPN) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var hz = [];
                $('.playInfoNum').find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    hz.push(num)
                });
                var arr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]]
                kdz(hz, wsn, arr);
            }
        }
        if (playId == 28 || playId == 40 || playId == 52) {
            if (pickL < allPN || echpick < 2) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var zsPickL = $('.playInfoNum').find('.xztzA').length;
                qszs(zsPickL);
            }
        }
        if (playId == 29 || playId == 41 || playId == 53 || playId == 94 || playId == 97) {
            wsn = 3;
            var numL = $('.playInfoNum').find('.xztzA').length;
            var allNum = [];
            if (numL < 3) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                $('.xztzA').each(function () {
                    var tnum = $(this).attr('data-id');
                    allNum.push(tnum);
                });
                chooseZs(wsn)
            }
        }
        if (playId == 31 || playId == 43 || playId == 55) {
            var numL = $('.playInfoNum').find('.xztzA').length;
            if (numL < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pzs = [];
                $('.xztzA').each(function () {
                    var tzs = 0;
                    var tnum = $(this).attr('data-id');
                    if (tnum == 1 || tnum == 26) {
                        tzs = 1
                    }
                    if (tnum == 2 || tnum == 3 || tnum == 24 || tnum == 25) {
                        tzs = 2
                    }
                    if (tnum == 4 || tnum == 23) {
                        tzs = 4
                    }
                    if (tnum == 5 || tnum == 22) {
                        tzs = 5
                    }
                    if (tnum == 6 || tnum == 21) {
                        tzs = 6
                    }
                    if (tnum == 7 || tnum == 20) {
                        tzs = 8
                    }
                    if (tnum == 8 || tnum == 19) {
                        tzs = 10
                    }
                    if (tnum == 9 || tnum == 18) {
                        tzs = 11
                    }
                    if (tnum == 10 || tnum == 17) {
                        tzs = 13
                    }
                    if (tnum == 11 || tnum == 12 || tnum == 15 || tnum == 16) {
                        tzs = 14
                    }
                    if (tnum == 13 || tnum == 14) {
                        tzs = 15
                    }
                    pzs.push(tzs)
                });
                qszshz(pzs)
            }
        }
        if (playId == 32 || playId == 44 || playId == 56) {
            var numL = $('.playInfoNum').find('.xztzA').length;
            if (numL < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                totalZhushuNum = 54
            }
        }
        if (playId == 62 || playId == 73) {

            var numL = $('.playInfoNum').find('.xztzA').length;
            if (numL < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pzs = [];
                $('.xztzA').each(function () {
                    var tzs = 0;
                    var tnum = $(this).attr('data-id');
                    if (tnum == 0 || tnum == 18) {
                        tzs = 1
                    }
                    if (tnum == 1 || tnum == 17) {
                        tzs = 2
                    }
                    if (tnum == 2 || tnum == 16) {
                        tzs = 3
                    }
                    if (tnum == 3 || tnum == 15) {
                        tzs = 4
                    }
                    if (tnum == 4 || tnum == 14) {
                        tzs = 5
                    }
                    if (tnum == 5 || tnum == 13) {
                        tzs = 6
                    }
                    if (tnum == 6 || tnum == 12) {
                        tzs = 7
                    }
                    if (tnum == 7 || tnum == 11) {
                        tzs = 8
                    }
                    if (tnum == 8 || tnum == 10) {
                        tzs = 9
                    }
                    if (tnum == 9) {
                        tzs = 10
                    }
                    pzs.push(tzs)
                });
                qszshz(pzs)
            }
        }
        if (playId == 63 || playId == 74) {
            wsn = 2;
            var numL = $('.playInfoNum').find('.xztzA').length;
            if (numL < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var hz = [];
                $('.playInfoNum').find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    hz.push(num)
                });
                var arr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]];
                kdz(hz, wsn, arr)
            }
        }
        if (playId == 64 || playId == 75 || playId == 87 || playId == 89 || playId == 91 || playId == 93 || playId == 96) {
            wsn = 2;
            var numL = $('.playInfoNum').find('.xztzA').length;
            var allNum = [];
            if (numL < 2) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                $('.xztzA').each(function () {
                    var tnum = $(this).attr('data-id');
                    allNum.push(tnum);
                });
                chooseZs(wsn)
            }
        }
        if (playId == 66 || playId == 77) {
            var numL = $('.playInfoNum').find('.xztzA').length;
            if (numL < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pzs = [];
                $('.xztzA').each(function () {
                    var tzs = 0;
                    var tnum = $(this).attr('data-id');
                    if (tnum == 1 || tnum == 2 || tnum == 17 || tnum == 16) {
                        tzs = 1
                    }
                    if (tnum == 3 || tnum == 4 || tnum == 15 || tnum == 14) {
                        tzs = 2
                    }
                    if (tnum == 5 || tnum == 6 || tnum == 13 || tnum == 12) {
                        tzs = 3
                    }
                    if (tnum == 7 || tnum == 8 || tnum == 11 || tnum == 10) {
                        tzs = 4
                    }
                    if (tnum == 9) {
                        tzs = 5
                    }
                    pzs.push(tzs)
                });
                qszshz(pzs)
            }
        }
        if (playId == 67 || playId == 78) {
            var numL = $('.playInfoNum').find('.xztzA').length;
            if (numL < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                totalZhushuNum = 9
            }
        }
        if (playId == 81) {
            if (pickL < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                $('.playInfoNum').each(function () {
                    var numL = $(this).find('.xztzA').length;
                    zhushu.push(numL);
                    qszshz(zhushu);
                })
            }
        }
        if (playId == 86 || playId == 88 || playId == 90 || playId == 92 || playId == 95) {
            if (pickL < allPN) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var numL = $('.playInfoNum').find('.xztzA').length;
                totalZhushuNum = numL
            }
        }
        if (playId == 164) {
            wsn = 2;
            if (pickL < 2 || pickNumA < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pickn = [];
                $('.pickNum').each(function () {
                    var pn = [];
                    $(this).find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        pn.push(num);
                    });
                    pickn.push(pn);
                })
                rxzxfs(pickn, wsn)

            }
        }
        if (playId == 173) {
            wsn = 3;
            if (pickL < 3 || pickNumA < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pickn = [];
                $('.pickNum').each(function () {
                    var pn = [];
                    $(this).find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        pn.push(num);
                    });
                    pickn.push(pn);
                })
                rxzxfs(pickn, wsn)

            }
        }
        if (playId == 183) {
            wsn = 4;
            if (pickL < 4 || pickNumA < 1) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pickn = [];
                $('.pickNum').each(function () {
                    var pn = [];
                    $(this).find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        pn.push(num);
                    });
                    pickn.push(pn);
                })
                rxzxfs(pickn, wsn)

            }
        }
        if (playId == 166) {
            wsn = 2;
            if (pickL < allPN || pickWs < 2) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var arr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]]
                var hz = [];
                $('.playInfoNum').find('.xztzA').each(function () {
                    var n = $(this).attr('data-id');
                    hz.push(n);
                })
                rxpl(arr, hz, wsn);
            }
        }
        if (playId == 167) {
            wsn = 2;
            if (echpick < 2 || pickWs < 2) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var zhushu = [];
                $('.playInfoNum').find('.xztzA').each(function () {
                    var n = $(this).attr('data-id');
                    zhushu.push(n);
                })
                rxefs(zhushu, wsn);
            }
        }
        if (playId == 169) {
            var numL = $('.playInfoNum').find('.xztzA').length;
            if (numL < 1 || pickWs < 2) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pzs = [];
                $('.xztzA').each(function () {
                    var tzs = 0;
                    var tnum = $(this).attr('data-id');
                    if (tnum == 1 || tnum == 2 || tnum == 17 || tnum == 16) {
                        tzs = 1
                    }
                    if (tnum == 3 || tnum == 4 || tnum == 15 || tnum == 14) {
                        tzs = 2
                    }
                    if (tnum == 5 || tnum == 6 || tnum == 13 || tnum == 12) {
                        tzs = 3
                    }
                    if (tnum == 7 || tnum == 8 || tnum == 11 || tnum == 10) {
                        tzs = 4
                    }
                    if (tnum == 9) {
                        tzs = 5
                    }
                    pzs.push(tzs)
                });
                qszshz(pzs)
            }
        }
        if (playId == 175) {
            wsn = 3
            if (pickL < allPN || pickWs < 3) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var hz = [];
                var arr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]];
                $('.playInfoNum').find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    hz.push(num)
                });
                rshz(arr, hz, wsn);
            }
        }
        if (playId == 176) {
            wsn = 3;
            var zcs = 2;
            if (pickWs < 3 || echpick < 2) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pn = [];
                $('.playInfoNum').find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    pn.push(num)
                });
                rxszs(pn, wsn, zcs);
            }
        }
        if (playId == 177) {
            wsn = 3;
            var zcs = 3;
            if (pickWs < 3 || echpick < 3) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pn = [];
                $('.playInfoNum').find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    pn.push(num)
                });
                rxszs1(pn, wsn, zcs);
            }
        }
        if (playId == 185) {
            wsn = 4;
            var zcs = 4;
            if (pickWs < 4 || echpick < 4) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pn = [];
                $('.playInfoNum').find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    pn.push(num)
                });
                rxszs1(pn, wsn, zcs);
            }
        }
        if (playId == 179) {
            wsn = 3;
            var numL = $('.playInfoNum').find('.xztzA').length;
            if (numL < 1 || pickWs < 3) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var pzs = [];
                $('.xztzA').each(function () {
                    var tzs = 0;
                    var tnum = $(this).attr('data-id');
                    if (tnum == 1 || tnum == 26) {
                        tzs = 1
                    }
                    if (tnum == 2 || tnum == 3 || tnum == 24 || tnum == 25) {
                        tzs = 2
                    }
                    if (tnum == 4 || tnum == 23) {
                        tzs = 4
                    }
                    if (tnum == 5 || tnum == 22) {
                        tzs = 5
                    }
                    if (tnum == 6 || tnum == 21) {
                        tzs = 6
                    }
                    if (tnum == 7 || tnum == 20) {
                        tzs = 8
                    }
                    if (tnum == 8 || tnum == 19) {
                        tzs = 10
                    }
                    if (tnum == 9 || tnum == 18) {
                        tzs = 11
                    }
                    if (tnum == 10 || tnum == 17) {
                        tzs = 13
                    }
                    if (tnum == 11 || tnum == 12 || tnum == 15 || tnum == 16) {
                        tzs = 14
                    }
                    if (tnum == 13 || tnum == 14) {
                        tzs = 15
                    }
                    pzs.push(tzs)
                });
                rxshz(wsn, pzs)
            }
        }
        if (playId == 186) {
            wsn = 2
            wsn1 = 4;
            if (pickL < allPN || dhpick < 2 || echpick < 1 || pickWs < 4) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var list1 = [];
                var list2 = [];
                $('.playInfoNum').eq(0).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list1.push(num);
                });
                $('.playInfoNum').eq(1).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list2.push(num);
                });
                txs12(list1, list2, wsn, wsn1)
            }
        }
        if (playId == 187) {
            if (pickWs < 4 || echpick < 2) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                wsn = 4;
                var zcs = 2;
                if (pickWs < 4 || echpick < 2) {
                    totalZhushuNum = 0;
                } else {
                    var pn = [];
                    $('.playInfoNum').find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        pn.push(num)
                    });
                    rxszs1(pn, wsn, zcs);
                }
            }
        }
        if (playId == 188) {
            wsn = 1
            wsn1 = 4;
            if (pickL < allPN || dhpick < 1 || echpick < 1 || pickWs < 4) {
                totalZhushuNum = 0;
                $('.proless').text(0);
            } else {
                var list1 = [];
                var list2 = [];
                $('.playInfoNum').eq(0).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list1.push(num);
                });
                $('.playInfoNum').eq(1).find('.xztzA').each(function () {
                    var num = $(this).attr('data-id');
                    list2.push(num);
                });
                txs12(list1, list2, wsn, wsn1)
            }
        }


        $('.totalZs').text(totalZhushuNum);
        $('.totalPrice').text(utp * totalZhushuNum * beishu);
        if ($('.totalPrice').text() > 0) {
            $('.proless').text($('.thisWayPrice').text() - $('.totalPrice').text());
        }

        function sscWxZxFs() {
            //直选复式注数算法
            var result = 1;
            for (var index = 0; index < zhushu.length; index++) {
                result *= zhushu[index];
                totalZhushuNum = result;
            }
        }

        function chooseZs(num) {
            function choose(arr, size) {
                var allResult = [];
                (function (arr, size, result) {
                    var arrLen = arr.length;
                    if (size > arrLen) {
                        return;
                    }
                    if (size == arrLen) {
                        allResult.push([].concat(result, arr))
                    } else {
                        for (var i = 0; i < arrLen; i++) {
                            var newResult = [].concat(result);
                            newResult.push(arr[i]);

                            if (size == 1) {
                                allResult.push(newResult);
                            } else {
                                var newArr = [].concat(arr);
                                newArr.splice(0, i + 1);
                                arguments.callee(newArr, size - 1, newResult);
                            }
                        }
                    }
                })(arr, size, []);
                return allResult;
            };
            var int = choose(allNum, num);
            totalZhushuNum = int.length;
        }

        //二重号
        function qpqc(num1, num2, wsn) {
            var coutNum = 0;

            function AAA(first, array, M) {
                var N = array.length;
                var top = 0, queue = [], flag = [], arr = [], _arr = [];

                function comb(first, s, n, m) {
                    var i;
                    if (s > n)
                        return;
                    if (top == m) {
                        for (i = 0; i < m; i++) {
                            _arr.push(queue[i]);
                        }
                        _arr.push(first);
                        arr.push(_arr)
                        _arr = []
                        return;
                    }
                    queue[top++] = array[s];
                    comb(first, s + 1, n, m);
                    top--;
                    comb(first, s + 1, n, m);
                }

                comb(first, 0, N, M);
                return arr
            }

            for (var i = 0; i < list1.length; i++) {

                var newList2 = [];
                for (var j = 0; j < list2.length; j++) {
                    if (list1[i] == list2[j]) {

                    } else {
                        newList2.push(list2[j]);
                    }

                }
                var cn = parseInt(AAA(list1[i], newList2, wsn).length);
                coutNum += cn
            }
            totalZhushuNum = coutNum;
        }

        //全排列，相同号码不排列
        function qpbupxt(garr) {
            function combination(arr) {
                var sarr = [[]];
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    var tarr = [];
                    //console.log('****',sarr)
                    for (var j = 0; j < sarr.length; j++) {
                        for (var k = 0; k < arr[i].length; k++) {
                            var isEqu = false;
                            for (var l = 0; l < sarr[j].length; l++) {
                                if (sarr[j][l] == arr[i][k]) isEqu = true;
                            }
                            if (isEqu) continue;
                            tarr.push(sarr[j].concat(arr[i][k]));
                        }
                    }
                    sarr = tarr;
                }

                for (var m = 0; m < sarr.length; m++) {
                    result.push(sarr[m]);
                }
                return result;
            }

            var result = combination(garr);
            totalZhushuNum = result.length;//全排列（重复数字不排列）
        }

        //前三复式(每位选择格数相乘)
        function qsfs(arr) {
            var alls = 1;
            for (var i = 0; i < arr.length; i++) {
                alls *= arr[i]
            }
            totalZhushuNum = alls
        }

        //全排列后每一个数位数相加等于和值
        var lazs = 0;

        function hezhi(arr, hezhishu, num) {
            qplcom(arr, hezhishu, num);
            totalZhushuNum = lazs
        }

        function qplcom(arr, hezhishu, num) {
            var pickHzs = hezhishu;

            function combine(arr) {
                if (arr.length > 1) {
                    var len1 = arr[0].length, len2 = arr[1].length, newArr = arr.slice(0), temp = [];
                    for (var i = 0; i < len1; i++) {
                        for (var j = 0; j < len2; j++) {
                            temp.push(arr[0][i].toString() + ',' + arr[1][j].toString())
                        }
                    }
                    newArr.splice(0, 2, temp);
                    return arguments.callee(newArr)
                }
                return arr[0]
            }

            var int = combine(arr, num);
            var fhzs = [];
            var hxzs;
            var rt = [];
            for (var i = 0; i < int.length; i++) {
                hxzs = int[i].split(',');
                fhzs.push(hxzs)
            }//存数组
            for (var j = 0; j < fhzs.length; j++) {
                var arr = fhzs[j];
                var result = 0;
                for (var i = arr.length - 1; i >= 0; i--) {
                    result += Number(arr[i]);
                }
                rt.push(result)
            }//取相加的和值
            var zs = 0;
            for (var i = 0; i < pickHzs.length; i++) {
                var pickS = pickHzs[i];
                for (var j = 0; j < rt.length; j++) {
                    if (pickS == rt[j]) {
                        zs++
                    }
                }

            }
            lazs = zs;
        }

        //任选4组12
        function txs12(num1, num2, wsn, wsn1) {
            var wezhi = [];
            $('.playInfoNumBtnA').each(function () {
                var num = $(this).attr('data-id');
                wezhi.push(num);
            });

            function choose(arr, size) {
                var allResult = [];
                (function (arr, size, result) {
                    var arrLen = arr.length;
                    if (size > arrLen) {
                        return;
                    }
                    if (size == arrLen) {
                        allResult.push([].concat(result, arr))
                    } else {
                        for (var i = 0; i < arrLen; i++) {
                            var newResult = [].concat(result);
                            newResult.push(arr[i]);

                            if (size == 1) {
                                allResult.push(newResult);
                            } else {
                                var newArr = [].concat(arr);
                                newArr.splice(0, i + 1);
                                arguments.callee(newArr, size - 1, newResult);
                            }
                        }
                    }
                })(arr, size, []);
                return allResult;
            };
            var int = choose(wezhi, wsn1).length;
            var coutNum = 0;

            function AAA(first, array, M) {
                var N = array.length;
                var top = 0, queue = [], flag = [], arr = [], _arr = [];

                function comb(first, s, n, m) {
                    var i;
                    if (s > n)
                        return;
                    if (top == m) {
                        for (i = 0; i < m; i++) {
                            _arr.push(queue[i]);
                        }
                        _arr.push(first);
                        arr.push(_arr)
                        _arr = []
                        return;
                    }
                    queue[top++] = array[s];
                    comb(first, s + 1, n, m);
                    top--;
                    comb(first, s + 1, n, m);
                }

                comb(first, 0, N, M);
                return arr
            }

            for (var i = 0; i < list1.length; i++) {

                var newList2 = [];
                for (var j = 0; j < list2.length; j++) {
                    if (list1[i] == list2[j]) {

                    } else {
                        newList2.push(list2[j]);
                    }

                }
                var cn = parseInt(AAA(list1[i], newList2, wsn).length);
                coutNum += cn
            }
            totalZhushuNum = coutNum * int;
        }

        //任选三直选和值
        function rshz(arr1, hezhishu, num) {
            qplcom(arr1, hezhishu, num);
            var wezhi = [];
            $('.playInfoNumBtnA').each(function () {
                var num = $(this).attr('data-id');
                wezhi.push(num);
            });

            function choose(arr, size) {
                var allResult = [];
                (function (arr, size, result) {
                    var arrLen = arr.length;
                    if (size > arrLen) {
                        return;
                    }
                    if (size == arrLen) {
                        allResult.push([].concat(result, arr))
                    } else {
                        for (var i = 0; i < arrLen; i++) {
                            var newResult = [].concat(result);
                            newResult.push(arr[i]);

                            if (size == 1) {
                                allResult.push(newResult);
                            } else {
                                var newArr = [].concat(arr);
                                newArr.splice(0, i + 1);
                                arguments.callee(newArr, size - 1, newResult);
                            }
                        }
                    }
                })(arr, size, []);
                return allResult;
            };
            var int = choose(wezhi, num).length;
            totalZhushuNum = lazs * int;
        }

        //任选三组三
        function rxszs(arr, num, zcs) {
            var wezhi = [];
            $('.playInfoNumBtnA').each(function () {
                var num = $(this).attr('data-id');
                wezhi.push(num);
            });

            function choose(arr, size) {
                var allResult = [];
                (function (arr, size, result) {
                    var arrLen = arr.length;
                    if (size > arrLen) {
                        return;
                    }
                    if (size == arrLen) {
                        allResult.push([].concat(result, arr))
                    } else {
                        for (var i = 0; i < arrLen; i++) {
                            var newResult = [].concat(result);
                            newResult.push(arr[i]);

                            if (size == 1) {
                                allResult.push(newResult);
                            } else {
                                var newArr = [].concat(arr);
                                newArr.splice(0, i + 1);
                                arguments.callee(newArr, size - 1, newResult);
                            }
                        }
                    }
                })(arr, size, []);
                return allResult;
            };
            var int = choose(wezhi, num).length;
            var int1 = choose(arr, zcs).length;
            totalZhushuNum = int1 * 2 * int
        }

        //任选三组六
        function rxszs1(arr, num, zcs) {
            var wezhi = [];
            $('.playInfoNumBtnA').each(function () {
                var num = $(this).attr('data-id');
                wezhi.push(num);
            });

            function choose(arr, size) {
                var allResult = [];
                (function (arr, size, result) {
                    var arrLen = arr.length;
                    if (size > arrLen) {
                        return;
                    }
                    if (size == arrLen) {
                        allResult.push([].concat(result, arr))
                    } else {
                        for (var i = 0; i < arrLen; i++) {
                            var newResult = [].concat(result);
                            newResult.push(arr[i]);

                            if (size == 1) {
                                allResult.push(newResult);
                            } else {
                                var newArr = [].concat(arr);
                                newArr.splice(0, i + 1);
                                arguments.callee(newArr, size - 1, newResult);
                            }
                        }
                    }
                })(arr, size, []);
                return allResult;
            };
            var int = choose(wezhi, num).length;
            var int1 = choose(arr, zcs).length;
            totalZhushuNum = int1 * int
        }

        //任选三组选和值
        function rxshz(num1, num) {
            var wezhi = [];
            $('.playInfoNumBtnA').each(function () {
                var num = $(this).attr('data-id');
                wezhi.push(num);
            });

            function choose(arr, size) {
                var allResult = [];
                (function (arr, size, result) {
                    var arrLen = arr.length;
                    if (size > arrLen) {
                        return;
                    }
                    if (size == arrLen) {
                        allResult.push([].concat(result, arr))
                    } else {
                        for (var i = 0; i < arrLen; i++) {
                            var newResult = [].concat(result);
                            newResult.push(arr[i]);

                            if (size == 1) {
                                allResult.push(newResult);
                            } else {
                                var newArr = [].concat(arr);
                                newArr.splice(0, i + 1);
                                arguments.callee(newArr, size - 1, newResult);
                            }
                        }
                    }
                })(arr, size, []);
                return allResult;
            };
            var int = choose(wezhi, num1).length;
            var zs = 0
            for (var i = num.length - 1; i >= 0; i--) {
                zs += Number(num[i]);
            }
            totalZhushuNum = zs * int;
        }

        //全排列后每一个数位最大值和最小值的差等于和值
        function kdz(kds, num, arr) {
            var pickKds = kds;

            function combine(arr) {
                if (arr.length > 1) {
                    var len1 = arr[0].length, len2 = arr[1].length, newArr = arr.slice(0), temp = [];
                    for (var i = 0; i < len1; i++) {
                        for (var j = 0; j < len2; j++) {
                            temp.push(arr[0][i].toString() + ',' + arr[1][j].toString())
                        }
                    }
                    newArr.splice(0, 2, temp);
                    return arguments.callee(newArr)
                }
                return arr[0]
            }

            var int = combine(arr, num);
            var fhzs = [];
            var hxzs;
            var rt = [];
            for (var i = 0; i < int.length; i++) {
                hxzs = int[i].split(',');
                fhzs.push(hxzs)
            }//存数组
            for (var j = 0; j < fhzs.length; j++) {
                var arr = fhzs[j];
                var min = arr[0];
                var max = arr[0];
                var result = 0;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] < min) {
                        min = arr[i];
                    }
                    if (arr[i] > max) {
                        max = arr[i];
                    }
                    result = max - min;
                }
                rt.push(result)
            }//取最大值和最小值的差
            var zs = 0;
            for (var i = 0; i < pickKds.length; i++) {
                var pickS = pickKds[i];
                for (var j = 0; j < rt.length; j++) {
                    if (pickS == rt[j]) {
                        zs++
                    }
                }

            }
            totalZhushuNum = zs
        }

        //前三（组3）
        function qszs(num) {
            totalZhushuNum = (num - 1) * num
        }

        //前三（组选和值）
        function qszshz(num) {
            var zs = 0
            for (var i = num.length - 1; i >= 0; i--) {
                zs += Number(num[i]);
            }
            totalZhushuNum = zs
        }

        //任选和值
        function rxpl(arr, hezhishu, ws) {
            var wezhi = [];
            $('.playInfoNumBtnA').each(function () {
                var num = $(this).attr('data-id');
                wezhi.push(num);
            });

            function choose(arry, size) {
                var allResult = [];
                (function (arry, size, result) {
                    var arrLen = arry.length;
                    if (size > arrLen) {
                        return;
                    }
                    if (size == arrLen) {
                        allResult.push([].concat(result, arry))
                    } else {
                        for (var i = 0; i < arrLen; i++) {
                            var newResult = [].concat(result);
                            newResult.push(arry[i]);

                            if (size == 1) {
                                allResult.push(newResult);
                            } else {
                                var newArr = [].concat(arry);
                                newArr.splice(0, i + 1);
                                arguments.callee(newArr, size - 1, newResult);
                            }
                        }
                    }
                })(arry, size, []);
                return allResult;
            };
            var intl = choose(wezhi, ws).length;

            qplcom(arr, hezhishu, ws);
            totalZhushuNum = lazs * intl;
        }

        //任选复式
        function rxzxfs(arrList, wsn) {
            //== 传入数组，需要结果内容C(m,n);有结果反馈
            function groupSplit2(arr, size) {
                var r = []; //result

                function _(t, a, n) { //tempArr, arr, num
                    if (n === 0) {
                        r[r.length] = t;
                        return;
                    }
                    for (var i = 0, l = a.length - n; i <= l; i++) {
                        var b = t.slice();
                        b.push(a[i]);
                        _(b, a.slice(i + 1), n - 1);
                    }
                }

                _([], arr, size);
                return r;
            }

            // console.log('把二维当一维数组，完成C(m,n)组合', groupSplit2(arrList, 2));

            // 二维数组的全组合，把每个数组里面的值拿出来组合
            function combination(arr) {
                var sarr = [
                    []
                ];
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    var tarr = [];
                    //console.log('****',sarr)

                    for (var j = 0; j < sarr.length; j++) {
                        for (var k = 0; k < arr[i].length; k++) {
                            var isEqu = false;
                            tarr.push(sarr[j].concat(arr[i][k]));
                        }
                    }
                    sarr = tarr;
                }


                for (var m = 0; m < sarr.length; m++) {
                    result.push(sarr[m]);
                }
                return result;
            }

            //== 传二维数组获取数组的全排列数量，不需求结果
            function getAllListCombination(list) {
                var resultNumber = 1;
                for (var i = 0; i < list.length; i++) {
                    resultNumber *= list[i].length;
                }
                return resultNumber;
            }


            //== 获取数组最终结果内容信息保存。
            function getResultList(arr, num) {
                var resultList = [];
                var restultGroupSplit = groupSplit2(arr, num);
                for (let j = 0; j < restultGroupSplit.length; j++) {
                    resultList.push(combination(restultGroupSplit[j]));
                }


                var resultNum = 0;
                for (let j = 0; j < restultGroupSplit.length; j++) {
                    resultNum += getAllListCombination(restultGroupSplit[j]);
                }


                totalZhushuNum = resultNum;
            }

            getResultList(arrList, wsn);
        }

        //任选2组选复式
        function rxefs(allNum, num) {
            var wezhi = [];
            $('.playInfoNumBtnA').each(function () {
                var num = $(this).attr('data-id');
                wezhi.push(num);
            });

            function choose(arr, size) {
                var allResult = [];
                (function (arr, size, result) {
                    var arrLen = arr.length;
                    if (size > arrLen) {
                        return;
                    }
                    if (size == arrLen) {
                        allResult.push([].concat(result, arr))
                    } else {
                        for (var i = 0; i < arrLen; i++) {
                            var newResult = [].concat(result);
                            newResult.push(arr[i]);

                            if (size == 1) {
                                allResult.push(newResult);
                            } else {
                                var newArr = [].concat(arr);
                                newArr.splice(0, i + 1);
                                arguments.callee(newArr, size - 1, newResult);
                            }
                        }
                    }
                })(arr, size, []);
                return allResult;
            };
            var int = choose(wezhi, num).length;
            var int1 = choose(allNum, num).length;
            totalZhushuNum = int * int1
        }
    }

});














