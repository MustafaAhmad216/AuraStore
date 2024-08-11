exports.sanitizeUser = function (user) {
	return {
		id: user._id,
		name: user.name,
		email: user.email,
		phone: user.phone,
		profilePicture: user.profilePicture,
		// address: user.address,
	};
};
