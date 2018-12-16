function Jiawen(img,title,content){
    var d=new Date;
    var time=d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
    this.imgsrc=img;
    this.title=title;
    this.content=content;
    this.time=time;
    this.create=function () {
        document.head.innerHTML="<link rel=\"stylesheet\" href=\"https://use.fontawesome.com/releases/v5.5.0/css/all.css\" integrity=\"sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU\" crossorigin=\"anonymous\">";
        document.body.innerHTML+=
            "<div class='bigImg'>\n" +
            "    <div class='imgs' style=\"background-image: url("+this.imgsrc+")\"><span class='imgTitle'><i class=\"fas fa-bookmark\"></i>&nbsp;"+this.title+"</span></div>\n" +
            "    <p class='contentP'>"+this.content+"</p>\n" +
            "    <div class='imgBottom'>\n" +
            "        <span class='bot1'>"+this.time+"</span><span class='bot2'><i class=\"fas fa-heart\"></i><span>1</span>  <i class=\"fas fa-comment massage2\"></i><span>2</span></span>\n" +
            "    </div>\n" +
            "</div>";
        var imgs=document.getElementsByClassName("imgs");
        var bigImg=document.getElementsByClassName("bigImg");
        var contentP=document.getElementsByClassName("contentP");
        var imgTitle=document.getElementsByClassName("imgTitle");
        var imgBottom=document.getElementsByClassName("imgBottom");
        var massage2=document.getElementsByClassName("massage2");
        var bot2=document.getElementsByClassName("bot2");
        for(var i=0;i<imgs.length;i++){
            bigImg[i].style.backgroundColor="white";
            bigImg[i].style.border="1px rgba(62, 62, 62, 0.20) solid";
            bigImg[i].style.margin="25px";
            bigImg[i].style.padding="5px";
            bigImg[i].style.width="380px";
            bigImg[i].style.float="left";
            imgs[i].style.backgroundSize="cover";
            imgs[i].style.transition="all .3s";
            imgs[i].style.backgroundPosition="0 0";
            imgs[i].style.height="280px";
            imgs[i].style.overflow="hidden";
            imgs[i].style.overflow.transition="all .5s";
            contentP[i].style.height="30px";
            contentP[i].style.lineHeight="30px";
            contentP[i].style.margin="0";
            contentP[i].style.fontSize="12px";
            contentP[i].style.borderBottom="1px rgba(62, 62, 62, 0.20) solid";
            imgTitle[i].style.backgroundColor="black";
            imgTitle[i].style.color="white";
            imgTitle[i].style.width="100%";
            imgTitle[i].style.height="30px";
            imgTitle[i].style.transition="all .2s";
            imgTitle[i].style.transform="translateY(-30px)";
            imgTitle[i].style.lineHeight="30px";
            imgTitle[i].style.overflow="hidden";
            imgTitle[i].style.fontSize="12px";
            imgTitle[i].style.padding="0 0 0 10px";
            imgTitle[i].style.display="inline-block";
            imgBottom[i].style.height="30px";
            imgBottom[i].style.lineHeight="30px";
            imgBottom[i].style.fontSize="12px";
            bot2[i].style.float="right";
            bot2[i].style.color="gray";
            bigImg[i].onmouseenter=function () {
                this.childNodes[1].childNodes[0].style.transform="translateY(0)";
                this.childNodes[1].style.backgroundPosition="0 10px";
                this.childNodes[3].style.color="#00C3B6";
                var a=this.childNodes[5].childNodes[2].childNodes[3];
                a.onmouseenter=function () {
                    this.style.color="#00C3B6";
                };
                a.onmouseleave=function () {
                    this.style.color="gray";
                }
            };
            bigImg[i].onmouseleave=function () {
                this.childNodes[1].childNodes[0].style.transform="translateY(-30px)";
                this.childNodes[1].style.backgroundPosition="0 0";
                this.childNodes[3].style.color="black";
            }
        }
    };
    this.create()
}
var j=new Jiawen("img/1.jpeg","用户研究","你了解SEO中的时效性吗？");
var j2=new Jiawen("img/2.jpg","前端开发","[翻译] 用 CSS 背景混合模式制作高级效果");