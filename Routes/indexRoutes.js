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

/***************************************************************/

// Mounting routes to the main application
const mountRoutes = (app) => {
	app.use('/api/v1/auth', authRouter);
	app.use('/api/v1/users', userRouter);
	app.use('/api/v1/categories', categoryRouter);
	app.use('/api/v1/subCategories', subCategoryRouter);
	app.use('/api/v1/brands', brandRouter);
	app.use('/api/v1/products', productRouter);
	app.use('/api/v1/coupons', couponRouter);
	app.use('/api/v1/reviews', reviewRouter);
	app.use('/api/v1/wishlist', wishlistRouter);
	app.use('/api/v1/address', addressRouter);
	app.use('/api/v1/cart', cartRouter);
	app.use('/api/v1/orders', orderRouter);
};

module.exports = mountRoutes;
