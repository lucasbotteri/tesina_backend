const textSanitization = require('../common/textSanitization');

// For each semantic it'll look for descriptions referencing the new symbol and it'll add the reference
async function updateSymbolReference(service, symbol, symbolsInSameProject) {

  const semantics = await service.find({query: {symbolId: {$in: symbolsInSameProject}},sequelize: {raw: false}, paginate: false});
  semantics
    .filter(sem => textSanitization(sem.description).includes(textSanitization(symbol.name)))
    .forEach(async function (sem) {
      await sem.addSymbolsReferenced(symbol.id);
    });
}

module.exports = async function (context) {
  let symbolsInSameProject = await context.service.find({query: {projectId: {$eq: context.result.projectId}}, paginate: false});
  symbolsInSameProject = symbolsInSameProject.map( s => s.id);
  await updateSymbolReference(context.app.service('behavioural-response'), context.result, symbolsInSameProject);
  await updateSymbolReference(context.app.service('notion'), context.result, symbolsInSameProject);
};
