const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const AppError = require('../appError');
const User = require('../../models/userModel');
/**************************************************************************/

//	--- TO DO List ---
// exports.addAddressValidator = [
// 	check('productId')
// 		.isMongoId()
// 		.withMessage('Invalid Object ID format!')
// 		.notEmpty()
// 		.withMessage(
// 			'please provide valid product ID to be added to the wishlist',
// 		)
// 		.custom(async (val) => {
// 			const product = await Product.findById(val);
// 			if (!product) {
// 				throw new AppError(
// 					"Product you're trying to add to the wishlist, doesn't exist!",
// 					404,
// 				);
// 			}
// 			return true;
// 		}),
// 	validatorMiddleware.validationMiddleware,
// ];

exports.removeAddressValidator = [
	check('id')
		.isMongoId()
		.withMessage('Invalid Object ID format!')
		.notEmpty()
		.withMessage(
			'please provide a valid address ID to be removed from your addresses list',
		)
		.custom(async (val, { req }) => {
			const user = await User.findById(req.user._id);

			const addressesIds = user.address.map((address) =>
				address._id.toString(),
			);
			if (!addressesIds.includes(val.toString())) {
				throw new AppError(
					"Address you're trying to remove from the Addresses list, doesn't exist!",
					404,
				);
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];
