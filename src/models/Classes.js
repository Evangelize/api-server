module.exports = function (sequelize, DataTypes) {
  var Classes = sequelize.define(
    'classes',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "title": DataTypes.STRING,
      "description": DataTypes.STRING,
      "createdAt": DataTypes.DATE,
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE
    }
  );

  return Classes;
};
