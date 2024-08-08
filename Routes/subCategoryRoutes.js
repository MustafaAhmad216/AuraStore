const express = require('express');
const subCategoryController = require('../controllers/subCategoryController');
const authController = require('../controllers/authController');
const subCategoryValidator = require('../utilities/validators/subCategoryValidator');

/*******************************************************************************/

//mergeParams Allow us to access parameeters from other Routers
const router = express.Router({ mergeParams: true });

//                     <<<< Nested Routes >>>>
//GET      /api/v1/categories/:categoryId/subCategories (To get child based on a parent)
//POST     /api/v1/categories/:categoryId/subCategories

router
	.route('/')
	.get(subCategoryController.getAllSubCategories)
	.post(
		authController.protect,
		authController.restrictTo('admin', 'manager'),
		subCategoryController.setCategoryIdToBody,
		subCategoryValidator.createSubCategoryValidator,
		subCategoryController.createSubCategory,
	);

router
	.route('/:id')
	.get(
		subCategoryValidator.getSubCategoryValidator,
		subCategoryController.getSubCategory,
	)
	.patch(
		authController.protect,
		authController.restrictTo('admin', 'manager'),
		subCategoryValidator.updateSubCategoryValidator,
		subCategoryController.updateSubCategory,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin'),
		subCategoryValidator.deleteSubCategoryValidator,
		subCategoryController.deleteSubCategory,
	);

module.exports = router;
