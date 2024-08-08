/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const slugify = require('slugify');

//1- Create Schema
const categorySchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Each Category must have a Name!'],
			unique: [true, 'Category Name must be unique!'],
			minlength: [3, 'Category Name must be more than 2 characters!'],
			maxlength: [50, 'Category Name must be less than 50 characters!'],
			lowercase: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		image: {
			type: String,
		},
	},
	{
		timestamps: true,
		// toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

//------------------------------------------------------------------------
//Virtual Populate
// categorySchema.virtual('subCategory', {
// 	ref: 'SubCategory',
// 	foreignField: 'category',
// 	localField: '_id',
// });

//------------------------------------------------------------------------
//DOCUMENT MIDDLEWARE: runs before or after .save() and .create() but not on .insertMany({})
categorySchema.pre('save', function (next) {
	if (!this.slug) {
		this.slug = slugify(this.name);
	}
	next();
});

categorySchema.pre('findOneAndUpdate', function (next) {
	const update = this.getUpdate();
	if (update.name) {
		update.slug = slugify(update.name, { lower: true });
	}
	next();
});
// categorySchema.pre(/^find/, function (next) {
// 	this.find().select('-createdAt -updatedAt');
// 	next();
// });
//------------------------------------------------------------------
//Set ImageUrl
const setImageUrl = function (doc) {
	if (doc.image) {
		const imageUrl = `${process.env.BASE_URL}/img/categories/${doc.image}`;
		doc.image = imageUrl;
	}
};

// Adjust ImageURL After Retrieving or Updating a document
categorySchema.post('init', (doc) => setImageUrl(doc));

// Adjust ImageURL After Creating a document
categorySchema.post('save', (doc) => setImageUrl(doc));

//------------------------------------------------------------------------
//2- Create Model
module.exports = mongoose.model('Category', categorySchema);
