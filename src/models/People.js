const moduleUtils = require('../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const People = sequelize.define(
    'people',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get() {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set(val) {
          this.setDataValue('id', new Buffer(val, 'hex'));
        },
      },
      entityId: {
        type: DataTypes.BLOB,
        get: function () {
          return moduleUtils.binToHex(this.getDataValue('entityId'));
        },
        set: function (val) {
          if (val) {
            this.setDataValue('entityId', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('entityId', null);
          }
        },
      },
      familyId: {
        type: DataTypes.BLOB,
        get() {
          if (this.getDataValue('familyId')) {
            return moduleUtils.binToHex(this.getDataValue('familyId'));
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.setDataValue('familyId', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('familyId', null);
          }
        },
      },
      cohortId: {
        type: DataTypes.BLOB,
        get() {
          if (this.getDataValue('cohort')) {
            return moduleUtils.binToHex(this.getDataValue('cohort'));
          } else {
            return null;
          }
        },
        set(val) {
          if (val) {
            this.setDataValue('cohort', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('cohort', null);
          }
        },
      },
      
      lastName: DataTypes.STRING,
      firstName: DataTypes.STRING,
      familyPosition: DataTypes.STRING(1),
      gender: DataTypes.STRING(1),
      homePhoneNumber: DataTypes.STRING,
      workPhoneNumber: DataTypes.STRING,
      cellPhoneNumber: DataTypes.STRING,
      emailAddress: DataTypes.STRING,
      birthday: {
        type: DataTypes.DATE,
        get: function() {

          if (this.getDataValue('birthday') && this.getDataValue('birthday') !== '0000-00-00 00:00:00') {
            return this.getDataValue('birthday').getTime();
          } else {
            return null;
          }
        },
      },
      nonChristian: { type: DataTypes.ENUM('y', 'n'), defaultValue: 'n' },
      nonMember: { type: DataTypes.ENUM('y', 'n'), defaultValue: 'n' },
      membershipStatus: DataTypes.STRING(1),
      collegeStudent: { type: DataTypes.ENUM('y', 'n'), defaultValue: 'n' },
      photoUrl: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('createdAt')) {
            return this.getDataValue('createdAt').getTime();
          } else {
            return null;
          }
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('updatedAt')) {
            return this.getDataValue('updatedAt').getTime();
          } else {
            return null;
          }
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('deletedAt')) {
            return this.getDataValue('deletedAt').getTime();
          } else {
            return null;
          }
        },
      },
      revision: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
      classMethods: {
        associate(models) {
          People.hasOne(models.Teachers, { foreignKey: 'peopleId' });
          People.hasOne(models.Students, { foreignKey: 'peopleId' });
        },
      },
    }
  );

  return People;
};
