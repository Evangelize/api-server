module.exports = function (sequelize, DataTypes) {
  var Classes = sequelize.define(
    'classes',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "title": DataTypes.STRING,
      "description": DataTypes.STRING,
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
    }
  );

  return Classes;
};
