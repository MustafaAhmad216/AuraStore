const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const reviewValidator = require('../utilities/validators/reviewValidator');

/*******************************************************************************/

//mergeParams Allow us to access parameeters from other Routers
const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(reviewController.getAllReviews)
	.post(
		authController.protect,
		authController.restrictTo('user'),
		reviewController.setUserIdAndProductIdToBody('both'),
		reviewValidator.createReviewValidator,
		reviewController.createReview,
	);

router
	.route('/:id')
	.get(reviewValidator.getReviewValidator, reviewController.getReview)
	.patch(
		authController.protect,
		authController.restrictTo('user'),
		reviewValidator.updateReviewValidator,
		reviewController.updateReview,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin', 'user', 'manager'),
		reviewValidator.deleteReviewValidator,
		reviewController.deleteReview,
	);

module.exports = router;
