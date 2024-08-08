/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');

const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');
/**********************************************************************************/
//HELPER FUNCTIONS
exports.filterByRole = asyncHandler(async (req, res, next) => {
	if (req.user.role === 'user') {
		req.filterObj = { user: req.user._id };
	}

	next();
});
/**********************************************************************************/

// @desc		Get All Orders
// @route 	GET  /api/v1/orders
// @access	Private --> (User, Admin)
exports.getAllOrders = factory.getAll(Order);

// @desc		Get a Specific Order
// @route 	GET  /api/v1/orders/:id
// @access	Public
exports.getOrder = factory.getOne(Order);

// @desc		Create cod(cash on delivery) Order
// @route 	POST  /api/v1/orders/cartId
// @access	Private --> (User)
exports.createCashOrder = asyncHandler(async (req, res, next) => {
	// @App Settings
	const taxPrice = 0;
	const shippingPrice = 0;

	// 1) Get Cart with cartId and validate it belongs to logged user
	const cart = await Cart.findById(req.params.cartId);
	if (!cart)
		return next(
			new AppError(
				`${req.user.name.split(' ')[0]}, Either your cart does not exist, or you have no purchased items in it.`,
				404,
			),
		);

	if (cart.user.toString() !== req.user._id.toString())
		return next(
			new AppError(
				`You are not authorized to access this cart. Only the user who created this cart can perform this action!`,
				403,
			),
		);
	if (cart.cartItems.length === 0)
		return next(new AppError(`Your cart is empty!`, 403));

	// 2) Get Order price depending on cart price "Check if coupon applied"
	// @@ Ternary Operator considers '0' as a valid value while || considers '0' as a falsy value@@
	const cartPrice = cart.totalPriceAfterDiscount
		? cart.totalPriceAfterDiscount
		: cart.totalPrice;
	const orderTotalPrice = cartPrice + taxPrice + shippingPrice;

	// const address = req.user._id &&&&&&&&&&&&&&&&&&&&&&&&&&&&

	// 3) Create order with default payment method (COD)
	const order = await Order.create({
		user: req.user._id,
		cartItems: cart.cartItems,
		// shippingAddress: req.user._id.address, &&&&&&&&&&&&&&&&&&&&&&&&&&&&
		shippingAddress: req.body.shippingAddress,
		orderTotalPrice,
	});

	//--------------------------------------------------------------------
	//4) After Creating Order, decrement product quantity and increment product sold

	//--1st--//	 const products = cart.cartItems.map((item) => {
	//--1st--//	 	const { product } = item;
	//--1st--//	 	const { quantity } = item;
	//--1st--//	 	return { product, quantity };
	//--1st--//	 });
	//--1st--//	 await Product.updateMany(
	//--1st--//	 	{ _id: { $in: products.product } },
	//--1st--//	 	{ $inc: { quantity: -products.quantity, sold: +products.quantity } },
	//--1st--//	 );

	/*--2nd--*/ /*--2nd--*/ /*--2nd--*/ /*--2nd--*/ /*--2nd--*/ /*--2nd--*/ /*--2nd--*/
	if (order) {
		const bulkOptions = cart.cartItems.map((item) => ({
			updateOne: {
				filter: { _id: item.product },
				update: {
					$inc: { quantity: -item.quantity, sold: +item.quantity },
				},
				upsert: true,
			},
		}));
		await Product.bulkWrite(bulkOptions, {});
		// await Order.save();
		//--------------------------------------------------------------------
		//5) clear user cart depending on cartId
		await Cart.findByIdAndDelete(req.params.cartId);
	}

	//6) send response
	res.status(201).json({
		status: 'success',
		message: 'Order is created successfully! 🤗',
		data: order,
	});
});

// @desc		Update order payment status to paid
// @route 	PATCH  /api/v1/orders/:id/pay
// @access	Private --> (Admin - Manager)
exports.updateOrdertoPaid = asyncHandler(async (req, res, next) => {
	const order = await Order.findById(req.params.id);
	if (!order)
		return next(
			new AppError(`No Order found with the id:${req.params.id}!😞😞`, 404),
		);

	if (order.isPaid)
		return next(
			new AppError(`Order you're trying to update is already paid`, 404),
		);

	//update order paid status to paid
	order.isPaid = true;
	order.paidAt = Date.now();

	const updatedOrder = await order.save();

	res.status(200).json({
		status: 'success',
		message: 'Order updated successfully!',
		data: {
			order: updatedOrder,
		},
	});
});

// @desc		Update order delivery status to delivered
// @route 	PATCH  /api/v1/orders/:id/deliver
// @access	Private --> (Admin - Manager)
exports.updateOrdertoDeliverd = asyncHandler(async (req, res, next) => {
	const order = await Order.findById(req.params.id);
	if (!order)
		return next(
			new AppError(`No Order found with the id:${req.params.id}!😞😞`, 404),
		);

	if (order.isDelivered)
		return next(
			new AppError(
				`Order you're trying to update is already Delivered`,
				404,
			),
		);

	//update order delivery status to delivered
	order.isDelivered = true;
	order.deliveredAt = Date.now();

	const updatedOrder = await order.save();

	res.status(200).json({
		status: 'success',
		message: 'Order updated successfully!',
		data: {
			order: updatedOrder,
		},
	});
});

// @desc		Get Checkout Session from Stripe and send it as a response
// @route 	GET  /api/v1/orders/checkout-session/:cartIds
// @access	Private --> (User)
exports.getCheckoutSession = asyncHandler(async (req, res, next) => {
	// @App Settings
	const taxPrice = 0;
	const shippingPrice = 0;

	// 1) Get Cart with cartId and validate it belongs to logged user
	const cart = await Cart.findById(req.params.cartId);
	if (!cart)
		return next(
			new AppError(
				`${req.user.name.split(' ')[0]}, Either your cart does not exist, or you have no purchased items in it.`,
				404,
			),
		);

	if (cart.user.toString() !== req.user._id.toString())
		return next(
			new AppError(
				`You are not authorized to access this cart. Only the user who created this cart can perform this action!`,
				403,
			),
		);
	if (cart.cartItems.length === 0)
		return next(new AppError(`Your cart is empty!`, 403));

	// 2) Get Order Price depend i=on cart price "check if coupon applied"
	const cartPrice = cart.totalPriceAfterDiscount
		? cart.totalPriceAfterDiscount
		: cart.totalPrice;
	const orderTotalPrice = cartPrice + taxPrice + shippingPrice;

	// 3) Create Stripe Checkout session
	const session = await stripe.checkout.sessions.create({
		expand: ['line_items'], // a must

		mode: 'payment',
		success_url: `${req.protocol}://${req.get('host')}/orders`,
		cancel_url: `${req.protocol}://${req.get('host')}/cart`,
		customer_email: req.user.email,
		// customer_address: req.body.shippingAddress,
		client_reference_id: req.params.cartId,
		metadata: {
			address: req.body.shippingAddress,
		},
		// shipping_address_collection: req.body.shippingAddress,
		line_items: [
			{
				price_data: {
					unit_amount: (orderTotalPrice * 100).toFixed(2), //amount expected in cents
					currency: 'egp',
					product_data: {
						name: `${req.user.name}'s Order`,
						description: `${req.body.shippingAddress}` || 'address',
					},
				},
				quantity: 1,
			},
		],
	});

	// 4) Send Session to Response
	res.status(200).json({
		status: 'success',
		message: 'Checkout Session created successfully!',
		data: { session },
	});
});

// @desc		create Checkout Webhook from Stripe
// @route 	POST  /webhook-checkout
// @access	Private --> (User)
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
	const sig = req.headers['stripe-signature'];

	let event;

	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET_KEY,
		);
	} catch (err) {
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}
	if (event.type === 'checkout.session.completed') {
		// eslint-disable-next-line no-console
		console.log('Create Order Here!');
	}
});
