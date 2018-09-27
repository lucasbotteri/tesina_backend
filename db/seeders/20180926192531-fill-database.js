'use strict';
const hash = require('@feathersjs/authentication-local/lib/utils/hash');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('user', [
      { email: 'admin@admin.com', password: await hash('admin'), createdAt: new Date() ,updatedAt: new Date() }
    ], {});


    const users = await queryInterface.sequelize.query(
      'SELECT * from \"user\";'
    );
    const usersRows = users[0];
    

    await queryInterface.bulkInsert('project', [
      { name: 'proyecto 1', ownerId: usersRows[0].id, createdAt: new Date() ,updatedAt: new Date()}
    ], {});


    const projects = await queryInterface.sequelize.query(
      'SELECT id from project;'
    );

    const projectsRows = projects[0];
    return await queryInterface.bulkInsert('symbol', [
      { name: 'Cuenta', type: 'Object', projectId: projects[0].id, createdAt: new Date() ,updatedAt: new Date()}
    ], {});
  },

  down: async (queryInterface) => {
  },
};
