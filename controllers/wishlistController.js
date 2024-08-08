const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const AppError = require('../utilities/appError');

/************************************************************************/

// @desc		Get Products in wishlist
// @route 	GET  /api/v1/whishlist
// @access	Private --> (User)
exports.getloggedUserWishlist = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id).populate(
		'wishlist',
		'title ratingsAverage price imageCover',
	);
	if (!user) {
		return next(
			new AppError(`No User found with the id:${req.user._id}!😞`, 404),
		);
	}
	res.status(200).json({
		status: 'success',
		wishlist: user.wishlist,
	});
});

// @desc		Add Product to wishlist
// @route 	POST  /api/v1/whishlist
// @access	Private --> (User)
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			// $addToSet ==> adds productId to wishlist array if productId doesn't exist
			$addToSet: { wishlist: req.body.productId },
		},
		{
			new: true,
			runValidators: true,
		},
	);
	if (!user) {
		return next(
			new AppError(`No User found with the id:${req.user._id}!😞`, 404),
		);
	}
	res.status(201).json({
		status: 'success',
		message: 'Product was successfully added to your wishlist',
		data: { wishlist: user.wishlist },
	});
});

// @desc		Remove Product from wishlist
// @route 	DELETE  /api/v1/whishlist/:productId
// @access	Private --> (User)
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			// $pull ==> removes productId from wishlist array if productId exists
			$pull: { wishlist: req.params.productId },
		},
		{
			new: true,
			runValidators: true,
		},
	);
	if (!user) {
		return next(
			new AppError(`No User found with the id:${req.user._id}!😞`, 404),
		);
	}
	res.status(200).json({
		status: 'success',
		message: 'Product was successfully removed from your wishlist',
		data: { wishlist: user.wishlist },
	});
});
