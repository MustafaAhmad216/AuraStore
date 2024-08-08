const asyncHandler = require('express-async-handler');
const AppError = require('../utilities/appError');
const ApiFeatures = require('../utilities/apiFeatures');
/************************************************************************/

exports.getAll = (Model) =>
	asyncHandler(async (req, res, next) => {
		// Nested route handler
		let filterObj = {};

		if (Model.modelName === 'SubCategory') {
			if (req.params.categoryId)
				filterObj = { category: req.params.categoryId };
		}
		if (Model.modelName === 'Review') {
			if (req.params.productId)
				filterObj = { product: req.params.productId };
		}
		if (Model.modelName === 'Order') {
			// eslint-disable-next-line prefer-destructuring
			filterObj = req.filterObj;
		}

		//(*) Filter, Search, Pagination, Sorting, limitingFields are in ApiFeatures class
		// Building query using ApiFeatures class and then Execute it
		const documentsCount = await Model.countDocuments();
		const features = new ApiFeatures(Model.find(filterObj), req.query)
			.search()
			.filter()
			.sort()
			.limitFields()
			.paginate(documentsCount);

		const { paginationResult, query } = features;
		const document = await query;

		res.status(200).json({
			status: 'success',
			numOfPages: paginationResult.numOfPages,
			page: paginationResult.page,
			results: document.length,
			data: {
				document,
			},
		});
	});

// @desc		Get a Single document
// @access	Public
exports.getOne = (Model, populateOptions) =>
	asyncHandler(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (populateOptions) query = query.populate(populateOptions);

		const doc = await query;
		if (!doc) {
			return next(
				new AppError(
					`No ${Model.modelName} found with the id:${req.params.id}!😞`,
					404,
				),
			);
		}
		res.status(200).json({
			status: 'success',
			data: {
				doc,
			},
		});
	});

// @desc		Create a document
// @access	Private
exports.createOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		const doc = await Model.create(req.body);
		res.status(201).json({
			status: 'success',
			message: `${Model.modelName} created successfully! 🤗`,
			data: doc,
		});
	});

// @desc		Update Specific document
// @access	Private
exports.updateOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		if (req.body.password || req.body.passwordConfirm)
			return next(
				new AppError(
					'Can not update password with this route! Try /updatePassword',
					403,
				),
			);
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!doc) {
			return next(
				new AppError(
					`No ${Model.modelName} found with the id:${req.params.id}!😞`,
					404,
				),
			);
		}
		//Trigger "save" event when is updated
		doc.save();

		res.status(200).json({
			status: 'success',
			message: `${Model.modelName} updated successfully!`,
			data: doc,
		});
	});

// @desc		Delete Specific document
// @access	Private
exports.deleteOne = (Model) =>
	asyncHandler(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		// const doc = Model.findById(req.params.id);

		if (!doc) {
			return next(
				new AppError(
					`No ${Model.modelName} found with the id of ${req.params.id}`,
					404,
				),
			);
		}

		//Nothing worked in the Schema middleware so we're going to apply it here
		if (Model.modelName === 'Review')
			await Model.calcAvgRatingsAndQuantity(doc.product);

		res.status(204).send();
	});
