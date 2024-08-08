const AppError = require('../utilities/appError');

const handleJWTError = () =>
	new AppError('Invalid Token, Please login again!', 401);

const handleExpiredJWTError = () =>
	new AppError('Expired Token, Please login again!', 401);

const sendErrorDev = (err, req, res) => {
	res.status(+err.statusCode).json({
		status: err.status,
		name: err.name,
		message: err.message,
		error: err,
		stack: err.stack,
	});
};
const sendErrorProd = (err, req, res) => {
	if (err.name === 'JsonWebTokenError') err = handleJWTError();
	if (err.name === 'TokenExpiredError') err = handleExpiredJWTError();

	res.status(+err.statusCode).json({
		status: err.status,
		message: err.message,
	});
};

//Global Error Handling Middleware for Express
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = `${err.status}` || 'Error';

	if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
	else if (process.env.NODE_ENV === 'production') sendErrorProd(err, req, res);

	next();
};
