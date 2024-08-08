const express = require('express');
const addressController = require('../controllers/addressController');
const authController = require('../controllers/authController');
const addressValidator = require('../utilities/validators/addressValidator');

/*************************************************************************/

const router = express.Router();

// Apply middleware to protect all routes
router.use(authController.protect, authController.restrictTo('user'));

router.route('/').get(addressController.getUserAddresses).post(
	// addressValidator.addToWishlistValidator,
	addressController.addAddress,
);

router
	.route('/:id')
	.delete(
		addressValidator.removeAddressValidator,
		addressController.removeAddress,
	);

module.exports = router;
