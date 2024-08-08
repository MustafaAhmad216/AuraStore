const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getBrandValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];

exports.createBrandValidator = [
	check('name')
		.notEmpty()
		.withMessage('Each Brand must have a Name!')
		.isLength({ min: 3, max: 50 })
		.withMessage('Each Brand Name must be between 3 and 50 characters'),
	validatorMiddleware.validationMiddleware,
];
 
exports.updateBrandValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	check('name')
		.optional()
		.isLength({ min: 3, max: 50 })
		.withMessage('Each Brand Name must be between 3 and 30 characters'),
	validatorMiddleware.validationMiddleware,
];

exports.deleteBrandValidator = [
	check('id').isMongoId().withMessage(`Invalid Object ID format!`),
	validatorMiddleware.validationMiddleware,
];
