const express = require('express');
const cartController = require('../controllers/cartController');
// const cartValidator = require('../utilities/validators/cartValidator');
const authController = require('../controllers/authController');

/*************************************************************************/

const router = express.Router();

router.use(authController.protect, authController.restrictTo('user'));

router
	.route('/')
	.get(cartController.getLoggedUserCart)
	.post(cartController.addProductToCart)
	.delete(cartController.clearCart);

router.patch('/applyCoupon', cartController.applyCoupon);

router
	.route('/:id')
	.patch(cartController.updateCartItemQuantity)
	.delete(cartController.removeSpecificCartItem);

module.exports = router;
