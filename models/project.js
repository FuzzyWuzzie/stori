module.exports = function(sequelize, Sequelize) {
	return sequelize.define('project', {
			name:        { type: Sequelize.STRING,  allowNull: false, unique: false   },
			description: { type: Sequelize.STRING,  allowNull: false, unique: false   }
		});
}