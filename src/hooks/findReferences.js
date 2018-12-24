const textSanitization = require('../common/textSanitization');

// For each semantic it'll look for descriptions referencing the new symbol and it'll add the reference
async function updateSymbolReference(service, symbol) {
  const semantics = await service.find({sequelize: {raw: false}, paginate: false});
  semantics
    .filter(sem => textSanitization(sem.description).includes(textSanitization(symbol.name)))
    .forEach(async function (sem) {
      await sem.addSymbolsReferenced(symbol.id);
    });
}

module.exports = async function (context) {
  await updateSymbolReference(context.app.service('behavioural-response'), context.result);
  await updateSymbolReference(context.app.service('notion'), context.result);
};
