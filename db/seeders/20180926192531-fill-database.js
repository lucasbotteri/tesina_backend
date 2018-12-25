'use strict';
const hash = require('@feathersjs/authentication-local/lib/utils/hash');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('user', [
      { email: 'admin@admin.com', password: await hash('admin'), type: 'ADMINISTRATOR', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    console.log('SEEDED USERES')

    const users = await queryInterface.sequelize.query(
      'SELECT * from "user";'
    );

    await queryInterface.bulkInsert('project', [
      { name: 'proyecto 1', ownerId: users[0][0].id, createdAt: new Date(), updatedAt: new Date() }
    ], {});


    console.log('SEEDED PROJECTS')

    const projects = await queryInterface.sequelize.query(
      'SELECT id from project;'
    );



    await queryInterface.bulkInsert('symbol', [
      { name: 'Cuenta', type: 'OBJECT', description: 'Una descripcion muy larga, larga',  projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Banco', type: 'SUBJECT', description: 'Una descripcion muy larga, larga', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Usuario', type: 'VERB', description: 'Una descripcion muy larga, larga', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Deposito', type: 'VERB', description: 'Una descripcion muy larga, larga', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Extraccion', type: 'VERB', description: 'Una descripcion muy larga, larga', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Transaccion', type: 'VERB', description: 'Una descripcion muy larga, larga', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Empleado', type: 'SUBJECT', description: 'Una descripcion', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cuenta Corriente', type: 'OBJECT', description: 'Una descripcion', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Caja Ahorro', type: 'OBJECT', description: 'Una descripcion', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Credito', type: 'VERB', description: 'Una descripcion', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Interes', type: 'VERB', description: 'Una descripcion', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Congelada', type: 'STATE', description: 'Una descripcion', projectId: projects[0][0].id, createdAt: new Date(), updatedAt: new Date() },
    ], {});


    console.log('SEEDED SYMBOLS')

    const symbols = await queryInterface.sequelize.query(
      'SELECT id from symbol;'
    );

    await queryInterface.bulkInsert('notion', [
      { description: 'La cuenta tiene un balance', symbolId: symbols[0][0].id, createdAt: new Date(), updatedAt: new Date() }
    ], {});


    console.log('SEEDED NOTIONS')

    return await queryInterface.bulkInsert('behavioural_response', [
      { description: 'El cliente puede abrir una cuenta', symbolId: symbols[0][0].id, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface) => {
  },
};
