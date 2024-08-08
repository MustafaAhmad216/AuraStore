const mongoose = require('mongoose');

const { Schema } = mongoose;
const slugify = require('slugify');

const subCategorySchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Each Sub-Category must have a Name!'],
			unique: [true, 'Sub-Category Name must be unique!'],
			trim: true,
			minlength: [2, 'Sub-Category Name must be more than 2 characters!'],
			maxlength: [50, 'Sub-Category Name must be less than 50 characters!'],
			lowercase: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		category: {
			type: Schema.ObjectId,
			ref: 'Category',
			required: [true, 'Each Sub-Category must belong to a main Category'],
		},
	},
	{
		timestamps: true,
		// toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

subCategorySchema.pre('save', function (next) {
	if (!this.slug) this.slug = slugify(this.name);
	next();
});

subCategorySchema.pre('findOneAndUpdate', function (next) {
	const update = this.getUpdate();
	if (update.name) {
		update.slug = slugify(update.name, { lower: true });
	}
	next();
});

//------------------------------------------------------------------------
subCategorySchema.pre(/^find/, function (next) {
	this.populate([
		{
			path: 'category',
			select: 'name',
		},
	]);
	this.find().select('-createdAt -updatedAt')
	next();
});
//------------------------------------------------------------------------
//2- Create Model
module.exports = mongoose.model('SubCategory', subCategorySchema);
