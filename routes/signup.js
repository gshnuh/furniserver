var express = require('express');
var router = express.Router();
var signupcontroller = require("../controller/signupcontroller");
var countrycontroller = require("../controller/countrycontroller");
var statecontroller = require("../controller/statecontroller");
var admincontroller = require("../controller/admincontroller");
var verifyToken = require("../middleware/verifyToken");
var categorycontroller = require("../controller/categorycontroller");
var tagcontroller = require("../controller/tagcontroller");
var productcontroller = require("../controller/productcontroller");
var couponcontroller = require("../controller/couponcontroller");
var ordercontroller = require("../controller/ordercontroller");
var otpcontroller = require("../controller/otpcontroller");
var multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
  
  const upload = multer({ storage: storage });

router.post('/addcountry', verifyToken, countrycontroller.createcountry);
router.post('/addstate', verifyToken, statecontroller.createstate);
router.get('/allcountry', verifyToken, countrycontroller.countrylist);
router.get('/allstate', verifyToken, statecontroller.statelist);




router.post('/addform', signupcontroller.createform);
router.post('/log', signupcontroller.loginform);
router.get('/getdata/:id', verifyToken, signupcontroller.getformbyid);
router.put('/update/:id', verifyToken, upload.single('image'), signupcontroller.updateform);
router.delete('/deleteuser/:id', signupcontroller.deleteuser);




router.post('/adminlog', admincontroller.adminloginform);
router.post('/signupform', upload.single('image'), admincontroller.createdata);
router.get('/admindata/:id', verifyToken, admincontroller.getdatabyid);
router.put('/updateadmin/:id', verifyToken, upload.single('image'), admincontroller.updateadmin);
router.delete('/deleteprofile/:id', admincontroller.deleteprofile);




router.post('/addcategory', upload.single('image'), categorycontroller.addcategory);
router.get('/categorylist', verifyToken, categorycontroller.getAllCategories);
router.delete('/deletecategory/:id', categorycontroller.deletecategory);
router.put('/updatecategory/:id', verifyToken, upload.single('image'), categorycontroller.updatecategory);




router.post('/addtag', upload.single('image'), tagcontroller.addtags);
router.get('/taglist', verifyToken, tagcontroller.getAllTags);
router.delete('/deletetags/:id', tagcontroller.deletetag);
router.put('/updatetags/:id', verifyToken, upload.single('image'), tagcontroller.updatetag);




router.post('/addproduct', upload.array('images'), productcontroller.addproduct);
router.get('/productlist', verifyToken, productcontroller.getAllProducts);
router.delete('/deleteproduct/:id', productcontroller.deleteProduct);
router.put('/updateproduct/:id', verifyToken, upload.array('images'), productcontroller.updateProduct);



router.post('/addcoupon', upload.array('images'), couponcontroller.addcoupon);
router.get('/couponlist', verifyToken, couponcontroller.getAllCoupons);
router.delete('/deletecoupon/:id', couponcontroller.deleteCoupon);
router.put('/updatecoupon/:id', verifyToken, upload.array('images'), couponcontroller.updateCoupon);



router.post('/addorderdetails',  ordercontroller.addorderdetails);
router.get('/getorders', verifyToken, ordercontroller.getAllOrders);
router.get('/orderlist/:id', verifyToken, ordercontroller.getOrderbyuserId);
router.get('/orderstatus/:id', ordercontroller.orderstatus);
router.put('/cancelorder/:orderid', ordercontroller.cancelOrder);
router.put('/updatestatus/:id', verifyToken, ordercontroller.updatestatus);
 



router.post('/sendotp',  otpcontroller.sendotp);
router.post('/verifyotp',  otpcontroller.verifyOtp);






module.exports = router;