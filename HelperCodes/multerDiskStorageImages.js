/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utilities/appError');

/**********************************************************************/

/********************** Multer Configuration ***************************/

// 1- Disk Storage Engine
//--Store image directly in diskStorage without imageProcessing
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/categories');
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split('/')[1];
		const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
		cb(null, filename);
	},
});

// 2- File Filter
const multerFilter = (req, file, cb) => {
	if (file.mimetype.split('/')[0] === 'image') {
		cb(null, true);
	} else {
		cb(new AppError('Please Upload a valid image!', 400), false);
	}
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadCategoryImage = upload.single('image');
