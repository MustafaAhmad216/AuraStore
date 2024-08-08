const mongoose = require('mongoose');

const { Schema } = mongoose;

//1- Create Schema
const couponSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Each Coupon must have a name!'],
			unique: true,
			trim: true,
			lowercase: true,
		},
		expires: {
			type: Date,
			// required: [true, `Each Coupon must have an expiration date`],
			default: Date.now() + 20 * 24 * 60 * 60 * 1000, //20 days from now
		},

		discount: {
			type: Number,
			required: [true, `Each Coupon must have a discount percentage`],
			min: 0,
			max: 100,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }, // To include timestamps in the JSON output
	},
);

//------------------------------------------------------------------------
//2- Create Model
module.exports = mongoose.model('Coupon', couponSchema);
