'use strict';

var async = require('async');
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
        'people',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "familyName": Sequelize.STRING,
          "lastName": Sequelize.STRING,
          "firstName": Sequelize.STRING,
          "familyPosition": Sequelize.STRING(1),
          "gender": Sequelize.STRING(1),
          "address1": Sequelize.STRING,
          "address2": Sequelize.STRING,
          "city": Sequelize.STRING,
          "state": Sequelize.STRING(2),
          "zipCode": Sequelize.STRING(20),
          "homePhoneNumber": Sequelize.STRING,
          "workPhoneNumber": Sequelize.STRING,
          "cellPhoneNumber": Sequelize.STRING,
          "emailAddress": Sequelize.STRING,
          "birthday": Sequelize.DATE,
          "nonChristian": { type: Sequelize.ENUM('y', 'n'), defaultValue: 'n' },
          "nonMember": { type: Sequelize.ENUM('y', 'n'), defaultValue: 'n' },
          "membershipStatus": Sequelize.STRING(1),
          "collegeStudent": { type: Sequelize.ENUM('y', 'n'), defaultValue: 'n' },
          "individualPhotoUrl": Sequelize.STRING,
          "familyPhotoUrl": Sequelize.STRING,
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
        'teachers',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "peopleId": Sequelize.INTEGER,
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
        'students',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "peopleId": Sequelize.INTEGER,
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
        'divisionConfigs',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "title": { type: Sequelize.STRING, defaultValue: 'Children\'s Classes' },
          "divisionName": { type: Sequelize.ENUM('semester', 'quarter'), defaultValue: 'quarter' },
          "academicYearTitle": { type: Sequelize.STRING, defaultValue: 'Academic Year' },
          "divisonStart": { type: Sequelize.INTEGER, defaultValue: 0 },
          "divisionLength": { type: Sequelize.INTEGER, defaultValue: 3 },
          "divisionDayStartOrdinal": { type: Sequelize.INTEGER, defaultValue: 0 },
          "divisionDayStartText": { type: Sequelize.STRING, defaultValue: 'sunday' },
          "divisionDayEndOrdinal": { type: Sequelize.INTEGER, defaultValue: -1 },
          "divisionDayEndText": { type: Sequelize.STRING, defaultValue: 'wednesday' },
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
        'divisionYears',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "divisionConfigId": Sequelize.INTEGER,
          "startDate": Sequelize.DATE,
          "endDate": Sequelize.DATE,
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
        'divisions',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "divisionConfigId": Sequelize.INTEGER,
          "divisionYear": Sequelize.INTEGER,
          "title": Sequelize.STRING,
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
        'classes',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "title": Sequelize.STRING,
          "description": Sequelize.STRING,
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
        'divisionClasses',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "divisionId": Sequelize.INTEGER,
          "classId": Sequelize.INTEGER,
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
        'classMeetingDays',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "divisionConfigId": Sequelize.INTEGER,
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
        'divisionClassTeachers',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "divisionClassId": Sequelize.INTEGER,
          "peopleId": Sequelize.INTEGER,
          "day": Sequelize.INTEGER,
          "confirmed": { type: Sequelize.BOOLEAN, defaultValue: false },
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
        'divisionClassStudents',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "divisionClassId": Sequelize.INTEGER,
          "peopleId": Sequelize.INTEGER,
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
        'divisionClassAttendance',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "divisionClassId": Sequelize.INTEGER,
          "day": Sequelize.INTEGER,
          "attendanceDate": Sequelize.DATE,
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
        'notes',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          "type": {
            type: Sequelize.ENUM(
              'none',
              'user',
              'class'
            ),
            defaultValue: 'none'
          },
          "typeId": Sequelize.INTEGER,
          "text": Sequelize.TEXT,
          "title": Sequelize.TEXT,
          "reminderDate": Sequelize.DATE,
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
        'revisions',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          model: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          documentId: {
            type: Sequelize.UUID,
            allowNull: false
          },
          revision: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          document: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE
        }
      ),
      queryInterface.createTable(
        'revisionChanges',
        {
          "id": { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
          path: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          document: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          diff: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          "revisionId": Sequelize.INTEGER,
          "createdAt": Sequelize.DATE,
          "updatedAt": Sequelize.DATE,
          "deletedAt": Sequelize.DATE
        }
      )
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
      queryInterface.dropTable('people'),
      queryInterface.dropTable('teachers'),
      queryInterface.dropTable('students'),
      queryInterface.dropTable('divisionConfigs'),
      queryInterface.dropTable('divisionYears'),
      queryInterface.dropTable('divisions'),
      queryInterface.dropTable('classes'),
      queryInterface.dropTable('divisionClasses'),
      queryInterface.dropTable('classMeetingDays'),
      queryInterface.dropTable('divisionClassTeachers'),
      queryInterface.dropTable('divisionClassStudents'),
      queryInterface.dropTable('divisionClassAttendance'),
      queryInterface.dropTable('revisions'),
      queryInterface.dropTable('revisionChanges')
    ]);
  }
};
