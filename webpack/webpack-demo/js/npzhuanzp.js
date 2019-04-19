$(window).load(function () {
    var main = $(window.parent.document).find("#main");
    var thisheight = $('.npzhuanzpInfo').outerHeight(true) + 10
    if (thisheight < 750) {
        main.height(750);
    } else {
        main.height(thisheight);
        $(window.parent.document).find('.containerInfo').height(thisheight);
        $(window.parent.document).find('.container').height(thisheight);
        $(window.parent.document).find('.userNav').height(thisheight);
    }
});


$('.lotteryType').hover(function(){
    $(this).find('ul').show();
},function(){
    $(this).find('ul').hide();
})
$('.lotteryType ul li').on('click',function(){
    var typeName=$(this).html();
    var close_type=$(this).attr('close-type')
    $('#lotteryType').text(typeName);
    $('#lotteryType').attr('close-type',close_type)
})