const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const AppError = require('../utilities/appError');

/************************************************************************/

// @desc		Get Address for a specific user
// @route 	GET  /api/v1/address
// @access	Private --> (User)
exports.getUserAddresses = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id).populate('address');

	if (!user) {
		return next(
			new AppError(`No User found with the id:${req.user._id}!😞`, 404),
		);
	}

	res.status(200).json({
		status: 'success',
		address: user.address,
	});
});

// @desc		Add Address to user addresses list
// @route 	POST  /api/v1/address
// @access	Private --> (User)
exports.addAddress = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			// $addToSet ==> adds address object to addresses array
			$addToSet: { address: req.body },
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
		message: 'Address was successfully added to your Addresses list',
		data: { address: user.address.at(-1) },
	});
});

// @desc		Remove address from addresses array
// @route 	DELETE  /api/v1/address/:id
// @access	Private --> (User)
exports.removeAddress = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			// $pull ==> removes address from addresses array
			$pull: { Address: req.params.id },
		},
		{
			new: true,
			// runValidators: true,
		},
	);
	if (!user) {
		return next(
			new AppError(`No User found with the id:${req.user._id}!😞`, 404),
		);
	}

	res.status(200).json({
		status: 'success',
		message: 'Address was successfully removed from your Addresses list.',
		data: { address: user.address },
	});
});
