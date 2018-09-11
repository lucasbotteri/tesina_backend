const symbol = require('./symbol/symbol.service.js');
const notion = require('./notion/notion.service.js');
const behaviouralResponse = require('./behavioural-response/behavioural-response.service.js');
const user = require('./user/user.service.js');
const project = require('./project/project.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(symbol);
  app.configure(notion);
  app.configure(behaviouralResponse);
  app.configure(user);
  app.configure(project);
};
