/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
// const sharp = require('sharp');
// const asyncHandler = require('express-async-handler');
// const { v4: uuidv4 } = require('uuid');
const AppError = require('../utilities/appError');

/************************************************************************/

// Multer setup
const multerOptions = () => {
	// 1- Memory Storage Engine
	//--Store the image as a buffer in memory to be saved later in diskstorage
	//--(storing image after imageProcessing)
	const multerStorage = multer.memoryStorage();

	// 2- File Filter
	const multerFilter = (req, file, cb) => {
		if (file.mimetype.split('/')[0] === 'image') {
			cb(null, true);
		} else {
			cb(new AppError('Please Upload a valid image!', 400), false);
		}
	};

	// 3- upload the image
	const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
	return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultipleImages = (arrayOfFields) =>
	multerOptions().fields(arrayOfFields);
