const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/categoryModel');
const AppError = require('../appError');

// Define a middleware function to validate user input

exports.getSubCategoryValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];

exports.createSubCategoryValidator = [
	check('name')
		.notEmpty()
		.withMessage('Each Sub-Category must have a Name!')
		.isLength({ min: 2, max: 50 })
		.withMessage(
			'Each Sub-Category Name must be between 3 and 50 characters',
		),
	check('category')
		.notEmpty()
		.withMessage('Each Sub-Category must belong to a Category!')
		.isMongoId()
		.withMessage('Invalid Object ID format!')
		.custom(async (categoryId, { req }) => {
			//Check if categoryId already exists
			const categoryExist = await Category.findById(categoryId);
			if (!categoryExist) {
				throw new AppError(
					`No Category found with the id: ${categoryId} 😕`,
					404,
				);
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];

exports.updateSubCategoryValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];

exports.deleteSubCategoryValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];
