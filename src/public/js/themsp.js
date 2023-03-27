var hinh = document.querySelectorAll('.sp-hinh');
hinh[0].onchange = function(){
    var length = hinh[0].value.length;

    var hinh0= hinh[0].value;
    var array=hinh0.split("");

    array[length-5]='2';
    hinh[1].value= array.join('');

    array[length-5]='3';
    hinh[2].value= array.join('');

    array[length-5]='4';
    hinh[3].value= array.join('');

    array[length-5]='5';
    hinh[4].value= array.join('');

    array[length-5]='6';
    hinh[5].value= array.join('');
    
    array[length-5]='7';
    hinh[6].value= array.join('');
}

var delSP = document.querySelectorAll('.sp-xoa');
for(var i=0;i<delSP.length;i++){
    delSP[i].onclick=function(){
        console.log(this);
    }
}

if((document.querySelector('.sp-phanloai').value)=='phukien'){
    document.querySelector('.sp-size-M').style.display="none";
    document.querySelector('.hidden-pk-M').style.display="none";

    document.querySelector('.sp-size-L').style.display="none";
    document.querySelector('.hidden-pk-L').style.display="none";

    document.querySelector('.sp-size-XL').style.display="none";
    document.querySelector('.hidden-pk-XL').style.display="none";
}

document.querySelector('.sp-phanloai').onchange=function(){
    if(this.value=='phukien'){
        document.querySelector('.sp-size-M').style.display="none";
        document.querySelector('.hidden-pk-M').style.display="none";

        document.querySelector('.sp-size-L').style.display="none";
        document.querySelector('.hidden-pk-L').style.display="none";

        document.querySelector('.sp-size-XL').style.display="none";
        document.querySelector('.hidden-pk-XL').style.display="none";
    }else{
        document.querySelector('.sp-size-M').style.display="inline-block";
        document.querySelector('.hidden-pk-M').style.display="inline-block";

        document.querySelector('.sp-size-L').style.display="inline-block";
        document.querySelector('.hidden-pk-L').style.display="inline-block";

        document.querySelector('.sp-size-XL').style.display="inline-block";
        document.querySelector('.hidden-pk-XL').style.display="inline-block";
    }
}