module.exports = function (sequelize, DataTypes) {
  var DivisionConfigs = sequelize.define(
    'divisionConfigs',
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
      "title": { type: DataTypes.STRING, defaultValue: 'Children\'s Classes' },
      "divisionName": { type: DataTypes.ENUM('semester', 'quarter'), defaultValue: 'quarter' },
      "academicYearTitle": { type: DataTypes.STRING, defaultValue: 'Academic Year' },
      "divisonStart": { type: DataTypes.INTEGER, defaultValue: 0 },
      "divisionLength": { type: DataTypes.INTEGER, defaultValue: 3 },
      "divisionDayStartOrdinal": { type: DataTypes.INTEGER, defaultValue: 0 },
      "divisionDayStartText": { type: DataTypes.STRING, defaultValue: 'sunday' },
      "divisionDayEndOrdinal": { type: DataTypes.INTEGER, defaultValue: -1 },
      "divisionDayEndText": { type: DataTypes.STRING, defaultValue: 'wednesday' },
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
          DivisionConfigs.hasMany(models.DivisionYears, {foreignKey: 'divisionConfigId'});
          DivisionConfigs.hasMany(models.ClassMeetingDays, {foreignKey: 'divisionConfigId'});
        }
      }
    }
  );

  return DivisionConfigs;
};
