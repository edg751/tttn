var arrayImage = document.querySelectorAll('.item__img__product');
for(var i=0;i < arrayImage.length;i++){
    arrayImage[i].onclick = function(){

        function opacity0(){
            document.querySelector('.image__products').style.opacity = "0";  
        }
        setTimeout(opacity0, 0);

        function opacity1(){
            document.querySelector('.image__products').style.opacity = "0.5";  
        }
        setTimeout(opacity1, 100);

        function opacity12(){
            document.querySelector('.image__products').style.opacity = "0.55";  
        }
        setTimeout(opacity12, 150);

        function opacity2(){
            document.querySelector('.image__products').style.opacity = "0.6";  
        }
        setTimeout(opacity2, 200);

        function opacity22(){
            document.querySelector('.image__products').style.opacity = "0.65";  
        }
        setTimeout(opacity22, 250);

        function opacity3(){
            document.querySelector('.image__products').style.opacity = "0.7";  
        }
        setTimeout(opacity3, 300);

        function opacity33(){
            document.querySelector('.image__products').style.opacity = "0.75";  
        }
        setTimeout(opacity33, 350);

        function opacity4(){
            document.querySelector('.image__products').style.opacity = "0.8";  
        }
        setTimeout(opacity4, 400);

        function opacity44(){
            document.querySelector('.image__products').style.opacity = "0.85";  
        }
        setTimeout(opacity44, 450);

        function opacity5(){
            document.querySelector('.image__products').style.opacity = "0.9";  
        }
        setTimeout(opacity5, 500);

        function opacity55(){
            document.querySelector('.image__products').style.opacity = "0.95";  
        }
        setTimeout(opacity55, 550);

        function opacity6(){
            document.querySelector('.image__products').style.opacity = "1";  
        }
        setTimeout(opacity6, 600);

        document.querySelector('.image__products').src = this.src;  
        // console.log(this.src);
    }
}