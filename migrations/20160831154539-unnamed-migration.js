'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameTable('divisionClassStudents', 'yearClassStudents'),
      queryInterface.addColumn(
        'yearClassStudents',
        'yearId',
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.createTable(
        'yearMeetingDays',
        {
          id: { type: Sequelize.STRING, primaryKey: true },
          yearId: { type: Sequelize.STRING },
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
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'divisionClassAttendance',
        'dayId',
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearMeetingDays` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearMeetingDays` CHANGE `yearId` `yearId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassTeachers` CHANGE `dayId` `dayId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassAttendance` CHANGE `dayId` `dayId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearClassStudents` CHANGE `yearId` `yearId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearClassStudents` CHANGE `divisionClassId` `classId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearClassStudents` CHANGE `peopleId` `peopleId` BINARY(16) NOT NULL'
      ),
      queryInterface.addIndex('yearMeetingDays', ['yearId']),
      queryInterface.addIndex('divisionClassTeachers', ['dayId']),
      queryInterface.addIndex('divisionClassAttendance', ['dayId']),
      queryInterface.addIndex('yearClassStudents', ['yearId'])
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
      queryInterface.renameColumn('divisionClassStudents', 'classId', 'divisionClassId'),
      queryInterface.removeColumn(
        'divisionClassStudents',
        'yearId'
      ),
    ]);
  }
};
