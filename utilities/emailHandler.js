/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
	// 1) Create Transporter (service that will send email (ex. Gmail, mailtrap, sendGrid))
	const transporter = nodemailer.createTransport({
		host: process.env.MAILTRAP_HOST,
		port: process.env.MAILTRAP_PORT,
		// secure: true,
		auth: {
			user: process.env.MAILTRAP_USER,
			pass: process.env.MAILTRAP_PASSWORD,
		},
	});

	// 2) Define Email Options (ex. From, To, Subject and Content)
	const mailOptions = {
		from: process.env.MAILTRAP_FROM,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	// 3) SendEmail
	await transporter.sendMail(mailOptions);
};

// module.exports = sendEmail;
