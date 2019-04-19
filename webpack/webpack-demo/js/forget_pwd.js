$(function () {
    layui.use(['layer'],function () {
        var layer=layui.layer;
        document.onkeydown=function (e) {//回车监听
            if (e.keyCode==13){
                // $.Msg('回车监听')
                Retrieve()

            }
        };
        $('.registerBtn').on('click',function () {
            Retrieve()
        });
        function Retrieve() {//找回密码事件
            var username=$('#userName').val(),
                // pwd=$('#pwd').val(),
                // rpwd=$('#rpwd').val(),
                _usernmae=/^[a-zA-Z_][a-zA-Z0-9_]{4,14}$/,
                _pwd=/^[a-zA-Z0-9_]{5,16}$/;
            if (username==''){
                $.Msg('用户名不能为空')
            } else if (!username.match(_usernmae)){
                $.Msg('用户名格式不正确')
            }  else {
                // _getJson(
                //     'post',
                //     '/',
                //     {
                //         'username':username
                //     },
                //     function (data) {
                //
                //     }
                // )
            }
        }
    })


});
