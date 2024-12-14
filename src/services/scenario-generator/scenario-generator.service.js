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
      const scenarioService = app.service('scenario');

      // Delete existing scenarios for the project
      await scenarioService.remove(null, {
        query: {
          projectId
        }
      });


      const verbSymbols = await symbolService.find({
        query: {
          projectId,
          type: 'VERB'
        },
        paginate: false
      });



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

        const scenarioData = {
          title: `${verb.name}`,
          projectId: projectId,
          verbId: verb.id,
        };

        const scenario = await scenarioService.create(scenarioData, { sequelize: { raw: false } });

        // Then, associate actors, goals, episodes, and resources
        if (actors.length > 0) {
          await scenario.setActors(actors.map(actor => actor.id));
        }

        if (goals.length > 0) {
          await scenario.setGoals(goals.map(goal => goal.id));
        }

        if (episodes.length > 0) {
          await scenario.setEpisodes(episodes.map(episode => episode.id));
        }

        if (resources.length > 0) {
          await scenario.setResources(resources.map(resource => resource.id));
        }
        return scenario;
      }));

      // Bulk create scenarios

      return generatedScenarios;
    },
  };
};

module.exports = function (app) {
  app.use('/scenario-generator', createScenarioGeneratorService(app));

  const service = app.service('scenario-generator');

  service.hooks(hooks);
};
