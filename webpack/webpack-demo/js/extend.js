$(function () {
    layui.use(['laydate', 'util', 'layer', 'form', 'table'], function () {//layui初始化
        // var loading=layer.msg('正在加载中.....',{
        //     time:6000,
        //     offset:'300px'
        // });
        var form = layui.form;//表单初始化
        var main = $(window.parent.document).find("#main");
        var thisheight = $('.nextGameInfo').outerHeight(true) + 10;
        if (thisheight < 750) {
            main.height(750);
        } else {
            main.height(thisheight);
            $(window.parent.document).find('.containerInfo').height(thisheight);
            $(window.parent.document).find('.container').height(thisheight);
            $(window.parent.document).find('.userNav').height(thisheight);
        }
        $('.add').on('click', function () {
            $('.linkRate').hide()
            $('.linkSet').show()
        });

        $('.rebate').text(rebate + '%');
        var smallFd = 0;
        var checkfd = smallFd;
        var n = 0;
        var step = 0.1;
        var zero = (0).toFixed(1);
        // (0.1*1000+0.2*1000)/1000==0.3
        n = ((rebate * 1000) - (smallFd * 1000)) / step / 1000;//向下取整(*1000解决浮点问题)
        miniarr = [];
        for (var i = 0; i < n; i++) {
            checkfd = (Math.floor(checkfd * 10 + 1) / 10).toFixed(1);
            miniarr.push(checkfd);
        }
        $.each(miniarr, function (i, item) {//小返点
            if (i === 0) {
                $('#fdmini').append(new Option(zero + '%', zero))//遍历值添加到下拉列表
            }
            $('#fdmini').append(new Option(item + '%', item))//遍历值添加到下拉列表
        });
        var maxarr = miniarr.reverse();//把数组反过来
        $.each(maxarr, function (i, item) {//大返点
            $('#fdmax').append(new Option(item + '%', item));//遍历值添加到下拉列表
            if (i === maxarr.length - 1) {
                $('#fdmax').append(new Option(zero + '%', zero))//遍历值添加到下拉列表
            }
        });
        maxarr = miniarr.reverse();//
        $.each(maxarr, function (i, item) {//设置链接的返点
            if (i === 0) {
                $('#fdset').append(new Option(zero + '%', zero))//遍历值添加到下拉列表
            }
            $('#fdset').append(new Option(item + '%', item))//遍历值添加到下拉列表
        });
        form.render();//刷新表单,遍历渲染下拉数据后必须刷新

        var usertype = $('#usertype').val();//查询用户类型下拉
        var fdmini = $('#fdmini').val();//查询小返点
        var fdmax = $('#fdmax').val();//查询大返点
        var status = $('#status').val();//查询状态
        var Term = $('#Term').val();//查询天数


        var fdset = $('#fdset').val();//设置返点
        var type = $('input[name="usertype"]:checked ').val();//设置用户类型单选
        var validity = $('#terms').val();//天数设置


        form.on('select(usertype)', function (data) {//监听查询用户下拉
            usertype = data.value;
        });
        form.on('select(status)', function (data) {//监听查询状态
            status = data.value;
        });
        form.on('select(Term)', function (data) {//监听查询天数
            Term = data.value;
        });
        form.on('select(fdmini)', function (data) {//监听mini返点
            fdmini = data.value;
        });
        form.on('select(fdmax)', function (data) {//监听max返点
            fdmax = data.value;
        });
        form.on('select(fdset)', function (data) {//监听set返点
            fdset = data.value;
        });
        form.on('select(terms)', function (data) {//监听天数
            validity = data.value;
        });
        form.on('radio', function (data) {//监听单选框的值
            type = data.value;
        });

        var table = layui.table;
        table.render({
            elem: '#extend',
            url: _baseurl + '/agent/getSpread?from_station=only_port',
            method: 'post',
            where: {
                'user_id': member_id
            },
            response: {
                statusName: 'code', //规定数据状态的字段名称，默认：code
                statusCode: 1, //规定成功的状态码，默认：0
                msgName: 'msg', //规定状态信息的字段名称，默认：msg
            },

            parseData: function (res) { //res 即为原始返回的数据
                if (res.code == 1) {
                    $(".layui-table-page").show();//显示分页
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.data.total, //解析数据长度
                        "data": res.data.data //解析数据列表
                    };
                } else {
                    $(".layui-table-page").hide();//隐藏分页
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.message, //解析提示文本
                    };
                }
            },

            cols: [[ //标题栏
                {field: 'id', title: 'id', width: 100, hide: true},//每条数据id绑定
                {field: 'qrcode', title: 'qrcode', width: 100, hide: true},//二维码地址设置
                {field: 'name', title: '名称', width: 60},
                {field: 'type', title: '用户类型', width: 90, templet: '#usertypes'},
                {field: 'rebate', title: '返点', width: 60, templet: '#rebate'},
                {field: 'reg_num', title: '已注册人数', width: 100},
                {field: 'validity', title: '有效期', width: 80, templet: '#time'},
                {field: 'create_time', title: '生成日期', width: 150},
                {field: 'status', title: '状态', width: 90},
                {field: 'url', title: '链接', width: 200},
                {field: 'operation', title: '操作', width: 165, templet: '#operation'},
            ]],
            page: {
                //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['prev', 'page', 'next'] //自定义分页布局
                //,curr: 5 //设定初始在第 5 页
                , groups: 5 //只显示 1 个连续页码
            }, //是否显示分页
            skin: 'line', //表格风格,
            even: true,
            limits: [10, 12, 14],
            limit: 10, //每页默认显示的数量
            id: 'extend',
        });
        table.on('tool(extend)', function (obj) {//监听表格按钮点击事件
            var data = obj.data;//获取这一行的所有数据
            if (obj.event === 'delete') {
                parent.layer.confirm('确定删除该链接吗',//这里是父元素打开所以下面关闭就要父元素关闭
                    //弹框参数配置
                    {
                        offset: '300px',
                    },
                    function (index) {
                        obj.del();
                        parent.layer.close(index);//父元素弹框关闭
                        _getJson(
                            'post',
                            '/agent/delSpread?from_station=only_port',
                            {
                                'user_id': member_id,
                                'spread_id': data.id
                            }, function (data) {
                                if (data.code == 1) {
                                    $.Msg(data.data);
                                } else {
                                    $.Msg(data.message)
                                }
                            }
                        );
                        $.refs(//判断是否是该页面最后一条数据，如果是就返回上一页
                            'extend',
                            '/agent/getSpread?from_station=only_port',
                            {},
                            function (res, curr) {
                                var brforeCurr = curr; // 获得当前页码
                                if (res.code == -1) { //无数据
                                    if (curr != 1) { //不是第一页
                                        table.reload("extend", { // 刷新表格到上一页
                                            page: {
                                                curr: brforeCurr - 1
                                            }
                                        });
                                    }
                                }
                            }
                        )
                    });
            }
            if (obj.event === 'copy') {
                $(this).attr('data-clipboard-text', data.url);//将要复制的属性添加到该元素
                var clipboard = new Clipboard('#copy');
                clipboard.on('success', function (e) {//复制链接
                    $.Msg('复制链接成功')
                });
                clipboard.on('error', function (e) {
                    $.Msg('复制失败请手动复制')
                });
            }
            if (obj.event === 'code') {//查看二维码
                var codesrc = 'http://192.168.5.175:81/';
                var codeurl = codesrc + data.qrcode;//二维码地址
                $.getImageWidth(codeurl, function (w, h) {
                    parent.layer.open({
                        type: 1,
                        title: false,
                        shadeClose: true,
                        offset: 'auto',
                        skin: 'layui-layer-rim', //加上边框
                        area: [w / 2 + 'px', h / 2 + 'px'],
                        content:
                            '<img src="' + codeurl + '" alt="" class="codeimg">'
                    });
                })
            }
        });
        $('.search').on('click', function () {
            $.refs(
                'extend',
                '/agent/getSpread?from_station=only_port',
                {
                    'user_id': member_id,
                    'rebate_mini': fdmini,
                    'rebate_max': fdmax,
                    'type': usertype,
                    'validity': Term,
                    'status': status
                },
                function () {
                    this.where = {};
                }
            );
        });
        $('.shengcheng').on('click', function () {
            var name = $('input[name="name"]').val();//链接名称
            if (name == '') {
                $.Msg('请输入链接名称')
            } else {
                _getJson(
                    'post',
                    '/agent/addSpread?from_station=only_port',
                    {
                        'user_id': member_id,
                        'name': name,
                        'type': type,
                        'validity': validity,
                        'rebate': fdset
                    }, function (data) {
                        if (data.code == 1) {
                            $.Msg(data.data);
                            $('#form')[0].reset();//重置表单数据
                            $.refs(
                                'extend',
                                '/agent/getSpread?from_station=only_port',
                                {
                                    'user_id': member_id
                                },
                                function () {//添加完成之后返回到表格页面
                                    $('.linkRate').show();
                                    $('.linkSet').hide();
                                }
                            );
                        } else {
                            $.Msg(data.data)
                        }
                    }
                )
            }
        })
        $('.return').on('click', function () {
            $('.linkRate').show();
            $('.linkSet').hide();
        });
    });
});
