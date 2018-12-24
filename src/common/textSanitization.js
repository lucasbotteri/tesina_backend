module.exports = function (text) {
  return text
  // Matches must be case insensitive
    .toLowerCase()
    // Decomposes combined graphemes into the combination of simple ones: é e´
    .normalize('NFD')
    //get rid of the diacritics
    .replace(/[\u0300-\u036f]/g, '')
    // Replaces all tokens that isn't a word, replacing them for a whitespace
    .replace(/[^\w]|\t\n/g, ' ');
};
