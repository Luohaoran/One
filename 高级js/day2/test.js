(function () {
    var a=10;
    function sets() {
        console.log("sets")
    }
    function gets() {
        console.log("函数内部get")
    }
    window.gets=gets;
})();
window.a="测试window对象的属性a";
var x="测试x的全局变量";
