/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

const dbConnection = function () {
//******************** Database connection logic here ********************

//connect with DB
	const DB = process.env.DATABASE_URI.replace(
		'<PASSWORD>',
		process.env.DB_PASSWORD
	);
	mongoose.connect(DB).then(() => {
		console.log(`DB connection successfully established!🥳`);
	});
};

module.exports = dbConnection;
