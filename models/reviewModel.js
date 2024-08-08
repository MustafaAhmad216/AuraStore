const mongoose = require('mongoose');
const Product = require('./productModel');

const { Schema } = mongoose;

//1- Create Schema
const reviewSchema = new Schema(
	{
		title: {
			type: String,
			minlength: [3, 'Review title must be more than 2 characters!'],
			maxlength: [60, 'Review title must be less than 60 characters!'],
			lowercase: true,
		},
		ratings: {
			type: Number,
			required: [true, 'Each Review Must be given a rating value!'],
			min: [1, "Review rating can't be less than 1"],
			max: [5, "Review rating can't be more than 5"],
			default: 3.0,
		},
		user: {
			type: Schema.ObjectId,
			ref: 'User',
			required: [true, 'Each Review must belong to a User'],
		},
		product: {
			type: Schema.ObjectId,
			ref: 'Product',
			required: [true, 'Each Review must belong to a Product'],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

//------------------------------------------------------------------------
//DOCUMENT MIDDLEWARE: runs before or after .save() and .create() but not on .insertMany({})
reviewSchema.pre(/^find/, function (next) {
	this.populate([
		{
			path: 'user',
			select: 'name',
		},
		// {
		// 	path: 'product',
		// 	select: 'title -category -subCategory',
		// },
	]);
	this.find().select('-createdAt -updatedAt');
	next();
});
//--------------------------------------------------------------------
//Aggregation
reviewSchema.statics.calcAvgRatingsAndQuantity = async function (productId) {
	const stats = await this.aggregate([
		// Stage 1: Get all reviews for a product
		{ $match: { product: productId } },

		// Stage 2: group by productId and Calculate averageRatings and ratingsQuantity for products
		{
			$group: {
				_id: 'product',
				avgRatings: { $avg: '$ratings' },
				ratingsQuantity: { $sum: 1 },
			},
		},
	]);

	if (stats.length > 0) {
		await Product.findByIdAndUpdate(productId, {
			ratingsQuantity: stats[0].ratingsQuantity,
			ratingsAverage: stats[0].avgRatings,
		});
	} else {
		await Product.findByIdAndUpdate(productId, {
			ratingsQuantity: 0,
			ratingsAverage: 3,
		});
	}
};

reviewSchema.post('save', async function () {
	//this points to current review..
	await this.constructor.calcAvgRatingsAndQuantity(this.product);
});

// Surprisingly Did not Work
// reviewSchema.post(/^findOneAnd/, async (doc) => {
// 	if (doc) await doc.constructor.calcAvgRatingsAndQuantity(doc.product._id);
// });

//------------------------------------------------------------------------
//2- Create Model
module.exports = mongoose.model('Review', reviewSchema);
