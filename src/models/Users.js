module.exports = function (sequelize, DataTypes) {
  var Users = sequelize.define(
    'users',
    {
      "peopleId": {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return this.getDataValue('peopleId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('peopleId', new Buffer(val, "hex"));
        }
      },
      "password": DataTypes.STRING,
      "active": DataTypes.BOOLEAN,
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

        }
      }
    }
  );

  return Users;
};
