module.exports = function (context) {
  const model = context.app.service('symbol').Model;
  const association = {include: [{model: model, as: 'symbolsReferenced', attributes: ['id','name']}]};
  context.params.sequelize = Object.assign(association, {raw: false});
  return context;
};
