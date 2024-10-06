// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const behaviouralResponse = sequelizeClient.define('behavioural_response', {
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
  behaviouralResponse.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    this.belongsTo(models.symbol, { as: 'symbol', foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
    this.belongsToMany(models.symbol, { as: 'symbolsReferenced', through: 'behavioural_response_symbol' });
  };

  return behaviouralResponse;
};
