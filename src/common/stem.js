const lorca = require('lorca-nlp')

/**
 * 
 * @param {String} text to be stemmed
 * @returns an array of words stemmed
 */
const stemToWords = text => lorca(text)
  .words()
  .stem()
  .get()

/**
 * 
 * @param {String} text to be stemmed
 * @returns a text with the words stemmed separated by spaces
 */
const stem = text => stemToWords(text).join(' ')


module.exports = {
  stemToWords,
  stem
};
