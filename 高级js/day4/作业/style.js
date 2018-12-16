(function () {
    function jquery(obj){
        var p1 = new RegExp("[.#]");//tag
        var p2=new RegExp("[.]");//class
        var p3=new RegExp("[#]");//id
        function css(nn,value) {
            if (p3.test(obj)){
                var Obj=obj.substring(1,obj.length);
                document.getElementById(""+Obj+"").style[nn]=value;
            }
            if (p2.test(obj)){
                var Obj=obj.substring(1,obj.length);
                var a=document.getElementsByClassName(""+Obj+"");
                for (var i=0;i<a.length;i++){
                    a[i].style[nn]=""+value+"";
                }
            }
            if (p3.test(obj)==false){
                var a=document.getElementsByTagName(""+obj+"");
                for (var i=0;i<a.length;i++){
                    a[i].style[nn]=""+value+"";
                }
                // document.getElementsByTagName(""+obj+"")[0].style[nn]=""+value+"";
            }
        }
        function html(value) {
            if (p3.test(obj)) {
                var Obj = obj.substring(1, obj.length);
                document.getElementById("" + Obj + "").innerHTML = value;
            }
            if (p2.test(obj)) {
                var Obj = obj.substring(1, obj.length);
                var a = document.getElementsByClassName("" + Obj + "");
                for (var i = 0; i < a.length; i++) {
                    a[i].innerHTML = value;
                }
                // document.getElementsByClassName(""+Obj+"")[0].innerHTML=value;
            }
            if (p1.test(obj) == false) {
                var Obj = obj.substring(1, obj.length);
                var a = document.getElementsByTagName("" + Obj + "");
                for (var i = 0; i < a.length; i++) {
                    a[i].innerHTML = value;
                }
            }
        }
        return {css:css,html:html}
    }
    window.$=jquery;
})();