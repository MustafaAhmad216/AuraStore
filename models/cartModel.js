const mongoose = require('mongoose');

const { Schema } = mongoose;

//1- Create Schema
const cartSchema = new Schema(
	{
		cartItems: [
			{
				product: {
					type: Schema.ObjectId,
					ref: 'Product',
				},
				quantity: {
					type: Number,
					default: 1,
				},
				price: {
					type: Number,
					required: true,
				},
				color: {
					type: String,
					lowercase: true,
				},
			},
		],
		totalPrice: {
			type: Number,
		},
		totalPriceAfterDiscount: {
			type: Number,
		},
		user: {
			type: Schema.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }, // To include timestamps in the JSON output
	},
);

//------------------------------------------------------------------------
//2- Create Model
module.exports = mongoose.model('Cart', cartSchema);
