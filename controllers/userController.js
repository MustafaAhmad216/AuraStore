/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const factory = require('./handlerFactory');
const { uploadSingleImage } = require('../middlewares/uploadImage');
const User = require('../models/userModel');
const AppError = require('../utilities/appError');
const createToken = require('../utilities/createToken');

/**********************************************************************************/

//upload Single Image
exports.uploadUserImage = uploadSingleImage('profilePicture');

//--------------------------------------------------------

//--imageProcessing applied on the buffer image in memory
//--while if we stored the image directly to diskStorage then sharp middleware function is not needed
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(600, 600)
		.toFormat('jpeg')
		.jpeg({ quality: 98 })
		.toFile(`public/img/users/${req.file.filename}`);

	// Save Image to DB
	req.body.profilePicture = req.file.filename;

	next();
});

/**********************************************************************************/
// 1) Helper functions
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};
//-----------------------------------------------------------------

// 2) Routes for User managing Himself
// لما ربنا يفرجها و نعمل تسجيل دخول و الحاجات دي
// exports.updateMe = asyncHandler(async (req, res, next) => {
// 	const inputData = Object.keys(req.body).join(' ').toLowerCase();

// 	// 1) Create error if user Post Password data
// 	if (/password/.test(inputData)) {
// 		return next(
// 			new AppError(
// 				'This route is not for password update, please use /updatePassword',
// 				403,
// 			),
// 		);
// 	}
// 	//2) Filter unwanted fields names that are not allowed to be updated
// 	const filteredData = filterObj(req.body, 'name', 'email', 'phone', 'role');
// 	if (req.file) filteredData.photo = req.file.filename;

// 	// 3) Update user document
// 	const updatedUser = await User.findByIdAndUpdate(
// 		req.params.id,
// 		filteredData,
// 		{
// 			new: true,
// 			runValidators: true,
// 		},
// 	);

// 	if (!updatedUser) {
// 		return next(
// 			new AppError(`No User found with the id:${req.params.id}!😞`, 404),
// 		);
// 	}

// 	res.status(200).json({
// 		status: 'success',
// 		data: { user: updatedUser },
// 	});
// });

// لما ربنا يفرجها و نعمل تسجيل دخول و الحاجات دي
// exports.updatePassword = asyncHandler(async (req, res, next) => {
// 	//1) Get the user from collection
// 	const user = await User.findById(req.params.id).select('+password');
// 	if (!user) return next(new AppError('No user found with this ID!😞', 404));

// 	//2) Check if posted current password is correct
// 	if (
// 		!req.body.currentPassword ||
// 		!(await user.correctPassword(req.body.currentPassword, user.password))
// 	) {
// 		return next(new AppError('Please enter a valid current password', 400));
// 	}

// 	//3) check if newPassword and passwordConfirm are available
// 	if (!req.body.newPassword || !req.body.confirmNewPassword) {
// 		return next(
// 			new AppError('Please enter a valid password and confirm it', 400),
// 		);
// 	}

// 	//4) check if password is equal to passwordConfirm
// 	if (req.body.newPassword !== req.body.confirmNewPassword) {
// 		return next(new AppError('New Passwords do not match', 400));
// 	}

// 	const updatedUser = await User.findByIdAndUpdate(req.params.id, {
// 		password: await bcrypt.hash(req.body.newPassword, 12),
// 		passwordConfirm: undefined,
// 	});

// 	res.status(200).json({
// 		status: 'success',
// 		data: { user: updatedUser },
// 	});
// 	// await updatedUser.save();
// });

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
	const doc = await User.findByIdAndUpdate(
		req.params.id,
		{
			password: await bcrypt.hash(req.body.newPassword, 12),
			passwordConfirm: undefined,
			passwordChangedAt: Date.now(),
		},
		{
			new: true,
			runValidators: true,
		},
	);

	if (!doc) return next(new AppError('No user found with this ID!', 404));

	res.status(200).json({
		status: 'success',
		data: { user: doc },
	});
});
/**********************************************************************************/

// @desc		Get All users
// @route 	GET  /api/v1/users
// @access	Private --> (Admin, Manager)
exports.getAllUsers = factory.getAll(User);

// @desc		Get a Single User
// @route 	GET  /api/v1/users/:id
// @access	Private --> (Admin)
exports.getUser = factory.getOne(User);

// @desc		Create User
// @route 	POST  /api/v1/users
// @access	Private --> (Admin)
// exports.createUser = factory.createOne(User);
exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is Not defined... Please, use /signup route instead',
	});
};

// @desc		Update Specific User			//Don't Change Password with this route
// @route 	PATCH  /api/v1/users/:id
// @access	Private --> (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
	const inputData = Object.keys(req.body).join(' ').toLowerCase();

	// 1) Create error if user Post Password data
	if (/password/.test(inputData)) {
		return next(
			new AppError(
				'This route is not for password update, please use /updatePassword',
				403,
			),
		);
	}
	//2) Filter unwanted fields names that are not allowed to be updated
	const filteredData = filterObj(req.body, 'name', 'email', 'phone', 'role');
	if (req.file) filteredData.profilePicture = req.file.filename;

	// 3) Update user document
	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		filteredData,
		{
			new: true,
			runValidators: true,
		},
	);

	if (!updatedUser) {
		return next(
			new AppError(`No User found with the id:${req.params.id}!😞`, 404),
		);
	}

	res.status(200).json({
		status: 'success',
		data: { user: updatedUser },
	});
});

// @desc		Delete Specific User
// @route 	DELETE  /api/v1/users/:id
// @access	Private --> (Admin)
exports.deleteUser = factory.deleteOne(User);

//----------------------------------------------------------------
// ( USER MANAGMENT ROUTES )

// @desc		Get logged user data
// @route 	GET  /api/v1/users/getMe
// @access	Private/protect --> (logged in user)
exports.getMe = asyncHandler(async (req, res, next) => {
	req.params.id = req.user._id;
	next();
});

// @desc		Update logged user Password
// @route 	PATCH  /api/v1/users/updateMyPassword
// @access	Private/protect --> (logged in user)
exports.updateMyPassword = asyncHandler(async (req, res, next) => {
	// 1) Update User Password based on payload (req.user._id)
	req.params.id = req.user._id;

	const user = await User.findByIdAndUpdate(
		req.params.id,
		{
			password: await bcrypt.hash(req.body.newPassword, 12),
			passwordConfirm: undefined,
			passwordChangedAt: Date.now(),
		},
		{
			new: true,
			runValidators: true,
		},
	);

	if (!user) return next(new AppError('No user found with this ID!', 404));

	const token = createToken(user._id);

	res.status(200).json({
		status: 'success',
		token,
		data: { user },
	});
	next();
});

// @desc		Update logged user data (except: password vars, role)
// @route 	PATCH  /api/v1/users/updateMe
// @access	Private/protect --> (logged in user)
exports.updateMe = asyncHandler(async (req, res, next) => {
	// // 1) Update User Data based on payload (req.user._id)
	req.params.id = req.user._id;

	//--> get feilds user want to update
	const inputData = Object.keys(req.body).join(' ').toLowerCase();

	// 2) Create error if user sent Password data
	if (/password/.test(inputData)) {
		return next(
			new AppError(
				'This route is not for password update, please use /updateMyPassword route instead.',
				403,
			),
		);
	}

	// 3) Filter unwanted fields names that are not allowed to be updated
	// const filteredData = filterObj(req.body, 'name', 'email', 'phone');
	// if (req.file) filteredData.profilePicture = req.file.filename;

	// 4) Update user document
	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		// req.user._id,
		{
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			profilePicture: req.file ? req.file.filename : req.body.profilePicture,
		},
		{
			new: true,
			runValidators: true,
		},
	);

	if (!updatedUser) {
		return next(
			new AppError(`No User found with the id:${req.params.id}!😞`, 404),
		);
	}

	res.status(200).json({
		status: 'success',
		message: 'User is updated successfully!',
		data: { user: updatedUser },
	});

	next();
});

// @desc		Deactivate logged user
// @route 	DELETE  /api/v1/users/deleteMe
// @access	Private/protect --> (logged in user)
exports.deleteMe = asyncHandler(async (req, res, next) => {
	// 1) Update User based on payload (req.user._id) to be deactive
	await User.findByIdAndUpdate(
		req.user._id,
		{ active: false },
		{
			new: true,
			runValidators: true,
		},
	);

	res.status(204).json({
		status: 'success',
		message: 'User is Deleted successfully!',
	});
	next();
});

// PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
// PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.
