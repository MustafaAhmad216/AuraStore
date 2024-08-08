/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable import/no-extraneous-dependencies */
// const multer = require('multer');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
// const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');
const Product = require('../models/productModel');
const { uploadMultipleImages } = require('../middlewares/uploadImage');

/**********************************************************************************/

//upload Multiple Images
exports.uploadProductImage = uploadMultipleImages([
	{ name: 'imageCover', maxCount: 1 },
	{ name: 'images', maxCount: 5 },
]);

//--------------------------------------------------------

//--imageProcessing applied on the buffer image in memory
//--while if we stored the image directly to diskStorage then sharp middleware function is not needed
exports.resizeProductImage = asyncHandler(async (req, res, next) => {
	if (!req.files) return next();

	// Process imageCover
	if (req.files.imageCover) {
		const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

		await sharp(req.files.imageCover[0].buffer)
			.resize(2000, 1333)
			.toFormat('jpeg')
			.jpeg({ quality: 93 })
			.toFile(`public/img/products/${imageCoverName}`);

		// Save Image to DB
		req.body.imageCover = imageCoverName;
	}

	// Process images
	if (req.files.images) {
		req.body.images = [];

		await Promise.all(
			req.files.images.map(async (image) => {
				const ImageName = `product-${uuidv4()}-${Date.now()}.jpeg`;

				await sharp(image.buffer)
					.resize(800, 800)
					.toFormat('jpeg')
					.jpeg({ quality: 90 })
					.toFile(`public/img/products/${ImageName}`);

				req.body.images.push(ImageName);
			}),
		);
	}
	next();
});

/**********************************************************************************/

// @desc		Get All Products
// @route 	GET  /api/v1/products
// @access	Public
exports.getAllProducts = factory.getAll(Product);

// @desc		Get a Single Product
// @route 	GET  /api/v1/products/:id
// @access	Public
exports.getProduct = factory.getOne(Product, { path: 'reviews' });

// @desc		Create Product
// @route 	POST  /api/v1/products
// @access	Private/protect --> (Admin, Manager)
exports.createProduct = factory.createOne(Product);

// @desc		Update Specific Product
// @route 	PATCH  /api/v1/products/:id
// @access	Private/protect --> (Admin, Manager)
exports.updateProduct = factory.updateOne(Product);

// @desc		Delete Specific Product
// @route 	DELETE  /api/v1/products/:id
// @access	Private/protect --> (Admin, Manager)
exports.deleteProduct = factory.deleteOne(Product);

// PUT modifies a record's information and creates a new record if one is not available, and PATCH updates a resource without sending the entire body in the request.
// PATCH can save you some bandwidth, as updating a field with PATCH means less data being transferred than sending the whole record with PUT.
