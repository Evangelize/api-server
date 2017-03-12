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
      queryInterface.sequelize.query(
        'ALTER TABLE `yearMeetingDays` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearMeetingDays` CHANGE `yearId` `yearId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearClassStudents` CHANGE `id` `id` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearClassStudents` CHANGE `classId` `classId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassTeachers` CHANGE `dayId` `dayId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassAttendance`  CHANGE `dayId` `dayId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearClassStudents` CHANGE `yearId` `yearId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `worshipServiceJobs` CHANGE `jobId` `jobId` BINARY(16) NOT NULL'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `jobs` CHANGE `id` `id` BINARY(16) NOT NULL FIRST'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `people` CHANGE COLUMN `familyId` `familyId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `people` CHANGE COLUMN `cohortId` `cohortId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `entities` CHANGE `id` `id` BINARY(16) NOT NULL FIRST'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `thirdPartyLogins` CHANGE `id` `id` BINARY(16) NOT NULL FIRST'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `thirdPartyLogins` CHANGE COLUMN `peopleId` `peopleId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `revisions` CHANGE COLUMN `peopleId` `peopleId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `thirdPartyLogins` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `people` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `teachers` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `students` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionConfigs` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionYears` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisions` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classes` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClasses` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classMeetingDays` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classMeetingDays` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassTeachers` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearMeetingDays` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassAttendance` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `users` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `worshipServices` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `attendanceTypes` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberAttendance` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `overallAttendance` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `groups` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberGroups` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberDevices` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `worshipServiceJobs` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberJobAssignments` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberAvailibility` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `memberJobPreferences` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `settings` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `families` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `cohorts` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `teacherSubstitutions` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classCoordinators` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classStudents` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `jobs` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `notes` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearClassStudents` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `presentations` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `presentations` CHANGE COLUMN `peopleId` `peopleId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `presentations` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `files` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `files` CHANGE COLUMN `peopleId` `peopleId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `files` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classFiles` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classFiles` CHANGE COLUMN `classId` `classId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classFiles` CHANGE COLUMN `entityId` `entityId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionYears` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisions` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionConfigs` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassTeachers` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClasses` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassAttendance` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `people` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `students` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `teachers` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `revisions` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `revisions` CHANGE COLUMN `documentId` `documentId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `revisionChanges` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `notes` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classes` CHANGE COLUMN `id` `id` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `yearClassStudents` CHANGE COLUMN `peopleId` `peopleId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionYears` CHANGE COLUMN `divisionConfigId` `divisionConfigId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisions` CHANGE COLUMN `divisionConfigId` `divisionConfigId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassTeachers` CHANGE COLUMN `divisionClassId` `divisionClassId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassTeachers` CHANGE COLUMN `peopleId` `peopleId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `teachers` CHANGE COLUMN `peopleId` `peopleId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `students` CHANGE COLUMN `peopleId` `peopleId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisions` CHANGE COLUMN `divisionYear` `divisionYear` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClasses` CHANGE COLUMN `divisionId` `divisionId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClasses` CHANGE COLUMN `classId` `classId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `divisionClassAttendance` CHANGE COLUMN `divisionClassId` `divisionClassId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classStudents` CHANGE COLUMN `classId` `classId` BINARY(16)'
      ),
      queryInterface.sequelize.query(
        'ALTER TABLE `classMeetingDays` CHANGE COLUMN `divisionConfigId` `divisionConfigId` BINARY(16)'
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

    return;
  }
};
