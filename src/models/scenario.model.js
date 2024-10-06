const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const scenario = sequelizeClient.define('scenario', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    context: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  scenario.associate = function (models) {
    this.belongsTo(models.project, { as: 'project' });
    this.belongsTo(models.symbol, { as: 'verb', foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
    this.belongsToMany(models.symbol, { as: 'actors', through: 'scenarios_actors' });
    this.belongsToMany(models.notion, { as: 'goals', through: 'scenarios_goals' });
    this.belongsToMany(models.symbol, { as: 'resources', through: 'scenarios_resources' });
    this.belongsToMany(models.behavioural_response, { as: 'episodes', through: 'scenarios_episodes' });
  };

  return scenario;
};
