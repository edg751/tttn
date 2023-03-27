import pool from '../configs/connectDB';

let getHomePage = async (req, res) => {
  var cookie =  Math.floor((Math.random() * 10000000000000) + 100000000000);
  if (!req.cookies.cart){
    await pool.execute("INSERT INTO TOKEN (token) VALUES (?) ",[cookie]);
    res.cookie('cart', cookie);
  }

try{
  var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
  return res.render('index.ejs',{SoLuongCart:SL[0]});
}
catch(Ex){
  return res.render('index.ejs');
}
};

let getNoSearch = async (req, res) => {
try{
  var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
  return res.render('noresultsearch.ejs',{SoLuongCart:SL[0]});
}
catch(Ex){
  return res.render('noresultsearch.ejs');
}
};

// const array = await pool.execute(
//   'SELECT * FROM sanpham'
// );
// return res.status(200).json({
//   data: array[0],
// });
let getCollections = async (req, res) => {
  const arraySP = await pool.execute('SELECT * FROM SANPHAM join CHITIETSANPHAM ON SANPHAM.masp = CHITIETSANPHAM.masp');

  try{
    var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
    return res.render('collections.ejs',{dataItem:arraySP[0],SoLuongCart:SL[0]});
  }
  catch(Ex){
    return res.render('collections.ejs',{dataItem:arraySP[0]});
  }
  
};

let getProducts = async (req, res) => {
  let maSP = req.params.itemID;
  const arraySP = await pool.execute(`SELECT * FROM SANPHAM join CHITIETSANPHAM ON SANPHAM.masp = CHITIETSANPHAM.masp WHERE SANPHAM.masp = '${maSP}' `);
  const arrayIM = await pool.execute(`SELECT * FROM sanpham_hinhanhsp WHERE masp ='${maSP}'`);
  try{
    var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);

    return res.render('products.ejs',{dataItem :arraySP[0],dataImage: arrayIM[0],SoLuongCart:SL[0]});
  }
  catch(Ex){
    return res.render('products.ejs',{dataItem :arraySP[0],dataImage: arrayIM[0]});
  }
  
};


let addCart = async (req, res) => {//POST
  var size=req.body.size;
  var maSP=req.params.itemID;
  var cookie=req.cookies.cart;

  console.log("Size: "+size);
  console.log("Mã sp: "+maSP);
  var cart = await pool.execute(`SELECT * FROM CART WHERE masp = '${maSP}' AND size = '${size}' AND token = '${cookie}'`);
  console.log(cart[0].length);
  if(cart[0].length>0){
        try{
          await pool.execute(`UPDATE cart SET soluong = (soluong+1) WHERE masp='${maSP}' AND size ='${size}' AND token = '${cookie}'`);   
        }
        catch (Ex){
          console.log(Ex);
        }
  }else{
        await pool.execute("INSERT INTO CART (masp,token,size) VALUES (?,?,?) ",[maSP,cookie,size]);
  }


// try{
//   if((cart[0][0].masp==maSP && cart[0][0].size==size)){
//     await pool.execute(`UPDATE cart SET soluong = (soluong+1) WHERE masp='${maSP}' AND size ='${size}'`);   
//    }else{
//     await pool.execute("INSERT INTO CART (masp,token,size) VALUES (?,?,?) ",[maSP,cookie,size]);
//    }
// }catch (e){
//   await pool.execute("INSERT INTO CART (masp,token,size) VALUES (?,?,?) ",[maSP,cookie,size]);
// }
return res.redirect(`/products/${maSP}`);
};

let getCart = async (req, res) => {
  var cookie=req.cookies.cart;

  const arraySP = await pool.execute(`SELECT * FROM CART join CHITIETSANPHAM ON CART.masp = CHITIETSANPHAM.masp AND CART.size=chitietsanpham.masize AND token = ${cookie}`);

  try{
    var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
    return res.render('cart.ejs',{listCart:arraySP[0],SoLuongCart:SL[0]}); 
  }
  catch(Ex){
    return res.render('cart.ejs',{listCart:arraySP[0]}); 
  }
  // return res.send('Cookie: '+ );
  // return res.send("Mã sp trong giỏ : " + req.cookies.item);
};

let deleleItemCart = async (req, res) => {
  try{
    var itemSelectX = req.body.deleteItemCart;
    var maSP='';
    var sizeSP='';
    var flag=false;
    
    for(var i = 0;i<itemSelectX.length;i++){
      if(itemSelectX[i]==" "){
        flag=true;
        i++;
      }
      if(flag==false){
        maSP+=itemSelectX[i];
      }else{
        sizeSP+=itemSelectX[i];
      }
    }

    await pool.execute(`DELETE FROM CART WHERE masp='${maSP}' AND size = '${sizeSP}'`);

  }catch(Ex){
    console.log(Ex);
  }
  return res.redirect('/cart');
};

let searchresult =  async (req, res) => {
  var inputSearch = '';
  inputSearch+=req.body.textSearch;
  var arraySPSearch=await pool.execute(`SELECT * FROM SANPHAM JOIN chitietsanpham on sanpham.masp=chitietsanpham.masp WHERE tensp LIKE '%${inputSearch}%'`);
  if((arraySPSearch[0].length)==0){
    return res.redirect('/noresultsearch');
  }

  try{
    var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
    return res.render('searchresult.ejs',{dataItem :arraySPSearch[0],SoLuongCart:SL[0]}); 
  }
  catch(Ex){
    return res.render('searchresult.ejs',{dataItem :arraySPSearch[0]} );
  }


};

let getBestSeller = async (req, res) => {
  var arraySPBestseller=await pool.execute(`SELECT * FROM SANPHAM JOIN chitietsanpham on sanpham.masp=chitietsanpham.masp WHERE chitietsanpham.masize='S' OR chitietsanpham.masize='M' OR chitietsanpham.masize='L' OR chitietsanpham.masize='XL'  ORDER BY chitietsanpham.luotmua DESC`);
  if((arraySPBestseller[0].length)==0){
    return res.redirect('/noresultsearch');
  }

  try{
    var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
    return res.render('bestseller.ejs',{dataItem :arraySPBestseller[0],SoLuongCart:SL[0]}); 
  }
  catch(Ex){
    return res.render('bestseller.ejs',{dataItem :arraySPBestseller[0]} );
  }

};

let getTops = async (req, res) => {
  var arrayTops=await pool.execute(`SELECT * FROM SANPHAM JOIN chitietsanpham on sanpham.masp=chitietsanpham.masp WHERE chitietsanpham.maphanloai='ao'`);
  if((arrayTops[0].length)==0){
    return res.render('noresultsearch.ejs');
  }

  try{
    var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
    return res.render('itemtops.ejs',{dataItem :arrayTops[0],SoLuongCart:SL[0]}); 
  }
  catch(Ex){
    return res.render('itemtops.ejs',{dataItem :arrayTops[0]} );
  }
};

let getOuterwear= async (req, res) => {
  var arrayOuterwear=await pool.execute(`SELECT * FROM SANPHAM JOIN chitietsanpham on sanpham.masp=chitietsanpham.masp WHERE chitietsanpham.maphanloai='aokhoac'`);
  if((arrayOuterwear[0].length)==0){
    return res.redirect('/noresultsearch');
  }

  try{
    var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
    return res.render('itemouterwear.ejs',{dataItem :arrayOuterwear[0],SoLuongCart:SL[0]}); 
  }
  catch(Ex){
    return res.render('itemouterwear.ejs',{dataItem :arrayOuterwear[0]} );
  }
};

let getBottoms= async (req, res) => {
  var arrayBottoms=await pool.execute(`SELECT * FROM SANPHAM JOIN chitietsanpham on sanpham.masp=chitietsanpham.masp WHERE chitietsanpham.maphanloai='quan'`);
  if((arrayBottoms[0].length)==0){
    return res.render('noresultsearch.ejs');
  }

  try{
    var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
    return res.render('itembottom.ejs',{dataItem :arrayBottoms[0],SoLuongCart:SL[0]}); 
  }
  catch(Ex){
    return res.render('itembottom.ejs',{dataItem :arrayBottoms[0]} );
  }
};

let getAccessories = async (req, res) => {
  var arrayAccessories=await pool.execute(`SELECT * FROM SANPHAM JOIN chitietsanpham on sanpham.masp=chitietsanpham.masp WHERE chitietsanpham.maphanloai='phukien'`);
  if((arrayAccessories[0].length)==0){
    return res.redirect('/noresultsearch');
  }

  try{
    var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
    return res.render('itemaccessories.ejs',{dataItem :arrayAccessories[0],SoLuongCart:SL[0]}); 
  }
  catch(Ex){
    return res.render('itemaccessories.ejs',{dataItem :arrayAccessories[0]} );
  }
};

let getQLSP = async (req, res) => {
  if(req.cookies.cookielogin){
    var arrCookies = await pool.execute(`SELECT * FROM NHANVIEN Where token = ${req.cookies.cookielogin}`);
    if(arrCookies[0].length>0){
      var arraySP=await pool.execute(`SELECT * FROM SANPHAM`);
      var arrayUser=await pool.execute(`SELECT * FROM NHANVIEN WHERE token = ${req.cookies.cookielogin}`);
      return res.render('qlsp.ejs',{dataItem:arraySP[0],dataUser:arrayUser[0]});
    }else{
      res.redirect('/login');
    }
  }else{
    res.redirect('/login');
  }
};

let deleteSP = async (req, res) => {
  var maSP= req.body.masp;
  try{
    var arrayCheckDel= await pool.execute (`SELECT * FROM cart join sanpham ON sanpham.masp=cart.masp WHERE sanpham.masp='${maSP}'`);

    if(arrayCheckDel[0].length>0){
      return res.send('Sản phẩm đã tồn tại bên đặt hàng nên không thể xóa');
    }else{
      await pool.execute (`DELETE FROM chitietsanpham WHERE masp= '${maSP}'`);
      await pool.execute (`DELETE FROM SANPHAM WHERE masp= '${maSP}'`);
      await pool.execute (`DELETE FROM sanpham_hinhanhsp WHERE masp= '${maSP}' `);
    } 
  }catch(Ex){
    console.log(Ex);
    return res.redirect('/qlsp');
  }

  return res.redirect('/qlsp');
};

let getAddSP = async (req, res) => {
  if(req.cookies.cookielogin){
    var arrCookies = await pool.execute(`SELECT * FROM NHANVIEN Where token = ${req.cookies.cookielogin}`);
    if(arrCookies[0].length>0){
      return res.render('addsp.ejs');
    }else{
      res.redirect('/login');
    }
  }else{
    res.redirect('/login');
  }
}

let postAddSP= async (req, res) => {
  try{
    var maSP=req.body.masp;
    var tenSP=req.body.tensp;
    await pool.execute(`INSERT INTO sanpham (masp, tensp) VALUES ('${maSP}', '${tenSP}')`);

    await pool.execute(`INSERT INTO chitietsanpham (machitiet, ngaybatdauban, luotmua, giasp, infosanpham, tonkho, maphanloai, masize, masp, hinh_truoc, hinh_sau) VALUES (NULL, NULL, NULL, NULL, NULL, '0', 'ao', 'S', '${maSP}', NULL, NULL), (NULL, NULL, NULL, NULL, NULL, '0', 'ao', 'M', '${maSP}', NULL, NULL), (NULL, NULL, NULL, NULL, NULL, '0', 'ao', 'L', '${maSP}', NULL, NULL), (NULL, NULL, NULL, NULL, NULL, '0', 'ao', 'XL', '${maSP}', NULL, NULL)`);
    await pool.execute(`INSERT INTO sanpham_hinhanhsp (hinhanhsp, masp, mahinhanh) VALUES ('URL', '${maSP}', NULL), ('URL', '${maSP}', NULL), ('URL', '${maSP}', NULL), ('URL', '${maSP}', NULL), ('URL', '${maSP}', NULL), ('URL', '${maSP}', NULL), ('URL', '${maSP}', NULL)`);
    return res.redirect(`/chitiet/${maSP}`);
  }
  catch(Ex){
    console.log(Ex);
  }
}

let getChiTietSP = async (req, res) => {
    if(req.cookies.cookielogin){
      var arrCookies = await pool.execute(`SELECT * FROM NHANVIEN Where token = ${req.cookies.cookielogin}`);
      if(arrCookies[0].length>0){
        var idSP=req.params.itemID;

        var arraySP=await pool.execute(`SELECT * FROM SANPHAM WHERE masp='${idSP}'`);
        var arrayPL=await pool.execute(`SELECT * FROM PHANLOAI`);
        var arraySize=await pool.execute(`SELECT * FROM SIZE ORDER BY id ASC`);
      
        var arrayHinhSP=await pool.execute(`SELECT * FROM sanpham_hinhanhsp WHERE masp = '${idSP}'`);
        var arrayCTSP =await pool.execute(`SELECT * FROM CHITIETSANPHAM WHERE masp = '${idSP}'`);
        // var date = new Date (req.body.ngayban);
        // var fullDate = `${date.getFullYear ()}-${date.getMonth()}-${date.getDay()}`
        
        var a= {b:arrayCTSP[0 ]};
        var ab = new Date (a.b[0].ngaybatdauban);
        var c=`${ab.getFullYear()}-${(ab.getMonth()>=10 ? ab.getMonth() : '0'+ab.getMonth())}-${(ab.getDay().length>1 ? ab.getDay() : '0'+ab.getDay())}`;
      
      
          return res.render('chitietsp.ejs',{
            dataItem:arraySP[0],
            dataPL:arrayPL[0],
            dataSize:arraySize[0],
            dataHinhSP:arrayHinhSP[0],
            dataCTSP:arrayCTSP[0],
            dataDay:c
          });      
      }else{
        res.redirect('/login');
      }
    }else{
      res.redirect('/login');
    }
}

let postChiTietSP = async (req, res) => {
  var idSP=req.params.itemID;
  // var date = new Date (req.body.ngayban);
  // var fullDate = `${date.getFullYear ()}-${date.getMonth()}-${date.getDay()}`
  var ngayban = req.body.ngayban; // Chuẩn SQL
  var luotmua = req.body.luotmua;
  var giasp = req.body.giasp;
  var infosp = req.body.infosp;
  var phanloai = req.body.phanloai;

  var tonkhoL = req.body.tonkho_L;
  var tonkhoS = req.body.tonkho_S;
  var tonkhoM = req.body.tonkho_M;
  var tonkhoXL = req.body.tonkho_XL;

  var hinh1 = req.body.hinh1;
  var hinh2 = req.body.hinh2;
  var hinh3 = req.body.hinh3;
  var hinh4 = req.body.hinh4;
  var hinh5 = req.body.hinh5;
  var hinh6 = req.body.hinh6;
  var hinh7 = req.body.hinh7;

  var hiddenanh1=req.body.hiddenanh1;
  var hiddenanh2=req.body.hiddenanh2;
  var hiddenanh3=req.body.hiddenanh3;
  var hiddenanh4=req.body.hiddenanh4;
  var hiddenanh5=req.body.hiddenanh5;
  var hiddenanh6=req.body.hiddenanh6;
  var hiddenanh7=req.body.hiddenanh7;

  var macthidden0=req.body.macthidden0;
  var macthidden1=req.body.macthidden1;
  var macthidden2=req.body.macthidden2;
  var macthidden3=req.body.macthidden3;
  try{
    await pool.execute(`UPDATE chitietsanpham SET ngaybatdauban= '${ngayban}',luotmua = '${luotmua}',giasp = '${giasp}',infosanpham='${infosp}',tonkho='${tonkhoS}',maphanloai='${phanloai}',masize='S',masp='${idSP}',hinh_truoc='${hinh1}',hinh_sau='${hinh2}' WHERE masp = '${idSP}' AND machitiet='${macthidden0}'`)
    await pool.execute(`UPDATE chitietsanpham SET ngaybatdauban= '${ngayban}',luotmua = '${luotmua}',giasp = '${giasp}',infosanpham='${infosp}',tonkho='${tonkhoM}',maphanloai='${phanloai}',masize='M',masp='${idSP}',hinh_truoc='${hinh1}',hinh_sau='${hinh2}' WHERE masp = '${idSP}' AND machitiet='${macthidden1}'`)
    await pool.execute(`UPDATE chitietsanpham SET ngaybatdauban= '${ngayban}',luotmua = '${luotmua}',giasp = '${giasp}',infosanpham='${infosp}',tonkho='${tonkhoL}',maphanloai='${phanloai}',masize='L',masp='${idSP}',hinh_truoc='${hinh1}',hinh_sau='${hinh2}' WHERE masp = '${idSP}' AND machitiet='${macthidden2}'`)
    await pool.execute(`UPDATE chitietsanpham SET ngaybatdauban= '${ngayban}',luotmua = '${luotmua}',giasp = '${giasp}',infosanpham='${infosp}',tonkho='${tonkhoXL}',maphanloai='${phanloai}',masize='XL',masp='${idSP}',hinh_truoc='${hinh1}',hinh_sau='${hinh2}' WHERE masp = '${idSP}' AND machitiet='${macthidden3}'`)
    // await pool.execute(`INSERT INTO sanpham_hinhanhsp (hinhanhsp, masp) VALUES ('${hinh1}', '${idSP}'), ('${hinh2}', '${idSP}'), ('${hinh3}', '${idSP}'), ('${hinh4}', '${idSP}'), ('${hinh5}', '${idSP}'), ('${hinh6}', '${idSP}'), ('${hinh7}', '${idSP}');`)
    await pool.execute(`UPDATE sanpham_hinhanhsp SET hinhanhsp='${hinh1}' WHERE mahinhanh='${hiddenanh1}'`)
    await pool.execute(`UPDATE sanpham_hinhanhsp SET hinhanhsp='${hinh2}' WHERE mahinhanh='${hiddenanh2}'`)
    await pool.execute(`UPDATE sanpham_hinhanhsp SET hinhanhsp='${hinh3}' WHERE mahinhanh='${hiddenanh3}'`)
    await pool.execute(`UPDATE sanpham_hinhanhsp SET hinhanhsp='${hinh4}' WHERE mahinhanh='${hiddenanh4}'`)
    await pool.execute(`UPDATE sanpham_hinhanhsp SET hinhanhsp='${hinh5}' WHERE mahinhanh='${hiddenanh5}'`)
    await pool.execute(`UPDATE sanpham_hinhanhsp SET hinhanhsp='${hinh6}' WHERE mahinhanh='${hiddenanh6}'`)
    await pool.execute(`UPDATE sanpham_hinhanhsp SET hinhanhsp='${hinh7}' WHERE mahinhanh='${hiddenanh7}'`)
    return res.redirect('/qlsp');
  } catch(Ex){
    res.send(`${Ex}`);

  }
  }

  let getLogin = async (req, res) => {
    return res.render('login.ejs');
  };
  let postLogin = async (req, res) => {
    var taikhoan=req.body.taikhoan;
    var matkhau=req.body.matkhau;
    var login=await pool.execute(`SELECT * FROM NHANVIEN WHERE manv = '${taikhoan}' AND password ='${matkhau}'`);
    if(login[0].length!=0){
      console.log('Đăng nhập thành công');
      var token = login[0][0].token;
      res.cookie('cookielogin',token);
      return res.redirect('/qlsp');
    }else{
      console.log('Đăng nhập thất bại');
      return res.redirect('/login');
    }
  };

  let logout = async (req, res) => {
    res.clearCookie('cookielogin');
    return res.redirect('/login');
  };

  let getCheckout = async (req, res) => {
    var array = await pool.execute(`SELECT * FROM CART JOIN chitietsanpham on cart.masp=chitietsanpham.masp JOIN sanpham ON sanpham.masp=chitietsanpham.masp WHERE cart.token='${req.cookies.cart}' AND chitietsanpham.masize=cart.size`);
    var arrayMoney = await pool.execute(`SELECT SUM((cart.soluong)*(chitietsanpham.giasp)) AS tongtien FROM CART JOIN chitietsanpham on cart.masp=chitietsanpham.masp WHERE cart.token='${req.cookies.cart}' AND chitietsanpham.masize=cart.size`)


    try{
      var SL=await pool.execute(`SELECT token, SUM(soluong) as SL FROM cart WHERE token = '${req.cookies.cart}' GROUP BY token`);
  
      return res.render('checkout.ejs',{arrayCart:array[0],arrayXu:arrayMoney[0],SoLuongCart:SL[0]});
    }
    catch(Ex){
      return res.render('checkout.ejs',{arrayCart:array[0],arrayXu:arrayMoney[0]});
    }
  };

  
  let postCheckout = async (req, res) => {
    try{
      var ten = req.body.name;
      var diachi= req.body.diachi;
      var sdt = req.body.sdt;
      var email = req.body.email;
      var cookie = req.cookies.cart;

      var date = new Date();

      var stringDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

      var array= await pool.execute(`INSERT INTO thongtinkh (makh, tenkh, diachi, SDT, email, token) VALUES (NULL, '${ten}', '${diachi}', '${sdt}', '${email}', '${cookie}')`);
      
      await pool.execute(`INSERT INTO donhang (madh, ngaylapdh, token, trangthai) VALUES (NULL, '${stringDate}', '${cookie}', '0')`);


      res.clearCookie('cart');

      res.redirect('/thanks');
    }
    catch(Ex){
      console.log(Ex);
    }
    // res.clearCookie('cart');
    // return res.redirect('/');
  };

  let getThanks = async (req, res) => {
    res.render('thanks.ejs');
};

  let getDonHangChoDuyet = async (req, res) => {
    if(req.cookies.cookielogin){
      var arrCookies = await pool.execute(`SELECT * FROM NHANVIEN Where token = ${req.cookies.cookielogin}`);
      if(arrCookies[0].length>0){
        console.log(req.params.SDT)
        var arrayDHCH = await pool.execute(`SELECT donhang.ngaylapdh,donhang.token,donhang.trangthai, cart.masp, cart.soluong, cart.size,thongtinkh.tenkh, thongtinkh.diachi, thongtinkh.SDT FROM donhang JOIN cart on donhang.token=cart.token JOIN thongtinkh on thongtinkh.token=cart.token WHERE thongtinkh.SDT = '${req.params.SDT}'`);
        res.render('donhangchoduyet.ejs',{dataDHCD:arrayDHCH[0]});
      }else{
        res.redirect('/login');
      }
    }else{
      res.redirect('/login');
    }
};

let getChiTietDonHangDaDuyet = async (req, res) => {
  if(req.cookies.cookielogin){
    var arrCookies = await pool.execute(`SELECT * FROM NHANVIEN Where token = ${req.cookies.cookielogin}`);
    if(arrCookies[0].length>0){
      console.log(req.params.SDT)
      var arrayDHCH = await pool.execute(`SELECT donhang.ngaylapdh,donhang.token,donhang.trangthai, cart.masp, cart.soluong, cart.size,thongtinkh.tenkh, thongtinkh.diachi, thongtinkh.SDT FROM donhang JOIN cart on donhang.token=cart.token JOIN thongtinkh on thongtinkh.token=cart.token WHERE thongtinkh.SDT = '${req.params.SDT}'`);
      res.render('chitietdonhangdaduyet.ejs',{dataDHCD:arrayDHCH[0]});
    }else{
      res.redirect('/login');
    }
  }else{
    res.redirect('/login');
  }
};

  let getDanhSachDonHang = async (req,res) =>{
    if(req.cookies.cookielogin){
      var arrCookies = await pool.execute(`SELECT * FROM NHANVIEN Where token = ${req.cookies.cookielogin}`);
      if(arrCookies[0].length>0){
        var arrayDSDH = await pool.execute(`SELECT DISTINCT thongtinkh.tenkh, thongtinkh.diachi, thongtinkh.SDT FROM donhang JOIN cart on donhang.token=cart.token JOIN thongtinkh on thongtinkh.token=cart.token WHERE donhang.trangthai = 0`);
        res.render('danhsachdonhang.ejs',{dataDSDH:arrayDSDH[0]});
      }else{
        res.redirect('/login');
      }
    }else{
      res.redirect('/login');
    }
  }
  let getDanhSachDonHangDuyet = async (req,res) =>{
    if(req.cookies.cookielogin){
      var arrCookies = await pool.execute(`SELECT * FROM NHANVIEN Where token = ${req.cookies.cookielogin}`);
      if(arrCookies[0].length>0){
        var arrayDSDH = await pool.execute(`SELECT DISTINCT thongtinkh.tenkh, thongtinkh.diachi, thongtinkh.SDT FROM donhang JOIN cart on donhang.token=cart.token JOIN thongtinkh on thongtinkh.token=cart.token WHERE donhang.trangthai = 1`);
        res.render('donhangdaduyet.ejs',{dataDSDH:arrayDSDH[0]});
      }else{
        res.redirect('/login');
      }
    }else{
      res.redirect('/login');
    }
  }
  let getDoiTrangThaiDuyet =async (req,res) =>{
    if(req.cookies.cookielogin){
      var arrCookies = await pool.execute(`SELECT * FROM NHANVIEN Where token = ${req.cookies.cookielogin}`);
      if(arrCookies[0].length>0){
        await pool.execute (`UPDATE donhang SET trangthai = '1' WHERE token = '${req.params.token}'`);
        res.redirect('/danhsachdonhang');
      }else{
        res.redirect('/login');
      }
    }else{
      res.redirect('/login');
    }
  }
  let getDoiTrangThaiDuyetKO =async (req,res) =>{
    if(req.cookies.cookielogin){
      var arrCookies = await pool.execute(`SELECT * FROM NHANVIEN Where token = ${req.cookies.cookielogin}`);
      if(arrCookies[0].length>0){
        await pool.execute (`UPDATE donhang SET trangthai = '2' WHERE token = '${req.params.token}'`);
        res.redirect('/danhsachdonhang');
      }else{
        res.redirect('/login');
      }
    }else{
      res.redirect('/login');
    }
  }

module.exports = {
  getHomePage,
  getCollections,
  getProducts,
  addCart,
  getCart,
  deleleItemCart,
  searchresult,
  getBestSeller,
  getTops,
  getOuterwear,
  getBottoms,
  getAccessories,
  getQLSP,
  deleteSP,
  getAddSP,
  postAddSP,
  getChiTietSP,
  postChiTietSP,
  getLogin,
  postLogin,
  logout,
  getCheckout,
  getNoSearch,
  postCheckout,
  getThanks,
  getDonHangChoDuyet,
  getDanhSachDonHang,
  getDoiTrangThaiDuyet,
  getDoiTrangThaiDuyetKO,
  getDanhSachDonHangDuyet,
  getChiTietDonHangDaDuyet
};
