const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const useCaseStep = sequelizeClient.define('use_case_step', {
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('happy', 'alternative', 'exceptional'),
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  useCaseStep.associate = function (models) {
    this.belongsTo(models.use_case, { as: 'useCase', onDelete: 'CASCADE' });
  };

  return useCaseStep;
}; 