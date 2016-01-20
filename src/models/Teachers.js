module.exports = function (sequelize, DataTypes) {
  var Teachers = sequelize.define(
    'teachers',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "peopleId": DataTypes.INTEGER,
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
