module.exports = function(userModel, refreshTokenModel) {
	refreshTokenModel.belongsTo(userModel);
}