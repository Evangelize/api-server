module.exports = function (sequelize, DataTypes) {
  var DivisionYears = sequelize.define(
    'divisionYears',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionConfigId": DataTypes.INTEGER,
      "startDate": DataTypes.DATE,
      "endDate": DataTypes.DATE,
      "createdAt": DataTypes.DATE,
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE
    },
    {
      paranoid: true,
      classMethods: {
        associate: function(models) {
          DivisionYears.hasMany(models.Divisions, {foreignKey: 'divisionYear'});
        }
      }
    }
  );

  return DivisionYears;
};
