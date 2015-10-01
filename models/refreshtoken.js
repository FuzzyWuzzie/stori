module.exports = function(sequelize, Sequelize) {
	return sequelize.define('refreshToken', {
			uuid: { type: Sequelize.UUID, allowNull:false, defaultValue: Sequelize.UUIDV1, primaryKey: true }
		});
}