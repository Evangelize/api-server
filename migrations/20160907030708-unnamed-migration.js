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
      queryInterface.addColumn(
        'yearClassStudents',
        'yearId',
        {
          type: Sequelize.BLOB,
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
      queryInterface.addIndex('yearClassStudents', ['yearId']),
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
      queryInterface.renameColumn('yearClassStudents', 'classId', 'divisionClassId'),
      queryInterface.removeColumn(
        'yearClassStudents',
        'yearId'
      ),
    ]);
  }
};
