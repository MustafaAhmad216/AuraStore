const mongoose = require('mongoose');

const { Schema } = mongoose;
const slugify = require('slugify');

//1- Create Schema
const brandSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Each Brand must have a Name!'],
			unique: [true, 'Brand Name must be unique!'],
			minlength: [3, 'Brand Name must be more than 2 characters!'],
			maxlength: [30, 'Brand Name must be less than 50 characters!'],
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
//DOCUMENT MIDDLEWARE: runs before or after .save() and .create() but not on .insertMany({})
brandSchema.pre('save', function (next) {
	if (!this.slug) {
		this.slug = slugify(this.name);
	}
	next();
});

brandSchema.pre('findOneAndUpdate', function (next) {
	const update = this.getUpdate();
	if (update.name) {
		update.slug = slugify(update.name, { lower: true });
	}
	next();
});
// brandSchema.pre(/^find/, function (next) {
// 	this.find().select('-createdAt -updatedAt');
// 	next();
// });

//------------------------------------------------------------------
//Set ImageUrl
const setImageUrl = function (doc) {
	if (doc.image) {
		const imageUrl = `${process.env.BASE_URL}/img/brands/${doc.image}`;
		doc.image = imageUrl;
	}
};

// Adjust ImageURL After Retrieving or Updating a document
brandSchema.post('init', (doc) => setImageUrl(doc));

// Adjust ImageURL After Creating a document
brandSchema.post('save', (doc) => setImageUrl(doc));

//------------------------------------------------------------------------
//2- Create Model
module.exports = mongoose.model('Brand', brandSchema);
