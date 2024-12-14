const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const useCase = sequelizeClient.define(
    'use_case',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      goal: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      happyPathCondition: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      alternativePathCondition: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      exceptionalPathCondition: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  useCase.associate = function (models) {
    this.belongsTo(models.project, { as: 'project', onDelete: 'CASCADE' });
    this.belongsToMany(models.symbol, {
      as: 'actors',
      through: 'use_cases_actors',
    });
    this.belongsToMany(models.scenario, {
      as: 'scenarios',
      through: 'use_cases_scenarios',
    });
    
    this.hasMany(models.use_case_step, { 
      as: 'happyPathSteps',
      scope: {
        type: 'happy'
      }
    });
    
    this.hasMany(models.use_case_step, { 
      as: 'alternativePathSteps',
      scope: {
        type: 'alternative'
      }
    });
    
    this.hasMany(models.use_case_step, { 
      as: 'exceptionalPathSteps',
      scope: {
        type: 'exceptional'
      }
    });
  };

  return useCase;
};
