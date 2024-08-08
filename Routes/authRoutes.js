const express = require('express');
const authController = require('../controllers/authController');
const authValidator = require('../utilities/validators/authValidator');

/*************************************************************************/

const router = express.Router();

router.post('/signup', authValidator.signupValidator, authController.signup);
router.post('/login', authValidator.loginValidator, authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/verifyResetCode', authController.verifyResetCode);
router.patch(
	'/resetPassword',
	authValidator.resetPasswordValidator,
	authController.resetPassword,
);

module.exports = router;
