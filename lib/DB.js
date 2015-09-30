module.exports = {
	Models: function(sequelize, Sequelize) {
		var User = sequelize.define('user', {
		    username:       { type: Sequelize.STRING,  allowNull: false, unique: true   },
		    email:          { type: Sequelize.STRING,  allowNull: false, unique: true   },
		    userlevel:      { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
		    password:       {
		        type: Sequelize.STRING,
		        set: function(v) {
		            var salt = bcrypt.genSaltSync(10);
		            var hash = bcrypt.hashSync(v, salt);
		            this.setDataValue('password', hash);
		        }
		    }
		});

		var Project = sequelize.define('project', {
		    name:        { type: Sequelize.STRING,  allowNull: false, unique: false   },
		    description: { type: Sequelize.STRING,  allowNull: false, unique: false   }
		});

		User.belongsToMany(Project, { through: 'user_project' });
		Project.belongsToMany(User, { through: 'user_project' });

		return {
			User: User,
			Project: Project
		};
	},
	ValidateUserPassword: function(user, password) {
		return bcrypt.compareSync(password, user.password);
	},
	Initialize: function(sequelize) {
		sequelize.sync();
	}
};