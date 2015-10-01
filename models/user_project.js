module.exports = function(userModel, projectModel) {
	userModel.belongsToMany(projectModel, { through: 'user_project' });
	projectModel.belongsToMany(userModel, { through: 'user_project' });
}