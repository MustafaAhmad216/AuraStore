const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Product = require('../../models/productModel');
const AppError = require('../appError');
const User = require('../../models/userModel');
/***********************************************************************/

exports.addToWishlistValidator = [
	check('productId')
		.isMongoId()
		.withMessage('Invalid Object ID format!')
		.notEmpty()
		.withMessage(
			'please provide valid product ID to be added to the wishlist',
		)
		.custom(async (val) => {
			const product = await Product.findById(val);
			if (!product) {
				throw new AppError(
					"Product you're trying to add to the wishlist, doesn't exist!",
					404,
				);
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];

exports.removeFromWishlistValidator = [
	check('productId')
		.isMongoId()
		.withMessage('Invalid Object ID format!')
		.notEmpty()
		.withMessage(
			'please provide valid product ID to be removed from your wishlist',
		)
		.custom(async (val, { req }) => {
			const user = await User.findById(req.user._id);

			if (!user.wishlist.includes(val.toString())) {
				throw new AppError(
					"Product you're trying to remove from the wishlist, doesn't exist in your wishlist!",
					404,
				);
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];
