// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const symbol = sequelizeClient.define('symbol', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  symbol.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    this.hasMany(models.notion, {
      as: 'notions',
      foreignKey: { allowNull: false },
      onDelete: 'CASCADE'
    });
    this.hasMany(models.behavioural_response, {
      as: 'behaviouralResponses',
      foreignKey: { allowNull: false },
      onDelete: 'CASCADE'
    });
    this.belongsTo(models.project, {
      as: 'project'
    });
  };

  return symbol;
};
