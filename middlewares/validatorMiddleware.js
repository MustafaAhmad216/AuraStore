const mongoose = require('mongoose');
const { validationResult } = require('express-validator');


// //---------------------------- HELPER FUNCTIONS ----------------------------
exports.validateCategoryId = (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).json({
			status: 'Error',
			message: `Invalid Object ID format: ${req.params.id}`,
		});
	}
	next(); // Continue to the next middleware or route handler
};

//-----------------------------------------------------------------------
exports.validationMiddleware = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};
