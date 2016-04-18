module.exports = function (sequelize, DataTypes) {
  var DivisionYears = sequelize.define(
    'divisionYears',
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
      "divisionConfigId":  {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('divisionConfigId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('divisionConfigId', new Buffer(val, "hex"));
        }
      },
      "startDate": {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('startDate')) {
            return this.getDataValue('startDate').getTime();
          } else {
            return null;
          }
        }
      },
      "endDate": {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('endDate')) {
            return this.getDataValue('endDate').getTime();
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
          DivisionYears.hasMany(models.Divisions, {foreignKey: 'divisionYear'});
        }
      }
    }
  );

  return DivisionYears;
};
