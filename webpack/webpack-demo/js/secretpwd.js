/**
 * Created by xdeng on 2018/12/18.
 */

$(function () {
    layui.use(['form'], function () {
        var question = localStorage.getItem('question');
        if (question === '') {
            //未设置密保问题
            $('.PwdDes').hide();
            $('.editPwdRow').show();
            $('.setSpBox').show();
            $('.editSpBox').hide();
        } else {
            //已设置
            $('.PwdDes').show();
            $('.editPwdRow').hide();
            $('#twop').val(question);
            //$('.PwdDes .setP').on('click',function(){
            //    $('.setSpBox').hide();
            //    $('.editSpBox').show();
            //})
        }
        $('.setP').on('click', function () {
            $('.editPwdRow').show();
            $('.PwdDes').hide();
            $('.setSpBox').hide();
            $('.editSpBox').show();
            //window.location.reload()
        })
//获取所有的密保问题
        getJson('post',
            '/member/member/getSecurityQues?c=Member&a=getSecurityQues',
            {
                'member_id': member_id,
            },
            function (data) {
                if (data.code == 1) {
                    var questionList = data.data;
                    $.each(questionList, function (i, item) {
                        $('#onep,#therep').append(new Option(item, item))
                    });
                    form.render();//刷新表单
                    var dn = 1;
                    $('.setSpBox .cpquestion .cpqIcon').on('click', function () {
                        if (dn == 1) {
                            $('.setSpBox .cpquestion ul').show();
                            dn = 2
                        } else {
                            $('.setSpBox .cpquestion ul').hide();
                            dn = 1
                        }
                    });
                    $('.setSpBox .cpquestion ul li').on('click', function () {
                        var question = $(this).html();
                        $('.setSpBox .cpquestion #newP').text(question);
                        $('.setSpBox .cpquestion #newP').attr('data-id', 1);
                        $('.setSpBox .cpquestion ul').hide();
                        dn = 1
                    });


                    var cn = 1;
                    $('.editSpBox .cpquestion .cpqIcon').on('click', function () {
                        if (cn == 1) {
                            $('.editSpBox .cpquestion ul').show();
                            cn = 2
                        } else {
                            $('.editSpBox .cpquestion ul').hide();
                            cn = 1
                        }
                    });
                    $('.editSpBox .cpquestion ul li').on('click', function () {
                        var question = $(this).html();
                        $('.editSpBox .cpquestion #oldP').text(question);
                        $('.editSpBox .cpquestion #oldP').attr('data-id', 1);
                        $('.editSpBox .cpquestion ul').hide();
                        cn = 1
                    });
                    var cm = 1;
                    $('.editSpBox .cpquestion1 .cpqIcon1').on('click', function () {
                        if (cm == 1) {
                            $('.editSpBox .cpquestion1 ul').show();
                            cm = 2
                        } else {
                            $('.editSpBox .cpquestion1 ul').hide();
                            cm = 1
                        }
                    });
                    $('.editSpBox .cpquestion1 ul li').on('click', function () {
                        var question = $(this).html();
                        $('.editSpBox .cpquestion1 #newP').text(question);
                        $('.editSpBox .cpquestion1 #newP').attr('data-id', 1);
                        $('.editSpBox .cpquestion1 ul').hide();
                        cm = 1
                    });
                }
            });

//点击确认设置密保问题
        $('.setSpBox .setf').on('click', function () {
            var question = $('#onep').val();
            var answer = $('#oneps').val();
            if (answer == '') {
                $.Msg('请输入密保答案')
            } else {
                getJson('post', '/member/member/setSecurity?c=Member&a=setSecurity', {
                    'member_id': member_id,
                    'question': question,
                    'answer': answer,
                }, function (data) {
                    if (data.code == 1) {
                        $.Msg(data.data)
                        localStorage.setItem('question', question);
                    } else {
                        $.Msg(data.message)
                    }
                })
            }
        });
//确认修改密保问题
        $('.editSpBox .setf').on('click', function () {
            var currentAnswer = $('#twops').val();
            var newQuestion = $('#therep').val();
            var newAnswer = $('#thereps').val();
            if (currentAnswer == '') {
                $.Msg('请输入旧密保答案')
            } else if (newAnswer == '') {
                $.Msg('请输入新密保答案')
            } else {
                getJson(
                    'post',
                    '/member/member/resetSecurity?c=Member&a=resetSecurity',
                    {
                        'member_id': member_id,
                        'currentAnswer': currentAnswer,
                        'newQuestion': newQuestion,
                        'newAnswer': newAnswer,
                    },
                    function (data) {
                        if (data.code == 1) {
                            localStorage.setItem('question', newQuestion);
                            $.Msg(data.data);
                            self.location.reload();//刷新iframe框架页面
                        } else {
                            $.Msg(data.message)
                        }
                    })
            }
        });


    })
});


