const asyncHandler = require('express-async-handler');

const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const AppError = require('../utilities/appError');

/**********************************************************************************/
const calcCartTotalPrice = (cart) => {
	//calculate TotalPrice of Cart
	const totalPrice = cart.cartItems.reduce(
		(acc, curr) => acc + curr.quantity * curr.price,
		0,
	);
	cart.totalPrice = totalPrice;
	cart.totalPriceAfterDiscount = undefined;
};

// @desc		Add Product To Cart
// @route 	POST  /api/v1/cart
// @access	Private --> (User)
exports.addProductToCart = asyncHandler(async (req, res, next) => {
	// -Get product details to be used
	const product = await Product.findById(req.body.product);

	// 1) Get Cart for logged user
	let cart = await Cart.findOne({ user: req.user._id });

	if (!cart) {
		// 2) No Cart? ---> Create a new Cart for logged user with product
		cart = await Cart.create({
			user: req.user._id,
			cartItems: [
				{
					product: req.body.product,
					quantity: req.body.quantity || 1,
					color: req.body.color,
					price: product.price,
				},
			],
		});
	} else {
		// 3) Cart already exists? ---> get product ids in stock
		const existingProductIndex = cart.cartItems.findIndex(
			(item) =>
				item.product.toString() === req.body.product &&
				item.color === req.body.color.toLowerCase(),
		);

		// A) Product is already in stock? --> update product's quantity
		if (existingProductIndex > -1) {
			cart.cartItems[existingProductIndex].quantity += req.body.quantity;
		}
		// B) new Product? ---> Push it to cartItems
		else {
			cart.cartItems.push({
				product: req.body.product,
				quantity: req.body.quantity || 1,
				color: req.body.color,
				price: product.price,
			});
		}
	}

	//calculate TotalPrice of Cart
	calcCartTotalPrice(cart);
	await cart.save();

	res.status(200).json({
		status: 'success',
		message: 'Product added to cart successfully! 🤗',
		cartItems: cart.cartItems.length,
		data: cart,
	});
});

// @desc		Get a logged user Cart
// @route 	GET  /api/v1/cart
// @access	Private --> (User)
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
	const cart = await Cart.findOne({ user: req.user._id });

	if (!cart) {
		return next(
			new AppError(
				`${req.user.name.split(' ')[0]} Does not have any items in his cart!`,
				404,
			),
		);
	}
	if (cart.user.toString() !== req.user._id.toString())
		return next(
			new AppError(
				`You are not authorized to access this cart. Only the user who created this cart can perform this action!`,
				403,
			),
		);

	if (cart.cartItems.length === 0)
		return next(new AppError(`Your cart is empty!`, 403));

	res.status(200).json({
		status: 'success',
		cartItems: cart.cartItems.length,
		data: cart,
	});
});

// @desc		Remove specific Cart item
// @route 	DELETE  /api/v1/cart/:id
// @access	Private --> (User)
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
	const cart = await Cart.findOneAndUpdate(
		{
			user: req.user._id,
		},
		{
			$pull: { cartItems: { _id: req.params.id } },
		},
		{ new: true },
	);

	if (!cart) {
		return next(
			new AppError(
				`${req.user.name.split(' ')[0]} Does not have any items in his cart!`,
				404,
			),
		);
	}

	//calculate TotalPrice of Cart
	calcCartTotalPrice(cart);
	await cart.save();

	res.status(200).json({
		status: 'success',
		cartItems: cart.cartItems.length,
		data: cart,
	});
});

// @desc		Delete Cart
// @route 	DELETE  /api/v1/cart/
// @access	Private --> (User)
exports.clearCart = asyncHandler(async (req, res, next) => {
	const cart = await Cart.findOneAndDelete({
		user: req.user._id,
	});

	if (!cart) {
		return next(
			new AppError(
				`${req.user.name.split(' ')[0]} Does not have any items in his cart!`,
				404,
			),
		);
	}

	res.status(204).send();
});

// @desc		Update specific Cart item quantity
// @route 	PATCH  /api/v1/cart/:id
// @access	Private --> (User)
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
	// 1) Find Cart
	const cart = await Cart.findOne({ user: req.user._id });
	if (!cart) {
		return next(
			new AppError(
				`${req.user.name.split(' ')[0]} Does not have any items in his cart!`,
				404,
			),
		);
	}
	if (cart.cartItems.length === 0)
		return next(new AppError(`Your cart is empty!`, 403));

	// 2) Cart already exists? ---> get cart Id
	const CartItemIdx = cart.cartItems.findIndex(
		(item) => item._id.toString() === req.params.id,
	);

	if (CartItemIdx === -1)
		return next(
			new AppError(`There's no cartItem with the id: ${req.params.id}`, 404),
		);

	// 3) Update cartItem quantity
	cart.cartItems[CartItemIdx].quantity = req.body.quantity;

	// 4) calculate TotalPrice of remaining CartItems and save
	calcCartTotalPrice(cart);

	await cart.save();

	res.status(200).json({
		status: 'success',
		cartItems: cart.cartItems.length,
		data: cart,
	});
});

// @desc		Apply Coupon on logged user Cart
// @route 	POST  /api/v1/cart/applyCoupon
// @access	Private --> (User)
exports.applyCoupon = asyncHandler(async (req, res, next) => {
	// 1) Get and check the validity of the coupon
	const coupon = await Coupon.findOne({
		name: req.body.name,
		expires: { $gt: Date.now() },
	});
	if (!coupon) {
		return next(
			new AppError(
				`${req.body.name} is not a valid Coupon or expired!!`,
				404,
			),
		);
	}

	// 2) Get logged user cart to get its totalPrice
	const cart = await Cart.findOne({ user: req.user._id });
	if (!cart) {
		return next(
			new AppError(
				`${req.user.name.split(' ')[0]}, You don't have any purchased items in your cart to apply coupon on!`,
				404,
			),
		);
	}
	if (cart.cartItems.length === 0)
		return next(new AppError(`Your cart is empty!`, 403));

	const { totalPrice } = cart;

	// 3) Apply the coupon to the total price
	const discount = (totalPrice * (coupon.discount / 100)).toFixed(2);

	// 4) Update the cart's totalPrice after applying coupon
	cart.totalPriceAfterDiscount = totalPrice - discount;

	// 5) Save the updated cart
	await cart.save();

	res.status(200).json({
		status: 'success',
		cartItems: cart.cartItems.length,
		data: cart,
	});
});
