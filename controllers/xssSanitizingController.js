/* eslint-disable import/no-extraneous-dependencies */
const xss = require('xss');
const asyncHandler = require('express-async-handler');
/************************************************************************/

const xssOptions = {
	whiteList: {}, // Empty whitelist means no tags are allowed
	stripIgnoreTag: true, // Strip all HTML tags not in the whitelist
	stripIgnoreTagBody: ['script'], // Remove content of these tags (like <script>)
};

const customXSS = new xss.FilterXSS(xssOptions);

const xssSanitizer = asyncHandler(async (req, res, next) => {
	if (req.body) {
		Object.entries(req.body).forEach(([key, value]) => {
			if (typeof value === 'string') {
				req.body[key] = customXSS.process(value);
			}
		});
	}
	next();
});

module.exports = xssSanitizer;
