module.exports = function (sequelize, DataTypes) {
  var Divisions = sequelize.define(
    'divisions',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionConfigId": DataTypes.INTEGER,
      "divisionYear": DataTypes.INTEGER,
      "title": DataTypes.STRING,
      "start": DataTypes.DATE,
      "end": DataTypes.DATE,
      "createdAt": DataTypes.DATE,
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE
    },
    {
      paranoid: true,
      classMethods: {
        associate: function(models) {
          Divisions.hasMany(models.DivisionClasses, {foreignKey: 'divisionId'});
        }
      }
    }
  );

  return Divisions;
};
