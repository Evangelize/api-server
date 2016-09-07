'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameTable('divisionClassStudents', 'yearClassStudents'),
      queryInterface.createTable(
        'yearMeetingDays',
        {
          id: { type: Sequelize.BLOB, primaryKey: true },
          yearId: { type: Sequelize.BLOB },
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
      queryInterface.addColumn(
        'divisionClassTeachers',
        'dayId',
        {
          type: Sequelize.BLOB,
        }
      ),
      queryInterface.addColumn(
        'divisionClassAttendance',
        'dayId',
        {
          type: Sequelize.BLOB,
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
      queryInterface.removeColumn(
        'divisionClassTeachers',
        'dayId'
      ),
      queryInterface.removeColumn(
        'divisionClassAttendance',
        'dayId'
      ),
      queryInterface.renameTable('yearClassStudents', 'divisionClassStudents'),
      
    ]);
  }
};
