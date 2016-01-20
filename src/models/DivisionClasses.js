module.exports = function (sequelize, DataTypes) {
  var DivisionClasses = sequelize.define(
    'divisionClasses',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionId": DataTypes.INTEGER,
      "classId": DataTypes.INTEGER,
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
