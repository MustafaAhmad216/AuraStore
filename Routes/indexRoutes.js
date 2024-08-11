/*Routes that supposed to be called in server.js*/

const categoryRouter = require('./categoryRoutes');
const subCategoryRouter = require('./subCategoryRoutes');
const brandRouter = require('./brandRoutes');
const couponRouter = require('./couponRoutes');
const reviewRouter = require('./reviewRoutes');
const productRouter = require('./productRoutes');
const userRouter = require('./userRoutes');
const authRouter = require('./authRoutes');
const wishlistRouter = require('./wishlistRoutes');
const addressRouter = require('./addressRoutes');
const cartRouter = require('./cartRoutes');
const orderRouter = require('./orderRoutes');
const xssSanitizer = require('../controllers/xssSanitizingController');
/***************************************************************/

// Mounting routes to the main application
const mountRoutes = (app) => {
	// Data Sanitization against XSS attacks in all routes
	app.use('/api/v1/auth', xssSanitizer, authRouter);
	app.use('/api/v1/users', xssSanitizer, userRouter);
	app.use('/api/v1/categories', xssSanitizer, categoryRouter);
	app.use('/api/v1/subCategories', xssSanitizer, subCategoryRouter);
	app.use('/api/v1/brands', xssSanitizer, brandRouter);
	app.use('/api/v1/products', xssSanitizer, productRouter);
	app.use('/api/v1/coupons', xssSanitizer, couponRouter);
	app.use('/api/v1/reviews', xssSanitizer, reviewRouter);
	app.use('/api/v1/wishlist', xssSanitizer, wishlistRouter);
	app.use('/api/v1/address', xssSanitizer, addressRouter);
	app.use('/api/v1/cart', xssSanitizer, cartRouter);
	app.use('/api/v1/orders', xssSanitizer, orderRouter);
};

module.exports = mountRoutes;
