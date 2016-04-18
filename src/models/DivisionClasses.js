module.exports = function (sequelize, DataTypes) {
  var DivisionClasses = sequelize.define(
    'divisionClasses',
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
      "divisionId": {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('divisionId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('divisionId', new Buffer(val, "hex"));
        }
      },
      "classId":  {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('classId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('classId', new Buffer(val, "hex"));
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
          DivisionClasses.belongsTo(models.Classes, {foreignKey: 'classId'});
          DivisionClasses.hasMany(models.DivisionClassTeachers, {foreignKey: 'divisionClassId'});
          DivisionClasses.hasMany(models.DivisionClassAttendance, {foreignKey: 'divisionClassId'});
        }
      }
    }
  );

  return DivisionClasses;
};
