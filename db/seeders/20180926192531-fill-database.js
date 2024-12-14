/* eslint-disable no-console */
'use strict';
const hash = require('@feathersjs/authentication-local/lib/utils/hash');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('user', [
      {
        email: 'admin@admin.com',
        password: await hash('admin'),
        role: 'ADMINISTRATOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    console.log('SEEDED USERS');

    const users = await queryInterface.sequelize.query('SELECT * from "user";');

    await queryInterface.bulkInsert('project', [
      {
        name: 'Proyecto Agricultores',
        ownerId: users[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    console.log('SEEDED PROJECTS');

    const projects = await queryInterface.sequelize.query('SELECT id from project;');

    await queryInterface.bulkInsert('symbol', [
      {
        name: 'Agricultor',
        type: 'SUBJECT',
        description: 'El agricultor es responsable de cultivar las frutas.',
        projectId: projects[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fertilizar usando la tubería de riego',
        type: 'VERB',
        description: 'La acción de fertilizar usando la tubería de riego tiene como objetivo agregar nutrientes a la planta mediante el riego.',
        projectId: projects[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fertilizar usando la mochila de riego',
        type: 'VERB',
        description: 'La acción de fertilizar usando la mochila de riego tiene como objetivo agregar nutrientes a la planta mediante la aspersión.',
        projectId: projects[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mezcla de minerales',
        type: 'OBJECT',
        description: 'Una mezcla de minerales para fertilización.',
        projectId: projects[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mochila de riego',
        type: 'OBJECT',
        description: 'Dispositivo usado para rociar líquidos en las plantas.',
        projectId: projects[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    console.log('SEEDED SYMBOLS');

    const symbols = await queryInterface.sequelize.query('SELECT id, name from symbol;');

    const symbolMap = {};
    symbols[0].forEach((symbol) => {
      symbolMap[symbol.name] = symbol.id;
    });

    await queryInterface.bulkInsert('notion', [
      {
        description: 'El agricultor es responsable de cultivar las frutas.',
        symbolId: symbolMap['Agricultor'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Agregar nutrientes a la planta',
        symbolId: symbolMap['Fertilizar usando la tubería de riego'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Agregar nutrientes a la planta',
        symbolId: symbolMap['Fertilizar usando la mochila de riego'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    console.log('SEEDED NOTIONS');

    await queryInterface.bulkInsert('behavioural_response', [
      // Para 'Agricultor'
      {
        description: 'El agricultor realiza la acción de fertilizar usando la mochila de riego.',
        symbolId: symbolMap['Agricultor'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor realiza la acción de fertilizar usando la tubería de riego.',
        symbolId: symbolMap['Agricultor'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor prepara la mezcla de minerales.',
        symbolId: symbolMap['Agricultor'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor diluye la mezcla de minerales en agua.',
        symbolId: symbolMap['Agricultor'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor usa la mochila de riego para rociar la mezcla en las plantas.',
        symbolId: symbolMap['Agricultor'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor usa la tubería de riego para regar la mezcla en el suelo.',
        symbolId: symbolMap['Agricultor'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Para 'Fertilizar usando la tubería de riego'
      {
        description: 'El agricultor prepara la mezcla de minerales.',
        symbolId: symbolMap['Fertilizar usando la tubería de riego'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor vierte la mezcla de minerales en la tubería de riego.',
        symbolId: symbolMap['Fertilizar usando la tubería de riego'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor vierte agua fresca en la tubería de riego.',
        symbolId: symbolMap['Fertilizar usando la tubería de riego'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Para 'Fertilizar usando la mochila de riego'
      {
        description: 'El agricultor prepara la mezcla de minerales.',
        symbolId: symbolMap['Fertilizar usando la mochila de riego'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor vierte la mezcla de minerales en la mochila de riego.',
        symbolId: symbolMap['Fertilizar usando la mochila de riego'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor usa la mochila de riego para rociar la mezcla en las plantas.',
        symbolId: symbolMap['Fertilizar usando la mochila de riego'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'El agricultor limpia la mochila de riego.',
        symbolId: symbolMap['Fertilizar usando la mochila de riego'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    console.log('SEEDED BEHAVIOURAL RESPONSES');
  },

  down: async () => {

  },
};