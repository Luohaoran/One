/**
 * Created by xdeng on 2018/12/14.
 */

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var ownNav = getQueryString('nav');
var type = getQueryString('type');


if (ownNav == 'tzjl') {
    //游戏记录页面
    $('.gameNav').show();
    $('.tradeNav').hide();
    $('.capitalNav').hide();
    $('.noticeNav').hide();
    $('.accountNav').hide();
    $('.gameRuleNav').hide();
    $('.userNav ul li').removeClass('userNActive');
    $('.showGameBtn').addClass('userNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'noterecord.html')
}
if (ownNav == 'notice') {
    //站内信页面
    $('.gameNav').hide();
    $('.tradeNav').hide();
    $('.capitalNav').hide();
    $('.noticeNav').show();
    $('.accountNav').hide();
    $('.gameRuleNav').hide();
    $('.userNav ul li').removeClass('userNActive');
    $('.showNoticeBtn').addClass('userNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'notice.html')


}
if (ownNav == 'zjjy') {
    //资金交易页面
    $('.gameNav').hide();
    $('.tradeNav').hide();
    $('.capitalNav').show();
    $('.noticeNav').hide();
    $('.accountNav').hide();
    $('.gameRuleNav').hide();
    $('.userNav ul li').removeClass('userNActive');
    $('.showCapitalBtn').addClass('userNActive')
    $('#main').attr('src', 'recharge.html')
    /*用于点击指定a标签跳转到指定iframe页面*/
    if (type == 1) {
        $('.capitalNav ul').find('li:eq(0)').addClass('ownNav');
        $('.capitalNav ul').find('li:eq(0)').siblings().removeClass('ownNav')
        $('#main').attr('src', 'recharge.html')
    }
    // if (type == 2) {
    //     $('.capitalNav ul').find('li:eq(1)').addClass('ownNav');
    //     $('.capitalNav ul').find('li:eq(1)').siblings().removeClass('ownNav')
    //     $('#main').attr('src', 'zhuanzhang.html')
    // }
    if (type == 3) {
        $('.capitalNav ul').find('li:eq(1)').addClass('ownNav');
        $('.capitalNav ul').find('li:eq(1)').siblings().removeClass('ownNav')
        $('#main').attr('src', 'put.html')
    }
}
if (ownNav == 'zhgl') {
    //账户管理页面
    $('.gameNav').hide();
    $('.tradeNav').hide();
    $('.capitalNav').hide();
    $('.noticeNav').hide();
    $('.accountNav').show();
    $('.gameRuleNav').hide();
    $('.userNav ul li').removeClass('userNActive');
    $('.showPersonalBtn').addClass('userNActive')
    $('#main').attr('src', 'memberinfo.html');
}
if (ownNav == 'jyjl') {
    //交易记录页面
    $('.gameNav').hide();
    $('.tradeNav').show();
    $('.capitalNav').hide();
    $('.noticeNav').hide();
    $('.accountNav').hide();
    $('.gameRuleNav').hide();
    $('.userNav ul li').removeClass('userNActive');
    $('.showTradeBtn').addClass('userNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    // console.log(type);
    $('#main').attr('src', 'tranrecord.html')

}


$('.userNav ul li').on('click', function () {
    $('.userNav ul li').removeClass('userNActive');
    $(this).addClass('userNActive')
});
$('.showGameBtn').on('click', function () {
    $('.gameNav').show();
    $('.tradeNav').hide();
    $('.capitalNav').hide();
    $('.noticeNav').hide();
    $('.accountNav').hide();
    $('.gameRuleNav').hide();
    $('.gameNav  ul li').removeClass('ownNav')
    $('.ownGameI').addClass('ownNav');
    // $('#main').attr('src', '/index.php/personal/game/index.html');
    $('#main').attr('src', 'noterecord.html')
})//显示游戏记录页
$('.showTradeBtn').on('click', function () {
    $('.gameNav').hide();
    $('.tradeNav').show();
    $('.capitalNav').hide();
    $('.noticeNav').hide();
    $('.gameRuleNav').hide();
    $('.accountNav').hide();
    $('.tradeNav ul li').removeClass('ownNav')
    $('.ownTranBtn').addClass('ownNav');
    $('#main').attr('src', 'tranrecord.html')
})//显示交易记录页
$('.showNoticeBtn').on('click', function () {
    $('.gameNav').hide();
    $('.tradeNav').hide();
    $('.capitalNav').hide();
    $('.noticeNav').show();
    $('.gameRuleNav').hide();
    $('.accountNav').hide();
    $('#main').attr('src', 'notice.html')
})//显示站内公告页
$('.showCapitalBtn').on('click', function () {
    $('.gameNav').hide();
    $('.tradeNav').hide();
    $('.capitalNav').show();
    $('.noticeNav').hide();
    $('.accountNav').hide();
    $('.gameRuleNav').hide();
    $('.capitalNav ul li').removeClass('ownNav')
    $('.ownRechargeBtn').addClass('ownNav');
    $('#main').attr('src', 'recharge.html')
})//显示资金交易页
$('.gameRuleBtn').on('click', function () {
    $('.gameNav').hide();
    $('.tradeNav').hide();
    $('.capitalNav').hide();
    $('.noticeNav').hide();
    $('.accountNav').hide();
    $('.gameRuleNav').show();
    $('.accountNav ul li').removeClass('ownNav')
    $('.page_ssc').addClass('ownNav');
    var pid = $('.gameRuleNav ul li').eq(0).attr('pid');
    $('#main').attr('pid', pid);
    $('#main').attr('src', '/index.php/personal/gamerule.html')
})//显示游戏规则页
$('.showPersonalBtn').on('click', function () {
    $('.gameNav').hide();
    $('.tradeNav').hide();
    $('.capitalNav').hide();
    $('.noticeNav').hide();
    $('.accountNav').show();
    $('.gameRuleNav').hide();
    $('.gameRuleNav ul li').removeClass('ownNav')
    $('.ownmsg').addClass('ownNav');
    $('#main').attr('src', 'memberinfo.html');
})//显示个人资料页


//账户管理
$('.accountNav ul li').on('click', function () {
    $('.accountNav ul li').removeClass('ownNav');
    $(this).addClass('ownNav');

})
$('.ownmsg').on('click', function () {
    $('#main').attr('src', 'memberinfo.html')
});//个人资料
$('.ownPwd').on('click', function () {
    $('#main').attr('src', 'editPwd.html')
});//登录密码
$('.ownEmail').on('click', function () {
    $('#main').attr('src', 'email.html')
});//电子邮箱
$('.ownPwdQ').on('click', function () {
    $('#main').attr('src', 'secretpwd.html')
});//密保问题
$('.ownZJPwd').on('click', function () {
    $('#main').attr('src', 'edittrad.html')
});//资金密码
$('.ownBankCard').on('click', function () {
    $('#main').attr('src', 'bank.html')
});//银行卡管理
//账户管理

//游戏规则
$('.gameRuleNav ul li').on('click', function () {
    $('.gameRuleNav ul li').removeClass('ownNav');
    $(this).addClass('ownNav');
    var pid = $(this).attr('pid');

    $('#main').attr('pid', pid);
});
$('.gameRuleBtn').on('click', function () {
    // $('#main').attr('src', '/index.php/personal/game/gamerule.html');
    $('#main').attr('src', 'noterecord.html')
})
//游戏规则

//资金交易
$('.capitalNav ul li').on('click', function () {
    $('.capitalNav ul li').removeClass('ownNav');
    $(this).addClass('ownNav');
});
$('.ownRechargeBtn').on('click', function () {
    $('#main').attr('src', 'recharge.html')
});//充值
$('.ownPutBtn').on('click', function () {
    $('#main').attr('src', 'put.html')
});//提现
$('.ownZhuanZBtn').on('click', function () {
    $('#main').attr('src', 'zhuanzhang.html')
});//转账
//资金交易s

//交易记录
$('.tradeNav ul li').on('click', function () {
    $('.tradeNav ul li').removeClass('ownNav');
    $(this).addClass('ownNav');
});
$('.ownTranBtn').on('click', function () {
    $('#main').attr('src', 'tranrecord.html')
});//交易流水
$('.ownRechargeRBtn').on('click', function () {
    $('#main').attr('src', 'tranrecord.html')
});//充值记录
$('.ownPutRBtn').on('click', function () {
    $('#main').attr('src', 'putrecord.html')
});//提现记录
//交易记录

//游戏记录
$('.gameNav ul li').on('click', function () {
    $('.gameNav ul li').removeClass('ownNav');
    $(this).addClass('ownNav');
});
$('.ownGameI').on('click', function () {
    // $('#main').attr('src', '/index.php/personal/game/index.html');
    $('#main').attr('src', 'noterecord.html')
});//彩票投注
$('.ownLotteryN').on('click', function () {
    $('#main').attr('src', 'lotteryn.html')
});//彩票追号
$('.ownProloss').on('click', function () {
    $('#main').attr('src', 'proloss.html')
});//盈亏统计
//游戏记录

var liw = $('.gameNav ul li').width();
var lilen = $('.gameNav ul li').length;
$('.gameNav ul').width(liw * lilen + lilen);
//游戏记录导航样式
var liw = $('.tradeNav ul li').width();
var lilen = $('.tradeNav ul li').length;
$('.tradeNav ul').width(liw * lilen + lilen);
//交易记录导航样式
var liw = $('.noticeNav ul li').width();
var lilen = $('.noticeNav ul li').length;
$('.noticeNav ul').width(liw * lilen + lilen);
//站内信导航样式
var liw = $('.capitalNav ul li').width();
var lilen = $('.capitalNav ul li').length;
$('.capitalNav ul').width(liw * lilen + lilen);
//资金交易导航样式
var liw = $('.accountNav ul li').width();
var lilen = $('.accountNav ul li').length;
$('.accountNav ul').width(liw * lilen + lilen);
//账户管理导航样式
