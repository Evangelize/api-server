module.exports = function (sequelize, DataTypes) {
  var Students = sequelize.define(
    'students',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "peopleId": DataTypes.INTEGER,
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
