const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Coupon = require('../../models/couponModel');
const AppError = require('../appError');

exports.getCouponValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];

exports.createCouponValidator = [
	check('name')
		.notEmpty()
		.withMessage('Each Coupon must have a Name!')
		.custom(async (val) => {
			const coupon = await Coupon.findOne({ name: val });
			if (coupon) {
				throw new AppError('This Coupon is already in intiated', 400);
			}
			return true;
		}),
	check('expires')
		.optional()
		.isDate({
			format: 'MM-DD-YYYY',
			strict: true,
		})
		.withMessage("Invalid Date format... Try ('MM-DD-YYYY') Format")
		.custom(async (val) => {
			const expireDate = Date.parse(val);
			const tommorrow = Date.now() + 24 * 60 * 60 * 1000;

			if (expireDate <= tommorrow) {
				throw new AppError(
					'The Coupon expiration date must be valid for at least 24 hours',
					400,
				);
			}
			return true;
		}),
	check('discount')
		.notEmpty()
		.withMessage('Each Coupon must have a discount value between 1 and 100')
		.isNumeric()
		.isLength({ min: 1, max: 100 })
		.withMessage('discount value must be between 1 and 100'),
	validatorMiddleware.validationMiddleware,
];

exports.updateCouponValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	check('name')
		.optional()
		.custom(async (val) => {
			const coupon = await Coupon.findOne({ name: val });
			if (coupon) {
				throw new AppError('This Coupon is already in intiated', 400);
			}
			return true;
		}),
	check('expires')
		.optional()
		.isDate({
			format: 'MM-DD-YYYY',
			strict: true,
		})
		.withMessage("Invalid Date format... Try ('mm-dd-yyyy') Format")
		.custom(async (val, { req }) => {
			const coupon = await Coupon.findById(req.params.id);

			const expireDate = Date.parse(val);
			const updatedAt = Date.parse(coupon.updatedAt) + 12 * 60 * 60 * 1000;
			// const tommorrow = Date.now() + 12 * 60 * 60 * 1000;

			if (expireDate <= updatedAt) {
				throw new AppError(
					'The Coupon expiration date must be valid for at least 12 hours of being created or updated',
					400,
				);
			}
			// if (expireDate <= tommorrow) {
			// 	throw new AppError(
			// 		'The Coupon expiration date must be valid for at least another 12 hours',
			// 		400,
			// 	);
			// }
			return true;
		}),
	check('discount')
		.optional()
		.isNumeric()
		.isLength({ min: 1, max: 100 })
		.withMessage('discount value must be between 1 and 100'),
	validatorMiddleware.validationMiddleware,
];

exports.deleteCouponValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];
