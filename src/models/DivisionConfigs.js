const moduleUtils = require('../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const DivisionConfigs = sequelize.define(
    'divisionConfigs',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get () {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set (val) {
          this.setDataValue('id', new Buffer(val, 'hex'));
        },
      },
      entityId: {
        type: DataTypes.BLOB,
        get: function () {
          return moduleUtils.binToHex(this.getDataValue('entityId'));
        },
        set: function (val) {
          if (val) {
            this.setDataValue('entityId', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('entityId', null);
          }
        },
      },
      title: { type: DataTypes.STRING, defaultValue: 'Children\'s Classes' },
      divisionName: { type: DataTypes.ENUM('semester', 'quarter'), defaultValue: 'quarter' },
      academicYearTitle: { type: DataTypes.STRING, defaultValue: 'Academic Year' },
      divisonStart: { type: DataTypes.INTEGER, defaultValue: 0 },
      divisionLength: { type: DataTypes.INTEGER, defaultValue: 3 },
      divisionDayStartOrdinal: { type: DataTypes.INTEGER, defaultValue: 0 },
      divisionDayStartText: { type: DataTypes.STRING, defaultValue: 'sunday' },
      divisionDayEndOrdinal: { type: DataTypes.INTEGER, defaultValue: -1 },
      divisionDayEndText: { type: DataTypes.STRING, defaultValue: 'wednesday' },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('createdAt')) {
            return this.getDataValue('createdAt').getTime();
          } else {
            return null;
          }
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('updatedAt')) {
            return this.getDataValue('updatedAt').getTime();
          } else {
            return null;
          }
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('deletedAt')) {
            return this.getDataValue('deletedAt').getTime();
          } else {
            return null;
          }
        },
      },
      revision: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
      classMethods: {
        associate (models) {
          DivisionConfigs.hasMany(models.DivisionYears, { foreignKey: 'divisionConfigId' });
          DivisionConfigs.hasMany(models.ClassMeetingDays, { foreignKey: 'divisionConfigId' });
        },
      },
    }
  );

  return DivisionConfigs;
};
