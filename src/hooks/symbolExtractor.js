function textSanitization(text) {
  return text
  // Matches must be case insensitive
    .toLowerCase()
    // Decomposes combined graphemes into the combination of simple ones: é e´
    .normalize('NFD')
    //get rid of the diacritics
    .replace(/[\u0300-\u036f]/g, '')
    // Replaces all tokens that isn't a word, replacing them for a whitespace
    .replace(/[^\w]|\t\n/g, ' ');
}

module.exports = async function (context) {
  const sanitizedSymbols = (await context.app.service('symbol').find({paginate: false}));
  sanitizedSymbols
    .forEach(s => {
      s.name = textSanitization(s.name);
    });

  const sanitizedDescription = textSanitization(context.data.description);

  const symbolsInDescription = sanitizedSymbols
    .filter(s => sanitizedDescription.includes(s.name))
    .map(s => s.id);

  await context.result.setSymbolsReferenced(symbolsInDescription);
};
