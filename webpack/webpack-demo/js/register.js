/**
 * Created by xdeng on 2018/10/11.
 */


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

$("#pwd").blur(function(){
    var loginP=$(this).val();
    if(loginP==''){
        $(this).attr('placeholder','密码不能为空');
        $.Msg('密码不能为空')
    }else  if (!/^[a-zA-Z0-9_]{6,16}$/.test(loginP)) {
        $.Msg('密码格式不正确')
    }
});//判断密码
$("#editPwd").blur(function(){
    var loginP=$("#pwd").val();//登录密码
    var lRP=$(this).val();//确认登录密码
    if(lRP==''){
        $(this).attr('placeholder','资金密码不能为空');
        $.Msg('资金密码不能为空');
    }else if(lRP==loginP){
        $(this).attr('placeholder','资金密码不能与登录密码相同');
        $.Msg('资金密码不能与登录密码相同');
        $(this).val();
    }else{
        $('.rLoginPDes').hide();
    }
});//判断两次密码

//点击按钮跳转到登录
$('.goLogin').on('click',function(){
    window.location.href='login.html'
});
//点击注册按钮
function reg(){
    var nickName=$("#userName").val();//昵称
    var loginP=$("#pwd").val();//登录密码
    var loginPs=$("#pwds").val();//登录密码
    // var code=$('#code').val();
    var key=getQueryString('key');
    if(nickName==''){
        $.Msg('用户名不能为空');
    }else if (!/^[a-zA-Z_][a-zA-Z0-9_]{4,14}$/.test(nickName)){
        $.Msg('用户名格式不正确')
    }else if(loginP==''){
        $.Msg('登录密码不能为空');
    }else if (!/^[a-zA-Z0-9_]{6,16}$/.test(loginP)){
        $.Msg('密码格式不正确')
    } else if (loginP!==loginPs){
        $.Msg('两次密码不一致')
    }else
        {
        getJson('post',
            '/member/member/register',
            {
                'nickname':nickName,
                'password':loginP,
                // 'captcha':code,
                'key':key,
            },function(data){

                if(data.code==1){
                    $.Msg(data.data+'即将跳转到登陆页');
                    setTimeout(function () {
                        window.location.href='/'
                    },2000)
                }else{
                    $.Msg(data.data);
                }
            });
    }
}
$('.registerBtn').on('click',function(){
    reg()
});
document.onkeydown = function(e){
    var ev = document.all ? window.event : e;
    if(ev.keyCode==13) {
        reg()
    }
};
