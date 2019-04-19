/**
 * Created by xdeng on 2018/12/18.
 */
if(tradepassword==''){
    //未设置资金密码
    $('.PwdDes').hide();
    $('.editPwdRow').show();
    $('.oldEditP').hide();
    $('.editPwdBox').show();
    $('.szzjp').show();
    $('.xgzjp').hide();
}else{
    $('.PwdDes').show();
    $('.editPwdRow').hide();
    $('.oldEditP').show();
    $('.editPwdBox').hide();
    $('.szzjp').hide();
    $('.xgzjp').show();
}
//设置资金密码
$('.szzjp').on('click',function(){
    var password=$('#ownP').val();
    var tradepassword=$('#newP').val();
    var tradepassword_confirm=$('#newP1').val();
    if(password==''){
         $.Msg('请输入登陆密码')
    }else if(tradepassword==''){
        $.Msg('请输入资金密码')
    }else if(tradepassword_confirm==''){
        $.Msg('请确认资金密码')
    }else{
        getJson('post','/member/member/setTradePassword?c=Member&a=setTradePassword',{'member_id':member_id,'password':password,'tradepassword':tradepassword,'reptradepassword':tradepassword_confirm,'mjmjid':mjmjid,'mjmjrandom':mjmjrandom},function(data){
            if(data.code==1){
                $.Msg(data.data)
                main.attr('src', 'memberinfo.html');
            }else{
                $.Msg(data.message)
            }
        });
    }
});

//修改资金密码
$('.setP').on('click',function(){
    $('.PwdDes').hide();
    $('.editPwdRow').show();
    $('.oldEditP').show();
    $('.editPwdBox').hide();
    $('.szzjp').hide();
    $('.xgzjp').show();
});
//修改资金密码
var main = $(window.parent.document).find("#main");
$('.xgzjp').on('click',function(){
    var oldtrad=$('#oldP').val();
    var newtrad=$('#newP').val();
    var newtrad_confirm=$('#newP1').val();
    if(oldtrad==''){
        $.Msg('请输入旧的资金密码')
    }else if(newtrad==''){
         layer.msg('请输入资金密码', {
                    offset: '150px',
                    anim: 1
                }
            );
    }else if(newtrad_confirm==''){
        layer.msg('请确认资金密码', {
                    offset: '150px',
                    anim: 1
                }
            );
    }else{
        getJson('post','/member/member/editTradePassword?c=Member&a=editTradePassword',{'member_id':member_id,'oldtradepwd':oldtrad,'newtradepwd':newtrad,'repnewtradepwd':newtrad_confirm,'mjmjid':mjmjid,'mjmjrandom':mjmjrandom},function(data){
            if(data.code==1){
                // alert(data.data)
                $.Msg(data.data)
                main.attr('src', 'memberinfo.html');
            }else{
                $.Msg(data.message)

            }
        });
    }
});
