/**
 * Created by lllnana on 2018/11/20.
 */

// jQuery("#div").css()    .html()  $.extend()   $("#div").mytest();


(function () {
    function jQuery(selector) {
        return new Init(selector)
    }

    function Init(selector) {
        this.node="";

        if(/^#/.test(selector)){
            this.node=document.getElementById(selector.substring(1));
        }else if(/^\./.test(selector)){
            this.node=document.getElementsByClassName(selector.substring(1));
        }else if(/\d*/.test(selector)){
            this.node=document.getElementsByTagName(selector);
        }
        console.log(this.node);
    }
    Init.prototype.html=function () {
        console.log("html方法")
    };
    Init.prototype.css=function () {
        console.log("CSS方法")
    };
    jQuery.ajax=function () {
        console.log("Ajax方法");
    };
    jQuery.fn=jQuery.prototype=Init.prototype;
    
    jQuery.extend=function (obj) {
        
    }

    window.jQuery=window.$=jQuery
})();




