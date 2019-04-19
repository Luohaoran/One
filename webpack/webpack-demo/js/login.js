/**
 * Created by xdeng on 2018/11/20.
 */


$(function () {
    var go_url=''
    _getJson(
        'post',
        '/index/getConfig?from_station=only_port',
        {},
        function (data) {
            if (data.code==1){
                if (data.data.open_reg==1){
                    $('.goRegister').show();
                    go_url=data.data.reg_url;
                }else {
                    $('.goRegister').hide();
                }
            }
        }
    );

    $('.goRegister').on('click',function(){
        window.location.href=go_url
    });
    $('.goFindPwd').on('click',function(){
        window.location.href='/index.php/member/member/forgetpwd.html'
    });
    function Login(){
        var userName=$('#userName').val();
        var pwd=$('#passWord').val();
        if(userName==''){
            $.Msg('用户名不能为空')
        }else if(pwd==''){
            $.Msg('密码不能为空')
        }else if (pwd.length<6) {
            $.Msg('密码长度不能小于6位')
        }else if (userName.length<4){
            $.Msg('用户名最少4位')
        }else {
            getJson(
                'post',
                '/member/member/login',
                {'loginname':userName,'loginpwd':pwd},
                function(data){
                    if(data.code==1){
                        localStorage.clear();
                        window.location.href='/index.php/member/member/index.html';
                    }else{
                        layer.msg(data.data, {
                                offset: '250px',
                                anim: 1,
                            }
                        );
                    }
                })
        }

    }



    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            Login()
        }
    }

    $('.loginBtn').on('click',function(){
        // window.location.href='/index.php/member/member/index.html';
        Login()
    })

});

