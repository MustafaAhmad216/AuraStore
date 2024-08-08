const { check } = require('express-validator');
const Category = require('../../models/categoryModel');
const Product = require('../../models/productModel');
const SubCategory = require('../../models/subCategoryModel');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const AppError = require('../appError');

/*************************************************************************/

exports.getProductValidator = [
	check('id')
		.isMongoId()
		.withMessage(`Invalid Object ID format!`)
		.custom(async (val) => {
			const product = await Product.findById(val);
			if (!product) {
				throw new AppError(
					"The Product you're seaching for may be deleted or doesn't exist right now!",
					404,
				);
			}
		}),
	validatorMiddleware.validationMiddleware,
];

exports.createProductValidator = [
	check('title')
		.notEmpty()
		.withMessage('Each Product must have a title!')
		.isLength({ min: 5, max: 120 })
		.withMessage('Each Product Title must be between 5 and 120 characters'),
	check('description')
		.notEmpty()
		.withMessage('Each Product must have a description!')
		.isLength({ min: 20 })
		.withMessage('Product description must be morethan 20 characters'),
	check('quantity')
		.notEmpty()
		.withMessage('Each Product must have a quantity!')
		.isNumeric()
		.withMessage('Product quantity must be a Number'),
	check('sold')
		.optional()
		.isNumeric()
		.withMessage('Sold Products must be saved in a Number'),
	check('price')
		.notEmpty()
		.withMessage('Each Product must have a Price!')
		.isNumeric()
		.withMessage('Product Price must be a Number!'),
	check('priceAfterDiscount')
		.optional()
		.isNumeric()
		.withMessage('Product Price must be a Number!')
		.isFloat()
		.custom((value, { req }) => {
			if (value > req.body.price) {
				throw new AppError(
					"Price after discount can't be greater than the original price",
					400,
				);
			}
			return true;
		}),
	check('ratingsAverage')
		.optional()
		.isNumeric()
		//new
		.isFloat()
		.withMessage('ratingsAverage must be a Number!')
		.isLength({ min: 1, max: 5 })
		.withMessage('Product Rating must be between 1.0 and 5.0'),
	check('ratingsQuantity')
		.optional()
		.isNumeric()
		.withMessage('ratingsQuantity must be a Number!'),
	check('colors')
		.optional()
		.isArray()
		.withMessage('Product colors should be an array of strings!'),
	check('imageCover')
		.notEmpty()
		.withMessage('Each Product must have a cover Image!'),
	check('images')
		.optional()
		.isArray()
		.withMessage('images should be an array of strings!'),
	check('category')
		.notEmpty()
		.withMessage('Each Product must belong to a specific category')
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
	check('subCategory')
		.optional()
		.isMongoId()
		.withMessage(`Invalid Object ID format!`)
		.custom(async (subCatIds, { req }) => {
			//Check if subcategoryId already exists
			const subNotExist = (
				await Promise.all(
					subCatIds.map(async (id) => {
						const subCategory = await SubCategory.findById(id);
						if (!subCategory) {
							return id;
						}
					}),
				)
			).filter((id) => id !== undefined);
			if (subNotExist.length > 0) {
				throw new AppError(
					`No Sub-Category found with the id(s): ${subNotExist.join(', ')} 😕`,
					404,
				);
			}
			return true;
		})
		.custom(async (InputsubCatIds, { req }) => {
			//Get all subcategoryIds in the given category id in the product schema
			const subCatDocs = await SubCategory.find({
				category: req.body.category,
			});
			// Map all category's subCategories ids to an array
			const orgSubCatIds = subCatDocs.map((val) => val.id);

			// Check if all InputsubCatIds exist in orgCategoryIds
			const allExist = InputsubCatIds.every((id) =>
				orgSubCatIds.includes(id),
			);

			// Throw error if any of InputsubCatIds doesnot belong to the category's subcategories
			if (!allExist) {
				const falsyIds = InputsubCatIds.filter(
					(id) => !orgSubCatIds.includes(id),
				);
				throw new AppError(
					`The following Sub-Category IDs: [${falsyIds.join(', ')}] ---> don't exist in Category: "${req.body.category}" 😕`,
					404,
				);
			}
			return true;
		}),
	check('brand')
		.optional()
		.isMongoId()
		.withMessage('Invalid Object ID format!'),

	validatorMiddleware.validationMiddleware,
];

exports.updateProductValidator = [
	check('id')
		.isMongoId()
		.withMessage(`Invalid Object ID format!`)
		.custom(async (val) => {
			const product = await Product.findById(val);
			if (!product) {
				throw new AppError(
					"The Product you're seaching for may be deleted or doesn't exist right now!",
					404,
				);
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];

exports.deleteProductValidator = [
	check('id')
		.isMongoId()
		.withMessage(`Invalid Object ID format!`)
		.custom(async (val) => {
			const product = await Product.findById(val);
			if (!product) {
				throw new AppError(
					"The Product you're seaching for may be deleted or doesn't exist right now!",
					404,
				);
			}
			return true;
		}),
	validatorMiddleware.validationMiddleware,
];
