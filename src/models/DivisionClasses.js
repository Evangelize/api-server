const moduleUtils = require('../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const DivisionClasses = sequelize.define(
    'divisionClasses',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set: function(val) {
          this.setDataValue('id', new Buffer(val, "hex"));
        }
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
      divisionId: {
        type: DataTypes.BLOB,
        get: function()  {
          return moduleUtils.binToHex(this.getDataValue('divisionId'));
        },
        set: function(val) {
          this.setDataValue('divisionId', new Buffer(val, "hex"));
        }
      },
      classId:  {
        type: DataTypes.BLOB,
        get: function()  {
          return moduleUtils.binToHex(this.getDataValue('classId'));
        },
        set: function(val) {
          this.setDataValue('classId', new Buffer(val, "hex"));
        }
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
