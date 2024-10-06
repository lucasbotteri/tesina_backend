const { stemToWords } = require('../../common/stem');

const createInitService = (app) => {
  const symbolService = app.service('symbol');
  const notionService = app.service('notion');
  const behaviouralResponseService = app.service('behavioural-response');

  return {
    async create() {
      // Retrieve all symbols
      const symbols = await symbolService.find({ paginate: false, sequelize: { raw: false } });

      for (const symbol of symbols) {
        // Properly await the retrieval of selfNotions and selfBehaviouralResponses
        const selfNotions = await symbol.getNotions({ raw: true });
        const selfBehaviouralResponses = await symbol.getBehaviouralResponses({ raw: true });

        // Exclude notions associated with the current symbol
        const projectNotions = await notionService.find({
          query: {
            id: { $notIn: selfNotions.map((n) => n.id) },
          },
          sequelize: { raw: false },
          paginate: false,
        });

        // Exclude behavioural responses associated with the current symbol
        const projectBehaviouralResponses = await behaviouralResponseService.find({
          query: {
            id: { $notIn: selfBehaviouralResponses.map((br) => br.id) },
          },
          sequelize: { raw: false },
          paginate: false,
        });

        const semantics = [...projectNotions, ...projectBehaviouralResponses];

        // Stem the symbol's name for comparison
        const stemmedSymbolWords = stemToWords(symbol.name);

        semantics
          // Filtering semantics where the (stemmed) description refereces the symbol name
          .filter(sem => {
            const stemmedDescriptionWords = stemToWords(sem.description);
            return stemmedSymbolWords.every(word => stemmedDescriptionWords.includes(word));
          })
          // Update semantic, saving the reference to the symbol
          .forEach(async function (sem) {
            await sem.addSymbolsReferenced(symbol.id);
          });
      }

      return { success: true };
    },
  };
};

module.exports = function (app) {
  app.use('/init', createInitService(app));
};