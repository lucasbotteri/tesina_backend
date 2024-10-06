// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const notion = sequelizeClient.define('notion', {
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
  notion.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    this.belongsTo(models.symbol, { as: 'symbol', foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
    this.belongsToMany(models.symbol, { as: 'symbolsReferenced', through: 'notion_symbol' });
  };

  return notion;
};
