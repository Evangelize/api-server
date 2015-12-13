module.exports = function (sequelize, DataTypes) {
  var DivisionClasses = sequelize.define(
    'divisionClasses',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionId": DataTypes.INTEGER,
      "classId": DataTypes.INTEGER,
      "createdAt": DataTypes.DATE,
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE
    },
    {
      paranoid: true,
      classMethods: {
        associate: function(models) {
          DivisionClasses.belongsTo(models.Classes, {foreignKey: 'classId'});
          DivisionClasses.hasMany(models.DivisionClassTeachers, {foreignKey: 'divisionClassId'});
          DivisionClasses.hasMany(models.DivisionClassAttendance, {foreignKey: 'divisionClassId'});
        }
      }
    }
  );

  return DivisionClasses;
};
