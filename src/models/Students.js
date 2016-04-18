module.exports = function (sequelize, DataTypes) {
  var Students = sequelize.define(
    'students',
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
      "peopleId":  {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('peopleId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('peopleId', new Buffer(val, "hex"));
        }
      },
      "createdAt": {
        type: DataTypes.DATE,
        get: function()  {
          return this.getDataValue('createdAt').getTime();
        }
      },
      "updatedAt": {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('updatedAt')) {
            return this.getDataValue('updatedAt').getTime();
          } else {
            return null;
          }
        }
      },
      "deletedAt": DataTypes.DATE,
      "revision": {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      paranoid: true
    }
  );

  return Students;
};
