const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
/*************************************************************************/

const router = express.Router();

router.use(authController.protect);

router.get(
	'/checkout-session/:cartId',
	authController.restrictTo('user'),
	orderController.getCheckoutSession,
);

router
	.route('/:cartId')
	.post(authController.restrictTo('user'), orderController.createCashOrder);
// .get(orderController.getLoggedUserCart)
// .delete(orderController.clearCart);

router
	.route('/')
	.get(
		authController.restrictTo('user', 'admin', 'manager'),
		orderController.filterByRole,
		orderController.getAllOrders,
	);

router.route('/:id').get(orderController.getOrder);

router
	.route('/:id/pay')
	.patch(
		authController.restrictTo('admin', 'manager'),
		orderController.updateOrdertoPaid,
	);

router
	.route('/:id/deliver')
	.patch(
		authController.restrictTo('admin', 'manager'),
		orderController.updateOrdertoDeliverd,
	);

module.exports = router;
