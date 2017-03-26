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
        'people',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true,
          },
          entityId: Sequelize.BLOB,
          familyId: Sequelize.BLOB,
          cohortId: Sequelize.BLOB,
          lastName: Sequelize.STRING,
          firstName: Sequelize.STRING,
          familyPosition: Sequelize.STRING(1),
          gender: Sequelize.STRING(1),
          homePhoneNumber: Sequelize.STRING,
          workPhoneNumber: Sequelize.STRING,
          cellPhoneNumber: Sequelize.STRING,
          emailAddress: Sequelize.STRING,
          birthday: Sequelize.DATE,
          nonChristian: { type: Sequelize.ENUM('y', 'n'), defaultValue: 'n' },
          nonMember: { type: Sequelize.ENUM('y', 'n'), defaultValue: 'n' },
          membershipStatus: Sequelize.STRING(1),
          deceased: { type: Sequelize.ENUM('y', 'n'), defaultValue: 'n' },
          collegeStudent: { type: Sequelize.ENUM('y', 'n'), defaultValue: 'n' },
          photoUrl: Sequelize.STRING,
          employer: Sequelize.STRING,
          occupation: Sequelize.STRING,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'teachers',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          peopleId: Sequelize.BLOB,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'students',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          peopleId: Sequelize.BLOB,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'divisionConfigs',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          title: { type: Sequelize.STRING, defaultValue: 'Children\'s Classes' },
          divisionName: { type: Sequelize.ENUM('semester', 'quarter'), defaultValue: 'quarter' },
          academicYearTitle: { type: Sequelize.STRING, defaultValue: 'Academic Year' },
          divisonStart: { type: Sequelize.INTEGER, defaultValue: 0 },
          divisionLength: { type: Sequelize.INTEGER, defaultValue: 3 },
          divisionDayStartOrdinal: { type: Sequelize.INTEGER, defaultValue: 0 },
          divisionDayStartText: { type: Sequelize.STRING, defaultValue: 'sunday' },
          divisionDayEndOrdinal: { type: Sequelize.INTEGER, defaultValue: -1 },
          divisionDayEndText: { type: Sequelize.STRING, defaultValue: 'wednesday' },
          order: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1,
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'divisionYears',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          divisionConfigId: Sequelize.BLOB,
          startDate: Sequelize.DATE,
          endDate: Sequelize.DATE,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'divisions',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          divisionConfigId: Sequelize.BLOB,
          divisionYear: Sequelize.BLOB,
          position: Sequelize.INTEGER,
          title: Sequelize.STRING,
          start: Sequelize.DATE,
          end: Sequelize.DATE,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'classes',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          title: Sequelize.STRING,
          description: Sequelize.STRING,
          order: Sequelize.INTEGER,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'divisionClasses',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          divisionId: Sequelize.BLOB,
          classId: Sequelize.BLOB,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'classMeetingDays',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          divisionConfigId: Sequelize.BLOB,
          day: Sequelize.INTEGER,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'divisionClassTeachers',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          divisionClassId: Sequelize.BLOB,
          peopleId: Sequelize.BLOB,
          dayId: Sequelize.BLOB,
          day: Sequelize.INTEGER,
          confirmed: { type: Sequelize.BOOLEAN, defaultValue: false },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'yearClassStudents',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          classId: Sequelize.BLOB,
          peopleId: Sequelize.BLOB,
          yearId: Sequelize.BLOB,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'divisionClassAttendance',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          divisionClassId: Sequelize.BLOB,
          dayId: Sequelize.BLOB,
          day: Sequelize.INTEGER,
          attendanceDate: Sequelize.DATE,
          count: Sequelize.INTEGER,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'notes',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          type: {
            type: Sequelize.ENUM(
              'none',
              'user',
              'class'
            ),
            defaultValue: 'none',
          },
          entityId: Sequelize.BLOB,
          typeId: Sequelize.INTEGER,
          text: Sequelize.TEXT,
          title: Sequelize.TEXT,
          reminderDate: Sequelize.DATE,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'revisions',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          peopleId: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          model: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          documentId: {
            type: Sequelize.STRING.BINARY,
            allowNull: false,
          },
          revision: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          document: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
        }
      ),
      queryInterface.createTable(
        'users',
        {
          peopleId: { type: Sequelize.STRING.BINARY, primaryKey: true  },
          entityId: Sequelize.BLOB,
          password: Sequelize.STRING(255),
          active: Sequelize.BOOLEAN,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'revisionChanges',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          path: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          document: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          diff: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          revisionId: Sequelize.BLOB,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
        }
      ),
      queryInterface.createTable(
        'worshipServices',
        {
          id: {
            type: Sequelize.STRING,  
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          day: Sequelize.INTEGER,
          startTime: {
            type: Sequelize.TIME,
            allowNull: true,
            defaultValue: '10:00:00',
          },
          title: Sequelize.STRING(255),
          endTime: {
            type: Sequelize.TIME,
            allowNull: true,
            defaultValue: '11:00:00',
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'attendanceTypes',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          title: Sequelize.STRING(255),
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'memberAttendance',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          worshipServiceId: Sequelize.BLOB,
          personId: Sequelize.BLOB,
          attendanceDate: Sequelize.DATE,
          day: Sequelize.INTEGER,
          attendanceTypeId: Sequelize.BLOB,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'overallAttendance',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          worshipServiceId: Sequelize.BLOB,
          attendanceDate: Sequelize.DATE,
          day: Sequelize.INTEGER,
          count: Sequelize.INTEGER,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'groups',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          title: Sequelize.STRING(255),
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'memberGroups',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          groupId: Sequelize.BLOB,
          personId: Sequelize.BLOB,
          rights: Sequelize.STRING(5),
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'memberDevices',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          personId: Sequelize.BLOB,
          deviceId: Sequelize.STRING(255),
          title: Sequelize.STRING(255),
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'worshipServiceJobs',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          worshipServiceId: Sequelize.BLOB,
          day: Sequelize.INTEGER,
          jobId: Sequelize.BLOB,
          title: Sequelize.STRING(255),
          active: Sequelize.BOOLEAN,
          priority: Sequelize.INTEGER,
          numPeople: Sequelize.INTEGER,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'memberJobAssignments',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          worshipServiceId: Sequelize.BLOB,
          personId: Sequelize.BLOB,
          assignmentDate: Sequelize.DATE,
          day: Sequelize.INTEGER,
          jobId: Sequelize.BLOB,
          confirmed: Sequelize.BOOLEAN,
          checkedIn: Sequelize.BOOLEAN,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'memberJobPreferences',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          personId: Sequelize.BLOB,
          jobId: Sequelize.BLOB,
          confirmed: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'memberAvailibility',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          personId: Sequelize.BLOB,
          start: Sequelize.DATE,
          end: Sequelize.DATE,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'families',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          name: Sequelize.STRING(255),
          familyName: Sequelize.STRING(255),
          address1: Sequelize.STRING,
          address2: Sequelize.STRING,
          city: Sequelize.STRING,
          state: Sequelize.STRING(2),
          zipCode: Sequelize.STRING(20),
          photoUrl: Sequelize.STRING(255),
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'settings',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          value: Sequelize.STRING(255),
          key: Sequelize.STRING(255),
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'cohorts',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          name: Sequelize.STRING(255),
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'classStudents',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          type: Sequelize.STRING(255),
          typeId: Sequelize.BLOB,
          classId: Sequelize.BLOB,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'teacherSubstitutions',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          personId: Sequelize.BLOB,
          divisionClassId: Sequelize.BLOB,
          day: Sequelize.INTEGER,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'classCoordinators',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          personId: Sequelize.BLOB,
          classId: Sequelize.BLOB,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'yearMeetingDays',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
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
      queryInterface.createTable(
        'jobs',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          title: Sequelize.STRING(255),
          active: Sequelize.BOOLEAN,
          priority: Sequelize.INTEGER,
          numPeople: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
          },
          confirm: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          ignore: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          duration: {
            type: Sequelize.STRING(255),
            allowNull: true,
            defaultValue: false,
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'thirdPartyLogins',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          peopleId: Sequelize.BLOB,
          type: Sequelize.STRING,
          externalId: Sequelize.STRING,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'entities',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          title: Sequelize.STRING,
          domain: Sequelize.STRING,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'presentations',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          peopleId: Sequelize.BLOB,
          title: Sequelize.STRING,
          presentation: Sequelize.TEXT,
          shared: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          globally: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'files',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          peopleId: Sequelize.BLOB,
          title: Sequelize.STRING(255),
          description: Sequelize.TEXT,
          url: Sequelize.STRING(255),
          shared: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          globally: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'classFiles',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true, 
          },
          entityId: Sequelize.BLOB,
          classId: Sequelize.BLOB,
          type: {
            type: Sequelize.ENUM('document', 'image'), 
            defaultValue: 'document', 
          },
          title: Sequelize.STRING(255),
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'familyCheckingAccounts',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true,
          },
          entityId: Sequelize.BLOB,
          familyId: Sequelize.BLOB,
          account: Sequelize.TEXT,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'familyPayments',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true,
          },
          entityId: Sequelize.BLOB,
          familyId: Sequelize.BLOB,
          accountId: Sequelize.BLOB,
          batchId: Sequelize.BLOB,
          number: Sequelize.STRING,
          amount: Sequelize.DECIMAL(6, 2),
          effectiveDate: Sequelize.DATE,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
      queryInterface.createTable(
        'batches',
        {
          id: {
            type: Sequelize.STRING.BINARY,
            primaryKey: true,
          },
          entityId: Sequelize.BLOB,
          title: Sequelize.STRING(255),
          open: Sequelize.BOOLEAN,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
          deletedAt: Sequelize.DATE,
          revision: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
        }
      ),
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
      queryInterface.dropTable('yearMeetingDays'),
      queryInterface.dropTable('divisionClassAttendance'),
      queryInterface.dropTable('revisions'),
      queryInterface.dropTable('revisionChanges'),
      queryInterface.dropTable('users'),
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
      queryInterface.dropTable('entities'),
      queryInterface.dropTable('classCoordinators'),
      queryInterface.dropTable('classStudents'),
      queryInterface.dropTable('jobs'),
      queryInterface.dropTable('notes'),
      queryInterface.dropTable('yearClassStudents'),
      queryInterface.dropTable('presentations'),
      queryInterface.dropTable('files'),
      queryInterface.dropTable('classFiles'),
    ]);
  },
};
