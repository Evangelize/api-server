module.exports = function (sequelize, DataTypes) {
  var DivisionClassAttendance = sequelize.define(
    'divisionClassAttendance',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionClassId": DataTypes.INTEGER,
      "day": DataTypes.INTEGER,
      "attendanceDate": DataTypes.DATE,
      "count": DataTypes.INTEGER,
      "createdAt": DataTypes.DATE,
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE
    },
    {
      freezeTableName: true,
      paranoid: true
    }
  );

  return DivisionClassAttendance;
};
