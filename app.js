/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* -----------------------------Imports----------------------------- */
const path = require('path');
const express = require('express');
const morgan = require('morgan'); //HTTP request logger middleware
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

const mountRoutes = require('./Routes/indexRoutes'); //Function to mount the routes
const { webhookCheckout } = require('./controllers/orderController');
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

/****************************************************************************/

// 1) Start Express App
const app = express();

/****************************************************************/
// 2) Global Middlewares

// Enable CORS (Cross-Origin Resource Sharing) to allow requests from other domains
app.use(cors());
app.options('*', cors());

app.use(express.json()); //parser that turns the encoded string to a js object to be readable
app.use(express.static(path.join(__dirname, 'public')));

// console.log(process.env);
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
	console.log(`mode: ${process.env.NODE_ENV}`);
}

//compressing all texts send to clients
app.use(compression());

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: '50kb' })); //express.json() is an express middleware that permits using the request body

//Data Sanitization against NoSQL query injection in (req.params, req.query, req.body)
app.use(mongoSanitize());
//AND Data Sanitization against XSS attacks applied in indexRoutes.js

//Limit requests from same IP to application
const limiter = rateLimit({
	windowMs: 1 * 60 * 60 * 1000, //60 Mins --> 1 hour
	max: 100,
	message: 'Too many requests from this IP, please try again in 30 mins!',
});
app.use('/api', limiter);

//Middleware to protect against (HTTP Parameter Pollution) attacks
app.use(
	hpp({
		whitelist: [
			'title',
			'color',
			'price',
			'quantity',
			'sold',
			'ratingsAverage',
			'ratingsQuantity',
		],
	}),
);

/****************************************************************/
//3) Routes

mountRoutes(app); //Mounting our app Routes

app.post(
	'/webhook-checkout',
	express.raw({ type: 'application/json' }),
	webhookCheckout,
);

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

/****************************************************************/
//4) Starting server
module.exports = app;
