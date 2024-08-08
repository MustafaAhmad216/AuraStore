/* eslint-disable import/no-extraneous-dependencies */
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const factory = require('./handlerFactory');
const { uploadSingleImage } = require('../middlewares/uploadImage');
const Brand = require('../models/brandModel');

/**********************************************************************************/

//upload Single Image
exports.uploadBrandImage = uploadSingleImage('image');

//--------------------------------------------------------

//--imageProcessing applied on the buffer image in memory
//--while if we stored the image directly to diskStorage then sharp middleware function is not needed
exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
	if (!req.file) return next(); 

	req.file.filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

	await sharp(req.file.buffer)
		.resize(300, 300)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/brands/${req.file.filename}`);

	// Save Image to DB
	req.body.image = req.file.filename;

	next();
});

/**********************************************************************************/

// @desc		Get All brands
// @route 	GET  /api/v1/brands
// @access	Public
exports.getAllBrands = factory.getAll(Brand);

// @desc		Get a Single Brand
// @route 	GET  /api/v1/brands/:id
// @access	Public
exports.getBrand = factory.getOne(Brand);

// @desc		Create Brand
// @route 	POST  /api/v1/brands/:id
// @access	Private --> (Admin, Manager)
exports.createBrand = factory.createOne(Brand);

// @desc		Update Specific Brand
// @route 	PATCH  /api/v1/brands/:id
// @access	Private --> (Admin, Manager)
exports.updateBrand = factory.updateOne(Brand);

// @desc		Delete Specific Brand
// @route 	DELETE  /api/v1/brands/:id
// @access	Private --> (Admin, Manager)
exports.deleteBrand = factory.deleteOne(Brand);

// PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
// PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.
