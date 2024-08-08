const express = require('express');
const couponController = require('../controllers/couponController');
const couponValidator = require('../utilities/validators/couponValidator');
const authController = require('../controllers/authController');

/*************************************************************************/

const router = express.Router();

router.use(
	authController.protect,
	authController.restrictTo('admin', 'manager'),
);

router
	.route('/')
	.get(couponController.getAllCoupons)
	.post(
		couponValidator.createCouponValidator, 
		couponController.createCoupon);

router
	.route('/:id')
	.get(couponValidator.getCouponValidator, couponController.getCoupon)
	.patch(couponValidator.updateCouponValidator, couponController.updateCoupon)
	.delete(couponValidator.deleteCouponValidator, couponController.deleteCoupon);

module.exports = router;
