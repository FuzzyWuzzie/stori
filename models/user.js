var bcrypt = require('bcryptjs');

module.exports = function(sequelize, Sequelize) {
	return sequelize.define('user', {
		    name:      { type: Sequelize.STRING,  allowNull: false, unique: true   },
		    email:     { type: Sequelize.STRING,  allowNull: false, unique: true   },
		    userlevel: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
		    password:  {
		        type: Sequelize.STRING,
		        set: function(v) {
		            var salt = bcrypt.genSaltSync(10);
		            var hash = bcrypt.hashSync(v, salt);
		            this.setDataValue('password', hash);
		        }
		    }
		},
		{
			instanceMethods: {
				VerifyPassword: function(pass, cb) {
					bcrypt.compare(pass, this.password, function(err, isMatch) {
						if(err) return cb(err);
						cb(null, isMatch);
					});
				},
				HasLevel: function(level) {
					return this.userlevel >= level;
				}
			}
		});
}