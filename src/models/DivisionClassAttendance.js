module.exports = function (sequelize, DataTypes) {
  var DivisionClassAttendance = sequelize.define(
    'divisionClassAttendance',
    {
      "id": {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return this.getDataValue('id').toString('hex');
        },
        set: function(val) {
          this.setDataValue('id', new Buffer(val, "hex"));
        }
      },
      "divisionClassId": {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('divisionClassId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('divisionClassId', new Buffer(val, "hex"));
        }
      },
      "day": DataTypes.INTEGER,
      "attendanceDate": {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('attendanceDate')) {
            return this.getDataValue('attendanceDate').getTime();
          } else {
            return null;
          }
        }
      },
      "count": DataTypes.INTEGER,
      "createdAt": {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('createdAt')) {
            return this.getDataValue('createdAt').getTime();
          } else {
            return null;
          }
        }
      },
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE,
      "revision": {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      paranoid: true
    }
  );

  return DivisionClassAttendance;
};
