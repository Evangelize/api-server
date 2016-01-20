module.exports = function (sequelize, DataTypes) {
  var DivisionClassTeachers = sequelize.define(
    'divisionClassTeachers',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionClassId": DataTypes.INTEGER,
      "peopleId": DataTypes.INTEGER,
      "day": DataTypes.INTEGER,
      "confirmed": DataTypes.BOOLEAN,
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
          DivisionClassTeachers.belongsTo(models.People, {foreignKey: 'peopleId'});
        }
      }
    }
  );

  return DivisionClassTeachers;
};
