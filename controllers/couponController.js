// const asyncHandler = require('express-async-handler');

const Coupon = require('../models/couponModel');
const factory = require('./handlerFactory');
// const AppError = require('../utilities/appError');

/**********************************************************************************/

// @desc		Get All coupons
// @route 	GET  /api/v1/coupons
// @access	Private --> (Admin, Manager)
exports.getAllCoupons = factory.getAll(Coupon);

// @desc		Get a Single Coupon
// @route 	GET  /api/v1/coupons/:id
// @access	Private --> (Admin, Manager)
exports.getCoupon = factory.getOne(Coupon);

// @desc		Create Coupon
// @route 	POST  /api/v1/coupons
// @access	Private --> (Admin, Manager)
exports.createCoupon = factory.createOne(Coupon);

// @desc		Update Specific Coupon
// @route 	PATCH  /api/v1/coupons/:id
// @access	Private --> (Admin, Manager)
exports.updateCoupon = factory.updateOne(Coupon);

// @desc		Delete Specific Coupon
// @route 	DELETE  /api/v1/coupons/:id
// @access	Private --> (Admin, Manager)
exports.deleteCoupon = factory.deleteOne(Coupon);

// PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
// PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.
