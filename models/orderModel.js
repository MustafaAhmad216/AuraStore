const mongoose = require('mongoose');

const { Schema } = mongoose;

//1- Create Schema
const orderSchema = new Schema(
	{
		user: {
			type: Schema.ObjectId,
			ref: 'User',
			required: [true, 'Order must belong to a specific user'],
		},
		cartItems: [
			{
				product: {
					type: Schema.ObjectId,
					ref: 'Product',
				},
				quantity: Number,
				price: Number,
				color: String,
			},
		],
		taxPrice: {
			type: Number,
			default: 0,
		},
		shippingPrice: {
			type: Number,
			default: 30,
		},
		orderTotalPrice: {
			type: Number,
			required: true,
		},
		paymentMethod: {
			type: String,
			required: true,
			enum: ['paypal', 'card', 'cod'],
			default: 'cod',
		},
		isPaid: {
			type: Boolean,
			default: false,
		},
		paidAt: Date,
		shippingAddress: {
			details: String,
			postalCode: String,
			phone: String,
			city: String,
		},
		isDelivered: {
			type: Boolean,
			default: false,
		},
		deliveredAt: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }, // To include timestamps in the JSON output
	},
);

//------------------------------------------------------------------------
//Middlewares
orderSchema.pre(/^find/, function (next) {
	this.populate([
		{
			path: 'user',
			select: 'name email profilePicture',
		},
		{
			path: 'cartItems.product',
			select: 'title ratingsAverage',
		},
	]);
	next();
});

//------------------------------------------------------------------------
//2- Create Model
module.exports = mongoose.model('Order', orderSchema);
