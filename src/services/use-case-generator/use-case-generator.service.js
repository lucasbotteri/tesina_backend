// const natural = require('natural');
const lorca = require('lorca-nlp');
const hooks = require('./use-case-generator.hooks');
const natural = require('natural');

const createUseCaseGeneratorService = (app) => {
  return {
    async create(data) {
      const { projectId } = data;
      const scenarioService = app.service('scenario');
      const useCaseService = app.service('use-case');


      // Delete existing use cases for the project
      await useCaseService.remove(null, {
        query: {
          projectId
        }
      });


      // Get all scenarios for the project
      const scenarios = await scenarioService.find({
        query: { projectId },
        paginate: false,
        sequelize: {
          include: [{ association: 'goals'}, { association: 'episodes'}],
          nest: true,
          raw: false
        },
      });

      if (!scenarios.length) {
        throw new Error('No scenarios found for this project');
      }

      // Group scenarios by their goals
      const scenariosByGoal = scenarios.reduce((acc, scenario) => {

        const goalDescription = scenario.goals[0].description;

        // Maybe add some smarter logic
        const sameGoal = acc.find((goal) => goal.goal.toLowerCase() === goalDescription.toLowerCase());

        if (!sameGoal) {
          acc.push({
            goal: goalDescription,
            scenarios: [scenario],
          });
        } else {
          sameGoal.scenarios.push(scenario);
        }
        return acc;
      }, []);


      // Generate use cases for each goal group
      const generatedUseCases = await Promise.all(
        Object.values(scenariosByGoal).map(async ({ goal, scenarios }) => {
          // Define common word between scenarios using TF-IDF
          const TfIdf = natural.TfIdf;
          const tfidf = new TfIdf();

          const allTitles = scenarios.map((s) => s.title).join('. ');
          tfidf.addDocument(allTitles);
          const mostRelevantWord = tfidf.listTerms(0).map((t) => t.term)[0];



          // Sort scenarios by sentiment analysis
          const scenariosSortedBySentiment = scenarios
            .map((s) => ({
              scenario: s,
              sentiment: s.context ? lorca(s.context).sentiment() : 0,
            }))
            .sort((a, b) => {
              if (a.sentiment === b.sentiment) {
                // If sentiments are equal, use creation date or ID as tiebreaker
                return a.scenario.createdAt - b.scenario.createdAt;
              }
              return b.sentiment - a.sentiment;
            })
            .map((s) => s.scenario);



          const happyPathScenario = scenariosSortedBySentiment[0];
          const alternativeScenario =
            scenariosSortedBySentiment[scenariosSortedBySentiment.length - 1];


          const thereIsAnExceptionalScenario = scenariosSortedBySentiment.length > 2;
          const exceptionalScenario = thereIsAnExceptionalScenario
            ? scenariosSortedBySentiment[1]
            : null;

          // Create the use case with conditions based on sentiment analysis
          const useCase = await useCaseService.create({
            title: mostRelevantWord,
            goal,
            projectId,
            happyPathCondition: happyPathScenario
              ? happyPathScenario.context
              : null,
            alternativePathCondition: alternativeScenario
              ? alternativeScenario.context
              : null,
            exceptionalPathCondition: exceptionalScenario
              ? exceptionalScenario.context
              : null,
          }, { sequelize: { raw: false } });




          await useCase.addScenarios(scenarios.map((s) => s.id));

          // Get happy path episodes
          const happyEpisodes = happyPathScenario.episodes || [];
          const happyPathSteps = await Promise.all(happyEpisodes.map((episode, stepOrder) => {
            return useCase.createHappyPathStep({
              order: stepOrder + 1,
              description: episode.description,
              type: 'happy'
            });
          }));
          useCase.setHappyPathSteps(happyPathSteps);

          // Get alternative path episodes
          if (alternativeScenario) {
            const alternativeEpisodes = alternativeScenario.episodes || [];
            const alternativePathSteps = await Promise.all(alternativeEpisodes.map((episode, stepOrder) => {
              return useCase.createAlternativePathStep({
                order: stepOrder + 1,
                description: episode.description,
                type: 'alternative'
              });
            }));
            await useCase.setAlternativePathSteps(alternativePathSteps);
          }

          // For exceptional path
          if (exceptionalScenario) {
            const exceptionalEpisodes = exceptionalScenario.episodes || [];
            const exceptionalPathSteps = await Promise.all(exceptionalEpisodes.map((episode, stepOrder) => {
              return useCase.createExceptionalPathStep({
                order: stepOrder + 1,
                description: episode.description,
                type: 'exceptional'
              });
            }));
            await useCase.setExceptionalPathSteps(exceptionalPathSteps);
          }

          // Load the steps using the new associations
          await useCase.reload({
            include: [
              { association: 'happyPathSteps' },
              { association: 'alternativePathSteps' },
              { association: 'exceptionalPathSteps' }
            ]
          });

          return useCase;
        })
      );

      return generatedUseCases;
    },
  };
};

module.exports = function (app) {
  app.use('/use-case-generator', createUseCaseGeneratorService(app));
  const service = app.service('use-case-generator');
  service.hooks(hooks);
};
