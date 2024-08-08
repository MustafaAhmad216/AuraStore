const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
require('colors');
const dotenv = require('dotenv');
const Product = require('../../models/productModel');
const dbConnection = require('../../config/database');

dotenv.config({ path: '../../config.env' });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(
	fs.readFileSync(`${__dirname}/products.json`, 'utf8'),
);

// Insert data into DB
const insertData = async () => {
	try {
		await Product.create(products);

		console.log('Data Inserted'.green.inverse);
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

// Delete data from DB
const destroyData = async () => {
	try {
		await Product.deleteMany();
		console.log('Data Destroyed'.red.inverse);
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

if (process.argv[2] === '-import') {
	// node seeder.js -import
	insertData();
} else if (process.argv[2] === '-delete') {
	// node seeder.js -delete
	destroyData();
}
