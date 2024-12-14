const symbol = require('./symbol/symbol.service.js');
const notion = require('./notion/notion.service.js');
const behaviouralResponse = require('./behavioural-response/behavioural-response.service.js');
const user = require('./user/user.service.js');
const project = require('./project/project.service.js');
const scenario = require('./scenario/scenario.service.js');
const scenarioGenerator = require('./scenario-generator/scenario-generator.service.js');
const init = require('./init/init.service.js');
const useCase = require('./use-case/use-case.service.js');
const useCaseGenerator = require('./use-case-generator/use-case-generator.service.js');
const useCaseStep = require('./use-case-step/use-case-step.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(symbol);
  app.configure(notion);
  app.configure(behaviouralResponse);
  app.configure(user);
  app.configure(project);
  app.configure(scenario);
  app.configure(scenarioGenerator);
  app.configure(useCase);
  app.configure(useCaseGenerator);
  app.configure(useCaseStep);
  app.configure(init);
};
