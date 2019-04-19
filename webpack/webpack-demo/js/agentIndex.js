function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var ownNav = getQueryString('nav');
if (ownNav == 'team') {
    //团队报表页面
    $('.teamFormNav').show();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.teamFormBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'teamform.html')
}
if (ownNav == 'day') {
    //日度报表页面
    $('.teamFormNav').hide();
    $('.dayFormNav').show();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.dayFormBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'dayform.html')
}
if (ownNav == 'next') {
    //下级游戏记录页面
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').show();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.npGameRcordBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'nextGame.html')
}
if (ownNav == 'nextgl') {
    //下级管理页面
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').show();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.nextGlBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'nextgl.html')
}
if (ownNav == 'regagent') {
    //注册下级
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').show();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.registerNextBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'regagent.html')
}
if (ownNav == 'npr') {
    //上下级转账记录
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').show();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.npzhuanzBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'npzhuanzp.html')
}
if (ownNav == 'tuig') {
    //推广链接
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').show();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.extendBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'extend.html')
}

$('.agentNav ul li').on('click', function () {
    $('.agentNav ul li').removeClass('agentNActive');
    $(this).addClass('agentNActive')
});
$('.teamFormBtn').on('click', function () {
    //团队报表页面
    $('.teamFormNav').show();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.teamFormBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'teamform.html')
})
$('.npGameRcordBtn').on('click', function () {
    //下级游戏记录页面
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').show();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.npGameRcordBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'nextGame.html')
})
$('.dayFormBtn').on('click', function () {
    //日度报表页面
    $('.teamFormNav').hide();
    $('.dayFormNav').show();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.dayFormBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'dayform.html')
})
$('.nextGlBtn').on('click', function () {
    //下级管理页面
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').show();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.nextGlBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'nextgl.html')
})
$('.registerNextBtn').on('click', function () {
    //注册下级
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').show();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.registerNextBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'regagent.html')
})
$('.npzhuanzBtn').on('click', function () {
    //上下级转账记录
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').show();
    $('.registerNextNav').hide();
    $('.rextendNav').hide();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.npzhuanzBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'npzhuanzp.html')
})
$('.extendBtn').on('click', function () {
    //推广链接
    $('.teamFormNav').hide();
    $('.dayFormNav').hide();
    $('.npGameRcordNav').hide();
    $('.nextGlNav').hide();
    $('.npzhuanzNav').hide();
    $('.registerNextNav').hide();
    $('.rextendNav').show();
    $('.agentNav ul li').removeClass('agentNActive');
    $('.extendBtn').addClass('agentNActive')
    // $('#main').attr('src', '/index.php/personal/game/index.html')
    $('#main').attr('src', 'extend.html')
})
$('.zgPrveBtn').on('click',function(){
    $('.npzhuanzNav ul li').removeClass('ownNav');
    $(this).addClass('ownNav');
    $('#main').attr('src', 'npzhuanzp.html')
})
$('.zgNextBtn').on('click',function(){
    $('.npzhuanzNav ul li').removeClass('ownNav');
    $(this).addClass('npzhuanzn')
})

var liw = $('.teamFormNav ul li').width();
var lilen = $('.teamFormNav ul li').length;
$('.teamFormNav ul').width(liw * lilen + lilen);
//团队报表nav样式
var liw = $('.dayFormNav ul li').width();
var lilen = $('.dayFormNav  ul li').length;
$('.dayFormNav  ul').width(liw * lilen + lilen);
//日度报表nav样式
var liw = $('.npGameRcordNav ul li').width();
var lilen = $('.npGameRcordNav  ul li').length;
$('.npGameRcordNav  ul').width(liw * lilen + lilen);
//
