const moduleUtils = require('../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const MemberAttendance = sequelize.define(
    'memberAttendance',
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
        get() {
          return moduleUtils.binToHex(this.getDataValue('entityId'));
        },
        set(val) {
          if (val) {
            this.setDataValue('entityId', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('entityId', null);
          }
        },
      },
      worshipServiceId: {
        type: DataTypes.BLOB,
        get() {
          return moduleUtils.binToHex(this.getDataValue('worshipServiceId'));
        },
        set(val) {
          this.setDataValue('worshipServiceId', new Buffer(val, 'hex'));
        },
      },
      day: DataTypes.INTEGER,
      personId: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get()  {
          return moduleUtils.binToHex(this.getDataValue('personId'));
        },
        set(val) {
          this.setDataValue('personId', new Buffer(val, 'hex'));
        },
      },
      attendanceDate: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('attendanceDate')) {
            return this.getDataValue('attendanceDate').getTime();
          } else {
            return null;
          }
        },
      },
      attendanceTypeId: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get()  {
          return moduleUtils.binToHex(this.getDataValue('attendanceTypeId'));
        },
        set(val) {
          this.setDataValue('attendanceTypeId', new Buffer(val, 'hex'));
        },
      },
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
      freezeTableName: true,
      paranoid: true,
    }
  );

  return MemberAttendance;
};
