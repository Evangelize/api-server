module.exports = function (sequelize, DataTypes) {
  var DivisionClassAttendance = sequelize.define(
    'divisionClassAttendance',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionClassId": DataTypes.INTEGER,
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
