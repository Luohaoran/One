$(function () {
    var caizhongname = JSON.parse(localStorage.getItem("caizhongname"));//获取所有彩种信息
    var fdSmall = 0,//返点最小值
        fdBig = 0,//返点最大值
        jjinSmall = 0,//奖金最小值——对应返点最小值
        jjinBig = 0,//奖金最大值——对应返点最大值
        lastJjin = 0,//变化后的奖金
        ds='',
        al='';
    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            addTouzhu();
            $('#playInfoNumIn').val('');
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


        $.getHistory(member_id, uuid);




        //获取每个玩法的返点奖金值
        function getfandjin(type, waiId) {
            getJson('post', '/lotteryitem/lotteryitem/getMethod?c=Lotteryitem&a=getMethod', {
                'id': waiId,
                'mjmjid': mjmjid,
                'mjmjrandom': mjmjrandom
            }, function (data) {
                if (data.code == 1) {
                    var wayList = data.data;
                    if (type == 1) {//直接获取需要的值
                        fdBig = wayList[0].highest_feed * 100;
                        jjinSmall = wayList[0].highest_bonus * 2;
                        jjinBig = wayList[0].lowest_bonus * 2;
                        $('.playInfoTypeInfoA').attr('play-id', wayList[0].id)
                        $('.range-bar').remove();
                        var lottery_uuid = wayList[0].lottery_id
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
                    $('.proless').text((totalJJ - touzp).toFixed(3));
                }

            }
        }
        newOpen();
        //获取近期开奖号码
        function newOpen(){
            getJson('post', '/openaward/openaward/newOpenaward?c=Openaward&a=newOpenAward', {
                'member_id': member_id,
                "lottery_uuid": uuid,
                'mjmjid': mjmjid,
                'mjmjrandom': mjmjrandom
            }, function (data) {
                if (data.code == 1) {
                    var dataList = data.data;
                    var html = '';
                    for (var i = 0; i < dataList.length; i++) {
                        html += '<li>'
                        html += '<span class="rankDate inline" style="width:30%;">' + dataList[i].expect + '</span>'
                        html += '<span class="rankNum inline" style="width:70%;">'
                        for (var j = 0; j < dataList[i].open_code.length; j++) {
                            html += '<e style="letter-spacing: 0px">' + dataList[i].open_code[j] + '</e>'
                        }
                        html += '</span>'

                        html += '</li>'
                    }
                    $('.moreLotteryRankInfoBox ul').html(html);
                }
            });
        }
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
        //获取这次开奖和下注日期
        function kaijiang() {
            getJson('post', '/getlotterytime/getlotterytime/getTime?c=Getlotterytime&a=getTime', {
                'member_id': member_id,
                "lottery_uuid": uuid,
                'mjmjid': mjmjid,
                'mjmjrandom': mjmjrandom
            }, function (data) {
                if (data.code == 1) {
                    var kaijList = data.data;
                    nowTime = kaijList.currExpect;//开奖期数
                    nextTime = kaijList.lastExpect;//投注期数
                    caizName = kaijList.lottery_naem;
                    kaijNum = kaijList.opencode;//开奖号码
                    time = kaijList.remainTime;//倒计时
                    $('.lotteryQishu span').text(nextTime);
                    $('.lotteryNumQishu span').text(nowTime);
                    var lw = $('.lotteryNumInfo2pk11 ul li').width();
                    var ll = $('.lotteryNumInfo2pk11 ul li').length;
                    $('.lotteryNumInfo2pk11').width(ll * (lw + 10))

                    if (kaijNum == '' || kaijNum == null) {
                        $('.lotteryNumInfo ul li').html('')
                        $('.lotteryNumInfo ul li').addClass('num_gif')
                    } else {
                        var html = '';
                        for (var i = 0; i < kaijNum.length; i++) {
                            html += '<li>' + kaijNum[i] + '</li>'
                        }
                        $('.lotteryNumInfo2pk11 ul').html(html);
                        var lw = $('.lotteryNumInfo2pk11 ul li').width();
                        var ll = $('.lotteryNumInfo2pk11 ul li').length;
                        $('.lotteryNumInfo2pk11').width(ll * (lw + 10))
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
                newOpen()
            }, 3000)
        });//倒计时结束进行的操作



        //获取当前彩种的玩法
        getJson('post', '/lotteryitem/lotteryitem/getListTitle?c=Lotteryitem&a=getListTitle', {
            'member_id': member_id,
            "lottery_id": lottery_id,
            'mjmjid': mjmjid,
            'mjmjrandom': mjmjrandom
        }, function (data) {
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
            $('.playInfoNumBox').removeClass('dxds');
            $('.playInfoNumBox').removeClass('czw');
            var waiId = $('.playInfoTypeInfoA').attr('id');
            html3 = '';
            if (waiId == 253) {
                type = 1;
                addHtml(waydata.pk10_caigj);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 255) {
                type = 1;
                addHtml(waydata.pk10_caiqe);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 256) {
                type = 1
                addHtmlds();
                $('.playWarTitle').text('手动输入或导入两个不重复的号码组成一注,用逗号隔开。所录入的号码与开奖号码的前两位号码相同，顺序一致，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 258) {
                type = 1;
                addHtml(waydata.pk10_caiqsan);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 259) {
                type = 1
                addHtmlds();
                $('.playWarTitle').text('手动输入或导入三个不重复的号码组成一注,用逗号隔开。所录入的号码与开奖号码的前三位号码相同，顺序一致，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 261) {
                type = 1;
                addHtml(waydata.pk10_caiqsi);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 262) {
                type = 1
                addHtmlds();
                $('.playWarTitle').text('手动输入或导入四个不重复的号码组成一注,用逗号隔开。所录入的号码与开奖号码的前四位号码相同，顺序一致，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 264) {
                type = 1;
                addHtml(waydata.pk10_caiqw);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 265) {
                type = 1
                addHtmlds();
                $('.playWarTitle').text('手动输入或导入五个不重复的号码组成一注,用逗号隔开。所录入的号码与开奖号码的前五位号码相同，顺序一致，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 267) {
                type = 1;
                addHtml(waydata.pk10_dwdq);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 268) {
                type = 1;
                addHtml(waydata.pk10_dwdh);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 270) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对冠军的“大（06、07、08、09、10）、小（01、02、03、04、05）”形态进行选择，所选形态与开奖号码第一位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 271) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对第二名的“大（06、07、08、09、10）、小（01、02、03、04、05）”形态进行选择，所选形态与开奖号码第二位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 272) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对第三名的“大（06、07、08、09、10）、小（01、02、03、04、05）”形态进行选择，所选形态与开奖号码第三位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 273) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对第四名的“大（06、07、08、09、10）、小（01、02、03、04、05）”形态进行选择，所选形态与开奖号码第四位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 274) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对第五名的“大（06、07、08、09、10）、小（01、02、03、04、05）”形态进行选择，所选形态与开奖号码第五位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 275) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对冠亚和值的大（11,12,13,14,15,16,17,18,19）、小（3,4,5,6,7,8,9,10）形态进行选择。所选形态与开奖号码冠亚和值的形态一致，即为中奖');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 277) {
                type = 2;
                $('.playInfoNumBox').addClass('czw');
                $('.playWarTitle').text('从3-19中任意选择至少一个号码，若所选号码的数值等于开奖号码的前两位数字相加之和，即为中奖。');
                addHtml1(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 278) {
                type = 2;
                $('.playInfoNumBox').addClass('czw');
                $('.playWarTitle').text('从6-27中任意选择至少一个号码，若所选号码的数值等于开奖号码的前三位数字相加之和，即为中奖。');
                addHtml1(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 280) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对冠军的“单（01、03、05、07、09）、双（02、04、06、08、10）”形态进行选择，所选形态与开奖号码第一位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 281) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对冠军的“单（01、03、05、07、09）、双（02、04、06、08、10）”形态进行选择，所选形态与开奖号码第一位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 282) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对第二名的“单（01、03、05、07、09）、双（02、04、06、08、10）”形态进行选择，所选形态与开奖号码第二位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 283) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对第三名的“单（01、03、05、07、09）、双（02、04、06、08、10）”形态进行选择，所选形态与开奖号码第三位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 284) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对第四名的“单（01、03、05、07、09）、双（02、04、06、08、10）”形态进行选择，所选形态与开奖号码第四位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 285) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('对第五名的“大（06、07、08、09、10）、小（01、02、03、04、05）”形态进行选择，所选形态与开奖号码第五位的形态相同，即为中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 287) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('若第一名号码大于第十名号码，龙中奖；反之则虎中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 288) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('若第二名号码大于第九名号码，龙中奖；反之则虎中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 289) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('若第三名号码大于第八名号码，龙中奖；反之则虎中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 290) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('若第四名号码大于第七名号码，龙中奖；反之则虎中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 291) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('若第五名号码大于第六名号码，龙中奖；反之则虎中奖。');
                addHtml0(type, waiId);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 293) {
                type = 1;
                addHtml(waydata.pk10_rezxfs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 296) {
                type = 1;
                addHtml(waydata.pk10_rszxfs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 294) {
                type = 1
                addHtml3();
                $('.playWarTitle').text('任意选择两个位置,手动输入或导入两个不重复的号码组成一注,用逗号隔开，所选号码与开奖号码对应位置上的号码相同且顺序一致，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 297) {
                type = 1
                addHtml3();
                $('.playWarTitle').text('任意选择三个位置,手动输入或导入三个不重复的号码组成一注,用逗号隔开，所选号码与开奖号码对应位置上的号码相同且顺序一致，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
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
            });
        };

        //从后台获取赔率和返点值
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
                        '<div class="tips">' + title + '</div>'
                    html += '<div class="playInfoRight">' +
                        '<span class="allBtn">全</span>' +
                        '<span class="deletBtn">清</span>' +
                        '</div>'
                    html += '<div class="playInfoNum" style="width:560px">'
                    for (var i = 0; i < playList.length; i++) {
                        html += '<p class="inline" lottery_uuid="' + playList[i].lottery_id + '" id="' + playList[i].id + '" data-id="' + playList[i].name + '" bjianj="' + playList[i].highest_bonus + '" sjianj="' + playList[i].lowest_bonus + '" fandian="' + playList[i].highest_feed + '">' +
                            '<label>' + playList[i].name + '</label>' +
                            '<label>1中' + playList[i].highest_bonus + '</label>' +
                            '</p>'
                    }
                    html += '</div>'
                    html += '</div>'
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

        //猜中位
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
                        '<div class="tips">' + title + '</div>'
                    html += '<div class="playInfoRight">' +
                        '<span class="allBtn">全</span>' +
                        '<span class="deletBtn">清</span>' +
                        '</div>'
                    html += '<div class="playInfoNum" style="width:560px">'
                    for (var i = 0; i < playList.length; i++) {
                        html += '<p class="inline" lottery_uuid="' + playList[i].lottery_id + '" id="' + playList[i].id + '" data-id="' + playList[i].name + '" bjianj="' + playList[i].highest_bonus + '" sjianj="' + playList[i].lowest_bonus + '" fandian="' + playList[i].highest_feed + '">' + playList[i].name + '</p>'
                    }
                    html += '</div>'
                    html += '</div>'
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
                html3 += '</div>'
            }
            $('.playInfoNumBox').html(html3);

        }

        //没有右边快捷选择按钮
        function addHtml2(dataName) {
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
                html3 += '</div>'
            }
            $('.playInfoNumBox').html(html3);
        }

        //任选
        function addHtml3(dataName) {
            html3 += '<div class="playInfoNumBtnBox">' +
                '<div class="playInfoNumBtnT">选择位置</div>' +
                '<div class="playInfoNumBtnRow gw">' +
                '<span class="playInfoNumBtnS wanwBtn playInfoNumBtnG" data-id="01">✔</span>' +
                '<span class="playInfoNumBtnDes">冠军</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow yw">' +
                '<span class="playInfoNumBtnS qianwBtn" data-id="02">✔</span>' +
                '<span class="playInfoNumBtnDes">亚军</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow jw">' +
                '<span class="playInfoNumBtnS baiwBtn" data-id="03">✔</span>' +
                '<span class="playInfoNumBtnDes">季军</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow smw" data-id="04">' +
                '<span class="playInfoNumBtnS shiwBtn">✔</span>' +
                '<span class="playInfoNumBtnDes">第四名</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow wmw">' +
                '<span class="playInfoNumBtnS gewBtn" data-id="05">✔</span>' +
                '<span class="playInfoNumBtnDes">第五名</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow lmw">' +
                '<span class="playInfoNumBtnS gewBtn" data-id="06">✔</span>' +
                '<span class="playInfoNumBtnDes">第六名</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow qmw">' +
                '<span class="playInfoNumBtnS gewBtn" data-id="07">✔</span>' +
                '<span class="playInfoNumBtnDes">第七名</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow bmw">' +
                '<span class="playInfoNumBtnS gewBtn" data-id="08">✔</span>' +
                '<span class="playInfoNumBtnDes">第八名</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow jmw">' +
                '<span class="playInfoNumBtnS gewBtn" data-id="09">✔</span>' +
                '<span class="playInfoNumBtnDes">第九名</span>' +
                '</div>' +
                '<div class="playInfoNumBtnRow smw">' +
                '<span class="playInfoNumBtnS gewBtn" data-id="10">✔</span>' +
                '<span class="playInfoNumBtnDes">第十名</span>' +
                '</div>' +
                '<span style="font-size:14px;color:#666;">注意：此处默认选择一个位置，请您自行调整</span>' +
                '</div>'
            html3 += '<div class="playInfoNumInBox">' +
                '<textarea id="playInfoNumIn" style="font-size: 20px;letter-spacing: 5px" placeholder="请输入投注号码，按回车键确认选号,小于10则前面加0如01，02"></textarea>' +
                '</div>' +
                '<div class="handelNumBox">' +
                '<span class="deleteNum inline">删除重复号</span>' +
                '<span class="deleteAll inline">清空</span>' +
                '</div>'
            $('.playInfoNumBox').html(html3);
            $('#playInfoNumIn').on('keyup', function () {
                let playid = $('.playInfoTypeInfoA').attr('id');//玩法id
                ds = $('#playInfoNumIn').val();//输入框字符长度
                if (playid == 294) {
                    if (ds.length == 5&&al==1) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 297) {
                    if (ds.length == 8&&al==2) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
            })

            $('.deleteNum').on('click', function () {
                var val = $('#playInfoNumIn').val();
                var _val = val.split(/,|\，/g);
                var __val = [];
                for (let i = 0; i < _val.length; i++) {
                    if (__val.indexOf(_val[i]) == -1) {
                        __val.push(_val[i])
                    }
                }
                $('#playInfoNumIn').val(__val);
            })

            $('.deleteAll').on('click', function () {
                $('#playInfoNumIn').val('')
            })

        }

        //创建没有位置选择的单式
        function addHtmlds() {
            html3 += '<div class="playInfoNumInBox">' +
                '<textarea id="playInfoNumIn" style="font-size: 20px;letter-spacing: 5px" placeholder="请输入投注号码，按回车键确认选号，小于10则前面加0如01，02"  onkeydown="if(event.keyCode==13){return false;}"></textarea>' +
                '</div>' +
                '<div class="handelNumBox">' +
                '<span class="deleteNum inline">删除重复号</span>' +
                '<span class="deleteAll inline">清空</span>' +
                '</div>'
            $('.playInfoNumBox').html(html3);

            $('#playInfoNumIn').on('keyup', function () {
                let playid = $('.playInfoTypeInfoA').attr('id');//玩法id
                var ds = $('#playInfoNumIn').val();//输入框字符长度
                if (playid == 256) {//猜前二输入时设置注数
                    if (ds.length == 5) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 259) {
                    if (ds.length == 8) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 262) {
                    if (ds.length == 11) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 265) {
                    if (ds.length == 14) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
            })

            $('.deleteNum').on('click', function () {
                var val = $('#playInfoNumIn').val();
                var _val = val.split(/,|\，/g);
                var __val = [];
                for (let i = 0; i < _val.length; i++) {
                    if (__val.indexOf(_val[i]) == -1) {
                        __val.push(_val[i])
                    }
                }
                $('#playInfoNumIn').val(__val);
            })

            $('.deleteAll').on('click', function () {
                $('#playInfoNumIn').val('')
            })
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
                $('.playInfoRight').removeClass('fastBtnA');
                if ($(this).hasClass('xztzA')) {
                    $(this).removeClass('xztzA');
                } else {
                    $(this).addClass('xztzA');
                    $(this).parent().addClass('pickNum');
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
            $('.playInfoNumBtnS').on('click', function () {
                let playid = $('.playInfoTypeInfoA').attr('id');
                al = $('.playInfoNumBtnG').length;
                var max;
                if (playid == 294) {
                    max = 1;
                    if (al==1&&ds.length==5){
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 297) {
                    max = 2;
                    if (al==2&&ds.length==8){
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 294 || playid == 297) {
                    if ($(this).hasClass('playInfoNumBtnG')) {
                        $(this).removeClass('playInfoNumBtnG');
                    } else {
                        $(this).addClass('playInfoNumBtnG');
                        if (al > max) {
                            $(this).removeClass('playInfoNumBtnG');
                            $.Msg('最多选择' + (max + 1) + '位置哦', {}
                            );
                        }
                    }
                }
                // countZhushu()
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
                    if (data_id == 6 || data_id == 7 || data_id == 8 || data_id == 9 || data_id == 10 || data_id == 11) {
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
                    if (data_id == 1 || data_id == 2 || data_id == 3 || data_id == 4 || data_id == 5) {
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
                    if (data_id == 1 || data_id == 3 || data_id == 5 || data_id == 7 || data_id == 9 || data_id == 11) {
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
                    if (data_id == 2 || data_id == 4 || data_id == 6 || data_id == 8 || data_id == 10) {
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
            $('.proless').text((lastJj - (utp * totalZs * beishu).toFixed(3)))
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
            $('.proless').text((jj - utp * totalZs * beishu).toFixed(3));
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
        var totalNum;

        function addTouzhu() {
            var dhpick = $('.playInfoNum').eq(1).find('.xztzA').length;
            var echpick = $('.playInfoNum').eq(0).find('.xztzA').length;
            var pickL = $('.pickNum').length;
            var allPN = $('.playInfoNum').length;
            var paiming;

            playId = $('.playInfoTypeInfoA').attr('id');//小玩法的id（例：五星直选复选的id=4）
            playName = $('.playWayName').text();//玩法名字
            tzjine = $('.totalPrice').text();
            totalNum = $('.totalZs').text();//总注数
            var aNum = '';
            if (tzjine == 0) {
                $.Msg('无效投注，请重新下注', {}
                );
            } else {
                if (playId == 253 || playId == 255 || playId == 258 || playId == 261 || playId == 264 || playId == 267 || playId == 268 || playId == 270 || playId == 271 || playId == 272 || playId == 273 || playId == 274 || playId == 275 || playId == 277 || playId == 278 || playId == 280 || playId == 281 || playId == 282 || playId == 283 || playId == 284 || playId == 285 || playId == 287 || playId == 288 || playId == 289 || playId == 290 || playId == 291 || playId == 256 || playId == 259 || playId == 262 || playId == 265 || playId == 294 || playId == 297) {
                    if (pickL < $('.playInfoNum').length) {
                        $.Msg('无效投注，请重新选择', {}
                        );
                    } else {
                        if (type == 1) {
                            if (playId == 256 || playId == 259 || playId == 262 || playId == 265 || playId == 294 || playId == 297) {
                                let num = $('#playInfoNumIn').val()
                                let _num
                                _num = num.replace(/,|\，/g, "|");//逗号替换
                                playNum.push(_num);
                                creatTouzhuHtml();
                                $('#playInfoNumIn').val('');
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
                            $('#playInfoNumIn').val('');
                            beishu = 1;
                        }
                    }
                }
                if (playId == 293) {
                    if (pickL < 2) {
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
                if (playId == 296) {
                    if (pickL < 3) {
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
                        $('#playInfoNumIn').val('');
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
            let playId = $('.playInfoTypeInfoA').attr('id');
            if (zs < 1) {
                $.Msg('无效注单，请重新下注'
                );
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
                    var rank = '';
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
                        if (playId == 256 || playId == 259 || playId == 262 || playId == 265 || playId == 294 || playId == 297) {
                            let num = $('#playInfoNumIn').val()
                            code_list = num.replace(/,|\，/g, "|");//逗号替
                        }
                    } else {
                        code_list = aNum + '|' + wezhi2
                    }


                    if (playId == 294 || playId == 297) {
                        $('.playInfoNumBtnG').each(function () {
                            rank += $(this).attr('data-id') + ','
                        })
                        rank = rank.substring(0, rank.length - 1);
                        tzmsg.push({
                            'play_id': play_id,
                            'action_coin': action_coin,
                            'bonus': bonus,
                            'mode': mode,
                            'bets_num': zs,
                            'mulriple': mulriple,
                            'rebate': rebate,
                            'code_list': code_list,
                            'rank': rank
                        })
                    } else {
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
                    }
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
                        // if(playId==256||playId==259||playId==262||playId==265||playId==294||playId==297){//单式传入值的设置，和其他的不一样
                        //     let num=$('#playInfoNumIn').val()
                        //     tzmsg[0].code_list=num.replace(/,|\，/g,"|");//逗号替换
                        // }
                    }
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
                        //每遍历一次获取一次奖金值
                        var sjj = $(this).attr('sjianj');
                        var bjj = $(this).attr('bjianj');
                        var fdz = $(this).attr('fandianNum');//返点值
                        var wayN = $(this).attr('data-id');
                        var play_id = $(this).attr('id');
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
                            // if(playId==256||playId==259||playId==262||playId==265||playId==294||playId==297){//单式传入值的设置，和其他的不一样
                            //     let num=$('#playInfoNumIn').val()
                            //     playnum=num.replace(/,|\，/g,"|");//逗号替换
                            // }
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
                            $.Msg(data.data, {
                                    offset: '150px',
                                    anim: 1
                                }
                            );
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
                            $.Msg(data.message, {
                                    offset: '150px',
                                    anim: 1
                                }
                            );
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
            var alltzmsg={};
            tzcommon = {'member_id': member_id, 'action_no': action_no, 'lottery_uuid': uuid, 'lottery_pid': lottery_id}
            if ($('.touzhulanD ul li').length > 0) {
                $('.touzhulanD ul li').each(function () {
                    var beishu = $(this).attr('beishu');//倍数
                    var touzs = $(this).attr('touzs');//投注数
                    var totaljine = $(this).attr('totaljine');//投注金额
                    var fanshui = ($(this).attr('fanshui') / 100).toFixed(3);//反水
                    var jianj = $(this).attr('jianj');//奖金
                    var play_id = $(this).attr('play-id');//玩法id
                    var playnum = $(this).attr('playnum');//玩法号码
                    var mode = $(this).attr('mode');//下注模式
                    var rank = $(this).attr('paiming');
                    if (playId == 294 || playId == 297) {
                        tzmsg.push({
                            'play_id': play_id,
                            'action_coin': totaljine,
                            'bonus': jianj,
                            'mode': mode,
                            'bets_num': touzs,
                            'mulriple': beishu,
                            'rebate': fanshui,
                            'code_list': playnum,
                            'rank': rank
                        });
                        alltzmsg = {'common': tzcommon, 'betBean': tzmsg}
                        getJson('post', '/officialorders/officialorders/makeOrder?c=Officialorders&a=makeOrder', alltzmsg, function (data) {
                            if (data.code == 1) {
                                $.Msg(data.data, {}
                                );
                                $('.touzhulanD ul').html('');
                                $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面
                                $._getBalane();
                            } else {
                                $.Msg(data.message, {}
                                );
                            }
                        })

                    } else {
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
                                $.Msg(data.data, {}
                                );
                                $('.touzhulanD ul').html('');
                                $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面
                                $._getBalane();
                            } else {
                                $.Msg(data.message, {}
                                );
                            }
                        })
                    }
                });
            } else {
                $.Msg('购彩蓝还没有可下单的注单', {}
                );
            }

        })//确认投注（购彩篮里面的注单）

//没有所在位置选择
        function creatTouzhuHtml() {
            var wfid = $('.playInfoTypeInfoA').attr('id');
            var play_id = $('.playInfoTypeInfoA').attr('play-id');
            var jianj = $('.thisWayPrice').text();
            var fanshui = $('.fandianNum').text();
            var paiming = '';
            if (playId == 294 || playId == 297) {
                $('.playInfoNumBtnG').each(function () {
                    paiming += $(this).attr('data-id') + ','
                })
                paiming = paiming.substring(0, paiming.length - 1);
            }
            var mode = $('.moshiBoxActive').attr('mode');
            var html = '<li class="relative" paiming="' + paiming + '" play-id="' + play_id + '" mode="' + mode + '" beishu="' + beishu + '" touzs="' + totalNum + '" totaljine="' + tzjine + '" fanshui="' + fanshui + '" jianj="' + jianj + '" title="' + playName + '" wfid="' + wfid + '" playNum="' + playNum + '">' +
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
            var dhpick = $('.playInfoNum').eq(1).find('.xztzA').length;
            var echpick = $('.playInfoNum').eq(0).find('.xztzA').length;
            if (playId == 253 || playId == 270 || playId == 271 || playId == 272 || playId == 273 || playId == 274 || playId == 275 || playId == 277 || playId == 278 || playId == 280 || playId == 281 || playId == 282 || playId == 283 || playId == 284 || playId == 285 || playId == 287 || playId == 288 || playId == 289 || playId == 290 || playId == 291) {
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
            if (playId == 255 || playId == 258 || playId == 261 || playId == 264) {
                if (pickL < allPN) {
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
            ;
            if (playId == 267 || playId == 268) {
                if (pickL < 1) {
                    totalZhushuNum = 0;
                    $('.proless').text(0);
                } else {
                    var total = [];
                    $('.playInfoNum').each(function () {
                        var numl = $(this).find('.xztzA').length;
                        total.push(numl)
                    });
                    dwd(total);
                }
            }
            ;
            if (playId == 293) {
                wsn = 2;
                if (pickL < 2) {
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
            if (playId == 296) {
                wsn = 3;
                if (pickL < 3) {
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
            $('.totalZs').text(totalZhushuNum);
            $('.totalPrice').text(utp * totalZhushuNum * beishu);
            if ($('.totalPrice').text() > 0) {
                $('.proless').text(($('.thisWayPrice').text() - $('.totalPrice').text()).toFixed(3));
            }

            //一个号码一注
            function qsfs(arr) {
                var alls = 1;
                for (var i = 0; i < arr.length; i++) {
                    alls *= arr[i]
                }
                totalZhushuNum = alls
            }

            //选几个几注
            function dwd(arr) {
                var alls = 0;
                for (var i = 0; i < arr.length; i++) {
                    alls += arr[i]
                }
                totalZhushuNum = alls
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
                    var sarr = [[]];
                    var result = [];
                    for (var i = 0; i < arr.length; i++) {
                        var tarr = [];
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


                //== 获取数组最终结果内容信息保存。
                function getResultList(arr, num) {
                    var resultList = [];
                    var restultGroupSplit = groupSplit2(arr, num);
                    for (let j = 0; j < restultGroupSplit.length; j++) {
                        resultList.push(combination(restultGroupSplit[j]));
                    }
                    // console.log('最终结果', resultList);


                    var resultNum = 0;
                    for (let j = 0; j < resultList.length; j++) {
                        resultNum += resultList[j].length;
                    }

                    // console.log('最终数量', resultNum);
                    totalZhushuNum = resultNum;
                }

                getResultList(arrList, wsn);
            }
        }

    }
})
