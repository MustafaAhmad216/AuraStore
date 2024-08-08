const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getCategoryValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];

exports.createCategoryValidator = [
	check('name')
		.notEmpty()
		.withMessage('Each Category must have a Name!')
		.isLength({ min: 3, max: 50 })
		.withMessage('Each Category Name must be between 3 and 50 characters'),
	validatorMiddleware.validationMiddleware,
];

exports.updateCategoryValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	check('name')
		.optional()
		.isLength({ min: 3, max: 50 })
		.withMessage('Each Category Name must be between 3 and 50 characters'),
	validatorMiddleware.validationMiddleware,
];

exports.deleteCategoryValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];
