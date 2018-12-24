module.exports = function (context) {
  if (context.params.query && context.params.query.symbolId) {
    context.params.paginate = false;
    delete context.params.query.$limit;
  }
  return context;
};
