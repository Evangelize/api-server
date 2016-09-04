module.exports = function (sequelize, DataTypes) {
  var YearClassStudents = sequelize.define(
    'yearClassStudents',
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
      classId:  {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('classId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('classId', new Buffer(val, "hex"));
        }
      },
      yearId:  {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('yearId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('yearId', new Buffer(val, "hex"));
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
    }
  );

  return YearClassStudents;
};
