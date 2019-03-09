const { stem, stemToWords } = require('../common/stem');


/**
 * @function updateSymbolReference From a symbol it will search previous semantic descriptions referencing this new symbol and it'll update this semantics with the reference 
 * @param {Array} semantics Array of semantics models used to find the references to the new symbol
 * @param {Object} symbol Plain symbol object, it's the new symbol created
  */
async function updateSymbolReference(semantics, symbol) {
  // Steem symbol name
  const stemmedSymbolName = stem(symbol.name);

  semantics
    // Filtering semantics where the (stemmed) description refereces the symbol name
    .filter(sem => stemToWords(sem.description).includes(stemmedSymbolName))

    // Updating semantic, saving the reference to the new symbol
    .forEach(async function (sem) {
        await sem.addSymbolsReferenced(symbol.id);
    });
}

async function findSemantic(serviceName, context, symbolsInSameProject){
  const service = context.app.service(serviceName)
  return service.find({query: {symbolId: {$in: symbolsInSameProject}},sequelize: {raw: false}, paginate: false})
}

/**
 * @function findSymbolReferences When a new symbols is created, it's possible that a previous created semantic had a reference to this symbol. So the semantic needs to be updated with this new reference, now that the symbol exists
 */
module.exports = async function (context) {
  let symbolsInSameProject = await context.service.find({query: {projectId: {$eq: context.result.projectId}}, paginate: false});
  symbolsInSameProject = symbolsInSameProject.map( s => s.id);

  // Concatenating all semantics in the symbols of same proyect in one array ( they are polimorfic models)
  const semantics = [
    ...await findSemantic('behavioural-response', context, symbolsInSameProject),
    ...await findSemantic('notion', context, symbolsInSameProject)
  ]

  await updateSymbolReference(semantics, context.result, symbolsInSameProject);
};
