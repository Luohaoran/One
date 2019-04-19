/**
 * Created by xdeng on 2018/12/17.
 */
!function () {
    $('#addBnum').on('keyup mouseout input', function () {
        var $this = $(this),
            v = $this.val();
        /\S{5}/.test(v) && $this.val(v.replace(/\s/g, '').replace(/(.{4})/g, "$1 "));
    });
}();
function luhnCheck(bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array(); //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9
    var arrOuShu = new Array(); //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) { //奇数位
            if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
            else arrJiShu2.push(parseInt(newArr[j]) * 2);
        } else //偶数位
            arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
//计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

//计算luhn值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhn = 10 - k;

    if (lastNum == luhn) {
        return true;
    } else {
        return false;
    }
}


$('.cpD').on('click', function () {
    $('.addBankRow').hide();
});
$('.ckBank').on('click', function () {
    $('.allBank').show();
});
// $('.editBankRow .cpD').on('click', function () {
//     $('.editBankRow').hide();
// });
$('.checkPwdBox .cpD').on('click', function () {
    $('.checkPwd').hide();
});
//验证资金密码
// $('.ckpBtn').on('click', function () {
//     var tradepassword = $('#ckp').val();
//     console.log(tradepassword)
//     if (tradepassword == '') {
//         alert('aaa');
//         $('#ckp').val('请输入要验证的资金密码')
//     } else {
//         getJson('post', '/member/member/checkTradePwd?c=Member&a=checkTradePwd', { 'member_id': member_id, 'tradepassword': tradepassword, 'mjmjid': mjmjid, 'mjmjrandom': mjmjrandom }, function (data) {
//             if (data.code == 1) {
//                 $('.checkPwd').hide();
//                 $('.editBankRow').show();
//             } else {
//                 alert(data.message);
//             }
//         });
//     }
// });
//获取所有的开户行
getJson('post', '/member/member/getSysBank?c=Member&a=getSysBank', {
    'member_id': member_id,
    'mjmjid': mjmjid,
    'mjmjrandom': mjmjrandom
}, function (data) {
    if (data.code == 1) {
        var bankList = data.data;
        var html = '';
        for (var i = 0; i < bankList.length; i++) {
            html += '<li class="bankNM" data-id="' + bankList[i].key + '">' + bankList[i].name + '</li>'
        }
        $('.allBank').html(html);
        $('.addBankBox ul li .bankNM').on('click', function () {
            var bankM = $(this).html();
            var data_id = $(this).attr('data-id');
            $('#ckBank1').text(bankM);
            $('#ckBank1').attr('data-id', data_id);
            $('.allBank').hide();
        });
        $('.addBankBox ul li .bankNM').on('click', function () {
            var bankM = $(this).html();
            var data_id = $(this).attr('data-id');
            $('#ckBank').text(bankM);
            $('#ckBank').attr('data-id', data_id);
            $('.allBank').hide();
        });
    }
});

// (function () {
//     if (true) {
//         // var bankMList = data.data;
//         var _Data=[
//             {
//                 bank_type: "中国建设银行",
//                 username: "张*",
//                 opening_bank: "阿萨德撒大所多",
//                 card_number: "2343*********2432"
//             },
//             {
//                 bank_type: "中国建设银行",
//                 username: "张*",
//                 opening_bank: "阿萨德撒大所多",
//                 card_number: "2343*********2432"
//             }
//         ];
//         if (false) {
//             alert('您还未绑定银行卡')
//         } else {
//             var html='';
//             // $('.bankListRow ul li').eq(0).addClass('ownBankName');
//             for (var i=0;i<2;i++){
//                 $('.bankListRow ul li').eq(i).addClass('ownBankName');
//                 $('.bankListRow ul li').eq(i).removeClass('nob');
//             }
//             $.each(_Data,function (i,item) {
//                 console.log(item.bank_type)
//                 console.log(item.card_number)
//                 console.log(item.username)
//                 html+= '<span class="bankLogo inline relative">￥</span>' +
//                     '<span class="bankName">' + item.bank_type + '</span>' +
//                     '<div class="bankNum">' + item.card_number + '</div>' +
//                     '<div class="bankN absolute"></div>' +
//                     $('.bankListRow ul li').eq(i).html(html);
//                 console.log(i);
//             });
//             //for(var i=0;i<bankMList.length;i++){
//             // var html= '<li class="ownBankName relative">' +
//             //     '<span class="bankLogo inline relative">￥</span>' +
//             //     '<span class="bankName">' + bankMList.bank_type + '</span>' +
//             //     '<div class="bankNum">' + bankMList.card_number + '</div>' +
//             //     '<div class="bankN absolute">持卡人：' + bankMList.username + '</div>' +
//             //     '</li>';
//             // }
//             // $('.bankListRow ul').prepend(html);
//             // $('.nob').hide();
//
//             // $('#editBn').val(bankMList.username);
//             // $('#editnum').val(bankMList.card_number)
//             // $('#ckBank1').text(bankMList.bank_type);
//             // $('#ckBank1').attr('bank-id', bankMList.bank_id);
//             // $('#ckBank1').attr('data-id', bankMList.bank_type_id);
//             // $('#bD1').val(bankMList.opening_bank);
//
//             $('.bankListRow .ownBankName').on('click', function () {
//                 //验证资金密码
//                 // $('.checkPwd').show();
//             });
//
//         }
//     }
//
// })()
$('.nob').on('click', function () {
    if ($(this).children('.bankLogo').length === 0) {
        $('.addBankRow').show();

    }
});
//获取个人银行卡信息
getJson(
    'post',
    '/member/member/getBankInfo?c=Member&a=getBankInfo',
    {
        'member_id': member_id,
    },
    function (data) {
        if (data.code == 1) {
            var bankMList = data.data;
            if (bankMList == '') {
                // alert('您还未绑定银行卡')
                $.Msg('您还未绑定银行卡')
            } else {
                for (var i = 0; i < bankMList.length; i++) {
                    $('.bankListRow ul li').eq(i).addClass('ownBankName relative');
                    $('.bankListRow ul li').eq(i).removeClass('nob');
                }
                $.each(bankMList, function (i, item) {
                    var html = '';
                    html += '<span class="bankLogo inline relative">￥</span>' +
                        '<span class="bankName">' + item.bank_type + '</span>' +
                        '<div class="bankNum">' + item.card_number + '</div>' +
                        '<div class="bankN absolute">持卡人：' + item.username + '</div>';
                    $('.ownBankName').eq(i).html(html);
                });
                // $('#editBn').val(bankMList.username);
                // $('#editnum').val(bankMList.card_number)
                // $('#ckBank1').text(bankMList.bank_type);
                // $('#ckBank1').attr('bank-id', bankMList.bank_id);
                // $('#ckBank1').attr('data-id', bankMList.bank_type_id);
                // $('#bD1').val(bankMList.opening_bank);

                // $('.bankListRow .ownBankName').on('click', function () {
                //     //验证资金密码
                //     // $('.checkPwd').show();
                // });
                // $('.nob').on('click', function () {
                //     $('.addBankRow').show();
                // });
            }
        }
    })


//点击添加银行卡

$('.addB').on('click', function () {
    // console.log('11');
    var han = /^[\u4e00-\u9fa5]+$/;//汉字正则
    var username = $('#addBn').val();
    var card_number = $('#addBnum').val();
    var opening_bank = $('#bD').val();
    var bank_type = $('#ckBank').attr('data-id');
    //var bank_id=$('#ckBank').attr('bank-id');
    var bankN = $('#ckBank').text();
    if (username == '') {
        $.Msg('请输入收款人姓名')
    } else if (!han.test(username)) {
        $.Msg('收款人请输入中文')
    } else if (card_number == '') {
        $.Msg('请输入收款卡号')
    } else if (opening_bank == '') {
        $.Msg('请输入开户网点')
    } else if (bank_type == '' || bank_type == 'undefined') {
        $.Msg('请选择开户行')
    } else if (!luhnCheck((card_number.replace(/\s*/g,"")))) {
        $.Msg('请输入正确的银行卡')
    }else {
        getJson(
            'post',
            '/member/member/addBankCard?c=Member&a=addBankCard',
            {
                'member_id': member_id,
                'username': username,
                'card_number': card_number,
                'opening_bank': opening_bank,
                'bank_type': bank_type,
            },
            function (data) {
                if (data.code == 1) {
                    $.Msg(data.data)
                    $('.addBankRow').hide();
                    self.location.reload();//刷新当前字iframe页面

                    // var html = '<li class="ownBankName relative">' +
                    //     '<span class="bankLogo inline relative"><img class="absolute" src="/assets/img/ny.png"/></span>' +
                    //     '<span class="bankName">' + bankN + '</span>' +
                    //     '<div class="bankNum">' + card_number + '</div>' +
                    //     '<div class="bankN absolute">持卡人：' + username + '</div>' +
                    //     '</li>';
                    //
                    //
                    // $('.bankListRow ul').prepend(html);
                    // $('.nob').hide();
                    // // window.parent.location.reload()
                    // $('#editBn').val(username);
                    // $('#editnum').val(card_number)
                    // $('#ckBank1').val(bankN);
                    // $('#ckBank1').attr('data-id', bank_type);
                    // $('#bD1').val(opening_bank)
                    // // $('.bankListRow .ownBankName').on('click', function () {
                    // //     $('.editBankRow').show();
                    // // });
                } else {
                    $.Msg(data.message)
                }
            });
    }
});

$('.editBankInfo input').each(function () {
    $(this).focus(function () {
        this.value = "";
    })
});
//点击提交修改银行卡信息
// $('.editB').on('click', function () {
//     var username = $('#editBn').val();
//     var card_number = $('#editnum').val();
//     var opening_bank = $('#bD1').val();
//     var bank_type = $('#ckBank1').attr('data-id');
//     var bank_id = $('#ckBank1').attr('bank-id');
//     //var bankN=$('#ckBank1').text();
//     if (username == '') {
//         $('#editBn').attr('placeholder', '请输入姓名')
//     } else if (card_number == '') {
//         $('#editnum').attr('placeholder', '请输入卡号')
//     } else if (opening_bank == '') {
//         $('#bD').attr('placeholder', '请输入开户行地址')
//     } else {
//         getJson('post', '/member/member/editBank?c=member&a=editBank', { 'username': username, 'card_number': card_number, 'opening_bank': opening_bank, 'bank_type': bank_type, 'bank_id': bank_id, 'mjmjid': mjmjid, 'mjmjrandom': mjmjrandom }, function (data) {
//             if (data.code == 1) {
//                 $('.editBankRow').hide();
//                 alert('修改成功');
//                 window.parent.location.reload()
//             } else {
//                 alert(data.message);
//             }
//         })
//
//     }
// });


