module.exports = function (sequelize, DataTypes) {
  var Teachers = sequelize.define(
    'teachers',
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
      paranoid: true
    }
  );

  return Teachers;
};
