/* eslint-disable import/no-extraneous-dependencies */
/* -----------------------------Imports----------------------------- */
const path = require('path');

const express = require('express');
const morgan = require('morgan'); //HTTP request logger middleware
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const dbConnection = require('./config/database');

const mountRoutes = require('./Routes/indexRoutes'); //Function to mount the routes
const { webhookCheckout } = require('./controllers/orderController');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

/****************************************************************************/

dotenv.config({ path: 'config.env' });
//connect with DB
dbConnection();

//Express App
const app = express();

// Enable CORS (Cross-Origin Resource Sharing) to allow requests from other domains
app.use(cors());
app.options('*', cors());

//compressing all texts send to clients
app.use(compression());

app.post(
	'/webhook-checkout',
	express.raw({ type: 'application/json' }),
	webhookCheckout,
);

// Middlewares
app.use(express.json()); //parser that turns the encoded string to a js object to be readable
app.use(express.static(path.join(__dirname, 'public')));

// console.log(process.env);
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
	console.log(`mode: ${process.env.NODE_ENV}`);
}

/****************************************************************/
//3) Routes

//Mounting our app Routes
mountRoutes(app);

app.get('/', (req, res) => {
	res.status(200).send({
		status: 'success',
		message: 'Welcome to my API! 😊',
	});
});
app.all('*', (req, res, next) => {
	//Create Error snd send it to error handling middleware...
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
/*************************************************************************/

//Global Error Handling Middleware for Express
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!😁`);
});

//Handling Rejections outside Express
process.on('unhandledRejection', (err) => {
	console.error(`UNHANDLED REJECTION!💥💥💥`);
	console.error(`${err.name.toUpperCase()}: ${err.message}⚠️⚠️`);
	// Close server & exit process
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	// Perform cleanup tasks here
	console.log('👋 SIGTERM Received. Shutting down gracefully...');
	server.close(() => {
		console.log('💥 Server closed. Process Terminated.');
	});
});
