// var createDiv=function () {
//     var div;
//   var div=document.createElement("div");
//   div.className="layer";
//   document.body.appendChild(div);
//
//
//   var show=function () {
//       div.style.display="block";
//       document.body.style.overflow="hidden";
//   };
//   return {show:show};
// };
var createDiv=function () {
    var result;
    return function () {
        if (result==undefined){
            result=document.createElement("div");
            result.className="layer";
            document.body.appendChild(result);
            console.log(result);
            // return result;
        }
        var show=function () {
            result.style.display="block";
            document.body.style.overflow="hidden";
        };
        var close=function(){
            result.style.display="hidden";
            document.body.style.overflow="auto";
        };
        show();
        return result;
    };

    // var div=document.createElement("div");
    // div.className="layer";
    // document.body.appendChild(div);
    //
    //
    // var show=function () {
    //     div.style.display="block";
    //     document.body.style.overflow="hidden";
    // };
    // return {show:show};
};