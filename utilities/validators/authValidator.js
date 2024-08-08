/* eslint-disable import/no-extraneous-dependencies */
const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');
const AppError = require('../appError');

/**************************************************************************/

exports.signupValidator = [
	check('name')
		.optional()
		.isLength({ min: 3, max: 50 })
		.withMessage('Each User Name must be between 3 and 30 characters')
		.custom(async (val) => {
			const user = await User.findOne({ email: val });
			if (user) {
				throw new AppError('This Email Address is already in use', 400);
			}
			return true;
		}),
	check('email')
		.notEmpty()
		.withMessage('Each User must have an Email!')
		.isEmail()
		.withMessage('Invalid Email address format!'),
	check('password')
		.notEmpty()
		.withMessage('Each User must have a Strong Password!')
		.isLength({ min: 8, max: 30 })
		.withMessage('Your Password must be at least 8 characters'),
	check('passwordConfirm')
		.notEmpty()
		.withMessage('You need to confirm your password!')
		.custom(async (val, { req }) => {
			if (val !== req.body.password) {
				throw new AppError(
					"Password and PasswordConfirm don't match!",
					400,
				);
			}
			return true;
		}),
	check('phone')
		.optional()
		.isMobilePhone(['ar-EG', 'en-US'])
		.withMessage('Please enter a valid phone number on the Egyptian format'),
	check('profilePicture').optional(),
	check('role').optional(),
	validatorMiddleware.validationMiddleware,
];

exports.loginValidator = [
	check('email')
		.notEmpty()
		.withMessage('Please Enter a valid email')
		.isEmail()
		.withMessage('Invalid Email address format!'),
	check('password').notEmpty().withMessage('Please Enter a valid password'),
	validatorMiddleware.validationMiddleware,
];

exports.resetPasswordValidator = [
	check('email')
		.notEmpty()
		.withMessage("you've to enter your email!")
		.isEmail()
		.withMessage('Invalid Email address format!'),
	check('password')
		.notEmpty()
		.withMessage('Each User must have a Strong Password!')
		.isLength({ min: 8, max: 30 })
		.withMessage('Your Password must be at least 8 characters'),
	check('passwordConfirm')
		.notEmpty()
		.withMessage('You need to confirm your password!')
		.custom(async (val, { req }) => {
			if (val !== req.body.password) {
				throw new AppError(
					"Password and PasswordConfirm don't match!",
					400,
				);
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];
