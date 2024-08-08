const mongoose = require('mongoose');

const { Schema } = mongoose;
const slugify = require('slugify');

//1- Create Schema
const productSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Each Product must have a Title!'],
			trim: true,
			minlength: [5, 'Product Title must be more than 4 characters!'],
			maxlength: [120, 'Product Title must be less than 120 characters!'],
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: String,
			required: [true, 'Each Product must have a Description!'],
			minlength: [20, 'Product Description must be morethan 20 characters!'],
		},
		quantity: {
			type: Number,
			required: [true, 'Each Product must have a Quantity!'],
		},
		sold: {
			type: Number,
			default: 0,
		},
		ratingsAverage: {
			type: Number,
			default: 3.0,
			min: [1, 'Rating must be a number between 1 and 5!'],
			max: [5, 'Rating must be a number between 1 and 5!'],
			set: (val) => val.toFixed(2),
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, 'Each Product must have a Price!'],
			trim: true,
		},
		priceAfterDiscount: {
			type: Number,
			default: function () {
				if (this.price) {
					return this.price;
				}
				return null;
			},
		},
		colors: {
			type: [String],
		},
		images: {
			type: [String],
		},
		imageCover: {
			type: String,
			required: [true, 'Each Product must have a Cover Image!'],
		},
		category: {
			type: Schema.ObjectId,
			ref: 'Category',
			required: [true, 'Each Product must belong to a Category!'],
		},
		subCategory: [
			{
				type: Schema.ObjectId,
				ref: 'SubCategory',
			},
		],
		brand: {
			type: Schema.ObjectId,
			ref: 'Brand',
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
productSchema.pre('save', function (next) {
	if (!this.slug) {
		this.slug = slugify(this.title);
	}
	next();
});

productSchema.pre('findOneAndUpdate', async function (next) {
	const update = this.getUpdate();

	//update slug whenever title is updated
	if (update.title) {
		update.slug = slugify(update.title, { lower: true });
	}

	//update priceAfterDiscount if updated price is smaller than current priceAfterDiscount
	if (update.priceAfterDiscount) {
		const product = await this.model.findOne(this.getQuery());

		if (product && update.priceAfterDiscount > product.price) {
			update.priceAfterDiscount = product.price;
		}
	}

	//update priceAfterDiscount if updated price is smaller than current priceAfterDiscount
	if (update.price) {
		const product = await this.model.findOne(this.getQuery());

		if (product && product.priceAfterDiscount > update.price) {
			update.priceAfterDiscount = update.price;
		}
	}

	next();
});

productSchema.pre(/^find/, function (next) {
	this.find().select('-createdAt -updatedAt');
	next();
});
productSchema.pre(/^find/, function (next) {
	this.populate([
		{
			path: 'category',
			select: 'name',
		},
		{
			path: 'subCategory',
			select: 'name',
		},
		{
			path: 'brand',
			select: 'name',
		},
	]);
	this.find().select('-createdAt -updatedAt');
	next();
});

// Virtual population for reviews
productSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'product',
	localField: '_id',
	// options: { sort: { createdAt: -1 } },
});

//------------------------------------------------------------------
//Set ImageUrl
const setImageUrl = function (doc) {
	if (doc.imageCover) {
		const imageUrl = `${process.env.BASE_URL}/img/products/${doc.imageCover}`;
		doc.imageCover = imageUrl;
	}
	if (doc.images) {
		doc.images = doc.images.map(
			(image) => `${process.env.BASE_URL}/img/products/${image}`,
		);
	}
};

// Adjust ImageURL After Retrieving or Updating a document
productSchema.post('init', (doc) => setImageUrl(doc));

// Adjust ImageURL After Creating a document
productSchema.post('save', (doc) => setImageUrl(doc));

//------------------------------------------------------------------------
//2- Create Model
module.exports = mongoose.model('Product', productSchema);
