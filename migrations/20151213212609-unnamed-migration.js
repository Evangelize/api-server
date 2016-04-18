'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.createTable(
        'users',
        {
          "peopleId": { type: Sequelize.BLOB, primaryKey: true },
          "password": Sequelize.BLOB,
          "active": Sequelize.BOOLEAN,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      )
    ]);

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return Promise.all([
      queryInterface.dropTable('users')
    ]);
  }
};
