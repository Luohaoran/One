(function () {
    var bigbig=document.getElementById("father");
    function big() {
        this.one=function () {
            console.log("1");
            bigbig.innerHTML+="\t<figure class=\"effect-lily\">\n" +
                "\t\t\t\t\t<img src=\"./img/lanrenzhijia1.jpg\" alt=\"img01\">\n" +
                "\t\t\t\t\t<figcaption>\n" +
                "\t\t\t\t\t\t<h2>Nice <span>Lily</span></h2>\n" +
                "\t\t\t\t\t\t<p>Lily likes to play with crayons and pencils</p>\n" +
                "\t\t\t\t\t\t<a >View more</a>\n" +
                "\t\t\t\t\t</figcaption>\n" +
                "\t\t\t\t</figure>"
        };
        this.two=function () {
            console.log("2");
            bigbig.innerHTML+="\t<figure class=\"effect-sadie\">\n" +
                "\t\t\t\t<img src=\"./img/lanrenzhijia2.jpg\" alt=\"img02\">\n" +
                "\t\t\t\t<figcaption>\n" +
                "\t\t\t\t<h2>Holy <span>Sadie</span></h2>\n" +
                "\t\t\t\t<p>Sadie never took her eyes off me. <br>She had a dark soul.</p>\n" +
                "\t\t\t\t<a >View more</a>\n" +
                "\t\t\t\t</figcaption>\t\t\t\n" +
                "\t\t\t\t</figure>"
        };
        this.three=function () {
            console.log("3");
            bigbig.innerHTML+="<figure class=\"effect-honey\">\n" +
                "\t\t\t\t\t<img src=\"./img/lanrenzhijia7.jpg\" alt=\"img07\">\n" +
                "\t\t\t\t\t<figcaption>\n" +
                "\t\t\t\t\t\t<h2>Dreamy <span>Honey</span> <i>Now</i></h2>\n" +
                "\t\t\t\t\t\t<a >View more</a>\n" +
                "\t\t\t\t\t</figcaption>\t\t\t\n" +
                "\t\t\t\t</figure>"
        };
        this.four=function () {
            console.log("4");
            bigbig.innerHTML+="<figure class=\"effect-layla\">\n" +
                "\t\t\t\t\t<img src=\"./img/lanrenzhijia4.jpg\" alt=\"img04\">\n" +
                "\t\t\t\t\t<figcaption>\n" +
                "\t\t\t\t\t\t<h2>Crazy <span>Layla</span></h2>\n" +
                "\t\t\t\t\t\t<p>When Layla appears, she brings an eternal summer along.</p>\n" +
                "\t\t\t\t\t\t<a >View more</a>\n" +
                "\t\t\t\t\t</figcaption>\t\t\t\n" +
                "\t\t\t\t</figure>"
        };
        this.five=function () {
            console.log("5");
            bigbig.innerHTML+="<figure class=\"effect-zoe\">\n" +
                "\t\t\t\t\t<img src=\"./img/lanrenzhijia14.jpg\" alt=\"img14\">\n" +
                "\t\t\t\t\t<figcaption>\n" +
                "\t\t\t\t\t\t<h2>Creative <span>Zoe</span></h2>\n" +
                "\t\t\t\t\t\t<span class=\"icon-heart\"></span>\n" +
                "\t\t\t\t\t\t<span class=\"icon-eye\"></span>\n" +
                "\t\t\t\t\t\t<span class=\"icon-paper-clip\"></span>\n" +
                "\t\t\t\t\t\t<p>Zoe never had the patience of her sisters. She deliberately punched the bear in his face.</p>\n" +
                "\t\t\t\t\t\t<a >View more</a>\n" +
                "\t\t\t\t\t</figcaption>\t\t\t\n" +
                "\t\t\t\t</figure>"
        };
    }
    window.Big=big;
})();