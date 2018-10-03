'use strict';
const hash = require('@feathersjs/authentication-local/lib/utils/hash');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('user', [
      { email: 'admin@admin.com', password: await hash('admin'), createdAt: new Date(), updatedAt: new Date() }
    ], {});


    const users = await queryInterface.sequelize.query(
      'SELECT * from \"user\";'
    );
    const usersRows = users[0];


    await queryInterface.bulkInsert('project', [
      { name: 'proyecto 1', ownerId: usersRows[0].id, createdAt: new Date(), updatedAt: new Date() }
    ], {});


    const projects = await queryInterface.sequelize.query(
      'SELECT id from project;'
    );

    return await queryInterface.bulkInsert('symbol', [
      { name: 'Cuenta', type: 'OBJECT', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Banco', type: 'SUBJECT', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Usuario', type: 'VERB', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Deposito', type: 'VERB', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Extraccion', type: 'VERB', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Transaccion', type: 'VERB', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Empleado', type: 'SUBJECT', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cuenta Corriente', type: 'OBJECT', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Caja Ahorro', type: 'OBJECT', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Credito', type: 'VERB', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Interes', type: 'VERB', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Congelada', type: 'STATE', projectId: projects[0].id, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: async (queryInterface) => {
  },
};
