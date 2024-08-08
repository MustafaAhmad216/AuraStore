const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const productValidator = require('../utilities/validators/productValidator');
const reviewRouter = require('./reviewRoutes');

/*************************************************************************/

const router = express.Router();

//                     <<<< Nested Routes >>>>
//GET      /api/v1/products/:productId/reviews (To get child based on a parent)
//POST     /api/v1/products/:productId/reviews
router.use('/:productId/reviews', reviewRouter);

router
	.route('/')
	.get(productController.getAllProducts)
	.post(
		authController.protect,
		authController.restrictTo('admin', 'manager'),
		productController.uploadProductImage,
		productController.resizeProductImage,
		productValidator.createProductValidator,
		productController.createProduct,
	);

router
	.route('/:id')
	.get(productValidator.getProductValidator, productController.getProduct)
	.patch(
		authController.protect,
		authController.restrictTo('admin', 'manager'),
		productController.uploadProductImage,
		productController.resizeProductImage,
		productValidator.updateProductValidator,
		productController.updateProduct,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin'),
		productValidator.deleteProductValidator,
		productController.deleteProduct,
	);

module.exports = router;
