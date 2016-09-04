module.exports = function (sequelize, DataTypes) {
  var DivisionClassTeachers = sequelize.define(
    'divisionClassTeachers',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return this.getDataValue('id').toString('hex');
        },
        set: function(val) {
          this.setDataValue('id', new Buffer(val, "hex"));
        }
      },
      divisionClassId:  {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('divisionClassId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('divisionClassId', new Buffer(val, "hex"));
        }
      },
      peopleId:  {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('peopleId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('peopleId', new Buffer(val, "hex"));
        }
      },
      day: DataTypes.INTEGER,
      confirmed: DataTypes.BOOLEAN,
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
          DivisionClassTeachers.belongsTo(models.People, {foreignKey: 'peopleId'});
        }
      }
    }
  );

  return DivisionClassTeachers;
};
