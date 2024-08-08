/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const { Schema } = mongoose;

/***********************************************************************/

//1- Create Schema
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Each User must have a Name!'],
			minlength: [3, 'Name must be more than 2 characters!'],
			maxlength: [52, 'Name must be less than 52 characters!'],
			trim: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		email: {
			type: String,
			required: [true, 'Each User must have an Email!'],
			unique: [true, 'Email must be unique!'],
		},
		phone: {
			type: String,
			// unique: [true, 'This phone number is entered previously'],
			// match: [
			// 	/^\+?\d{1,11}$/,
			// 	'Phone Number must be on the egyptian format',
			// ],
		},
		profilePicture: {
			type: String,
			default: 'default.jpg',
		},
		role: {
			type: String,
			enum: ['user', 'admin', 'manager'],
			default: 'user',
		},
		//Embedded Document
		address: [
			{
				id: { type: Schema.ObjectId },
				alias: {
					type: String,
					required: [true, 'Address must have an alias!'],
					minlength: [3, 'Alias must be more than 2 characters!'],
					maxlength: [20, 'Alias must be less than 20 characters!'],
					trim: true,
					lowercase: true,
				},
				details: {
					type: String,
					required: [true, 'Address must be detailed!'],
					minlength: [10, 'Address must be more than 10 characters!'],
					maxlength: [90, 'Address must be less than 90 characters!'],
					trim: true,
					lowercase: true,
				},
				postalCode: Number,
				phone: String,
				city: {
					type: String,
					lowercase: true,
				},
			},
		],
		password: {
			type: String,
			required: [true, 'Please provide a valid password!'],
			minlength: [8, 'A password must be at least 8 characters!'],
			maxlength: [70, "A password shouldn't be more than 70 characters!"],
			// select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Please confirm your password!'],
			// select: false,
		},
		passwordChangedAt: {
			type: Date,
			// select: false,
		},
		passwordResetToken: {
			type: String,
			// select: false,
		},
		passwordResetExpires: {
			type: Date,
			// select: false,
		},
		passwordResetVerified: {
			type: Boolean,
			// select: false,
		},
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
		//child reference (one to many)
		wishlist: [
			{
				type: Schema.ObjectId,
				ref: 'Product',
			},
		],
	},
	{
		timestamps: true,
	},
);
//------------------------------------------------------------------------
//DOCUMENT MIDDLEWARE: runs before or after .save() and .create() but not on .insertMany({})
userSchema.pre('save', function (next) {
	if (!this.slug) {
		this.slug = slugify(this.name);
	}
	next();
});

userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.pre('findOneAndUpdate', function (next) {
	const update = this.getUpdate();
	if (update.name) {
		update.slug = slugify(update.name, { lower: true });
	}
	next();
});

userSchema.pre('save', async function (next) {
	// Hash the password if it has been modified (or is new)
	if (!this.isModified('password')) return next();

	//Hash the password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	//Delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (decodedIat) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = +this.passwordChangedAt.getTime() / 1000;

		return decodedIat < changedTimeStamp;
	}
	return false;
};

//------------------------------------------------------------------
//Set ImageUrl
const setImageUrl = function (doc) {
	if (doc.profilePicture) {
		doc.profilePicture = `${process.env.BASE_URL}/img/users/${doc.profilePicture}`;
	}
};

// Adjust ImageURL After Retrieving or Updating a document
userSchema.post('init', (doc) => setImageUrl(doc));

// Adjust ImageURL After Creating a document
userSchema.post('save', (doc) => setImageUrl(doc));

//------------------------------------------------------------------------
//2- Create Model
module.exports = mongoose.model('User', userSchema);
