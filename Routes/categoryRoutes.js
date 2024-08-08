/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const categoryValidator = require('../utilities/validators/categoryValidator');
const subCategoryRoutes = require('./subCategoryRoutes');
// const validatorMiddleware = require('../middlewares/validatorMiddleware');

/*************************************************************************/

const router = express.Router();

//                     <<<< Nested Routes >>>>
//GET      /api/v1/categories/:categoryId/subCategories (To get child based on a parent)
//POST     /api/v1/categories/:categoryId/subCategories

router.use('/:categoryId/subCategories', subCategoryRoutes);

router
	.route('/')
	.get(categoryController.getAllCategories)
	.post(
		authController.protect,
		authController.restrictTo('admin', 'manager'),
		categoryController.uploadCategoryImage,
		categoryController.resizeCategoryImage,
		categoryValidator.createCategoryValidator,
		categoryController.createCategory,
	);

router
	.route('/:id')
	.get(categoryValidator.getCategoryValidator, categoryController.getCategory)
	.patch(
		authController.protect,
		authController.restrictTo('admin', 'manager'),
		categoryController.uploadCategoryImage,
		categoryController.resizeCategoryImage,
		categoryValidator.updateCategoryValidator,
		categoryController.updateCategory,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin'),
		categoryValidator.deleteCategoryValidator,
		categoryController.deleteCategory,
	);

module.exports = router;
