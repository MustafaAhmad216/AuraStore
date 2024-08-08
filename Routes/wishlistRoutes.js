const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authController = require('../controllers/authController');
const wishlistValidator = require('../utilities/validators/wishlistValidator');

/*************************************************************************/

const router = express.Router();

// Apply middleware to protect all routes
router.use(authController.protect, authController.restrictTo('user'));

router
	.route('/')
	.get(wishlistController.getloggedUserWishlist)
	.post(
		wishlistValidator.addToWishlistValidator,
		wishlistController.addProductToWishlist,
	);

router
	.route('/:productId')
	.delete(
		wishlistValidator.removeFromWishlistValidator,
		wishlistController.removeProductFromWishlist,
	);

module.exports = router;
