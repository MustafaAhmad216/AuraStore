/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* -----------------------------Imports----------------------------- */
const dotenv = require('dotenv');
const dbConnection = require('./config/database');

/****************************************************************************/
process.on('uncaughtException', (err) => {
	console.error('UNHANDLED EXCEPTION!💥.... SHUTTING DOWN');
	console.error(`${err.name.toUpperCase()}: ${err.message} ⚠️⚠️`);

	process.exit(1);
});

dotenv.config({ path: 'config.env' });

const app = require('./app');

//connect with DB
dbConnection();

//Assinging working Port
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!😁`);
});

/*********************************************************************/
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
