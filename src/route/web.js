import express from 'express';
import homeController from '../controller/homeController';
let router = express.Router();

const initWebRoute = (app) => {
  router.get('/', homeController.getHomePage);
  //COLLECTION
  router.get('/collections/all',homeController.getCollections);
  router.get('/collections/bestseller',homeController.getBestSeller);
  router.get('/collections/tops',homeController.getTops);
  router.get('/collections/outerwear',homeController.getOuterwear);
  router.get('/collections/bottoms',homeController.getBottoms);
  router.get('/collections/accessories',homeController.getAccessories);
  //PRODUCT
  router.get('/products/:itemID',homeController.getProducts);
  //CART
  router.post('/products/:itemID',homeController.addCart);
  router.post('/cart',homeController.deleleItemCart);
  // SEARCH
  router.post('/searchresult',homeController.searchresult);
  router.get('/noresultsearch',homeController.getNoSearch);
  //CART
  router.get('/cart',homeController.getCart);
  //DSSP control
  router.get('/qlsp',homeController.getQLSP);
  //XOA SP
  router.post('/qlsp',homeController.deleteSP);
  //THEM SP
  router.get ('/addsp',homeController.getAddSP);
  router.post ('/addsp',homeController.postAddSP);
  // CHITIETSP
  router.get ('/chitiet/:itemID',homeController.getChiTietSP);
  router.post ('/chitiet/:itemID',homeController.postChiTietSP);
  // LOGIN
  router.get('/login',homeController.getLogin);
  router.post('/login',homeController.postLogin);
  // LOGOUT
  router.get('/logout',homeController.logout);

  // CART CHECKOUT
  router.get('/checkout',homeController.getCheckout);
  router.post('/checkout',homeController.postCheckout);
  //CART So Luong

  //THANKS
  router.get('/thanks',homeController.getThanks);

  // duyet don hang
  router.get('/donhangchoduyet/:SDT',homeController.getDonHangChoDuyet);
  router.get('/chitietdonhangdaduyet/:SDT',homeController.getChiTietDonHangDaDuyet);
  //duyet don hang
  router.get('/danhsachdonhang',homeController.getDanhSachDonHang);
  router.get('/donhangdaduyet',homeController.getDanhSachDonHangDuyet);

  router.get('/doitrangthaiduyet/:token',homeController.getDoiTrangThaiDuyet);
  router.get('/doitrangthaiduyetKO/:token',homeController.getDoiTrangThaiDuyetKO);
  return app.use('/', router);
};

module.exports = initWebRoute;
