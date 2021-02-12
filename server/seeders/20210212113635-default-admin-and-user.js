'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [{
      login: 'admin',
      password: '$2b$10$NkA4jKkNssy0wE.b80CVMe6IWc65O.1F3lG.hBr1sU5SGitR5ofHK', // admin
      type: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      login: 'user',
      password: '$2b$10$TxEgxGXFYAIMbD.Yj37iZOZk8TBLyo.3RTqAX9uc51qJbYimNuLXO', // user
      type: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', { login: ['admin', 'user'] }, {});
  }
};
