const moduleUtils = require('../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const DivisionClassAttendance = sequelize.define(
    'divisionClassAttendance',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set: function(val) {
          this.setDataValue('id', new Buffer(val, "hex"));
        }
      },
      entityId: {
        type: DataTypes.BLOB,
        get: function () {
          return moduleUtils.binToHex(this.getDataValue('entityId'));
        },
        set: function (val) {
          this.setDataValue('entityId', new Buffer(val, 'hex'));
        },
      },
      divisionClassId: {
        type: DataTypes.BLOB,
        get: function()  {
          return moduleUtils.binToHex(this.getDataValue('divisionClassId'));
        },
        set: function(val) {
          this.setDataValue('divisionClassId', new Buffer(val, "hex"));
        }
      },
      day: DataTypes.INTEGER,
      dayId: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return moduleUtils.binToHex(this.getDataValue('dayId'));
        },
        set: function(val) {
          this.setDataValue('dayId', new Buffer(val, "hex"));
        }
      },
      attendanceDate: {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('attendanceDate')) {
            return this.getDataValue('attendanceDate').getTime();
          } else {
            return null;
          }
        }
      },
      count: DataTypes.INTEGER,
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
      paranoid: true
    }
  );

  return DivisionClassAttendance;
};
