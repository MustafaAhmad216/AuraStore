const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const AppError = require('../appError');
const Review = require('../../models/reviewModel');
const Product = require('../../models/productModel');
/**********************************************************************/

exports.getReviewValidator = [
	check('id')
		.isMongoId()
		.withMessage(`Invalid Object ID format!`)
		.custom(async (val) => {
			const review = await Review.findById(val);
			if (!review) {
				throw new AppError(
					"The Review you're seaching for may be deleted or doesn't exist right now!",
					404,
				);
			}
		}),
	validatorMiddleware.validationMiddleware,
];

exports.createReviewValidator = [
	check('title')
		.optional()
		.isLength({ min: 3, max: 60 })
		.withMessage('Each Review Title must be between 3 and 60 characters'),
	check('ratings')
		.notEmpty()
		.isNumeric()
		.isFloat({
			min: 1.0,
			max: 5.0,
		})
		.withMessage('Product rating must be between 1.0 and 5.0'),
	check('user')
		.isMongoId()
		.withMessage(`Invalid Object ID format!`)
		.custom(async (val, { req }) => {
			// 1) Check if logged user is the one creating the review
			if (req.user._id.toString() !== val.toString()) {
				throw new AppError(
					'You cannot create a review for another user!',
					403,
				);
			}
			// 2) Check if logged user have already created a review
			const review = await Review.findOne({
				user: req.user._id,
				product: req.body.product,
			});
			if (review) {
				throw new AppError(
					'You have already created a review for this product!',
					403,
				);
			}
		}),
	check('product')
		.isMongoId()
		.withMessage(`Invalid Object ID format!`)
		.custom(async (val, { req }) => {
			const product = await Product.findById(req.body.product);
			if (!product) {
				throw new AppError(
					"The Product you want to review may be deleted or doesn't exist right now!",
					404,
				);
			}
		}),
	validatorMiddleware.validationMiddleware,
];

exports.updateReviewValidator = [
	check('id')
		.isMongoId()
		.withMessage(`Invalid Object ID format!`)
		.custom(async (val, { req }) => {
			// 1) Check if review exists
			const review = await Review.findById(val);
			if (!review) {
				return new AppError(`There's no review with the id: ${val}`, 404);
			}
			// 2) Check if review belongs to the logged user
			if (review.user._id.toString() !== req.user._id.toString()) {
				throw new AppError(
					'You are not authorized to update this review!',
					403,
				);
			}
		}),
	check('title')
		.optional()
		.isLength({ min: 3, max: 60 })
		.withMessage('Each Review Name must be between 3 and 60 characters'),
	validatorMiddleware.validationMiddleware,
];

exports.deleteReviewValidator = [
	check('id')
		.isMongoId()
		.withMessage(`Invalid Object ID format!`)
		.custom(async (val, { req }) => {
			if (req.user.role === 'user') {
				// 1) Check if review exists
				const review = await Review.findById(val);
				if (!review) {
					return new AppError(
						`There's no review with the id: ${val}`,
						404,
					);
				}

				// 2) Check if review belongs to the logged user
				if (review.user._id.toString() !== req.user._id.toString()) {
					throw new AppError(
						'You are not authorized to delete this review!',
						403,
					);
				}
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];
