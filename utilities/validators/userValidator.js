/* eslint-disable import/no-extraneous-dependencies */
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');
const AppError = require('../appError');

/**************************************************************************/
exports.getUserValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];

exports.createUserValidator = [
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
		.withMessage('Invalid Email address format!')
		.custom(async (val) => {
			const user = await User.findOne({ email: val });
			if (user) {
				throw new AppError('This Email Address is already in use', 400);
			}
			return true;
		}),
	check('password')
		.notEmpty()
		.withMessage('Each User must have a Strong Password!')
		.isLength({ min: 8, max: 30 })
		.withMessage('Each User Name must be between 3 and 30 characters'),
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

exports.updateUserValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	check('name')
		.optional()
		.isLength({ min: 3, max: 50 })
		.withMessage('Each User Name must be between 3 and 50 characters'),
	check('email')
		.optional()
		.isEmail()
		.withMessage('Invalid Email address format!')
		.custom(async (val) => {
			const user = await User.findOne({ email: val });
			if (user) {
				throw new AppError('This Email Address is already in use', 400);
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

exports.updateMeValidator = [
	check('name')
		.optional()
		.isLength({ min: 3, max: 50 })
		.withMessage('Each User Name must be between 3 and 50 characters'),
	check('email')
		.optional()
		.isEmail()
		.withMessage('Invalid Email address format!')
		.custom(async (val) => {
			const user = await User.findOne({ email: val });
			if (user) {
				throw new AppError('This Email Address is already in use', 400);
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

exports.updateUserPasswordValidator = [
	check('id').optional().isMongoId().withMessage(`Invalid Object ID format!`),
	body('currentPassword')
		.notEmpty()
		.withMessage('You must provide your current password')
		.custom(async (val, { req }) => {
			// 1) verify current password
			const user = await User.findById(req.params.id);
			if (!user) {
				throw new AppError(
					`No user found with this ID: ${req.params.id}!`,
					404,
				);
			}
			const IsCorrectPassword = await bcrypt.compare(val, user.password);

			if (!IsCorrectPassword) {
				throw new AppError('Incorrect current password!', 401);
			}
		}),
	body('newPassword')
		.notEmpty()
		.withMessage('You must provide your new password')
		.isLength({ min: 8, max: 70 })
		.withMessage('Your password has to be at least 8 characters long'),
	body('confirmNewPassword')
		.notEmpty()
		.withMessage('You must provide your new password confirmation')
		.custom(async (val, { req }) => {
			// 2) verify that new password and confirm password match
			if (val !== req.body.newPassword) {
				throw new AppError(
					"New Password and Password Confirmation don't match!",
					400,
				);
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];

exports.updateMyPasswordValidator = [
	body('currentPassword')
		.notEmpty()
		.withMessage('You must provide your current password')
		.custom(async (val, { req }) => {
			// 1) verify current password
			const user = await User.findById(req.user._id);
			if (!user) {
				throw new AppError(
					`No user found with this ID: ${req.user._id}!`,
					404,
				);
			}
			const IsCorrectPassword = await bcrypt.compare(val, user.password);

			if (!IsCorrectPassword) {
				throw new AppError('Incorrect current password!', 401);
			}
		}),
	body('newPassword')
		.notEmpty()
		.withMessage('You must provide your new password')
		.isLength({ min: 8, max: 70 })
		.withMessage('Your password has to be at least 8 characters long'),
	body('confirmNewPassword')
		.notEmpty()
		.withMessage('You must provide your new password confirmation')
		.custom(async (val, { req }) => {
			// 2) verify that new password and confirm password match
			if (val !== req.body.newPassword) {
				throw new AppError(
					"New Password and Password Confirmation don't match!",
					400,
				);
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];

exports.deleteUserValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];
