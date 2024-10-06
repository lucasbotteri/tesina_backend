const hooks = require('./scenario-generator.hooks');

const createScenarioGeneratorService = (app) => {

  return {
    /**
     * Generate scenarios for a projectId
     * 
     * for each verb v in LEL
     * define a Scenario s
     * s.id = v.id
     * s.actor = subject containing v in behavioral resp.
     * s.goal = v.notion
     * s.episodes = v.behav responses
     * complete s.context manually
     * s.resources = objects in s.episodes
     * 
     */
    async create(data) {
      const { projectId } = data;
      const symbolService = app.service('symbol');
      const notionService = app.service('notion');
      const behaviouralResponseService = app.service('behavioural-response');


      // Fetch verb symbols for the projectId
      const verbSymbols = await symbolService.find({
        query: {
          projectId,
          type: 'VERB'
        },
        paginate: false
      });



      // Generate scenarios for each verb

      const generatedScenarios = await Promise.all(verbSymbols.map(async (verb) => {
        const verbId = verb.id;


        const goals = await notionService.find({
          query: {
            symbolId: verbId
          },
          paginate: false
        });



        const episodes = await behaviouralResponseService.find({
          query: {
            symbolId: verbId
          },
          paginate: false
        });


        const idsReferencedByBH = new Set(
          episodes.reduce((acc, bh) => acc.concat(bh.symbolsReferenced.map(sr => sr.id.toString()) || []), [])
        );


        const resources = await symbolService.find({
          query: {
            id: {
              $in: Array.from(idsReferencedByBH).map(id => id.toString())
            },
            type: 'OBJECT'
          },
          paginate: false
        });



        // I think this one is wrong because we want the subject that contains the verb in the behavioural response
        const actors = await symbolService.find({
          query: {
            type: 'SUBJECT', id: {
              $in: Array.from(idsReferencedByBH)
            },
          },
          paginate: false
        });



        return {
          title: `${verb.name} Scenario`,
          project: projectId,
          verb,
          actors,
          goals,
          episodes,
          resources,
        };

      }));

      return generatedScenarios;
    },
  };
};

module.exports = function (app) {
  app.use('/scenario-generator', createScenarioGeneratorService(app));

  const service = app.service('scenario-generator');

  service.hooks(hooks);
};
