module.exports = function (sequelize, DataTypes) {
  var DivisionClassTeachers = sequelize.define(
    'divisionClassTeachers',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionClassId": DataTypes.INTEGER,
      "peopleId": DataTypes.INTEGER,
      "day": DataTypes.INTEGER,
      "confirmed": DataTypes.BOOLEAN,
      "createdAt": DataTypes.DATE,
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE
    },
    {
      paranoid: true,
      classMethods: {
        associate: function(models) {
          DivisionClassTeachers.belongsTo(models.People, {foreignKey: 'peopleId'});
        }
      }
    }
  );

  return DivisionClassTeachers;
};
