let searchBtn= document.querySelector('.header__search-cart-header__item');
searchBtn.onclick= function(){
    document.querySelector('.header__item__search').classList.toggle('header__item__search--active');
    document.querySelector('.header__item__search__btn').onclick=(event)=>{
        event.stopPropagation();
    }
    document.querySelector('.header__item__search__btn__submit').onclick=(event)=>{
        event.stopPropagation();
    }
}
// let cart= document.querySelector('.add__cart');
// cart.onclick = function(){
//     console.log('them thanh cong');
// }
var hinh = document.querySelectorAll('.sp-hinh');

console.log(hinh);