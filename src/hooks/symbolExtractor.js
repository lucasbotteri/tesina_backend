const  textSanitization= require('../common/textSanitization');
// The result must be sent as RAW for this hook to works
module.exports = async function (context) {
  const symbol = await context.result.getSymbol();
  const sanitizedSymbols = await context.app.service('symbol').find({query: {projectId: {$eq: symbol.projectId}}, paginate: false});
  sanitizedSymbols
    .forEach(s => {
      s.name = textSanitization(s.name);
    });

  const sanitizedDescription = textSanitization(context.data.description);

  const symbolsInDescription = sanitizedSymbols
    .filter(s => sanitizedDescription.includes(s.name))
    .map(s => s.id);

  // Adding relationship
  await context.result.setSymbolsReferenced(symbolsInDescription);

  // Populating referenced symbols on semantic
  const symbolsReferenced = await context.result.getSymbolsReferenced();
  context.result = context.result.get({ plain: true });
  context.result.symbolsReferenced = symbolsReferenced;
  return context;
};
