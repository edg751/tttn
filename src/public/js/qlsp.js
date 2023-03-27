var delSP = document.querySelectorAll('.sp-xoa-value');
var valueDel=document.querySelectorAll('.value-del');
for(var i=0;i<delSP.length;i++){
    delSP[i].onclick=function(){
        var daylathis=this.value;
        document.querySelector(`.del-item-${daylathis}`).classList.add('display-block');

        document.querySelectorAll('.no')[daylathis].onclick=function(){
            document.querySelector(`.del-item-${daylathis}`).classList.remove('display-block');
        }
    }
}




// for(var j =0; j<valueDel.length;j++){
//     console.log(valueDel[j].value);
// }

// var z=0;
// document.querySelector(`.del-${z}`).classList.add('display-block');
// console.log(document.querySelector(`.del-${z}`));