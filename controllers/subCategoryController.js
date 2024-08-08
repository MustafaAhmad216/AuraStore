const factory = require('./handlerFactory');
const SubCategory = require('../models/subCategoryModel');

/**********************************************************************************/

exports.setCategoryIdToBody = (req, res, next) => {
	//Nested Route
	req.body.category = req.body.category || req.params.categoryId;
	next();
};

// @desc		Get All Sub-Categories
// @route 	GET  /api/v1/subCategories
// @access	Public
exports.getAllSubCategories = factory.getAll(SubCategory);

// @desc		Get a Single Sub-Category
// @route 	GET  /api/v1/subCategories/:id
// @access	Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc		Create Sub-Category
// @route 	POST  /api/v1/subCategories/:id
// @access	Private --> (Admin, Manager)
exports.createSubCategory = factory.createOne(SubCategory);

//@desc		Update Sub-Category
//@route		PATCH /api/v1/subCategories/:id
//@access	Private --> (Admin, Manager)
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc		Delete Specific Sub-Category
// @route 	DELETE  /api/v1/subCategories/:id
// @access	Private --> (Admin, Manager)
exports.deleteSubCategory = factory.deleteOne(SubCategory);
