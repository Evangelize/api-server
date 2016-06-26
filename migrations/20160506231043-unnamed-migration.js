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
        'worshipServices',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "day": Sequelize.INTEGER,
          "time": Sequelize.DATE,
          "title": Sequelize.STRING(255),
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'attendanceTypes',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "title": Sequelize.STRING(255),
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'memberAttendance',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "worshipServiceId": Sequelize.BLOB,
          "personId": Sequelize.BLOB,
          "attendanceDate": Sequelize.DATE,
          "day": Sequelize.INTEGER,
          "attendanceTypeId": Sequelize.BLOB,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'overallAttendance',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "worshipServiceId": Sequelize.BLOB,
          "attendanceDate": Sequelize.DATE,
          "day": Sequelize.INTEGER,
          "count": Sequelize.INTEGER,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'groups',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "title": Sequelize.STRING(255),
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'memberGroups',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "groupId": Sequelize.BLOB,
          "personId": Sequelize.BLOB,
          "rights": Sequelize.STRING(5),
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'memberDevices',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "personId": Sequelize.BLOB,
          "deviceId": Sequelize.STRING(255),
          "title": Sequelize.STRING(255),
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'worshipServiceJobs',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "worshipServiceId": Sequelize.BLOB,
          "day": Sequelize.INTEGER,
          "title": Sequelize.STRING(255),
          "active": Sequelize.BOOLEAN,
          "priority": Sequelize.INTEGER,
          "numPeople": {
            type: Sequelize.INTEGER,
            defaultValue: 1
          },
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'memberJobAssignments',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "worshipServiceId": Sequelize.BLOB,
          "personId": Sequelize.BLOB,
          "assignmentDate": Sequelize.DATE,
          "day": Sequelize.INTEGER,
          "jobId": Sequelize.BLOB,
          "confirmed": Sequelize.BOOLEAN,
          "checkedIn": Sequelize.BOOLEAN,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'memberJobPreferences',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "personId": Sequelize.BLOB,
          "jobId": Sequelize.BLOB,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'memberAvailibility',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "personId": Sequelize.BLOB,
          "start": Sequelize.DATE,
          "end": Sequelize.DATE,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'families',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "name": Sequelize.STRING(255),
          "photoUrl": Sequelize.STRING(255),
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'settings',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "value": Sequelize.STRING(255),
          "key": Sequelize.STRING(255),
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'cohorts',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "name": Sequelize.STRING(255),
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'classStudents',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "type": Sequelize.STRING(255),
          "typeId": Sequelize.BLOB,
          "classId": Sequelize.BLOB,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'teacherSubstitutions',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "personId": Sequelize.BLOB,
          "divisionClassId": Sequelize.BLOB,
          "day": Sequelize.INTEGER,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.createTable(
        'classCoordinators',
        {
          "id": { type: Sequelize.STRING,  primaryKey: true },
          "personId": Sequelize.BLOB,
          "classId": Sequelize.BLOB,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE,
          "revision": {
            type: Sequelize.INTEGER,
            defaultValue: 0
          }
        }
      ),
      queryInterface.addColumn(
        'classes',
        'order',
        Sequelize.INTEGER
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `users` CHANGE `peopleid` `peopleid` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `worshipServices` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `attendanceTypes` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberAttendance` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberAttendance` CHANGE `worshipServiceId` `worshipServiceId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberAttendance` CHANGE `personId` `personId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberAttendance` CHANGE `attendanceTypeId` `attendanceTypeId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `overallAttendance` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `overallAttendance` CHANGE `worshipServiceId` `worshipServiceId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `groups` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberDevices` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberDevices` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberDevices` CHANGE `personId` `personId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberGroups` CHANGE `personId` `personId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberGroups` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberGroups` CHANGE `groupId` `groupId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `worshipServiceJobs` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `worshipServiceJobs` CHANGE `worshipServiceId` `worshipServiceId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberJobAssignments` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberJobAssignments` CHANGE `worshipServiceId` `worshipServiceId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberJobAssignments` CHANGE `personId` `personId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberJobAssignments` CHANGE `jobId` `jobId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberAvailibility` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberAvailibility` CHANGE `personId` `personId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberJobPreferences` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberJobPreferences` CHANGE `personId` `personId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberJobPreferences` CHANGE `jobId` `jobId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `settings` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `families` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `cohorts` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `teacherSubstitutions` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `teacherSubstitutions` CHANGE `personId` `personId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `teacherSubstitutions` CHANGE `divisionClassId` `divisionClassId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `people` ADD COLUMN `familyId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `people` ADD COLUMN cohort` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classStudents` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classStudents` CHANGE `typeId` `typeId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classCoordinators` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classCoordinators` CHANGE `classId` `classId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classCoordinators` CHANGE `personId` `personId` BINARY(16) NOT NULL'
      ),
    ])
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.dropTable('worshipServices'),
      queryInterface.dropTable('attendanceType'),
      queryInterface.dropTable('memberAttendance'),
      queryInterface.dropTable('overallAttendance'),
      queryInterface.dropTable('groups'),
      queryInterface.dropTable('memberGroup'),
      queryInterface.dropTable('memberDevices'),
      queryInterface.dropTable('worshipServiceJobs'),
      queryInterface.dropTable('memberJobAssignments'),
      queryInterface.dropTable('memberAvailibility'),
      queryInterface.dropTable('memberJobPreferences'),
      queryInterface.dropTable('settings'),
      queryInterface.dropTable('families'),
      queryInterface.dropTable('cohorts'),
      queryInterface.dropTable('teacherSubstitutions'),
      queryInterface.removeColumn(
        'classes',
        'order'
      ),
      queryInterface.removeColumn(
        'people',
        'cohort'
      ),
      queryInterface.removeColumn(
        'people',
        'familyId'
      ),
    ]);
  }
};
