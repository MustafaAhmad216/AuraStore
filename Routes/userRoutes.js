const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const userValidator = require('../utilities/validators/userValidator');

/*************************************************************************/

const router = express.Router();

// 1) Only logged in users can access these routes
/*---------------*/ router.use(authController.protect); /*---------------*/

router.get('/getMe', userController.getMe, userController.getUser);
router.patch(
	'/updateMyPassword',
	userValidator.updateMyPasswordValidator,
	userController.updateMyPassword,
);
router.patch(
	'/updateMe',
	userController.uploadUserImage,
	userController.resizeUserImage,
	userValidator.updateMeValidator,
	userController.updateMe,
);

router.delete('/deleteMe', userController.deleteMe);

//------------------------------------------------------------------------

// 2) Only admins and managers roles can access these routes
/*------*/ router.use(authController.restrictTo('admin', 'manager')); /*------*/

router
	.route('/')
	.get(userController.getAllUsers)
	.post(
		userController.uploadUserImage,
		userController.resizeUserImage,
		userValidator.createUserValidator,
		userController.createUser,
	);

router
	.route('/:id')
	.get(userValidator.getUserValidator, userController.getUser)
	.patch(
		userController.uploadUserImage,
		userController.resizeUserImage,
		userValidator.updateUserValidator,
		userController.updateUser,
	)
	.delete(userValidator.deleteUserValidator, userController.deleteUser);

router.patch(
	'/updateUserPassword/:id',
	userValidator.updateUserPasswordValidator,
	userController.updateUserPassword,
);

module.exports = router;
