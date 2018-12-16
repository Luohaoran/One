/*1.创建xhr对象
2.xhr.open
3.xhr.send
4.xhr.onreadystatechange
5.resp.send
6.调用回调函数
* */
(function () {
    function createXHR() {
        //1.创建xhr对象
        var xhr=new XMLHttpRequest()||new ActiveXObject("Microsoft.XMLHTTP");
        return xhr;
    }
    /*执行ajax请求
    * method:get/post
    * url
    * data
    * async
    * success*/
    function ourAjax(obj) {
        var xhr=createXHR();
        xhr.onreadystatechange=obj.success;
        if (obj.async==ndefined){
            obj.async=false;
        }
        //判断get/post
        if (obj.method=="get"){
            obj.url=obj.url+"?"+obj.data;
        }
        xhr.open(obj.method,obj.url,obj.async);
        if (obj.method=="post"){
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send(obj.data)
        } else {
            xhr.send(null);
        }
    }
    window.myajx=ourAjax;
})();


var myFx=(function () {
    function ourAjax(obj) {
        var xhr=createXHR();
        xhr.onreadystatechange=obj.success;
        if (obj.async==ndefined){
            obj.async=false;
        }
        //判断get/post
        if (obj.method=="get"){
            obj.url=obj.url+"?"+obj.data;
        }
        xhr.open(obj.method,obj.url,obj.async);
        if (obj.method=="post"){
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send(obj.data)
        } else {
            xhr.send(null);
        }
    }
    return {runAjax:ourAjax,create:createXhr};
})();