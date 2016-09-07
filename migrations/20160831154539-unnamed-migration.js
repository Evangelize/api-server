'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameTable('divisionClassStudents', 'yearClassStudents'),
      queryInterface.createTable(
        'yearMeetingDays',
        {
          id: { type: Sequelize.STRING.BINARY, primaryKey: true },
          yearId: { type: Sequelize.STRING.BINARY },
          dow: Sequelize.INTEGER,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.addColumn(
        'divisionConfigs',
        'order',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 1,
        }
      ),
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropTable('yearMeetingDays'),
      queryInterface.removeColumn(
        'divisionConfigs',
        'order'
      ),
      queryInterface.renameTable('yearClassStudents', 'divisionClassStudents'),
      
    ]);
  }
};
