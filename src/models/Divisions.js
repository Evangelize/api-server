module.exports = function (sequelize, DataTypes) {
  var Divisions = sequelize.define(
    'divisions',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionConfigId": DataTypes.INTEGER,
      "divisionYear": DataTypes.INTEGER,
      "position": DataTypes.INTEGER,
      "title": DataTypes.STRING,
      "start": {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('start')) {
            return this.getDataValue('start').getTime();
          } else {
            return null;
          }
        }
      },
      "end": {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('end')) {
            return this.getDataValue('end').getTime();
          } else {
            return null;
          }
        }
      },
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
          Divisions.hasMany(models.DivisionClasses, {foreignKey: 'divisionId'});
        }
      }
    }
  );

  return Divisions;
};
