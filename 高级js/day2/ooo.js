(function () {
    var anniu=document.getElementsByTagName("figcaption");
    var num=0;
    var hezi=function () {
         this.gg=[];
         this.load();
         this.open();
         this.left();
         this.right();
         this.down();
    };
    hezi.prototype.load=function () {
        var father=document.getElementById("father");
        father.innerHTML="<figure class=\"tutu\">\n" +
            "        <img src=\"img/1.jpg\" data-src=\"img/1.jpg\" id=\"img1\" class=\"imga\" alt=\"\" />\n" +
            "        <figcaption><button >旅行工作</button> </figcaption>\n" +
            "    </figure>\n" +
            "    <figure class=\"tutu\">\n" +
            "        <img src=\"img/2.jpg\" data-src=\"img/2.jpg\" alt=\"\" class=\"imga\"/>\n" +
            "        <figcaption><button >家庭晚宴</button> </figcaption>\n" +
            "    </figure>\n" +
            "    <figure class=\"tutu\">\n" +
            "        <img src=\"img/3.jpg\" data-src=\"img/3.jpg\" alt=\"\" class=\"imga\"/>\n" +
            "        <figcaption><button > 欢乐热欲</button></figcaption>\n" +
            "    </figure>\n" +
            "    <figure class=\"tutu\">\n" +
            "        <img src=\"img/4.jpg\" data-src=\"img/4.jpg\" alt=\"\" class=\"imga\"/>\n" +
            "        <figcaption><button >温馨早餐</button> </figcaption>\n" +
            "    </figure>\n" +
            "    <figure class=\"tutu\">\n" +
            "        <img src=\"img/5.jpg\" data-src=\"img/5.jpg\" alt=\"\" class=\"imga\"/>\n" +
            "        <figcaption><button >温馨家庭</button> </figcaption>\n" +
            "    </figure>\n" +
            "    <figure class=\"tutu\">\n" +
            "        <img src=\"img/6.jpg\" data-src=\"img/6.jpg\" alt=\"\" class=\"imga\"/>\n" +
            "        <figcaption><button >温馨家庭</button></figcaption>\n" +
            "    </figure>";
        var imggg=document.getElementsByClassName("imga");
        var gg=this.gg;
        // console.log(imggg[0].getAttribute("data-src"))
        for (var i=0;i<imggg.length;i++){
            gg.push(imggg[i].getAttribute("data-src"))
        }
    };
    hezi.prototype.open=function () {
        var father=document.getElementById("father");
        father.innerHTML+=" <div id=\"lunbo\">\n" +
            "        <div id=\"lunboson\">\n" +
            "            <div id=\"left\" class=\"qiehuan\">\n" +
            "                <img src=\"img/toPre.png\" alt=\"\">\n" +
            "            </div>\n" +
            "            <div id=\"right\" class=\"qiehuan\">\n" +
            "                <img src=\"img/toNext.png\" alt=\"\">\n" +
            "            </div>\n" +
            "            <div id=\"end\">\n" +
            "                <img src=\"img/close.png\" alt=\"\">\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>";
        var lunboson=document.getElementById("lunboson");
        var lunobo=document.getElementById("lunbo");
        var left=document.getElementById("left");
        var right=document.getElementById("right");
        var end=document.getElementById("end");
        for (i=0;i<anniu.length;i++){
            anniu[i].onclick=function () {
                var a=this.parentNode.firstChild.nextSibling;
                var src=a.getAttribute("data-src");
                if (lunboson.style==null){
                    lunboson.style="";
                }
                if (lunbo.style==null){
                    lunobo.style="";
                }
                lunboson.style.backgroundImage="url("+src+")";
                lunobo.style.height="99%";
                lunobo.style.width="99%";
            }
        }
    };
    hezi.prototype.left=function () {
        var a=this.gg;
        left.onclick=function () {
            num--;
            if (num<0){
                num=5;
            }
            lunboson.style.backgroundImage="url("+a[num]+")";
        }
    };
    hezi.prototype.right=function(){
        var a=this.gg;
        right.onclick=function () {
            if (num>=5){
                num=-1
            }
            num++;
            lunboson.style.backgroundImage="url("+a[num]+")";
        }
    };
    hezi.prototype.down=function(){
        end.onclick=function(){
            lunbo.style.height="0";
            lunbo.style.width="0";
        };
    };
    window.hezi=hezi;
})();