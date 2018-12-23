module.exports = function (context) {
  if (!context.params.sequelize) context.params.sequelize = {};
  Object.assign(context.params.sequelize, {raw: false});
  return context;
};
