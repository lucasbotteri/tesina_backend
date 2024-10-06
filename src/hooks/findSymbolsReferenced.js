const { stem, stemToWords } = require('../common/stem');


/**
 * @function addSymbolsReferenced For every symbol referenced in the description of the semantic it'll save the reference in the database and return it populated in the semantic
 * @param {Object} semantic Sequelize instace of the semantic to analize
 * @param {Array} symbols List of plain symbols objects possible to be referenced by the semantic
 * @returns {Object} Returns a plain semantic object populated with the symbols referenced
 */
async function addSymbolsReferenced(semantic, symbols) {
  //Steamming semantic description
  const sanitizedDescription = stemToWords(semantic.description);

  // Stemming symbols' names into arrays of words
  const sanitizedSymbols = symbols.map(sym => ({
    ...sym,
    stemmedWords: stemToWords(sym.name),
  }));


  //Filtering symbols that are referenced in the semantic description
  const symbolsInDescription = sanitizedSymbols
    .filter(sym => sym.stemmedWords.every(word => sanitizedDescription.includes(word)))
    .map(sym => sym.id);

  // Adding relationship
  await semantic.setSymbolsReferenced(symbolsInDescription);

  // Returning plain semantic object and populating it with referenced symbols on description
  return {
    ...semantic.get({ plain: true }),
    symbolsReferenced: await semantic.getSymbolsReferenced()
  }
}


// The result must be sent as RAW for this hook to works
/**
 * @function findSymbolsReferenced When a new semantic is created, the description will probably have references to some symbols. This function finds they and save the references on the semantic
 */
module.exports = async function (context) {
  const semantic = context.result;
  const symbol = await semantic.getSymbol();
  const symbolsInProject = await context.app.service('symbol').find({
    query: {
      projectId: { $eq: symbol.projectId },
      id: { $ne: symbol.id }
    },
    paginate: false
  });
  context.result = await addSymbolsReferenced(semantic, symbolsInProject);
  return context;
};
