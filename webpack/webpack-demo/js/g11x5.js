$(function () {

    var caizhongname = JSON.parse(localStorage.getItem("caizhongname"));//获取所有彩种信息
    var fdSmall = 0,//返点最小值
        fdBig = 0,//返点最大值
        jjinSmall = 0,//奖金最小值——对应返点最小值
        jjinBig = 0,//奖金最大值——对应返点最大值
        lastJjin = 0//变化后的奖金
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
                    // console.log(wayList);
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
                    // console.log('aaa');
                    $('.proless').text((totalJJ - touzp).toFixed(3));
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
            getJson('post', '/getlotterytime/getlotterytime/getTime?c=Getlotterytime&a=getTime', {
                'member_id': member_id,
                "lottery_uuid": uuid,
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
                        $('.lotteryNumInfo2').width(ll * (lw + 10))
                    }
                } else {
                    // alert(data.message);
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
                // window.location.reload();
                newOpen();
                // kaijiang();
            }, 3000)
        });//倒计时结束进行的操作

        newOpen()
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
                        html += '<span class="rankDate inline" style="width:40%;">' + dataList[i].expect + '</span>'
                        html += '<span class="rankNum inline" style="width:60%;">'
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
        //获取近期开奖号码


        //获取当前彩种的玩法
        getJson('post', '/lotteryitem/lotteryitem/getListTitle?c=Lotteryitem&a=getListTitle', {
            'member_id': member_id,
            "lottery_id": '3',
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
            if (waiId == 198) {
                type = 1;
                addHtml(waydata.g11x5_sxqszxfs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 199) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('手动输入或导入三个号码（三个号码各不相同），所录入的号码与当期顺序摇出的五个号码中的前三个号码相同，顺序一致，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 200) {
                type = 1;
                addHtml(waydata.g11x5_smqszxfs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 201) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('手动输入或导入三个号码（三个号码各不相同）组成一注，所录入的号码与当期顺序摇出的五个号码中的前三个号码相同，顺序不限，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 203) {
                type = 1;
                addHtml(waydata.g11x5_exqezxfs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 204) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('手动输入或导入两个号码（两个号码不同），所录入的号码与当期顺序摇出的五个号码中的前两个号码相同，顺序一致，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 205) {
                type = 1;
                addHtml(waydata.g11x5_emqszxfs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 206) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('手动输入或导入两个号码（两个号码不同）组成一注，所录入的号码与当期顺序摇出的五个号码中的前两个号码相同，顺序不限，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 208) {
                type = 1;
                addHtml(waydata.g11x5_bdd);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 210) {
                type = 1;
                addHtml(waydata.g11x5_dwd);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 212) {
                type = 1;
                addHtml(waydata.g11x5_rxfsyzy);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 213) {
                type = 1;
                addHtml(waydata.g11x5_rxfseze);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 214) {
                type = 1;
                addHtml(waydata.g11x5_rxfssazs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 215) {
                type = 1;
                addHtml(waydata.g11x5_rxfsszs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 216) {
                type = 1;
                addHtml(waydata.g11x5_rxfswzw);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 217) {
                type = 1;
                addHtml(waydata.g11x5_rxfslzw);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 218) {
                type = 1;
                addHtml(waydata.g11x5_rxfsqzw);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 219) {
                type = 1;
                addHtml(waydata.g11x5_rxfsbzw);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 221) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('从01-11中任意输入或导入一个号码,每个号码之间用英文逗号（,）隔开，作为一注，只要当期顺序摇出的五个开奖号码中包含所选号码，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 222) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('从01-11中任意输入或导入两个号码,每个号码之间用英文逗号（,）隔开，作为一注，只要当期顺序摇出的五个开奖号码中包含所选号码，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 223) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('从01-11中任意输入或导入三个号码,每个号码之间用英文逗号（,）隔开，作为一注，只要当期顺序摇出的五个开奖号码中包含所选号码，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 224) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('从01-11中任意输入或导入四个号码,每个号码之间用英文逗号（,）隔开，作为一注，只要当期顺序摇出的五个开奖号码中包含所选号码，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 225) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('从01-11中任意输入或导入五个号码,每个号码之间用英文逗号（,）隔开，作为一注，只要当期顺序摇出的五个开奖号码中包含所选号码，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 226) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('从01-11中任意输入或导入六个号码,每个号码之间用英文逗号（,）隔开，作为一注，只要所选号码包含当期顺序摇出的五个开奖号码，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 227) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('从01-11中任意输入或导入七个号码,每个号码之间用英文逗号（,）隔开，作为一注，只要所选号码包含当期顺序摇出的五个开奖号码，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 228) {
                type == 3
                addHtmlds();
                $('.playWarTitle').text('从01-11中任意输入或导入八个号码,每个号码之间用英文逗号（,）隔开，作为一注，只要所选号码包含当期顺序摇出的五个开奖号码，即为中奖。');
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 230) {
                type = 1;
                addHtml2(waydata.g11x5_rxdteze);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 231) {
                type = 1;
                addHtml2(waydata.g11x5_rxdtsazs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 232) {
                type = 1;
                addHtml2(waydata.g11x5_rxdtszs);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 233) {
                type = 1;
                addHtml2(waydata.g11x5_rxdtwzw);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 234) {
                type = 1;
                addHtml2(waydata.g11x5_rxdtlzw);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 235) {
                type = 1;
                addHtml2(waydata.g11x5_rxdtqzw);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 236) {
                type = 1;
                addHtml2(waydata.g11x5_rxdtbzw);
                xz();
                getfandjin(type, waiId)
            }
            if (waiId == 238) {
                type = 2;
                $('.playInfoNumBox').addClass('dxds');
                $('.playWarTitle').text('从5个开奖号码形成的六种单双组合中选择一种作为一注，若开奖号码符合所选的单双组合，即中奖。每种组合的中奖概率不一样，奖金也各不相同，奖金由高至低排列依次为：0单5双、5单0双、1单4双、4单1双、2单3双、3单2双。');
                addHtml0(type, waiId);
                xz();
                // getfandjin(type, waiId)
            }
            if (waiId == 239) {
                type = 2;
                $('.playInfoNumBox').addClass('czw');
                $('.playWarTitle').text('从03至09中选择1个号码作为1注，若开奖号码按照从大到小顺序排列后的第3个号码与投注号码相同，即为中奖。号码中奖概率不一样，奖金也不相同，奖金由高至低排列依次为：03/09、04/08、05/07、06。');
                addHtml1(type, waiId);
                xz();
                // getfandjin(type, waiId)
            }
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
                    html += '<div class="playInfoNum czw" style="width:560px">'
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

        //创建没有位置选择的单式
        function addHtmlds() {
            html3 += '<div class="playInfoNumInBox">' +
                '<textarea id="playInfoNumIn" style="font-size: 20px;letter-spacing: 5px" placeholder="请输入投注号码，按回车键确认选号，小于10则前面加0如01，02" onkeydown="if(event.keyCode==13){return false;}""></textarea>' +
                '</div>' +
                '<div class="handelNumBox">' +
                '<span class="deleteNum inline">删除重复号</span>' +
                '<span class="deleteAll inline">清空</span>' +
                '</div>'
            $('.playInfoNumBox').html(html3);

            $('#playInfoNumIn').bind('keyup', function () {//单式框输入文字检测
                let playid = $('.playInfoTypeInfoA').attr('id');//小玩法id
                var ds = $('#playInfoNumIn').val();//输入框值
                if (playid == 221) {//1中1
                    if (ds.length == 2) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 222) {//2中2
                    if (ds.length == 5) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 224) {//4中4
                    if (ds.length == 11) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 225) {//5中5
                    if (ds.length == 14) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 226) {//6中5
                    if (ds.length == 17) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 227) {//7中5
                    if (ds.length == 20) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 228) {//8中5
                    if (ds.length == 23) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 199) {//前三直选单式
                    if (ds.length == 8) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 201) {//前三组选单式
                    if (ds.length == 8) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 204) {//前二直选单式
                    if (ds.length == 5) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
                if (playid == 206) {//前二组选单式
                    if (ds.length == 5) {
                        $('.totalZs').text(1);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    } else {
                        $('.totalZs').text(0);
                        $('.totalPrice').text($('.totalZs').text() * 2)
                    }
                }
            });

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

            // $.unique(qiuqiuarr);
            $('.playInfoRight').on('click', 'span', function () {
                $('.playInfoRight span').removeClass('fastBtnA');
                // $(this).addClass('fastBtnA');
            })
            //选择投注数据
            $('.playInfoNum').on('click', 'span', function () {


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
                var count = 0;
                if (waiId == 230) {
                    count = 1
                }
                if (waiId == 231) {
                    count = 2
                }
                if (waiId == 232) {
                    count = 3
                }
                if (waiId == 233) {
                    count = 4
                }
                if (waiId == 234) {
                    count = 5
                }
                if (waiId == 235) {
                    count = 6
                }
                if (waiId == 236) {
                    count = 7
                }
                if (waiId == 230 || waiId == 231 || waiId == 232 || waiId == 233 || waiId == 234 || waiId == 235 || waiId == 236) {
                    if ($(this).hasClass('xztzA')) {
                        $(this).removeClass('xztzA');
                    } else {
                        var num = $(this).attr('data-id');
                        $('.inline [data-id="' + num + '"]').removeClass('xztzA');
                        $(this).addClass('xztzA');
                        $(this).parent().addClass('pickNum');
                        var al = $('.playInfoNum').eq(0).find('.xztzA').length;

                        if (al > count) {
                            $(this).removeClass('xztzA');
                            $.Msg('胆码只能选择' + count + '位', {}
                            );
                        }
                    }
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
            $('.proless').text((lastJj - (utp * totalZs * beishu).toFixed(3)).toFixed(3))
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
        var totalNum;

        function addTouzhu() {
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
                $.Msg('无效投注，请重新下注', {}
                );
            } else {
                if (playId == 198 || playId == 200 || playId == 203 || playId == 205 || playId == 208 || playId == 210 || playId == 212 || playId == 213 || playId == 214 || playId == 215 || playId == 216 || playId == 217 || playId == 218 || playId == 219 || playId == 230 || playId == 231 || playId == 232 || playId == 233 || playId == 234 || playId == 235 || playId == 236 || playId == 238 || playId == 239 || playId == 221 || playId == 222 || playId == 224 || playId == 225 || playId == 226 || playId == 227 || playId == 228 || playId == 199 || playId == 201 || playId == 204 || playId == 206) {
                    if (pickL < $('.playInfoNum').length) {
                        $.Msg('无效投注，请重新选择', {}
                        );
                    } else {
                        if (type == 1) {
                            if (playId == 221 || playId == 222 || playId == 224 || playId == 225 || playId == 226 || playId == 227 || playId == 228 || playId == 199 || playId == 201 || playId == 204 || playId == 206) {
                                // console.log('111');
                                let num = $('#playInfoNumIn').val()
                                let _num
                                _num = num.replace(/,|\，/g, "|");//逗号替换
                                playNum.push(_num);
                                creatTouzhuHtml();
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
                                        // console.log('playId 214')

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
                            $('#playInfoNumIn').val('');
                            beishu = 1;
                        }
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
            if (zs < 1) {
                $.Msg('无效注单，请重新下注');
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
                            playNum = [];
                            beishu = 1;
                            $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面//确定删除之后刷新页面
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
                            console.log(fdz);
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
                            playNum = [];
                            beishu = 1;
                            $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面//确定删除之后刷新页面
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
                });
            } else {
                $.Msg('购彩蓝还没有可下单的注单')
            }
            alltzmsg = {'common': tzcommon, 'betBean': tzmsg}
            //请求下单接口
            getJson('post', '/officialorders/officialorders/makeOrder?c=Officialorders&a=makeOrder', alltzmsg, function (data) {
                if (data.code == 1) {
                    $.Msg(data.data);
                    $('.touzhulanD ul').html('');
                    $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面//确定删除之后刷新页面
                    $._getBalane();
                } else {
                    $.Msg(data.message);
                }
            })
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
            $('#playInfoNumIn').val('');

            playNum = [];
            beishu = 1;
            $.refs('code-1','/officialorders/getOrderRecord?from_station=only_port',{})//确定删除之后刷新页面
        }

        //计算投注数
        function countZhushu() {
            var playId = $('.playInfoTypeInfoA').attr('id');//小玩法的id（例：五星直选复选的id=4）
            var wsn = 0;//组成几位数（id=6就是一个数组组合成5位数）
            var fristPrice = 0;//投注金额（）
            var totalZhushuNum = 0;//总注数
            var pickL = $('.pickNum').length;
            // console.log('pickL===='+pickL);
            var allPN = $('.playInfoNum').length;
            // console.log('allPN===='+allPN);
            var echpick = $('.playInfoNum').eq(0).find('.xztzA').length;
            // console.log('echpick====胆码'+echpick);
            var dhpick = $('.playInfoNum').eq(1).find('.xztzA').length;
            // console.log('dhpick====拖码'+dhpick);

            var pickNumA = 0;
            $('.pickNum').each(function () {
                pickNumA = $(this).find('.xztzA').length;
            })
            if (playId == 198 || playId == 203) {
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
            if (playId == 200) {
                wsn = 3;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 3) {
                    totalZhushuNum = 0;
                    $('.proless').text(0);
                } else {
                    // console.log('playId 200')

                    $('.xztzA').each(function () {
                        var tnum = $(this).attr('data-id');
                        allNum.push(tnum);
                    });
                    chooseZs(wsn)
                }
            }
            ;
            if (playId == 205 || playId == 213) {
                wsn = 2;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 2) {
                    totalZhushuNum = 0;
                    $('.proless').text(0);
                } else {
                    // console.log('playId 205 213')

                    $('.xztzA').each(function () {
                        var tnum = $(this).attr('data-id');
                        allNum.push(tnum);
                    });
                    chooseZs(wsn)
                }
            }
            ;
            if (playId == 214) {
                wsn = 3;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 3) {
                    totalZhushuNum = 0;
                    $('.proless').text(0);
                } else {
                    // console.log('playId 214')

                    $('.xztzA').each(function () {
                        var tnum = $(this).attr('data-id');
                        allNum.push(tnum);
                    });
                    chooseZs(wsn)
                }
            }
            if (playId == 215) {
                wsn = 4;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 4) {
                    totalZhushuNum = 0;
                    $('.proless').text(0);
                } else {
                    // console.log('playId 215')

                    $('.xztzA').each(function () {
                        var tnum = $(this).attr('data-id');
                        allNum.push(tnum);
                    });
                    chooseZs(wsn)
                }
            }
            if (playId == 216) {
                wsn = 5;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 5) {
                    totalZhushuNum = 0;
                    $('.proless').text(0);
                } else {
                    // console.log('playId 216')

                    $('.xztzA').each(function () {
                        var tnum = $(this).attr('data-id');
                        allNum.push(tnum);
                    });
                    chooseZs(wsn)
                }
            }
            if (playId == 217) {
                wsn = 6;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 6) {
                    totalZhushuNum = 0;
                    $('.proless').text(0);
                } else {
                    // console.log('playId 217')

                    $('.xztzA').each(function () {
                        var tnum = $(this).attr('data-id');
                        allNum.push(tnum);
                    });
                    chooseZs(wsn)
                }
            }
            if (playId == 218) {
                wsn = 7;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 7) {
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
            if (playId == 219) {
                wsn = 8;
                var numL = $('.playInfoNum').find('.xztzA').length;
                var allNum = [];
                if (numL < 8) {
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
            if (playId == 208 || playId == 212 || playId == 238 || playId == 239) {
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
            if (playId == 210) {
                if (pickL < allPN) {
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
            if (playId == 230) {//二中二
                wsn = 1;
                if (echpick + dhpick < 2) {
                    $('.proless').text(0);
                    totalZhushuNum = 0;
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
                    totalZhushuNum = ((echpick) * (dhpick));//计算总注数;
                    qpqc(list1, list2, wsn)
                }
            }
            if (playId == 231) {
                wsn = 2;
                if ((echpick + dhpick) < 2) {
                    $('.proless').text(0);
                    totalZhushuNum = 0;
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
            if (playId == 232) {//四中四
                wsn = 4;
                if ((echpick + dhpick) < 4) {
                    $('.proless').text(0);
                    totalZhushuNum = 0;
                } else {
                    // console.log('选择');
                    var list1 = [];
                    var list2 = [];
                    $('.playInfoNum').eq(0).find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        list1.push(num);//胆码
                    });
                    $('.playInfoNum').eq(1).find('.xztzA').each(function () {
                        var num = $(this).attr('data-id');
                        list2.push(num);//拖码
                    });

                    totalZhushuNum = combination(dhpick, (4 - echpick));//计算总注数;
                    qpqc(list1, list2, wsn)
                }
            }
            if (playId == 233) {//五中五
                wsn = 4;
                if ((echpick + dhpick) < 5) {
                    $('.proless').text(0);
                    totalZhushuNum = 0;
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
                    totalZhushuNum = combination(dhpick, (5 - echpick));//计算总注数;
                    qpqc(list1, list2, wsn)
                }
            }
            if (playId == 234) {//六中五
                wsn = 5;
                if ((echpick + dhpick) < 6) {
                    $('.proless').text(0);
                    totalZhushuNum = 0;
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
                    totalZhushuNum = combination(dhpick, (6 - echpick));//计算总注数;
                    qpqc(list1, list2, wsn)
                }
            }
            if (playId == 235) {//七中五
                wsn = 6;
                if ((echpick + dhpick) < 7) {
                    $('.proless').text(0);
                    totalZhushuNum = 0;
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
                    totalZhushuNum = combination(dhpick, (7 - echpick));//计算总注数;
                    qpqc(list1, list2, wsn)
                }
            }
            if (playId == 236) {//八中五
                wsn = 7;
                if ((echpick + dhpick) < 8) {
                    $('.proless').text(0);
                    totalZhushuNum = 0;
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
                    totalZhushuNum = combination(dhpick, (8 - echpick));//计算总注数;
                    qpqc(list1, list2, wsn)
                }
            }
            $('.totalZs').text(totalZhushuNum);
            $('.totalPrice').text(utp * totalZhushuNum * beishu);
            if ($('.totalPrice').text() > 0) {
                var num = $('.thisWayPrice').text() - $('.totalPrice').text();
                $('.proless').text(num.toFixed(3));
            }

            function combination(m, n) {
                return factorial(m, n) / factorial(n, n);//就是Cmn(上面是n，下面是m) = Amn(上面是n，下面是m)/Ann(上下都是n)
            }

            function factorial(m, n) {//阶乘求注数
                var num = 1;
                var count = 0;
                for (var i = m; i > 0; i--) {
                    if (count == n) {//当循环次数等于指定的相乘个数时，即跳出for循环
                        break;
                    }
                    num = num * i;
                    count++;
                }
                return num;
            }

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
                // totalZhushuNum = coutNum;
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
                // console.log(totalZhushuNum+'totalZhushuNum')
            }
        }

    }
});
