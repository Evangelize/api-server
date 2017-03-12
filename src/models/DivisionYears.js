const moduleUtils = require('../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const DivisionYears = sequelize.define(
    'divisionYears',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get() {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set(val) {
          this.setDataValue('id', new Buffer(val, 'hex'));
        },
      },
      entityId: {
        type: DataTypes.BLOB,
        get: function () {
          return moduleUtils.binToHex(this.getDataValue('entityId'));
        },
        set: function (val) {
          this.setDataValue('entityId', new Buffer(val, 'hex'));
        },
      },
      divisionConfigId: {
        type: DataTypes.BLOB,
        get() {
          return moduleUtils.binToHex(this.getDataValue('divisionConfigId'));
        },
        set(val) {
          this.setDataValue('divisionConfigId', new Buffer(val, 'hex'));
        },
      },
      startDate: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('startDate')) {
            return this.getDataValue('startDate').getTime();
          } else {
            return null;
          }
        },
      },
      endDate: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('endDate')) {
            return this.getDataValue('endDate').getTime();
          } else {
            return null;
          }
        },
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
        associate(models) {
          DivisionYears.hasMany(models.Divisions, { foreignKey: 'divisionYear' });
        },
      },
    }
  );

  return DivisionYears;
};
