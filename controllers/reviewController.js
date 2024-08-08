/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable import/no-extraneous-dependencies */
// const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');
const Review = require('../models/reviewModel');
/***********************************************************************/

// @desc		Get All Reviews
// @route 	GET  /api/v1/reviews
// @access	Public
exports.getAllReviews = factory.getAll(Review);

// @desc		Get a Single Review
// @route 	GET  /api/v1/reviews/:id
// @access	Public
exports.getReview = factory.getOne(Review);

//For createReview Nested route
exports.setUserIdAndProductIdToBody = (set) => (req, res, next) => {
	if (set === 'user') req.body.user = req.body.user || req.user._id;

	if (set === 'product')
		req.body.product = req.body.product || req.params.productId;

	if (set === 'both') {
		req.body.user = req.body.user || req.user._id;
		req.body.product = req.body.product || req.params.productId;
	}
	next();
};
exports.setproductIdToBody = (req, res, next) => {
	//Nested Route
	req.body.product = req.body.product || req.params.productId;
	next();
};
exports.setUserIdToBody = (req, res, next) => {
	//Nested Route
	req.body.user = req.body.user || req.user._id;
	next();
};

// @desc		Create Review
// @route 	POST  /api/v1/reviews
// @access	Private/protect --> (User)
exports.createReview = factory.createOne(Review);

// @desc		Update Specific Review
// @route 	PATCH  /api/v1/reviews/:id
// @access	Private/protect --> (User)
exports.updateReview = factory.updateOne(Review);

// @desc		Delete Specific Review
// @route 	DELETE  /api/v1/reviews/:id
// @access	Private --> (Admin, User)
exports.deleteReview = factory.deleteOne(Review);

// PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
// PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.
