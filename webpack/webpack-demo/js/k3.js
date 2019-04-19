$(function () {
    var caizhongname = JSON.parse(localStorage.getItem("caizhongname"));//获取所有彩种信息
    var fdSmall = 0,//返点最小值
        fdBig = 0,//返点最大值
        jjinSmall = 0,//奖金最小值——对应返点最小值
        jjinBig = 0,//奖金最大值——对应返点最大值
        lastJjin = 0//变化后的奖金


    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var lottery_id = getQueryString('lottery-id');
    var uuid = getQueryString('uuid');
    var id = getQueryString('id');
    var logo = $('#lotteryLogo');//玩法logo设置
    $('#lotteryLogo').attr('lt', '' + uuid + '');
    // logo.attr('src', '/assets/img/' + uuid + '.png');
    if (lottery_id == '' || uuid == '' || id == '') {
        return
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


        $.getHistory(member_id, uuid)//历史记录

        //获取每个玩法的返点奖金值
        function getfandjin(type, waiId) {
            getJson(
                'post',
                '/lotteryitem/lotteryitem/getMethod?c=Lotteryitem&a=getMethod',
                {
                    'id': waiId,
                    'mjmjid': mjmjid,
                    'mjmjrandom': mjmjrandom
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
                            var fd, smj, bgj
                            $('.playInfoNum').on('click', 'p', function () {
                                var al = $('.playInfoNum').find('.xztzA').length;
                                if (al < 1) {
                                    $('.thisWayPrice').text(0);//未选中时时0
                                    $('.totalZs').text(0);
                                    jjinBig = 0;
                                    jjinSmall = 0;
                                    fdBig = 0;
                                    lastJjin = 0
                                    $('.fandianNum').attr('title', jjinSmall);
                                    $('.proless').text(0);
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
                                        } else {
                                            // fdBig += Number(fd);
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
                var n1 = (fandN - fdSmall) / y
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

        //获取这次开奖和下注日期
        var nowTime, nextTime, caizName, countTime, kaijNum //倒计时
        kaijiang();

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
                    'member_id': member_id,
                    "lottery_uuid": uuid,
                    'mjmjid': mjmjid,
                    'mjmjrandom': mjmjrandom
                },
                function (data) {
                    // console.log('获取这次开奖和下注日期+getTime?c=Getlotterytime&a=getTime');
                    // console.log(data.data);
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
                        $('.lotteryNumInfo2').width(ll * (lw + 10))
                        if (kaijNum == '' || kaijNum == null) {
                            $('.lotteryNumInfo ul li').html('')
                            $('.lotteryNumInfo ul li').addClass('num_gif')
                        } else {
                            var html = '';
                            for (var i = 0; i < kaijNum.length; i++) {
                                html += '<li>' + kaijNum[i] + '</li>'
                            }
                            $('.lotteryNumInfo2 ul').html(html);
                            var lw = $('.lotteryNumInfo2 ul li').width();
                            var ll = $('.lotteryNumInfo2 ul li').length;
                            $('.lotteryNumInfo2').width(ll * (lw + 10));
                        }
                    } else {
                        // alert(data.message)
                    }
                })
        };
        $.formatSeconds(Number(countTime), function (val) {
            $('.bettingEndTime').html(val);
            $('.endTime').html(val);
        }, function () {
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
                // $._getBalane();
                newOpen()
                // kaijiang();
            }, 2500)
        });//倒计时结束进行的操作


        //获取近期开奖号码
        newOpen();
        function newOpen(){
            getJson(
                'post',
                '/openaward/openaward/newOpenaward?c=Openaward&a=newOpenAward',
                {
                    'member_id': member_id,
                    "lottery_uuid": uuid,
                    'mjmjid': mjmjid,
                    'mjmjrandom': mjmjrandom
                },
                function (data) {
                    // console.log('获取近期开奖号码+newOpenaward?c=Openaward&a=newOpenAward');
                    // console.log(data);
                    if (data.code == 1) {
                        var dataList = data.data;
                        var html = '';
                        for (var i = 0; i < dataList.length; i++) {
                            html += '<li>'
                            html += '<span class="rankDate inline" style="width:60%;">' + dataList[i].expect + '</span>'
                            html += '<span class="rankNum inline" style="width:40%;">'
                            for (var j = 0; j < dataList[i].open_code.length; j++) {
                                html += '<e>' + dataList[i].open_code[j] + '</e>'
                            }
                            html += '</span>'

                            html += '</li>'
                        }
                        $('.moreLotteryRankInfoBox ul').html(html);
                    }
                });
        }

        //获取当前彩种的玩法
        getJson(
            'post',
            '/lotteryitem/lotteryitem/getListTitle?c=Lotteryitem&a=getListTitle',
            {
                'member_id': member_id,
                'lottery_id': lottery_id,
                'mjmjid': mjmjid,
                'mjmjrandom': mjmjrandom
            },
            function (data) {
                // console.log('获取当前彩种玩法+getListTitle?c=Lotteryitem&a=getListTitle');
                // console.log(data);
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
                            $('.proless').text(0);
                        })
                        getH();
                        countZhushu();
                        var wayName = $('.wA').html() + '—' + $('.playInfoTypeInfoA').text();
                        $('.playWayName').text(wayName);
                        $('.proless').text(0);
                    }
                }
            });
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
            // console.log($('.playInfoNum'));
            $('.playInfoTypeInfo').eq(0).children().eq(0).addClass('playInfoTypeInfoA');
            $('.playInfoTypeT').eq(0).addClass('wA')
            checkPW();
            wayHtml();
        };

        function checkPW() {
            $('.playInfoTypeInfo').on('click', 'span', function () {
                $('.playInfoTypeInfo span').removeClass('playInfoTypeInfoA');
                $('.playInfoTypeT').removeClass('wA');
                $(this).addClass('playInfoTypeInfoA');
                $(this).parent().prev().addClass('wA');
                wayHtml();
                var wayName = $('.wA').html() + '—' + $('.playInfoTypeInfoA').text();
                $('.playWayName').text(wayName);
                getH();
                countZhushu();
            })
        };
        //创建投注选择HTML
        var type;

        function wayHtml() {
            $('.playInfoNumBox').removeClass('sthdx');
            $('.playInfoNumBox').removeClass('k3hz');
            $('.playInfoNumBox').removeClass('sthtx');
            $('.playInfoNumBox').removeClass('sbthdx');
            $('.playInfoNumBox').removeClass('sbthfx');
            $('.playInfoNumBox').removeClass('slhtx');
            $('.playInfoNumBox').removeClass('ethfs');
            var waiId = $('.playInfoTypeInfoA').attr('id');
            html3 = '';
            if (waiId == 306) {
                type = 2;
                $('.playInfoNumBox').addClass('k3hz');
                $('.playWarTitle').text('对三个号码和值的大小单双形态进行选择。注：3-10为小，11-18为大。');
                addHtml1(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 308) {
                type = 2;
                $('.playInfoNumBox').addClass('k3hz');
                $('.playWarTitle').text('选择一个和值号码进行投注。若所选号码等于开奖号码之和，即为中奖。');
                addHtml1(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 310) {
                type = 2;
                $('.playInfoNumBox').addClass('sthdx');
                $('.playWarTitle').text('在六组三同号（111,222,333,444,555,666）中选择一组，作为一注。若所选号码组与开奖号码相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 311) {
                type = 1;
                $('.playInfoNumBox').addClass('sthtx');
                addHtml(waydata.k3_sthtx);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 316) {
                type = 2;
                $('.playInfoNumBox').addClass('sbthdx');
                $('.playWarTitle').text('从下列20组号码中选择一组作为一注。若所选号码与开奖号码相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 317) {
                type = 1;
                $('.playInfoNumBox').addClass('sbthfx');
                addHtml2(waydata.k3_sbthfx);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 318) {
                type = 2;
                $('.playInfoNumBox').addClass('sbthdx');
                $('.playWarTitle').text('从以下4个三连号中选择一个进行投注，若投注号码与开奖号码相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 319) {
                type = 1;
                $('.playInfoNumBox').addClass('slhtx');
                addHtml3(waydata.k3_slhtx);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 320) {
                type = 2;
                $('.playInfoNumBox').addClass('sbthdx');
                $('.playWarTitle').text('从以下12组半顺形态号码中选择一组进行投注，若所选号码与开奖号码相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 321) {
                type = 1;
                $('.playInfoNumBox').addClass('slhtx');
                addHtml3(waydata.k3_bstx);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 322) {
                type = 2;
                $('.playInfoNumBox').addClass('sbthdx');
                $('.playWarTitle').text('从以下4组杂六形态号码中选择一组进行投注，若所选号码与开奖号码相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 323) {
                type = 1;
                $('.playInfoNumBox').addClass('slhtx');
                addHtml3(waydata.k3_zltx);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 326) {
                type = 1;
                $('.playInfoNumBox').addClass('ethfs');
                addHtml4(waydata.k3_ethfs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 327) {
                type = 2;
                $('.playInfoNumBox').addClass('sbthdx');
                $('.playWarTitle').text('从下列30组号码中选择一组作为一注。若所选号码与开奖号码相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 328) {
                type = 2;
                $('.playInfoNumBox').addClass('ethfs');
                $('.playWarTitle').text('从六组二同号（11,22,33,44,55,66）中选择一组作为一注。若开奖号码中包含所选的二同号，即为中奖。');
                addHtml5(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 330) {
                type = 1;
                $('.playInfoNumBox').addClass('sbthfx');
                addHtml2(waydata.k3_ebthfx);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 331) {
                type = 2;
                $('.playInfoNumBox').addClass('sbthdx');
                $('.playWarTitle').text('从下列15组号码中选择一组作为一注。若开奖号码中包含所选号码，即为中奖。');
                addHtml5(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
            if (waiId == 333) {
                type = 2;
                $('.playInfoNumBox').addClass('ethfs');
                $('.playWarTitle').text('从1-6这六个号码中选择一个进行投注，若选择的号码出现在开奖号码中，即为中奖。');
                addHtml6(type, waiId);
                xz();
                //getfandjin(type, waiId)
            }
        };

        //三同号通选
        function addHtml(dataName) {
            $('.playWarTitle').text(dataName.data.titleN);
            var wayList = dataName.data.des
            for (var w = 0; w < wayList.length; w++) {
                html3 += '<div class="playInfoNumRow">' +
                    '<div class="tips">' + wayList[w].title + '</div>'
                html3 += '<div class="playInfoNum">'
                html3 += '<p data-id="' + wayList[w].title + '">'
                for (var m = 0; m < wayList[w].numdes.length; m++) {
                    html3 += '<em class="inline" data-id="' + wayList[w].numdes[m].name + '">' +
                        '<label></label>' +
                        '<label></label>' +
                        '<label></label>' +
                        '</em>'
                }
                html3 += '</p>'
                html3 += '</div>'
                html3 += '</div>'
            }
            $('.playInfoNumBox').html(html3);

            $('.playInfoNum').find('em').each(function () {
                var jpid = $(this).attr('data-id');
                if (jpid == 111) {
                    $(this).attr('id', '1');
                    $(this).find('label').css('background-image', 'url(/assets/img/1.png)')
                }
                if (jpid == 222) {
                    $(this).attr('id', '2');
                    $(this).find('label').css('background-image', 'url(/assets/img/2.png)')
                }
                if (jpid == 333) {
                    $(this).attr('id', '3');
                    $(this).find('label').css('background-image', 'url(/assets/img/3.png)')
                }
                if (jpid == 444) {
                    $(this).attr('id', '4');
                    $(this).find('label').css('background-image', 'url(/assets/img/4.png)')
                }
                if (jpid == 555) {
                    $(this).attr('id', '5');
                    $(this).find('label').css('background-image', 'url(/assets/img/5.png)')
                }
                if (jpid == 666) {
                    $(this).attr('id', '6');
                    $(this).find('label').css('background-image', 'url(/assets/img/6.png)')
                }
            })
        }

        //二同号复选
        function addHtml6(type, waiId) {
            var title = $('.playInfoTypeInfoA').text();
            getJson('post', '/lotteryitem/lotteryitem/getMethod?c=Lotteryitem&a=getMethod', {
                'id': waiId,
                'mjmjid': mjmjid,
                'mjmjrandom': mjmjrandom
            }, function (data) {
                if (data.code == 1) {
                    var playList = data.data;
                    var html = '';
                    html += '<div class="playInfoNumRow">' +
                        '<div class="playInfoNumListBox">' +
                        '<div class="tips">' + title + '</div>'
                    html += '<div class="playInfoNum">'
                    for (var i = 0; i < playList.length; i++) {
                        html += '<p class="inline" id="' + playList[i].id + '" data-id="' + playList[i].name + '" bjianj="' + playList[i].highest_bonus + '" sjianj="' + playList[i].lowest_bonus + '" fandian="' + playList[i].highest_feed + '">' +
                            '<label></label>' +
                            '</p>'
                    }
                    html += '</div>'
                    html += '</div>'
                    html += '</div>'
                    $('.playInfoNumBox').html(html);
                    // console.log('111');

                    $('.playInfoNum').find('p').each(function () {
                        var ll = $(this).find('label').length;
                        if (ll == 1) {
                            $(this).find('label').eq(0).css('margin-left', '28%')
                        }
                        var jpid = $(this).attr('data-id');
                        if (jpid == 1) {
                            $(this).find('label').css('background-image', 'url(/assets/img/1.png)');
                        }
                        if (jpid == 2) {
                            $(this).find('label').css('background-image', 'url(/assets/img/2.png)');
                        }
                        if (jpid == 3) {
                            $(this).find('label').css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 4) {
                            $(this).find('label').css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 5) {
                            $(this).find('label').css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 6) {
                            $(this).find('label').css('background-image', 'url(/assets/img/6.png)');
                        }

                    })
                    xz();
                    getH();
                    getfandjin(2, waiId)


                } else {
                    $.Msg(data.message, {});
                    $('.playInfoNumBox').html('');
                }

            })
        }

        //二同号复选
        function addHtml5(type, waiId) {
            var title = $('.playInfoTypeInfoA').text();
            getJson('post', '/lotteryitem/lotteryitem/getMethod?c=Lotteryitem&a=getMethod', {
                'id': waiId,
                'mjmjid': mjmjid,
                'mjmjrandom': mjmjrandom
            }, function (data) {
                if (data.code == 1) {
                    var playList = data.data;
                    var html = '';
                    html += '<div class="playInfoNumRow">' +
                        '<div class="playInfoNumListBox">' +
                        '<div class="tips">' + title + '</div>'
                    html += '<div class="playInfoNum">'
                    for (var i = 0; i < playList.length; i++) {
                        html += '<p class="inline" id="' + playList[i].id + '" data-id="' + playList[i].name + '" bjianj="' + playList[i].highest_bonus + '" sjianj="' + playList[i].lowest_bonus + '" fandian="' + playList[i].highest_feed + '">' +
                            '<label></label>' +
                            '<label></label>' +
                            '</p>'
                    }
                    html += '</div>'
                    html += '</div>'
                    html += '</div>'
                    $('.playInfoNumBox').html(html);
                    $('.playInfoNum').find('p').each(function () {
                        var jpid = $(this).attr('data-id');
                        if (jpid == 11) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/1.png)');
                        }
                        if (jpid == 22) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                        }
                        if (jpid == 33) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 44) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 55) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 66) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 12) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                        }
                        if (jpid == 13) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 14) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 15) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 16) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 23) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 24) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 25) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 26) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 34) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 35) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 36) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 45) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 46) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 56) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                        }

                    })
                    xz();
                    getH();
                    getfandjin(2, waiId)
                } else {
                    $.Msg(data.message, {});
                    $('.playInfoNumBox').html('');
                }

            })
        }

        //从后台获取赔率和返点值(三同号单选)
        function addHtml0(type, waiId) {
            var title = $('.playInfoTypeInfoA').text();
            getJson('post', '/lotteryitem/lotteryitem/getMethod?c=Lotteryitem&a=getMethod', {
                'id': waiId,
                'mjmjid': mjmjid,
                'mjmjrandom': mjmjrandom
            }, function (data) {
                if (data.code == 1) {
                    var playList = data.data;
                    var html = '';
                    html += '<div class="playInfoNumRow">' +
                        '<div class="playInfoNumListBox">' +
                        '<div class="tips">' + title + '</div>'
                    html += '<div class="playInfoNum">'
                    for (var i = 0; i < playList.length; i++) {
                        html += '<p class="inline" id="' + playList[i].id + '" data-id="' + playList[i].name + '" bjianj="' + playList[i].highest_bonus + '" sjianj="' + playList[i].lowest_bonus + '" fandian="' + playList[i].highest_feed + '">' +
                            '<label></label>' +
                            '<label></label>' +
                            '<label></label>' +
                            '</p>'
                    }
                    html += '</div>'
                    html += '</div>'
                    html += '</div>'
                    $('.playInfoNumBox').html(html);
                    $('.playInfoNum').find('p').each(function () {
                        var jpid = $(this).attr('data-id');
                        if (jpid == 111) {
                            $(this).find('label').css('background-image', 'url(/assets/img/1.png)')
                        }
                        if (jpid == 222) {
                            $(this).find('label').css('background-image', 'url(/assets/img/2.png)')
                        }
                        if (jpid == 333) {
                            $(this).find('label').css('background-image', 'url(/assets/img/3.png)')
                        }
                        if (jpid == 444) {
                            $(this).find('label').css('background-image', 'url(/assets/img/4.png)')
                        }
                        if (jpid == 555) {
                            $(this).find('label').css('background-image', 'url(/assets/img/5.png)')
                        }
                        if (jpid == 666) {
                            $(this).find('label').css('background-image', 'url(/assets/img/6.png)')
                        }
                        if (jpid == 123) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 124) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 125) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 126) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 134) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 135) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 136) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 145) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 146) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 156) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 234) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 235) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 236) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 245) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 246) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 256) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 345) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 346) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 356) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 456) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 112) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/2.png)');
                        }
                        if (jpid == 113) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 114) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 115) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 116) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/1.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 221) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/1.png)');
                        }
                        if (jpid == 223) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 224) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 225) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 226) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 331) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/1.png)');
                        }
                        if (jpid == 332) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/2.png)');
                        }
                        if (jpid == 334) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 335) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 336) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 441) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/1.png)');
                        }
                        if (jpid == 442) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/2.png)');
                        }
                        if (jpid == 443) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 445) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                        if (jpid == 446) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 551) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/1.png)');
                        }
                        if (jpid == 552) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/2.png)');
                        }
                        if (jpid == 553) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 554) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 556) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                        }
                        if (jpid == 661) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/1.png)');
                        }
                        if (jpid == 662) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/2.png)');
                        }
                        if (jpid == 663) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/3.png)');
                        }
                        if (jpid == 664) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                        }
                        if (jpid == 665) {
                            $(this).find('label').eq(0).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(1).css('background-image', 'url(/assets/img/6.png)');
                            $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                        }
                    })
                    xz();
                    getH();
                    getfandjin(2, waiId)
                } else {
                    $.Msg(data.message, {});
                    $('.playInfoNumBox').html('');
                }

            })
        }

        //从后台获取赔率和返点值（快3和值）
        function addHtml1(type, waiId) {
            var title = $('.playInfoTypeInfoA').text();
            getJson('post', '/lotteryitem/lotteryitem/getMethod?c=Lotteryitem&a=getMethod', {
                'id': waiId,
                'mjmjid': mjmjid,
                'mjmjrandom': mjmjrandom
            }, function (data) {
                if (data.code == 1) {
                    var playList = data.data;
                    var html = '';
                    html += '<div class="playInfoNumRow">' +
                        '<div class="tips">和值</div>'
                    html += '<div class="playInfoNum">'
                    for (var i = 0; i < playList.length; i++) {
                        html += '<p class="inline" id="' + playList[i].id + '" data-id="' + playList[i].name + '" bjianj="' + playList[i].highest_bonus + '" sjianj="' + playList[i].lowest_bonus + '" fandian="' + playList[i].highest_feed + '">' + playList[i].name + '</p>'
                    }
                    html += '</div>'
                    html += '</div>'
                    $('.playInfoNumBox').html(html);
                    xz();
                    getH();
                    getfandjin(2, waiId)
                } else {
                    $.Msg(data.message, {});
                    $('.playInfoNumBox').html('');
                }

            })
        }

        //（快3三不同号复选——一个label）
        function addHtml2(dataName) {
            $('.playWarTitle').text(dataName.data.titleN);
            var wayList = dataName.data.des
            for (var w = 0; w < wayList.length; w++) {
                html3 += '<div class="playInfoNumRow">' +
                    '<div class="tips">' + wayList[w].title + '</div>'
                html3 += '<div class="playInfoNum">'
                for (var m = 0; m < wayList[w].numdes.length; m++) {
                    html3 += '<p class="inline" data-id="' + wayList[w].numdes[m].name + '">' +
                        '<label></label>' +
                        '</p>'
                }
                html3 += '</div>'
                html3 += '</div>'
            }
            $('.playInfoNumBox').html(html3);
            $('.playInfoNum').find('p').each(function () {
                var jpid = $(this).attr('data-id');
                if (jpid == 1) {
                    $(this).attr('id', '1');
                    $(this).find('label').css('background-image', 'url(/assets/img/1.png)')
                }
                if (jpid == 2) {
                    $(this).attr('id', '2');
                    $(this).find('label').css('background-image', 'url(/assets/img/2.png)')
                }
                if (jpid == 3) {
                    $(this).attr('id', '3');
                    $(this).find('label').css('background-image', 'url(/assets/img/3.png)')
                }
                if (jpid == 4) {
                    $(this).attr('id', '4');
                    $(this).find('label').css('background-image', 'url(/assets/img/4.png)')
                }
                if (jpid == 5) {
                    $(this).attr('id', '5');
                    $(this).find('label').css('background-image', 'url(/assets/img/5.png)')
                }
                if (jpid == 6) {
                    $(this).attr('id', '6');
                    $(this).find('label').css('background-image', 'url(/assets/img/6.png)')
                }
            })
        }

        //（快3三连号通选）
        function addHtml3(dataName) {
            $('.playWarTitle').text(dataName.data.titleN);
            var wayList = dataName.data.des
            for (var w = 0; w < wayList.length; w++) {
                html3 += '<div class="playInfoNumRow">' +
                    '<div class="tips">' + wayList[w].title + '</div>'
                html3 += '<div class="playInfoNum">'
                html3 += '<p data-id="' + wayList[w].title + '">'
                for (var m = 0; m < wayList[w].numdes.length; m++) {
                    html3 += '<em class="inline" data-id="' + wayList[w].numdes[m].name + '">' +
                        '<label></label>' +
                        '<label></label>' +
                        '<label></label>' +
                        '</em>'
                }
                html3 += '</p>'
                html3 += '</div>'
                html3 += '</div>'
            }
            $('.playInfoNumBox').html(html3);
            $('.playInfoNum').find('em').each(function () {
                var jpid = $(this).attr('data-id');
                if (jpid == 123) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/3.png)');
                }
                if (jpid == 234) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                }
                if (jpid == 345) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                }
                if (jpid == 456) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/4.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
                if (jpid == 124) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                }
                if (jpid == 125) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/3.png)');
                }
                if (jpid == 126) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
                if (jpid == 134) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                }
                if (jpid == 135) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                }
                if (jpid == 136) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
                if (jpid == 145) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                }
                if (jpid == 146) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
                if (jpid == 156) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/1.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
                if (jpid == 235) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/5.png)');
                }
                if (jpid == 236) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
                if (jpid == 245) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/4.png)');
                }
                if (jpid == 246) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
                if (jpid == 256) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/2.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
                if (jpid == 346) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/4.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
                if (jpid == 356) {
                    $(this).find('label').eq(0).css('background-image', 'url(/assets/img/3.png)');
                    $(this).find('label').eq(1).css('background-image', 'url(/assets/img/5.png)');
                    $(this).find('label').eq(2).css('background-image', 'url(/assets/img/6.png)');
                }
            })
        }

        //(快三二同号复式)
        function addHtml4(dataName) {
            $('.playWarTitle').text(dataName.data.titleN);
            var wayList = dataName.data.des
            for (var w = 0; w < wayList.length; w++) {
                html3 += '<div class="playInfoNumRow">' +
                    '<div class="tips">' + wayList[w].title + '</div>'
                html3 += '<div class="playInfoNum">'
                for (var m = 0; m < wayList[w].numdes.length; m++) {
                    html3 += '<p class="inline" nid="' + wayList[w].numdes[m].nid + '" data-id="' + wayList[w].numdes[m].dnum + '">'
                    for (var f = 0; f < wayList[w].numdes[m].name.length; f++) {
                        html3 += '<label></label>'
                    }
                    html3 += '</p>'
                }
                html3 += '</div>'
                html3 += '</div>'
            }
            $('.playInfoNumBox').html(html3);


            $('.playInfoNum').find('p').each(function () {
                var ll = $(this).find('label').length;
                if (ll == 1) {
                    $(this).find('label').eq(0).css('margin-left', '28%')
                }
                var jpid = $(this).attr('data-id');
                if (jpid == 11 || jpid == 1) {
                    $(this).find('label').css('background-image', 'url(/assets/img/1.png)');
                }
                if (jpid == 22 || jpid == 2) {
                    $(this).find('label').css('background-image', 'url(/assets/img/2.png)');
                }
                if (jpid == 33 || jpid == 3) {
                    $(this).find('label').css('background-image', 'url(/assets/img/3.png)');
                }
                if (jpid == 44 || jpid == 4) {
                    $(this).find('label').css('background-image', 'url(/assets/img/4.png)');
                }
                if (jpid == 55 || jpid == 5) {
                    $(this).find('label').css('background-image', 'url(/assets/img/5.png)');
                }
                if (jpid == 66 || jpid == 6) {
                    $(this).find('label').css('background-image', 'url(/assets/img/6.png)');
                }
            })

        }


        //右侧快捷节点创建
        function xz() {
            var waiId = $('.playInfoTypeInfoA').attr('id');
            //右边快捷选择按钮
            $('.playInfoRight').on('click', 'span', function () {
                $('.playInfoRight span').removeClass('fastBtnA');
                $(this).addClass('fastBtnA');
            })
            //选择投注数据
            $('.playInfoNum').on('click', 'span', function () {
                $('.playInfoRight').removeClass('fastBtnA');
                if (waiId == 32 || waiId == 67) {
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
                $('.playInfoRight').removeClass('fastBtnA');
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
        //清空已选号码
        $('.qingkongBtn').on('click', function () {
            $('.touzhulanD ul').html('');
        });


        //添加购彩到购彩蓝---一键投注
        var playId;//小玩法的id
        var playName;//玩法名字
        var tzjine;//总投注金额
        var playNum = [];//投注数据
        var totalNum

        function addTouzhu() {
            // console.log(0)
            var dhpick = $('.playInfoNum').eq(1).find('.xztzA').length;
            var echpick = $('.playInfoNum').eq(0).find('.xztzA').length;
            var pickL = $('.pickNum').length;
            var allPN = $('.playInfoNum').length;
            var pickNumA = 0;
            $('.playInfoNum').each(function () {
                pickNumA = $(this).find('.xztzA').length;
            })
            playId = $('.playInfoTypeInfoA').attr('id');//小玩法的id（例：五星直选复选的id=4）
            playName = $('.playWayName').text();//玩法名字
            tzjine = $('.totalPrice').text();
            totalNum = $('.totalZs').text();//总注数
            var aNum = '';
            if (tzjine == 0) {
                $.Msg('无效投注，请重新下注', {});
            } else {
                if (playId == 306 || playId == 308 || playId == 310 || playId == 311 || playId == 316 || playId == 318 || playId == 319 || playId == 320 || playId == 321 || playId == 322 || playId == 323 || playId == 326 || playId == 327 || playId == 328 || playId == 331 || playId == 333) {
                    if (pickL < $('.playInfoNum').length) {
                        $.Msg('无效投注，请重新选择', {});
                    } else {
                        if (type == 1) {
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
                        if (type == 2) {
                            var html0 = ''
                            var totp = $('.totalPrice').text();
                            var pcL = $('.pickNum .xztzA').length;
                            var bonus = 0;
                            var n = 0,//拖动次数
                                x = 0,//奖金每次变化值
                                y = 0.1//返点每次变化值
                            $('.pickNum .xztzA').each(function () {
                                var playNum = $(this).attr('data-id');
                                var wfid = $(this).attr('id');
                                //每遍历一次获取一次奖金值
                                var sjj = $(this).attr('sjianj');
                                var bjj = $(this).attr('bjianj');
                                var fdz = $(this).attr('fandianNum');//返点值
                                if (fdz > 0) {
                                    // console.log(fdz);
                                    n = (fdz - fdSmall) / y;
                                    x = (bjj - sjj) / n;
                                    var fandN = $('.fandianNum').text();
                                    var n1 = (fandN - fdSmall) / y
                                    lastJjin = Number(sjj) + Number(n1 * x);
                                    var totalJJ = lastJjin;
                                    // console.log('lastJjin=' + lastJjin);
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
                                    // console.log('totalJJ=' + totalJJ);
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
                if (playId == 317) {
                    var numL = $('.playInfoNum').find('.xztzA').length;
                    if (numL < 3) {
                        $.Msg('无效投注，请重新选择', {});
                    } else {
                        $('.xztzA').each(function () {
                            var num = $(this).attr('data-id');
                            aNum += num + ','
                        });
                        var aNum1 = aNum.toString();
                        var aNum2 = aNum1.substring(0, aNum1.length - 1);
                        playNum.push(aNum2);
                        // 创建购彩蓝里的节点
                        creatTouzhuHtml();
                    }
                }
                if (playId == 330) {
                    var numL = $('.playInfoNum').find('.xztzA').length;
                    if (numL < 2) {
                        $.Msg('无效投注，请重新选择', {});
                    } else {
                        $('.xztzA').each(function () {
                            var num = $(this).attr('data-id');
                            aNum += num + ','
                        });
                        var aNum1 = aNum.toString();
                        var aNum2 = aNum1.substring(0, aNum1.length - 1);
                        playNum.push(aNum2);
                        // 创建购彩蓝里的节点
                        creatTouzhuHtml();
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
        })//添加购彩蓝
        $('.fastTouzhuBtn').on('click', function () {
            var action_no = $('.lotteryQishu span').text();//下单期数
            var zs = $('.totalZs').text();
            if (zs < 1) {
                $.Msg('无效注单，请重新下注', {});
            } else {
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
                    var an = ''
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
                        });
                    }
                    alltzmsg = {'common': tzcommon, 'betBean': tzmsg, 'mjmjid': mjmjid, 'mjmjrandom': mjmjrandom}
                    //请求下单接口
                    getJson('post', '/officialorders/officialorders/makeOrder?c=Officialorders&a=makeOrder', alltzmsg, function (data) {
                        if (data.code == 1) {
                            $.Msg(data.data, {});
                            $('.touzhulanD ul').html('');
                            //下单成功清空已选择数据
                            $('.playInfoNum').removeClass('pickNum');
                            $('.playInfoNum span').removeClass('xztzA');
                            $('.playInfoNum p').removeClass('xztzA');
                            $('.playInfoRight span').removeClass('fastBtnA');
                            $('.totalZs').text('0');
                            $('.totalPrice').text('0');
                            $('.proless').text('0');
                            playNum = [];
                            beishu = 1;
                            $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面
                            $._getBalane();
                        } else {
                            $.Msg(data.message, {});
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
                            // console.log(fdz);
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
                            // console.log('totalJJ=' + totalJJ);
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
                    //请求下单接口
                    getJson('post', '/officialorders/officialorders/makeOrder?c=Officialorders&a=makeOrder', alltzmsg, function (data) {
                        if (data.code == 1) {
                            $.Msg(data.data, {});
                            $('.touzhulanD ul').html('');
                            //下单成功清空已选择数据
                            $('.playInfoNum').removeClass('pickNum');
                            $('.playInfoNum span').removeClass('xztzA');
                            $('.playInfoNum p').removeClass('xztzA');
                            $('.playInfoRight span').removeClass('fastBtnA');
                            $('.totalZs').text('0');
                            $('.totalPrice').text('0');
                            $('.proless').text('0');
                            playNum = [];
                            beishu = 1;
                            $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面
                            $._getBalane();
                        } else {
                            $.Msg(data.message, {});
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
                    alltzmsg = {'common': tzcommon, 'betBean': tzmsg}
                    //请求下单接口
                    getJson('post', '/officialorders/officialorders/makeOrder?c=Officialorders&a=makeOrder', alltzmsg, function (data) {
                        if (data.code == 1) {
                            $.Msg(data.data, {});
                            $('.touzhulanD ul').html('');
                            $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面
                            $._getBalane();
                        } else {
                            $.Msg(data.message, {});
                        }
                    })
                });
            } else {
                $.Msg('购彩蓝还没有可下单的注单', {});
            }

        })//确认投注（购彩篮里面的注单）

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
            playNum = [];
            beishu = 1;

        }

        //计算投注数
        function countZhushu() {
            var playId = $('.playInfoTypeInfoA').attr('id');//小玩法的id（例：五星直选复选的id=4）
            var wsn = 0;//组成几位数（id=6就是一个数组组合成5位数）
            var fristPrice = 0;//投注金额（）
            var totalZhushuNum = 0;//总注数
            var pickL = $('.pickNum').length;
            var allPN = $('.playInfoNum').length;
            var pickNumA = 0;
            $('.pickNum').each(function () {
                pickNumA = $(this).find('.xztzA').length;
            })
            if (playId == 306 || playId == 308 || playId == 310 || playId == 311 || playId == 316 || playId == 318 || playId == 319 || playId == 320 || playId == 321 || playId == 322 || playId == 323 || playId == 327 || playId == 328 || playId == 331 || playId == 333) {
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
            ;
            if (playId == 317) {
                wsn = 3;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 3) {
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
            if (playId == 330) {
                wsn = 2;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 2) {
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
            if (playId == 326) {
                if (pickL < allPN) {
                    totalZhushuNum = 0;
                    $('.proless').text(0);
                } else {
                    var allList = [];
                    $('.playInfoNum').each(function () {
                        var list = [];
                        $(this).find('.xztzA').each(function () {
                            var num = $(this).attr('nid');
                            list.push(num);
                        });
                        allList.push(list);
                    })
                    qpbupxt(allList)
                }
            }
            $('.totalZs').text(totalZhushuNum);
            $('.totalPrice').text(utp * totalZhushuNum * beishu);
            if ($('.totalPrice').text() > 0) {
                $('.proless').text($('.thisWayPrice').text() - $('.totalPrice').text());
            }


            //k3(每位选择格数相乘)
            function qsfs(arr) {
                var alls = 1;
                for (var i = 0; i < arr.length; i++) {
                    alls *= arr[i]
                }
                totalZhushuNum = alls
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
        }
    }
})
