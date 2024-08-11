/* eslint-disable import/no-extraneous-dependencies */
// const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const asyncHandler = require('express-async-handler');
// const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const AppError = require('../utilities/appError');
const { sanitizeUser } = require('../utilities/sanitizeData');
const { sendEmail } = require('../utilities/emailHandler');
const createToken = require('../utilities/createToken');

/************************************************************************/

//@desc		sign up
//@route 	POST /api/v1/auth/signup
//@access 	Public
exports.signup = asyncHandler(async (req, res, next) => {
	// 1- create a new user
	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	// 2- generate JWT token
	const token = createToken(user._id);

	// 3- send response
	res.status(201).json({
		status: 'success',
		message: 'User created successfully! ',
		token,
		data: sanitizeUser(user),
	});
});

//@desc		login
//@route 	POST /api/v1/auth/login
//@access 	Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// 1- check if user provided email and password (in loginValidator)

	// 2) check if user exists & if password is correct
	const user = await User.findOne({ email: email })
		.select('+password')
		.select('+active');

	if (!user || !user.correctPassword(password, user.password))
		// if (!user || !(await bcrypt.compare(password, user.password)))
		return next(
			new AppError(
				'Please, check if your Email and Password are correct',
				401,
			),
		);

	// 3) make user active
	// user.active = true;

	// 4) generate JWT token
	const token = createToken(user._id);

	// 5) send response
	res.json({
		status: 'success',
		message: 'User logged in successfully! ',
		token,
		data: sanitizeUser(user),
		// data: (user),
	});
});

//@desc		Make sure user is authenticated
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	// 1) Check if token exists, and catch it if exists
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(new AppError('You are not logged in! Please log in.', 401));
	}

	// 2) Verify token (No Changes Happened, Token Not Expired)
	// const decoded = await promisify(jwt.verify)(
	// 	token,
	// 	process.env.JWT_SECRET_KEY,
	// );
	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

	// 3) Check if user exists
	const currentUser = await User.findById(decoded.userId);
	if (!currentUser)
		return next(
			new AppError(
				"Unauthorized login! the user with this ID doesn't exist",
				401,
			),
		);

	// 4) Check if user hasn't changed his password after the token was created
	if (currentUser.passwordChangedAt) {
		if (currentUser.passwordChangedAfter(decoded.iat)) {
			return next(
				new AppError(
					"You've recently changed his password! Please login again.",
					401,
				),
			);
		}
	}
	// 5) If everything is fine, grant access to protected route
	req.user = currentUser;
	next();
});

//@desc		[Authorization --> User Permissions]
//@desc		restrict some requests to admins or managers only
exports.restrictTo = (...roles) =>
	asyncHandler(async (req, res, next) => {
		// 1) access allowed roles
		// 2) access registered users (req.user.role)
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					"You don't have permission to perform this action!",
					403,
				),
			);
		}

		next();
	});

//@desc		forgot Password
//@route 	POST /api/v1/auth/forgetPassword
//@access 	Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	// 1) Get User by Email Address
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(
			new AppError(`No User found with the email: ${req.body.email}`),
			404,
		);
	}

	// 2) If user Exists, Generate encrypted reset random 6 digits code
	const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
	const hashedResetCode = crypto
		.createHash('sha256')
		.update(resetCode)
		.digest('hex');

	// 3) Save Hashed Reset Code into DB
	user.passwordResetToken = hashedResetCode;
	user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
	user.passwordResetVerified = false;

	await user.save({ validateBeforeSave: false });

	// 4) Send the reset code via Email Address
	const message = `Hi ${user.name.split(' ')[0]},\n\nWe received a request to reset your password on Ecommerce Api Website.\n\nHere's Your Reset Code:  { ${resetCode} } 😊\nYou should know it's valid untill ${user.passwordResetExpires}\n\nThanks for helping us keep your data secure!`;
	try {
		await sendEmail({
			email: user.email,
			subject: `Password Reset Token`,
			message,
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		user.passwordResetVerified = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError("there's an error in sending reset token via email", 500),
		);
	}

	res.status(200).json({
		status: 'success',
		message: `Your password Reset Code is sent via Email: <${user.email}>`,
	});
	next();
});

//@desc		verify Reset Password Code
//@route 	PATCH /api/v1/auth/verifyResetCode
//@access 	Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
	// 1) Get Reset Code from the body and hash it to match the one in DB
	const hashedResetCode = crypto
		.createHash('sha256')
		.update(req.body.resetCode)
		.digest('hex');

	// 2) Get User by its resetPasswordCode
	const user = await User.findOne({
		passwordResetToken: hashedResetCode,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) {
		return next(
			new AppError(
				`The Code you've entered {${req.body.resetCode}} is invalid or has expired`,
				400,
			),
		);
	}

	// 3) Validate User's reset code
	user.passwordResetVerified = true;
	await user.save({ validateBeforeSave: false });

	res.status(200).json({
		status: 'success',
		message:
			'Code is verified successfully, please visit /api/v1/auth/resetPassword to reset your password',
	});
});

//@desc		Reset Password
//@route 	PATCH /api/v1/auth/resetPassword
//@access 	Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// 1) Get User by Email Address
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(
			new AppError(`No User found with the email: ${req.body.email}`, 404),
		);
	}

	// 2) Check if passwordResetVerified = true
	if (!user.passwordResetVerified) {
		return next(new AppError('Reset code is not verified or expired', 400));
	}

	// 3) update user password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	user.passwordResetVerified = undefined;
	user.passwordChangedAt = Date.now();
	await user.save();

	// 4) Everything's fine ? log the user in, send JWT
	const token = createToken(user._id);

	// 5) Send success message and token to the user
	res.status(200).json({
		status: 'success',
		message: 'Password has been reset successfully!',
		token,
		data: sanitizeUser(user),
	});
});
