/* eslint-disable import/no-extraneous-dependencies */
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const factory = require('./handlerFactory');
const Category = require('../models/categoryModel');
const { uploadSingleImage } = require('../middlewares/uploadImage');
 
/**********************************************************************************/

//upload Single Image
exports.uploadCategoryImage = uploadSingleImage('image');
 
//--------------------------------------------------------

//--imageProcessing applied on the buffer image in memory
//--while if we stored the image directly to diskStorage then sharp middleware function is not needed
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(600, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 93 })
		.toFile(`public/img/categories/${req.file.filename}`);

	// Save Image to DB
	req.body.image = req.file.filename;

	next();
});

/********************************************************************************/

// @desc		Get All Categories
// @route 	GET  /api/v1/categories
// @access	Public
exports.getAllCategories = factory.getAll(Category);

// @desc		Get a Single Category
// @route 	GET  /api/v1/categories/:id
// @access	Public
exports.getCategory = factory.getOne(Category);

// @desc		Create Category
// @route 	POST  /api/v1/categories
// @access	Private --> (Admin, Manager)
exports.createCategory = factory.createOne(Category);

// @desc		Update Specific Category
// @route 	PATCH  /api/v1/categories/:id
// @access	Private --> (Admin, Manager)
exports.updateCategory = factory.updateOne(Category);

// @desc		Delete Specific Category
// @route 	DELETE  /api/v1/categories/:id
// @access	Private --> (Admin, Manager)
exports.deleteCategory = factory.deleteOne(Category);
